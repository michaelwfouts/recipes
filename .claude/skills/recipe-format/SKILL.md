---
name: recipe-format
description: 'Format or convert recipe markdown files in this repo into the standard structure (YAML frontmatter + Ingredients + Instructions checklists). Use when adding a new recipe, fixing an inconsistently formatted recipe, or converting recipes copied from another source/app into this repo'\''s standard format.'
---

# Recipe File Format

Every recipe is a single markdown file under [content/recipes/](../../../content/recipes/). Use
[cuban-style-pollo-a-la-plancha.md](../../../content/recipes/cuban-style-pollo-a-la-plancha.md) as the
canonical reference example (frontmatter with source/credit, ingredient subsections, plain Notes).

## File Location & Naming

- Put new recipes directly in `content/recipes/`. Drinks go in `content/recipes/drinks/`.
  Subfolders are for organization only and don't affect the site.
- The filename is the recipe's URL slug: lowercase kebab-case, no accents or punctuation
  (e.g. `agua-de-pe-pina.md` for "Agua de Pe-Piña").
- Slugs must be unique across **all** subfolders. The site skips a file whose filename duplicates
  another one, so check for an existing file with the same name first.

## Structure

```markdown
---
title: Recipe Title
prep_time: 10
cook_time: 20
servings: 4
difficulty: Easy
tags:
  - chicken
source: https://example.com/original-recipe
credit: Serious Eats
---

## Ingredients

### Optional Subsection Heading
- [ ] 1 cup ingredient, prepared
- [ ] 2 tbsp ingredient

## Instructions
- [ ] Step one.
- [ ] Step two.

## Notes
- Optional freeform note.
```

## Frontmatter Rules

Field order is always: `title`, `prep_time`, `cook_time`, `servings`, `difficulty`, `tags`,
`source`, `credit`.

- `title`: required. The human-readable recipe name; fix typos and misspellings from the source.
- `prep_time` / `cook_time`: required, integers in minutes. Use `0` for no-cook recipes (e.g. drinks,
  dressings). If the source gives no times, estimate from the instructions and tell the user the
  values are estimates.
- `servings`: required, integer. Estimate from the recipe (pan size, number of portions) if not
  stated.
- `difficulty`: required, `Easy` or `Medium` (`Hard` is allowed but is rarely used).
- `tags`: required, a YAML list with at least one lowercase tag. Reuse the existing vocabulary
  before inventing new tags:
  - Course/type: `side`, `sauce`, `condiment`, `dessert`, `soup`, `drinks` (every recipe in
    `drinks/` gets `drinks`)
  - Protein: `chicken`, `pork`, `beef`, `seafood`, `eggs`
  - Cuisine/style: `korean`, `mexican`, `vietnamese`, `japanese`, `indian`, `thai`, `cuban`,
    `cajun`, `bbq`

  To see the current set, run `grep -rh --include=*.md "^  - " content/recipes | sort | uniq -c`.
- `source`: optional, a bare URL to the original recipe (not a markdown link). Leave it out when
  there is no URL.
- `credit`: optional, the publication or author name (e.g. `Serious Eats`, `Kenji López-Alt`).
  Leave it out for family or personal recipes unless the user asks for one.

## Body Rules

The site turns any `##` section containing `- [ ]` items into a checkable tab. Sections with plain
`- ` bullets are shown as text below the tabs. So:

- `## Ingredients`: every line uses `- [ ] ` with a single space after `]` (watch for doubled
  spaces in pasted text). Write quantity, then unit, then ingredient, with prep after a comma:
  `- [ ] 2 eggs, beaten`, `- [ ] 1/2 cup milk`. Use `cup`/`cups`, `tbsp`, `tsp`, `lb`, `oz` with no
  trailing periods.
- Group ingredients under `### Subsection` headings when the recipe has logical components. Leave a
  blank line between `## Ingredients` and the first `###` heading. Common headings include
  `### Serve With`, `### Topping`, `### Sauce`, and component names like `### Filling` or `### Pork`.
- `## Instructions`: each step is a `- [ ] ` item. Never use a numbered list. Write in imperative,
  complete sentences ending with a period. Give temperatures as `350°F`.
- `## Notes`: optional, always last. Use **plain** `- ` bullets, never `- [ ]`. A checkbox would make
  Notes a checkable tab. Keep freeform author notes, tips, and variations here.
- Don't add any other `##` sections. Info and tag sections from other apps belong in frontmatter.

## Conversion Checklist

When converting a recipe into this format:
1. Choose the filename/slug and folder (see File Location & Naming).
2. Move any `## Info` / `- **Source:**` links into the `source:` / `credit:` frontmatter fields
   (bare URL only).
3. Move any `## Tags` / `#hashtags` into the `tags:` list, mapped onto the existing tag vocabulary.
4. Add `prep_time`, `cook_time`, `servings`, `difficulty` if missing (estimate if necessary).
5. Convert numbered `## Directions` (or loose paragraph instructions) into a `- [ ] ` checklist
   under `## Instructions`.
6. Normalize ingredient bullets to `- [ ] ` with a single space, tidy unit abbreviations, and keep
   or add `### Subsection` groupings.
7. Move notes to a final `## Notes` section as plain bullets.
8. Fix obvious typos in `title:`, but don't invent ingredients or steps that aren't in the source.
   A step that is clearly implied (e.g. preheating the oven to the stated bake temperature) is
   fine; mention it to the user.
