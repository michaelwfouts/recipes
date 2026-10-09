<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <UApp>
    <header class="sticky top-0 z-50 border-b border-default bg-default/75 backdrop-blur">
      <UContainer class="flex h-16 items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2 text-lg font-bold tracking-tight">
          <UIcon name="i-lucide-chef-hat" class="size-6 text-primary" />
          Recipes
        </RouterLink>
        <UColorModeButton />
      </UContainer>
    </header>
    <UContainer class="py-10">
      <RouterView />
    </UContainer>
    <footer class="border-t border-default py-6 text-center text-sm text-muted">
      Made with Vue &amp; Nuxt UI
    </footer>
  </UApp>
</template>
