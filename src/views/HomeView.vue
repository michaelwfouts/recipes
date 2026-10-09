<script setup lang="ts">
import { useSearch, allTags } from '../composables/useSearch'
import SearchBar from '../components/SearchBar.vue'
import TagFilter from '../components/TagFilter.vue'
import RecipeCard from '../components/RecipeCard.vue'

const { query, selectedTags, results, toggleTag } = useSearch()
</script>

<template>
  <section class="relative -mt-10 pb-10 pt-16 text-center">
    <div class="bg-grid pointer-events-none absolute inset-0 -z-10" />
    <UBadge color="primary" variant="subtle" size="lg" class="rounded-full">
      {{ results.length }} recipes
    </UBadge>
    <h1 class="mx-auto mt-4 max-w-2xl text-4xl font-bold tracking-tight text-highlighted sm:text-5xl">
      What are we <span class="text-primary">cooking</span> today?
    </h1>
    <p class="mx-auto mt-4 max-w-xl text-lg text-muted">
      Search by name, ingredient or tag, then check things off as you cook.
    </p>
    <div class="mx-auto mt-8 max-w-xl">
      <SearchBar v-model="query" />
    </div>
    <TagFilter :tags="allTags" :selected="selectedTags" class="justify-center" @toggle="toggleTag" />
  </section>
  <p v-if="!results.length" class="mt-6 text-center text-muted">No recipes match.</p>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <RecipeCard v-for="r in results" :key="r.slug" :recipe="r" />
  </div>
</template>
