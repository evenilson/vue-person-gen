export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)


export function sample<T>(arr: T[], n: number) {
  const copy = [...arr]
  const out: T[] = []
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(Math.random()*copy.length), 1)[0])
  }
  return out
}