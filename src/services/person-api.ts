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

export async function fetchRandomPerson(): Promise<Person> {
  const res = await fetch('https://randomuser.me/api/?nat=br,us')
  if (!res.ok) throw new Error('Falha ao obter pessoa')
  const { results } = await res.json()
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

