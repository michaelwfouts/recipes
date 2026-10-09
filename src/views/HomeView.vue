<script setup lang="ts">
import { useSearch, allTags } from '../composables/useSearch'
import SearchBar from '../components/SearchBar.vue'
import TagFilter from '../components/TagFilter.vue'
import RecipeCard from '../components/RecipeCard.vue'

const { query, selectedTags, results, toggleTag } = useSearch()
</script>

<template>
  <h1 class="mb-4 font-serif text-3xl font-bold">Recipes</h1>
  <SearchBar v-model="query" />
  <TagFilter :tags="allTags" :selected="selectedTags" @toggle="toggleTag" />
  <p v-if="!results.length" class="mt-6 text-muted">No recipes match.</p>
  <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <RecipeCard v-for="r in results" :key="r.slug" :recipe="r" />
  </div>
</template>
