import { describe, expect, it } from 'vitest'
import { evaluate, formatResult } from './evaluate'

describe('evaluate', () => {
  it('respects operator precedence and parentheses', () => {
    expect(evaluate('2 + 3 * 4')).toBe(14)
    expect(evaluate('(2 + 3) * 4')).toBe(20)
    expect(evaluate('10 - 4 - 3')).toBe(3)
    expect(evaluate('12 / 4 / 3')).toBe(1)
  })

  it('accepts keypad symbols, decimals and unary minus', () => {
    expect(evaluate('2.5×4')).toBe(10)
    expect(evaluate('9÷.5')).toBe(18)
    expect(evaluate('5−8')).toBe(-3)
    expect(evaluate('-(2+1)*-2')).toBe(6)
  })

  it('treats % as divide by 100', () => {
    expect(evaluate('50%')).toBe(0.5)
    expect(evaluate('400 * 25%')).toBe(100)
  })

  it('throws on malformed input or division by zero', () => {
    expect(() => evaluate('')).toThrow()
    expect(() => evaluate('2 +')).toThrow()
    expect(() => evaluate('(2 + 3')).toThrow()
    expect(() => evaluate('2 3')).toThrow()
    expect(() => evaluate('1 / 0')).toThrow()
    expect(() => evaluate('alert(1)')).toThrow()
  })
})

describe('formatResult', () => {
  it('hides floating-point noise', () => {
    expect(formatResult(0.1 + 0.2)).toBe('0.3')
    expect(formatResult(1 / 3)).toBe('0.333333333333')
    expect(formatResult(42)).toBe('42')
  })
})
