<script setup lang="ts">
import type { Recipe } from '../types/recipe'

defineProps<{ recipe: Recipe }>()
</script>

<template>
  <RouterLink :to="{ name: 'recipe', params: { slug: recipe.slug } }" class="block">
    <UCard class="group h-full rounded-xl transition duration-200 hover:-translate-y-0.5 hover:ring-2 hover:ring-primary">
      <h2 class="text-lg font-semibold tracking-tight text-highlighted group-hover:text-primary">
        {{ recipe.meta.title }}
      </h2>
      <p class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        <span v-if="recipe.meta.prep_time !== undefined" class="flex items-center gap-1">
          <UIcon name="i-lucide-timer" /> {{ recipe.meta.prep_time }}m prep
        </span>
        <span v-if="recipe.meta.cook_time !== undefined" class="flex items-center gap-1">
          <UIcon name="i-lucide-flame" /> {{ recipe.meta.cook_time }}m cook
        </span>
        <span v-if="recipe.meta.difficulty" class="flex items-center gap-1">
          <UIcon name="i-lucide-gauge" /> {{ recipe.meta.difficulty }}
        </span>
      </p>
      <div v-if="recipe.meta.tags?.length" class="mt-3 flex flex-wrap gap-1">
        <UBadge v-for="t in recipe.meta.tags" :key="t" color="primary" variant="subtle" size="sm">{{ t }}</UBadge>
      </div>
    </UCard>
  </RouterLink>
</template>
