import { describe, expect, it } from 'vitest'
import { parseQuery } from './useSearch'

describe('parseQuery', () => {
  it('extracts tag tokens and keeps the remaining text', () => {
    expect(parseQuery('chicken tag:dinner TAG:Vietnamese')).toEqual({
      text: 'chicken',
      tags: ['dinner', 'vietnamese'],
    })
  })

  it('supports quoted tags and plain text', () => {
    expect(parseQuery('tag:"main dish"').tags).toEqual(['main dish'])
    expect(parseQuery('soup')).toEqual({ text: 'soup', tags: [] })
  })
})
