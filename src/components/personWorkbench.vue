<template>
  <!-- Toasts -->
  <div class="toasts" aria-live="polite" aria-atomic="true">
    <div v-for="t in toasts" :key="t.id" class="toast">{{ t.text }}</div>
  </div>

  <section class="box surface" :aria-busy="loading || isSaving">
    <div class="topbar" v-if="loading || isSaving"></div>

    <header class="row header">
      <div class="title">
        <h2>Gerador de Pessoa</h2>
        <p class="subtitle">Crie perfis plausíveis para testes e protótipos.</p>
      </div>

      <div class="actions">
        <label class="switch" :title="auth.user ? 'Salvar automaticamente após gerar' : 'Faça login para salvar'">
          <input type="checkbox" v-model="saveToDb" :disabled="!auth.user" />
          <span class="slider" aria-hidden="true"></span>
          <span class="switch-label">Salvar no banco</span>
        </label>

        <button class="btn primary" @click="generate" :disabled="loading || isSaving">
          <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <span>{{ loading ? 'Gerando…' : 'Gerar pessoa' }}</span>
        </button>
      </div>
    </header>

    <p v-if="errorMsg" class="alert error">{{ errorMsg }}</p>

    <!-- Skeleton while loading -->
    <div v-if="loading" class="card">
      <div class="avatar skeleton"></div>
      <div class="stack">
        <div class="sk-line w-60"></div>
        <div class="sk-line w-40"></div>
        <div class="sk-line w-80"></div>
        <div class="sk-line w-70"></div>
        <div class="chips">
          <span class="chip skeleton w-20"></span>
          <span class="chip skeleton w-16"></span>
          <span class="chip skeleton w-24"></span>
        </div>
        <div class="row">
          <button class="btn ghost" disabled>Copiar JSON</button>
          <button class="btn" disabled>Salvar agora</button>
        </div>
      </div>
    </div>

    <!-- Person card -->
    <div v-else-if="person" class="card">
      <div class="avatar-ring">
        <img class="avatar" :src="avatarSrc" :alt="person.fullName" @error="onAvatarError" />
      </div>

      <div class="stack">
        <h3 class="name">
          {{ person.fullName }}
          <small class="muted">({{ person.age }})</small>
        </h3>

        <div class="kv">
          <span class="k">Email</span>
          <span class="v">
            {{ person.email }}
            <button class="icon-btn" @click="copy(person.email)" title="Copiar email" aria-label="Copiar email"><svg
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-copy-icon lucide-copy">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg></button>
          </span>

          <span class="k">Fone</span>
          <span class="v">
            {{ person.phone }}
            <button class="icon-btn" @click="copy(person.phone)" title="Copiar telefone"
              aria-label="Copiar telefone"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg></button>
          </span>

          <span class="k">Endereço</span>
          <span class="v">{{ person.address }}, {{ person.city }} - {{ person.state }}, {{ person.country }}</span>

          <span class="k">Username</span>
          <span class="v">
            {{ person.username }}
            <button class="icon-btn" @click="copy(person.username)" title="Copiar username"
              aria-label="Copiar username"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg></button>
          </span>
        </div>

        <div>
          <b>Interesses:</b>
          <div class="chips">
            <span class="chip" v-for="t in person.interests" :key="t">{{ t }}</span>
          </div>
        </div>

        <div class="row">
          <button class="btn ghost" @click="copyJson" :disabled="isSaving">Copiar JSON</button>
          <button class="btn ghost" @click="downloadJson" :disabled="isSaving">Baixar JSON</button>

          <button v-if="auth.user" class="btn" @click="persist" :disabled="!canPersist || isSaving"
            :aria-busy="isSaving" :class="{ loading: isSaving }" title="Salvar este perfil agora">
            <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" fill="none"
                stroke="currentColor" stroke-width="2" />
              <path d="M17 21v-8H7v8M7 3v5h8" fill="none" stroke="currentColor" stroke-width="2" />
            </svg>
            <span>{{ isSaving ? 'Salvando…' : 'Salvar agora' }}</span>
          </button>
        </div>

        <p v-if="!auth.user && saveToDb" class="alert warn">
          Para salvar no banco, faça login com Google.
        </p>
      </div>
    </div>

    <p v-else class="empty">
      Clique em <b>“Gerar pessoa”</b> para começar. Você pode copiar ou baixar o JSON gerado.
    </p>
  </section>

  <!-- Saved list -->
  <section v-if="auth.user" class="box surface">
    <header class="row header">
      <div class="title">
        <h2>Minhas pessoas salvas</h2>
        <p class="subtitle">Registros associados à sua conta.</p>
      </div>
      <button class="btn ghost" @click="reloadList" :disabled="loadingList">
        {{ loadingList ? 'Carregando…' : 'Recarregar' }}
      </button>
    </header>

    <ul v-if="items.length" class="list">
      <li v-for="it in items" :key="it.id" class="list-item">
        <div class="list-title">
          <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="12" cy="12" r="8" fill="currentColor" opacity=".08" />
            <path d="M12 6v6l4 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <code>{{ it.data.fullName }}</code>
        </div>
        <small class="muted" :title="formatFull(it.created_at)">
          {{ formatRelative(it.created_at) }} · {{ formatShort(it.created_at) }}
        </small>
      </li>
    </ul>

    <p v-else class="empty">Nenhum registro ainda.</p>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useAuth } from '@/stores/auth'
