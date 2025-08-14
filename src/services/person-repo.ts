import { supabase } from "@/lib/supabase-client"
import type { Person } from "./person-api"


export async function savePerson(userId: string, person: Person) {
  const { error } = await supabase
    .from('persons')
    .insert({ user_id: userId, data: person })
  if (error) throw error
}

export async function listPersons(userId: string) {
  const { data, error } = await supabase
    .from('persons')
    .select('id, data, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
