import { computed, ref } from 'vue'
import Fuse from 'fuse.js'
import { recipes } from '../content/loadRecipes'
import type { Recipe } from '../types/recipe'

/** Single place to tune what is searched and how it is weighted. */
const FUSE_OPTIONS = {
  threshold: 0.35,
  ignoreLocation: true,
  keys: [
    { name: 'meta.title', weight: 3 },
    { name: 'meta.tags', weight: 2 },
    { name: 'searchText', weight: 1 },
  ],
}

interface Indexed extends Recipe {
  searchText: string
}

const indexed: Indexed[] = recipes.map((r) => ({
  ...r,
  searchText: r.sections
    .flatMap((s) => s.groups.flatMap((g) => g.items.map((i) => i.text)))
    .join(' '),
}))

const fuse = new Fuse(indexed, FUSE_OPTIONS)

export const allTags: string[] = [...new Set(recipes.flatMap((r) => r.meta.tags ?? []))].sort()

export function useSearch() {
  const query = ref('')
  const selectedTags = ref<string[]>([])

  const results = computed<Recipe[]>(() => {
    const q = query.value.trim()
    let list: Recipe[] = q ? fuse.search(q).map((r) => r.item) : recipes
    if (selectedTags.value.length) {
      list = list.filter((r) => selectedTags.value.every((t) => r.meta.tags?.includes(t)))
    }
    return list
  })

  function toggleTag(tag: string) {
    selectedTags.value = selectedTags.value.includes(tag)
      ? selectedTags.value.filter((t) => t !== tag)
      : [...selectedTags.value, tag]
  }

  return { query, selectedTags, results, toggleTag }
}
