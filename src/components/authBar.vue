<template>
  <div class="bar">
    <div v-if="!auth.user">
      <button @click="auth.signInWithGoogle">
        Sigin with Google
      </button>
    </div>
    <div v-else class="user">
      <img v-if="auth.user.avatar" :src="auth.user.avatar" alt="User avatar">
      <span>{{ auth.user.name || auth.user.email }}</span>
      <button class="ghost" @click="auth.signOut">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuth } from '@/stores/auth';
  const auth = useAuth()
</script>

<style>
  .bar {
    display: flex;
    justify-content: flex-end;
    gap: .5rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .user {
    display: flex;
    gap: .5rem;
    align-items: center;
  }

  img {
    width: 28px;
    height: 28px;
    border-radius: 999px;
  }

  button {
    padding:.5rem .8rem;
    border:1px solid #ddd;
    border-radius:.6rem;
    background:#111;
    color:#fff;
    cursor:pointer
  }

  button.ghost{
    background:transparent;
    color:#111
  }
</style>