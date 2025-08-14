import { supabase } from "@/lib/supabase-client";
import { defineStore } from "pinia";

type User = { id: string; email?: string | null; name?: string | null; avatar?: string | null }

function mapUser(u: any): User {
  return {
    id: u.id,
    email: u.email,
    name: u.user_metadata.name ?? null,
    avatar: u.user_metadata.avatar_url ?? null
  }
}

export const useAuth = defineStore('auth', {
  state: () => ({ user: null as User | null, loading: true }),
  actions: {
    async init() {
      const { data: { session } } = await supabase.auth.getSession()
      this.user = session ? mapUser(session.user) : null
      this.loading = false

      supabase.auth.onAuthStateChange((_event, sessionNow) => {
        this.user = sessionNow ? mapUser(sessionNow.user) : null
      } )
    },
    async signInWithGoogle() {
      await supabase.auth.signInWithOAuth({provider: "google"})
    },
    async signOut() {
      await supabase.auth.signOut()
    }
  }
})