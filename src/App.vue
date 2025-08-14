
<template>
  <main>
    <AuthBar />
    <PersonWorkbench />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AuthBar from './components/authBar.vue';
import PersonWorkbench from './components/personWorkbench.vue';
import { useAuth } from './stores/auth';

const auth = useAuth()

onMounted(() => auth.init())

</script>
<style scoped>
:root{
  color-scheme: light
}
body{
  margin:0;
  background:#f8fafc;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial
}
.container{max-width:900px;
  margin:2rem auto;
  padding:0 1rem
}
</style>
