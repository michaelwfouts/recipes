export interface RecipeFrontmatter {
  title: string
  prep_time?: number
  cook_time?: number
  servings?: number
  difficulty?: string
  tags?: string[]
  source?: string
  credit?: string
  // New frontmatter fields can be added to recipes without code changes.
  [key: string]: unknown
}

export interface RecipeItem {
  /** Raw markdown text of the line (without the list/checkbox marker). */
  text: string
  /** True when the source line used `- [ ]` / `- [x]` task syntax. */
  checkable: boolean
}

export interface RecipeGroup {
  /** `###` subsection heading, if any. */
  heading?: string
  items: RecipeItem[]
}

export interface RecipeSection {
  /** Slugified heading, e.g. `ingredients`. */
  id: string
  /** Heading text as written, e.g. `Ingredients`. */
  title: string
  groups: RecipeGroup[]
  /** True if any item in the section is a task-list item. */
  checkable: boolean
}

export interface Recipe {
  slug: string
  meta: RecipeFrontmatter
  sections: RecipeSection[]
}
