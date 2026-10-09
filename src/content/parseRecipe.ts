import { parse as parseYaml } from 'yaml'
import type { Recipe, RecipeFrontmatter, RecipeGroup, RecipeSection } from '../types/recipe'

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/
const TASK_ITEM = /^\s*[-*]\s+\[[ xX]\]\s+(.*\S)\s*$/
const BULLET_ITEM = /^\s*[-*]\s+(.*\S)\s*$/

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Parse one recipe markdown file. Pure function, no framework dependencies. */
export function parseRecipe(raw: string, slug: string): Recipe {
  const match = FRONTMATTER.exec(raw)
  const yamlText = match ? match[1] : ''
  const body = match ? match[2] : raw

  const data = (yamlText ? parseYaml(yamlText) : {}) as Partial<RecipeFrontmatter> | null
  const meta: RecipeFrontmatter = {
    ...(data ?? {}),
    title: typeof data?.title === 'string' && data.title ? data.title : slug,
  }
  if (meta.tags !== undefined && !Array.isArray(meta.tags)) {
    meta.tags = [String(meta.tags)]
  }

  return { slug, meta, sections: parseSections(body) }
}

function parseSections(body: string): RecipeSection[] {
  const sections: RecipeSection[] = []
  let section: RecipeSection | null = null
  let group: RecipeGroup | null = null

  const startGroup = (heading?: string) => {
    group = { heading, items: [] }
    section!.groups.push(group)
  }

  for (const line of body.split(/\r?\n/)) {
    const h2 = /^##\s+(.+?)\s*$/.exec(line)
    if (h2) {
      section = { id: slugify(h2[1]), title: h2[1], groups: [], checkable: false }
      sections.push(section)
      group = null
      continue
    }
    if (!section) continue

    const h3 = /^###\s+(.+?)\s*$/.exec(line)
    if (h3) {
      startGroup(h3[1])
      continue
    }

    const task = TASK_ITEM.exec(line)
    const bullet = task ?? BULLET_ITEM.exec(line)
    if (!bullet) continue

    if (!group) startGroup()
    group!.items.push({ text: bullet[1], checkable: task !== null })
    if (task) section.checkable = true
  }

  for (const s of sections) s.groups = s.groups.filter((g) => g.items.length > 0)
  return sections
}
