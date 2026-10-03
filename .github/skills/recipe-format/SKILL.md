---
name: recipe-format
description: 'Format or convert recipe markdown files in this repo into the standard structure (YAML frontmatter + Ingredients + Instructions checklists). Use when adding a new recipe, fixing an inconsistently formatted recipe, or converting recipes copied from another source/app into this repo'\''s standard format.'
---

# Recipe File Format

Every recipe is a single markdown file. Use the files in [Appetizers/](../../../Appetizers/) as the
canonical reference examples.

## Structure

```markdown
---
title: Recipe Title
prep_time: 10
cook_time: 20
servings: 4
difficulty: Easy
tags:
  - tag-one
  - tag-two
source: https://example.com/original-recipe
credit: Original Author Name
---

## Ingredients

### Optional Subsection Heading
- [ ] ingredient line

## Instructions
- [ ] step one
- [ ] step two

## Notes
- optional freeform notes
```

## Frontmatter Rules

- `title` — required, human-readable recipe name (fix typos/misspellings from the source file name).
- `prep_time` / `cook_time` — required, integers in minutes (active prep time and active cook time).
  If the source doesn't give times, estimate reasonably from the instructions and call out that the
  values are estimates.
- `servings` — required, integer. Estimate from the recipe (e.g., number of sandwiches/portions) if
  not stated.
- `difficulty` — required, one of `Easy`, `Medium`, `Hard`.
- `tags` — optional YAML list, lowercase, e.g. `dinner`, `vietnamese`, `chicken`. Convert any trailing
  `## Tags` / `#hashtag` section into this list instead.
- `source` — optional, a bare URL to the original recipe (not a markdown link). Pull this out of any
  `## Info` / `- **Source:**` section.
- `credit` — optional, original author/creator name if known.

## Body Rules

- `## Ingredients` — bullet list using GitHub task syntax `- [ ] `. Use a single space after `] `
  (watch for accidental double spaces when copying from other sources).
- Group ingredients with `### Subsection` headings when the recipe has logical components (e.g.
  `### Serve With`, `### For the Topping`), matching the style in
  [cranberry-whipped-feta-dip.md](../../../Appetizers/cranberry-whipped-feta-dip.md).
- `## Instructions` — use a checkbox list (`- [ ] `) for each step, **not** a numbered list. Convert
  any `## Directions` numbered list (`1.`, `2.`, ...) into this format.
- `## Notes` — optional, keep any freeform author notes from the source as a plain bullet list.
- Remove the old `## Info` and `## Tags` headings entirely once their content has been moved into
  frontmatter.

## Conversion Checklist

When converting a recipe into this format:
1. Move `## Info` source/credit links into `source:` / `credit:` frontmatter fields (bare URL only).
2. Move `## Tags` / `#hashtags` into the `tags:` frontmatter list.
3. Add `prep_time`, `cook_time`, `servings`, `difficulty` if missing (estimate if necessary).
4. Convert numbered `## Directions` steps into a `- [ ] ` checklist under `## Instructions`.
5. Normalize ingredient bullets to `- [ ] ` with a single space, keep `### Subsection` groupings.
6. Keep `## Notes` content as-is, just reformat location to the end of the file.
7. Fix obvious filename/title typos in the `title:` field, but don't invent ingredients or steps
   that aren't in the source.
