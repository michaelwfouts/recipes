import { marked } from 'marked'

/** Render inline markdown (links, bold, italics) from recipe text. Recipe files are trusted repo content. */
export function renderInline(text: string): string {
  return marked.parseInline(text, { async: false }) as string
}
