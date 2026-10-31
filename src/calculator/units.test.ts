import { describe, expect, it } from 'vitest'
import { convert, formatAmount } from './units'

describe('convert', () => {
  it('converts volumes', () => {
    expect(formatAmount(convert(1, 'cup', 'tbsp'))).toBe('16')
    expect(formatAmount(convert(1, 'tbsp', 'tsp'))).toBe('3')
    expect(formatAmount(convert(1, 'gallon', 'cup'))).toBe('16')
    expect(formatAmount(convert(1, 'cup', 'ml'))).toBe('236.6')
  })

  it('converts weights', () => {
    expect(formatAmount(convert(1, 'lb', 'oz'))).toBe('16')
    expect(formatAmount(convert(500, 'g', 'lb'))).toBe('1.102')
  })

  it('converts temperatures', () => {
    expect(convert(212, 'f', 'c')).toBe(100)
    expect(convert(180, 'c', 'f')).toBe(356)
    expect(convert(350, 'f', 'f')).toBe(350)
  })

  it('refuses to mix kinds', () => {
    expect(() => convert(1, 'cup', 'g')).toThrow()
    expect(() => convert(1, 'nope', 'g')).toThrow()
  })
})
