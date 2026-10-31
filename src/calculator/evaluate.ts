type Token = number | '+' | '-' | '*' | '/' | '%' | '(' | ')'

// Display symbols used by the keypad, mapped to plain operators.
const ALIASES: Record<string, Token> = { '×': '*', x: '*', '÷': '/', '−': '-' }

function tokenize(expr: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < expr.length) {
    const ch = expr[i]
    if (/\s/.test(ch)) {
      i++
    } else if (/[\d.]/.test(ch)) {
      const match = /^(\d+\.?\d*|\.\d+)/.exec(expr.slice(i))
      if (!match) throw new Error(`Bad number at ${i}`)
      tokens.push(Number(match[0]))
      i += match[0].length
    } else if ('+-*/%()'.includes(ch)) {
      tokens.push(ch as Token)
      i++
    } else if (ch in ALIASES) {
      tokens.push(ALIASES[ch])
      i++
    } else {
      throw new Error(`Unexpected "${ch}"`)
    }
  }
  return tokens
}

/**
 * Evaluates a basic arithmetic expression without eval().
 * Supports + - * / (or × ÷ −), parentheses, decimals, unary minus and
 * postfix % (which divides by 100). Throws on malformed input or division by zero.
 */
export function evaluate(expr: string): number {
  const tokens = tokenize(expr)
  let pos = 0
  const peek = () => tokens[pos]
  const next = () => tokens[pos++]

  function expression(): number {
    let value = term()
    while (peek() === '+' || peek() === '-') {
      const op = next()
      const rhs = term()
      value = op === '+' ? value + rhs : value - rhs
    }
    return value
  }

  function term(): number {
    let value = factor()
    while (peek() === '*' || peek() === '/') {
      const op = next()
      const rhs = factor()
      value = op === '*' ? value * rhs : value / rhs
    }
    return value
  }

  function factor(): number {
    if (peek() === '-') {
      next()
      return -factor()
    }
    if (peek() === '+') {
      next()
      return factor()
    }
    const t = next()
    let value: number
    if (t === '(') {
      value = expression()
      if (next() !== ')') throw new Error('Missing )')
    } else if (typeof t === 'number') {
      value = t
    } else {
      throw new Error('Unexpected input')
    }
    while (peek() === '%') {
      next()
      value /= 100
    }
    return value
  }

  if (!tokens.length) throw new Error('Empty expression')
  const result = expression()
  if (pos < tokens.length) throw new Error('Unexpected input')
  if (!Number.isFinite(result)) throw new Error('Not a number')
  return result
}

/** Trims floating-point noise, e.g. 0.1 + 0.2 shows as 0.3. */
export function formatResult(n: number): string {
  return String(Number(n.toPrecision(12)))
}
