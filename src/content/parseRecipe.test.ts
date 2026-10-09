import { describe, expect, it } from 'vitest'
import { parseRecipe } from './parseRecipe'

const sample = `---
title: Test Dish
prep_time: 5
cook_time: 10
servings: 2
difficulty: Easy
tags:
  - dinner
  - quick
source: https://example.com
---

## Ingredients
- [ ] 1 egg
### Serve With
- [ ] toast

## Instructions
- [ ] Crack egg
- [x] Cook it

## Notes
- Best fresh
`

describe('parseRecipe', () => {
  it('parses frontmatter', () => {
    const r = parseRecipe(sample, 'test-dish')
    expect(r.meta.title).toBe('Test Dish')
    expect(r.meta.prep_time).toBe(5)
    expect(r.meta.tags).toEqual(['dinner', 'quick'])
  })

  it('splits sections and groups', () => {
    const r = parseRecipe(sample, 'test-dish')
    expect(r.sections.map((s) => s.id)).toEqual(['ingredients', 'instructions', 'notes'])
    const ing = r.sections[0]
    expect(ing.groups.map((g) => g.heading)).toEqual([undefined, 'Serve With'])
    expect(ing.groups[1].items[0].text).toBe('toast')
    expect(r.sections[1].groups[0].items).toHaveLength(2)
  })

  it('marks task sections checkable and plain bullets not', () => {
    const r = parseRecipe(sample, 'test-dish')
    expect(r.sections[0].checkable).toBe(true)
    expect(r.sections[2].checkable).toBe(false)
  })

  it('falls back to slug when frontmatter is missing', () => {
    const r = parseRecipe('## Ingredients\n- [ ] salt', 'plain')
    expect(r.meta.title).toBe('plain')
    expect(r.sections).toHaveLength(1)
  })
})
