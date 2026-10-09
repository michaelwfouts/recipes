<script setup lang="ts">
import { useSearch, allTags } from '../composables/useSearch'
import SearchBar from '../components/SearchBar.vue'
import TagFilter from '../components/TagFilter.vue'
import RecipeCard from '../components/RecipeCard.vue'

const { query, selectedTags, results, toggleTag } = useSearch()
</script>

<template>
  <h1>Recipes</h1>
  <SearchBar v-model="query" />
  <TagFilter :tags="allTags" :selected="selectedTags" @toggle="toggleTag" />
  <p v-if="!results.length" class="empty">No recipes match.</p>
  <div class="grid">
    <RecipeCard v-for="r in results" :key="r.slug" :recipe="r" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-3);
  margin-top: var(--space-3);
}
.empty {
  color: var(--color-muted);
}
</style>
