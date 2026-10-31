import { parseRecipe } from './parseRecipe'
import type { Recipe } from '../types/recipe'

// Recurses into every subfolder of content/. Slugs come from the filename only,
// so folders are purely organizational and don't change recipe URLs.
const files = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function loadRecipes(): Recipe[] {
  const recipes: Recipe[] = []
  const seen = new Map<string, string>()
  for (const [path, raw] of Object.entries(files)) {
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    const existing = seen.get(slug)
    if (existing) {
      console.warn(`Skipping "${path}": slug "${slug}" already used by "${existing}"`)
      continue
    }
    seen.set(slug, path)
    try {
      recipes.push(parseRecipe(raw, slug))
    } catch (err) {
      console.warn(`Skipping recipe "${slug}": failed to parse`, err)
    }
  }
  return recipes.sort((a, b) => a.meta.title.localeCompare(b.meta.title))
}

export const recipes: Recipe[] = loadRecipes()