import { fetchRandomPerson, type Person } from '@/services/person-api'
import { listPersons, savePerson } from '@/services/person-repo'

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.locale('pt-br')

type CreatedAt = string | number | Date
type SavedPersonItem = { id: string; data: Person; created_at: CreatedAt }

const auth = useAuth()

const person = ref<Person | null>(null)
const items = ref<SavedPersonItem[]>([])
const loading = ref(false)
const loadingList = ref(false)
const isSaving = ref(false)
const saveToDb = ref(true)
const errorMsg = ref<string | null>(null)

// Tiny toast system
const toasts = ref<{ id: number; text: string }[]>([])
let toastId = 0
function notify(text: string, ms = 2200) {
  const id = ++toastId
  toasts.value.push({ id, text })
  setTimeout(() => (toasts.value = toasts.value.filter(t => t.id !== id)), ms)
}

const canPersist = computed(
  () => !!auth.user && !!person.value && saveToDb.value && !loading.value && !isSaving.value
)

// Avatar fallback
const avatarErrored = ref(false)
const avatarSrc = computed(() => {
  if (!person.value || avatarErrored.value) return placeholderAvatar(person.value?.fullName || 'User')
  return person.value.avatarUrl
})
function onAvatarError() {
  avatarErrored.value = true
}
function placeholderAvatar(seed: string) {
  // simple generated gradient as data URI
  const bg = encodeURIComponent('#f6f7f9')
  const fg = encodeURIComponent('#dfe3ea')
  return `data:image/svg+xml;utf8,` +
    `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${bg}'/><stop offset='100%' stop-color='${fg}'/></linearGradient></defs>` +
    `<rect width='128' height='128' fill='url(%23g)'/>` +
    `<text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' fill='#4b5563' font-family='Inter,system-ui,Arial' font-size='44' font-weight='700'>${(seed[0] || '?').toUpperCase()}</text>` +
    `</svg>`
}

// Dates
function toDayjs(x: CreatedAt) { return dayjs(x) }
function formatShort(x: CreatedAt) { return toDayjs(x).format('DD/MM/YYYY HH:mm') }
function formatFull(x: CreatedAt) { return toDayjs(x).format('LLLL') }
function formatRelative(x: CreatedAt) { return toDayjs(x).fromNow() }

// Actions
async function generate() {
  if (loading.value) return
  loading.value = true
  errorMsg.value = null
  try {
    const p = await fetchRandomPerson()
    person.value = p
    avatarErrored.value = false
    if (auth.user && saveToDb.value) {
      await persist()
    } else {
      notify('Pessoa gerada!')
    }
  } catch {
    errorMsg.value = 'Falha ao gerar pessoa. Tente novamente.'
  } finally {
    loading.value = false
  }
}

async function persist() {
  if (!canPersist.value || !auth.user || !person.value) return
  isSaving.value = true
  errorMsg.value = null
  try {
    await savePerson(auth.user.id, person.value)
    await reloadList()
    notify('Salvo com sucesso!')
  } catch {
    errorMsg.value = 'Não foi possível salvar no banco.'
  } finally {
    isSaving.value = false
  }
}

async function reloadList() {
  if (!auth.user) { items.value = []; return }
  loadingList.value = true
  errorMsg.value = null
  try {
    const result = await listPersons(auth.user.id)
    items.value = result as SavedPersonItem[]
  } catch {
    errorMsg.value = 'Falha ao carregar sua lista.'
  } finally {
    loadingList.value = false
  }
}

async function copyJson() {
  if (!person.value) return
  try {
    await navigator.clipboard.writeText(JSON.stringify(person.value, null, 2))
    notify('JSON copiado!')
  } catch {
    notify('Falha ao copiar. Selecione e copie.', 2600)
  }
}

