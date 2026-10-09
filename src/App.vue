<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="container">
    <RouterView />
  </main>
</template>

<style scoped>
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-4) var(--space-3);
}
</style>
