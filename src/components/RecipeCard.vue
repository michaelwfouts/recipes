<script setup lang="ts">
import type { Recipe } from '../types/recipe'

defineProps<{ recipe: Recipe }>()
</script>

<template>
  <RouterLink :to="{ name: 'recipe', params: { slug: recipe.slug } }" class="block">
    <UCard class="h-full transition hover:ring-primary">
      <h2 class="font-serif text-lg font-semibold">{{ recipe.meta.title }}</h2>
      <p class="mt-1 flex gap-3 text-sm text-muted">
        <span v-if="recipe.meta.prep_time !== undefined">Prep {{ recipe.meta.prep_time }}m</span>
        <span v-if="recipe.meta.cook_time !== undefined">Cook {{ recipe.meta.cook_time }}m</span>
        <span v-if="recipe.meta.difficulty">{{ recipe.meta.difficulty }}</span>
      </p>
      <div v-if="recipe.meta.tags?.length" class="mt-3 flex flex-wrap gap-1">
        <UBadge v-for="t in recipe.meta.tags" :key="t" color="primary" variant="subtle" size="sm">{{ t }}</UBadge>
      </div>
    </UCard>
  </RouterLink>
</template>
