<script setup lang="ts">
import type { Recipe } from '../types/recipe'

defineProps<{ recipe: Recipe }>()
</script>

<template>
  <router-link :to="{ name: 'recipe', params: { slug: recipe.slug } }" class="card">
    <h2>{{ recipe.meta.title }}</h2>
    <p class="times">
      <span v-if="recipe.meta.prep_time !== undefined">Prep {{ recipe.meta.prep_time }}m</span>
      <span v-if="recipe.meta.cook_time !== undefined">Cook {{ recipe.meta.cook_time }}m</span>
      <span v-if="recipe.meta.difficulty">{{ recipe.meta.difficulty }}</span>
    </p>
    <p v-if="recipe.meta.tags?.length" class="tags">{{ recipe.meta.tags.join(' · ') }}</p>
  </router-link>
</template>

<style scoped>
.card {
  display: block;
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: inherit;
  text-decoration: none;
}
.card:hover,
.card:focus-visible {
  border-color: var(--color-accent);
}
h2 {
  margin: 0 0 var(--space-2);
  font-size: 1.15rem;
}
.times {
  display: flex;
  gap: var(--space-3);
  margin: 0;
  color: var(--color-muted);
  font-size: 0.9rem;
}
.tags {
  margin: var(--space-2) 0 0;
  color: var(--color-accent);
  font-size: 0.85rem;
}
</style>