function downloadJson() {
  if (!person.value) return
  const data = JSON.stringify(person.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${person.value.username || 'person'}.json`
  a.click()
  URL.revokeObjectURL(url)
  notify('Download iniciado')
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    notify('Copiado!')
  } catch {
    notify('Falha ao copiar', 2200)
  }
}

// React to auth changes
watch(() => auth.user?.id, () => {
  if (auth.user) reloadList()
  else items.value = []
}, { immediate: true })

onMounted(() => {
  if (auth.user) reloadList()
})
</script>

<style scoped>
/* ===== Layout pieces ===== */
.surface {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-1);
}

.box {
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.header {
  gap: 1rem;
  margin-bottom: 1rem;
}

.header .title h2 {
  margin: 0;
  font-size: 1.15rem;
  color: var(--text);
}

.subtitle {
  margin: .25rem 0 0;
  color: var(--muted);
  font-size: .9rem;
}

.row {
  display: flex;
  gap: .75rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  align-items: center;
  gap: .75rem;
}

/* Progress top bar */
.topbar {
  height: 3px;
  background: linear-gradient(90deg, var(--primary), transparent);
  border-radius: 999px;
  margin: -0.2rem 0 .8rem;
  animation: indeterminate 1.2s infinite;
}

@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
    width: 40%
  }

  50% {
    transform: translateX(60%);
    width: 30%
  }

  100% {
    transform: translateX(120%);
    width: 40%
  }
}

/* Card */
.card {
  display: grid;
  grid-template-columns: 128px 1fr;
  gap: 1.1rem;
}

@media (max-width: 640px) {
  .card {
    grid-template-columns: 1fr;
  }
}

/* Avatar + ring */
.avatar-ring {
  position: relative;
  width: 128px;
  height: 128px;
  border-radius: 16px;
  background:
    radial-gradient(120px 60px at 20% 20%, rgba(42, 121, 255, .25), transparent 60%),
    radial-gradient(120px 60px at 80% 90%, rgba(42, 255, 184, .2), transparent 60%),
    var(--surface-2);
  display: grid;
  place-items: center;
  box-shadow: var(--shadow-2);
}

.avatar {
  width: 112px;
  height: 112px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--border);
}

/* Text / content */
.stack {
  display: grid;
  gap: .65rem;
}

.name {
  margin: 0;
  color: var(--text);
}

.kv {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: .35rem .75rem;
  align-items: start;
}

.k {
  color: var(--muted);
  font-weight: 500;
}

.v {
  color: var(--text);
  display: inline-flex;
  gap: .35rem;
  align-items: center;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  padding: .5rem .9rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-2);
  color: var(--text);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  transition: transform .06s ease, background .2s ease, border .2s ease, box-shadow .2s ease;
  box-shadow: var(--shadow-1);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn[disabled] {
  opacity: .6;
  cursor: not-allowed;
}

.btn.primary {
  background: var(--primary);
  color: var(--primary-contrast);
  border-color: transparent;
}

.btn.ghost {
  background: transparent;
  border-color: var(--border);
}

.icon {
  display: inline-block;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}

.icon-btn:hover {
  background: var(--surface-2);
}

/* Switch */
.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  user-select: none;
}

.switch input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.switch .slider {
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  position: relative;
  transition: background .2s ease, border .2s ease;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .02);
}

.switch .slider::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 2px;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: transform .2s ease;
  box-shadow: var(--shadow-1);
}

.switch input:checked+.slider {
  background: rgba(42, 121, 255, .25);
  border-color: rgba(42, 121, 255, .5);
}

.switch input:checked+.slider::after {
  transform: translate(18px, -50%);
}

.switch-label {
  color: var(--text);
  font-size: .92rem;
}

/* Chips */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: .35rem;
  margin-top: .25rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  padding: .2rem .6rem;
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--border);
  font-size: .85rem;
}

/* Skeletons */
.skeleton {
  position: relative;
  overflow: hidden;
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .4), transparent);
  animation: shimmer 1.2s infinite;
  pointer-events: none;
}

.sk-line {
  height: 14px;
  border-radius: 6px;
  background: var(--surface-2);
  border: 1px solid var(--border);
}

.w-20 {
  width: 20%
}

.w-24 {
  width: 24%
}

.w-40 {
  width: 40%
}

.w-60 {
  width: 60%
}

.w-70 {
  width: 70%
}

.w-80 {
  width: 80%
}

@keyframes shimmer {
  100% {
    transform: translateX(100%)
  }
}

/* Alerts & helper text */
.alert {
  border-radius: 12px;
  padding: .6rem .8rem;
  margin: .25rem 0 .75rem;
  border: 1px solid var(--border);
}

.alert.warn {
  color: #8a5700;
  background: #fff8e1;
  border-color: #f6e3a1;
}

@media (prefers-color-scheme: dark) {
  .alert.warn {
    color: #e5b94d;
    background: rgba(229, 185, 77, .12);
    border-color: rgba(229, 185, 77, .25);
  }
}

.alert.error {
  color: #b42318;
  background: #fef3f2;
  border-color: #fecdca;
}

@media (prefers-color-scheme: dark) {
  .alert.error {
    color: #ffb4a9;
    background: rgba(255, 95, 80, .12);
    border-color: rgba(255, 95, 80, .25);
  }
}

.muted {
  color: var(--muted);
}

.empty {
  color: var(--muted);
  text-align: center;
  padding: .6rem 0;
}

/* Saved list */
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: .6rem;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: .7rem .85rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}

.list-title {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  color: var(--text);
}

/* Toasts */
.toasts {
  position: fixed;
  top: 16px;
  right: 16px;
  display: grid;
  gap: 8px;
  z-index: 1000;
}

.toast {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  padding: .55rem .7rem;
  border-radius: 10px;
  box-shadow: var(--shadow-2);
  animation: toast-in .18s ease-out;
}

@keyframes toast-in {
  from {
    transform: translateY(-8px);
    opacity: 0
  }

  to {
    transform: translateY(0);
    opacity: 1
  }
}
</style>
