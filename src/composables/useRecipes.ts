import { recipes } from '../content/loadRecipes'
import type { Recipe } from '../types/recipe'

export function useRecipes() {
  const bySlug = (slug: string): Recipe | undefined => recipes.find((r) => r.slug === slug)
  return { recipes, bySlug }
}
