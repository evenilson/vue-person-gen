<template>
  <section class="box">
    <header class="row">
      <h2>Gerador de Pessoa</h2>
      <div class="row">
        <label class="row">
          <input type="checkbox" v-model="saveToDb" />
          <span>Salvar no banco (se logado)</span>
        </label>
        <button @click="generate">Gerar pessoa</button>
      </div>
    </header>

    <div v-if="loading" class="muted">Carregando…</div>
    <div v-else-if="person" class="card">
      <img :src="person.avatarUrl" :alt="person.fullName" />
      <div>
        <h3>{{ person.fullName }} <small>({{ person.age }})</small></h3>
        <p><b>Email:</b> {{ person.email }}</p>
        <p><b>Fone:</b> {{ person.phone }}</p>
        <p><b>Endereço:</b> {{ person.address }}, {{ person.city }} - {{ person.state }}, {{ person.country }}</p>
        <p><b>Username:</b> {{ person.username }}</p>
        <p><b>Interesses:</b> <span class="chip" v-for="t in person.interests" :key="t">{{ t }}</span></p>
        <div class="row">
          <button class="ghost" @click="copyJson">Copiar JSON</button>
          <button v-if="auth.user && saveToDb" @click="persist">Salvar agora</button>
        </div>
        <p v-if="!auth.user && saveToDb" class="warn">
          Para salvar no banco, faça login com Google.
        </p>
      </div>
    </div>
  </section>

  <section v-if="auth.user" class="box">
    <header class="row">
      <h2>Minhas pessoas salvas</h2>
      <button class="ghost" @click="reloadList">Recarregar</button>
    </header>
    <ul v-if="items.length">
      <li v-for="it in items" :key="it.id">
        <code>{{ it.data.fullName }}</code> — <small>{{ new Date(it.created_at).toLocaleString() }}</small>
      </li>
    </ul>
    <p v-else class="muted">Nenhum registro ainda.</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/stores/auth'
import { fetchRandomPerson, type Person } from '@/services/person-api'
import { listPersons, savePerson } from '@/services/person-repo'

const auth = useAuth()
const person = ref<Person | null>(null)
const loading = ref(false)
const saveToDb = ref(true)
const items = ref<any[]>([])

async function generate() {
  loading.value = true
  try {
    person.value = await fetchRandomPerson()
    if (auth.user && saveToDb.value) await persist()
  } finally {
    loading.value = false
  }
}

async function persist() {
  if (!auth.user || !person.value) return
  await savePerson(auth.user.id, person.value)
  await reloadList()
}

async function reloadList() {
  if (!auth.user) { items.value = []; return }
  items.value = await listPersons(auth.user.id)
}

async function copyJson() {
  if (!person.value) return
  await navigator.clipboard.writeText(JSON.stringify(person.value, null, 2))
  alert('JSON copiado!')
}

reloadList()
</script>

<style scoped>
.box{border:1px solid #eee;border-radius:1rem;padding:1rem;margin-bottom:1rem;background:#fff}
.row{display:flex;gap:.5rem;align-items:center;justify-content:space-between;flex-wrap:wrap}
.card{display:grid;grid-template-columns:128px 1fr;gap:1rem}
img{width:128px;height:128px;object-fit:cover;border-radius:.75rem}
button{padding:.5rem .8rem;border:1px solid #ddd;border-radius:.6rem;background:#111;color:#fff;cursor:pointer}
button.ghost{background:transparent;color:#111}
.chip{display:inline-block;padding:.1rem .5rem;border-radius:999px;background:#f1f5f9;margin-right:.35rem;margin-top:.2rem}
.warn{color:#8a5700;background:#fff8e1;padding:.4rem .6rem;border-radius:.5rem}
.muted{color:#6b7280}
@media (max-width:640px){.card{grid-template-columns:1fr}}
</style>
