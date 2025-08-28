<template>
  <div class="bar" :aria-busy="isBusy">
    <!-- Guest -->
    <div v-if="!auth.user" class="guest">
      <button class="btn google" @click="handleSignIn" :disabled="isBusy">
        <span v-if="!isBusy" class="gicon" aria-hidden="true"></span>
        <span v-if="!isBusy">Entrar com Google</span>
        <span v-else class="spinner" aria-hidden="true"></span>
        <span class="sr-only">{{ isBusy ? 'Autenticando…' : 'Entrar com a conta Google' }}</span>
      </button>
    </div>

    <!-- Signed-in -->
    <div v-else class="user">
      <div class="avatar">
        <img v-if="auth.user.avatar && !avatarError" :src="auth.user.avatar" :alt="`Avatar de ${displayName}`"
          @error="avatarError = true" />
        <div v-else class="avatar-fallback" :aria-label="displayName">{{ avatarLetter }}</div>
      </div>

      <div class="user-meta">
        <span class="name" :title="displayName">{{ displayName }}</span>
        <small v-if="auth.user.email" class="muted email">{{ auth.user.email }}</small>
      </div>

      <button class="btn ghost" @click="handleSignOut" :disabled="isBusy">
        <span v-if="!isBusy">Sair</span>
        <span v-else class="spinner small" aria-hidden="true"></span>
        <span class="sr-only">{{ isBusy ? 'Saindo…' : 'Sair da conta' }}</span>
      </button>
    </div>

    <p v-if="errorMsg" class="inline-error" role="status" aria-live="polite">{{ errorMsg }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuth } from '@/stores/auth'

const auth = useAuth()

const isBusy = ref(false)
const errorMsg = ref('')
const avatarError = ref(false)

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Usuário')
const avatarLetter = computed(() => displayName.value.trim().charAt(0).toUpperCase())

async function handleSignIn() {
  if (isBusy.value) return
  isBusy.value = true
  errorMsg.value = ''
  try {
    await auth.signInWithGoogle()
  } catch {
    errorMsg.value = 'Não foi possível autenticar. Tente novamente.'
  } finally {
    isBusy.value = false
  }
}

async function handleSignOut() {
  if (isBusy.value) return
  isBusy.value = true
  errorMsg.value = ''
  try {
    await auth.signOut()
  } catch {
    errorMsg.value = 'Falha ao sair. Tente novamente.'
  } finally {
    isBusy.value = false
  }
}
</script>

<style scoped>
.bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: .75rem;
  flex-wrap: wrap;
}

/* guest state */
.guest {
  display: flex;
  align-items: center;
}

/* user chip */
.user {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: .75rem;
  align-items: center;
  padding: .25rem .35rem;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 999px;
  background: var(--surface, #fff);
  box-shadow: var(--shadow-1, 0 1px 2px rgba(0, 0, 0, .06));
}

.user-meta {
  display: grid;
  line-height: 1;
}

.name {
  font-weight: 600;
  color: var(--text, #0f172a);
}

.email {
  color: var(--muted, #6b7280);
}

/* avatar */
.avatar {
  width: 30px;
  height: 30px;
}

.avatar img,
.avatar-fallback {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--border, #e5e7eb);
  object-fit: cover;
  display: grid;
  place-items: center;
  background:
    radial-gradient(80% 80% at 20% 20%, rgba(42, 121, 255, .18), transparent 60%),
    var(--surface, #fff);
  color: var(--text, #0f172a);
  font-weight: 700;
  font-size: .85rem;
}

/* buttons */
.btn {
  padding: .5rem .85rem;
  border-radius: 999px;
  border: 1px solid var(--border, #e5e7eb);
  background: var(--surface, #fff);
  color: var(--text, #0f172a);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  transition: transform .06s ease, background .2s ease, border .2s ease, box-shadow .2s ease, opacity .2s ease;
  box-shadow: var(--shadow-1, 0 1px 2px rgba(0, 0, 0, .06));
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

.btn.ghost {
  background: transparent;
  border-color: var(--border, #e5e7eb);
}

/* Google-style button (with masked logo) */
.btn.google {
  border-color: color-mix(in srgb, #1a73e8 35%, var(--border, #e5e7eb));
}

.btn.google .gicon {
  width: 18px;
  height: 18px;
  display: inline-block;
  background: conic-gradient(from 45deg,
      #ea4335 0 25%,
      #fbbc05 0 50%,
      #34a853 0 75%,
      #4285f4 0 100%);
  -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48"><path fill="%23000" d="M43.6 20.5H42V20H24v8h11.3C33.6 31.9 29.2 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 5.1 29.6 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21 21-9.3 21-21c0-1.2-.1-2.3-.4-3.5z"/></svg>') center / contain no-repeat;
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48"><path fill="%23000" d="M43.6 20.5H42V20H24v8h11.3C33.6 31.9 29.2 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 5.1 29.6 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21 21-9.3 21-21c0-1.2-.1-2.3-.4-3.5z"/></svg>') center / contain no-repeat;
}

/* spinner */
.spinner,
.spinner.small {
  --size: 18px;
  width: var(--size);
  height: var(--size);
  border: 2px solid color-mix(in srgb, var(--text, #0f172a) 25%, transparent);
  border-top-color: color-mix(in srgb, var(--text, #0f172a) 85%, transparent);
  border-radius: 999px;
  animation: spin .8s linear infinite;
}

.spinner.small {
  --size: 14px;
}

@keyframes spin {
  to {
    transform: rotate(360deg)
  }
}

/* inline error */
.inline-error {
  margin: 0;
  color: #b42318;
  background: #fef3f2;
  border: 1px solid #fecdca;
  padding: .35rem .5rem;
  border-radius: 8px;
}

/* a11y helpers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
