import { parseRecipe } from './parseRecipe'
import type { Recipe } from '../types/recipe'

const files = import.meta.glob('/content/recipes/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function loadRecipes(): Recipe[] {
  const recipes: Recipe[] = []
  for (const [path, raw] of Object.entries(files)) {
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    try {
      recipes.push(parseRecipe(raw, slug))
    } catch (err) {
      console.warn(`Skipping recipe "${slug}": failed to parse`, err)
    }
  }
  return recipes.sort((a, b) => a.meta.title.localeCompare(b.meta.title))
}

export const recipes: Recipe[] = loadRecipes()
