import { renderInline } from './renderInline'
import type { RecipeSection } from '../types/recipe'

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' }

/** Convert inline recipe markdown to plain text (drops link URLs, bold/italic markers, etc.). */
export function toPlainText(text: string): string {
  return renderInline(text)
    .replace(/<[^>]*>/g, '')
    .replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (m, e: string) => {
      if (e in ENTITIES) return ENTITIES[e]
      if (e[0] === '#') {
        const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
        return Number.isNaN(code) ? m : String.fromCodePoint(code)
      }
      return m
    })
    .trim()
}

/** Format a section as plain text: one item per line, groups separated by a blank line with their heading. */
export function sectionToText(section: RecipeSection): string {
  return section.groups
    .filter((g) => g.items.length)
    .map((g) => {
      const lines = g.items.map((i) => toPlainText(i.text))
      return (g.heading ? [`${toPlainText(g.heading)}:`, ...lines] : lines).join('\n')
    })
    .join('\n\n')
}
