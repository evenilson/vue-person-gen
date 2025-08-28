<template>
  <div class="app">
    <a class="skip-link" href="#content">Pular para o conteúdo</a>

    <header class="app-header">
      <div class="container">
        <AuthBar />
      </div>
    </header>

    <main id="content" class="app-main">
      <div class="container">
        <PersonWorkbench />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AuthBar from './components/authBar.vue'
import PersonWorkbench from './components/personWorkbench.vue'
import { useAuth } from './stores/auth'

const auth = useAuth()
onMounted(() => auth.init())
</script>

<!-- IMPORTANTE: estilos globais NÃO devem ser 'scoped' -->
<style>
/* =========================
   Design tokens (OKLCH-ready)
   ========================= */
:root {
  color-scheme: light dark;

  /* cores base (auto dark com prefers-color-scheme) */
  --bg: oklch(98% 0.01 250);
  --bg-accent: oklch(97% 0.02 240);
  --surface: #ffffff;
  --surface-2: #f7f8fa;
  --text: #0f172a;
  --muted: #6b7280;
  --border: #e5e7eb;
  --primary: oklch(55% 0.2 262);
  /* azul moderno */
  --primary-contrast: #fff;

  --radius-lg: 16px;
  --radius: 12px;
  --shadow-1: 0 1px 2px rgba(0, 0, 0, .06), 0 1px 1px rgba(0, 0, 0, .04);
  --shadow-2: 0 12px 24px rgba(0, 0, 0, .08), 0 6px 8px rgba(0, 0, 0, .06);

  --container: 1024px;
  --space-1: .5rem;
  --space-2: .75rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: oklch(16% 0.02 255);
    --bg-accent: oklch(20% 0.03 255);
    --surface: oklch(22% 0.02 255);
    --surface-2: oklch(18% 0.02 255);
    --text: oklch(93% 0.01 255);
    --muted: oklch(70% 0.02 255);
    --border: oklch(32% 0.02 255);
    --primary: oklch(65% 0.19 262);
    --primary-contrast: oklch(16% 0.02 255);
    --shadow-1: 0 1px 2px rgba(0, 0, 0, .35), 0 1px 1px rgba(0, 0, 0, .25);
    --shadow-2: 0 12px 24px rgba(0, 0, 0, .35), 0 6px 8px rgba(0, 0, 0, .28);
  }
}

/* =========================
   Reset/base
   ========================= */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#app,
.app {
  height: 100%;
  min-height: 100vh;
}

body {
  margin: 0;
  background:
    radial-gradient(1200px 600px at 80% -10%, color-mix(in oklab, var(--primary) 15%, transparent) 0%, transparent 60%),
    radial-gradient(900px 500px at -10% 10%, color-mix(in oklab, var(--primary) 10%, transparent) 0%, transparent 60%),
    var(--bg);
  color: var(--text);
  font: 400 16px/1.55 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Tipografia básica */
h1,
h2,
h3 {
  margin: 0 0 .25rem;
  line-height: 1.2;
}

h1 {
  font-size: clamp(1.6rem, 3vw, 2rem);
}

h2 {
  font-size: clamp(1.2rem, 2.2vw, 1.4rem);
}

.muted {
  color: var(--muted);
}

/* Container */
.container {
  max-width: var(--container);
  margin: 0 auto;
  width: 100%;
}

/* =========================
   Shell (header / main / footer)
   ========================= */
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: saturate(1.1) blur(10px);
  background:
    linear-gradient(to bottom, color-mix(in oklab, var(--surface) 92%, transparent), transparent),
    transparent;
  border-bottom: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
  display: flex;
  align-items: center;
  justify-content: end;
  padding-block: 1rem;
}

.app-main {
  padding-block: clamp(1rem, 2.5vw, 2rem);
}

.app-footer {
  padding-block: 1.2rem;
  border-top: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
  background: linear-gradient(to top, color-mix(in oklab, var(--surface) 92%, transparent), transparent);
  bottom: 0;
}

.container-content {
  min-height: calc(100vh - 72px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Skip link (A11Y) */
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.skip-link:focus {
  left: 16px;
  top: 12px;
  width: auto;
  height: auto;
  padding: .4rem .6rem;
  border-radius: 8px;
  background: var(--primary);
  color: var(--primary-contrast);
  z-index: 100;
}

/* Prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
