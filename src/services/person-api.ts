import { capitalize, sample } from '@/utils/general'
import { z } from 'zod'

export const PersonSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  gender: z.enum(['male', 'female']),
  age: z.number(),
  email: z.email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  avatarUrl: z.url(),
  username: z.string(),
  interests: z.array(z.string())
})

export type Person = z.infer<typeof PersonSchema>

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit & { timeoutMs?: number } = {}) {
  const { timeoutMs = 8000, ...rest } = init
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(input, { ...rest, signal: controller.signal })
    return response
  } finally {
    clearTimeout(id)
  }
}

async function fetchJsonWithRetry<T>(url: string, opts?: { retries?: number; timeoutMs?: number }): Promise<T> {
  const retries = opts?.retries ?? 2
  const timeoutMs = opts?.timeoutMs ?? 8000
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, { timeoutMs })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json() as T
    } catch (err) {
      lastError = err
      if (attempt === retries) break
      await new Promise(r => setTimeout(r, 400 * (attempt + 1)))
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Falha ao buscar dados')
}

export async function fetchRandomPerson(): Promise<Person> {
  const { results } = await fetchJsonWithRetry<{ results: any[] }>('https://randomuser.me/api/?nat=br', {
    retries: 2,
    timeoutMs: 8000
  })
  const r = results[0]

  const fullName = `${capitalize(r.name.first)} ${capitalize(r.name.last)}`
  const gender = r.gender === 'male' ? 'male' : 'female'
  const city = r.location.city
  const state = r.location.state
  const country = r.location.country
  const address = `${r.location.street.name}, ${r.location.street.number}`

  const person: Person = {
    id: crypto.randomUUID(),
    fullName,
    gender,
    age: r.dob.age,
    email: r.email,
    phone: r.phone || r.cell,
    address,
    city,
    state,
    country,
    avatarUrl: r.picture?.large ?? `https://i.pravatar.cc/256?u=${encodeURIComponent(fullName)}`,
    username: `${r.login.username}`,
    interests: sample(['futebol','música','cinema','programação','UI/UX','viagem','games','fotografia','cozinha'], 3)
  }

  return PersonSchema.parse(person)
}

