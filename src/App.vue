<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <UApp>
    <header class="border-b border-default">
      <UContainer class="flex items-center justify-between py-3">
        <RouterLink to="/" class="font-serif text-xl font-bold text-primary">Recipes</RouterLink>
        <UColorModeButton />
      </UContainer>
    </header>
    <UContainer class="py-6">
      <RouterView />
    </UContainer>
  </UApp>
</template>
