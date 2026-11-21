import { describe, expect, it } from 'vitest'
import { sectionToText, toPlainText } from './sectionToText'

describe('toPlainText', () => {
  it('strips links and emphasis', () => {
    expect(toPlainText('2 tbs [Thai red curry paste](http://amzn.to/x)')).toBe('2 tbs Thai red curry paste')
    expect(toPlainText('**1 cup** sugar & _salt_')).toBe('1 cup sugar & salt')
  })
})

describe('sectionToText', () => {
  it('formats groups with headings', () => {
    const text = sectionToText({
      id: 'ingredients',
      title: 'Ingredients',
      checkable: true,
      groups: [
        { items: [{ text: '1 egg', checkable: true }] },
        { heading: 'Topping', items: [{ text: '1 cup flour', checkable: true }, { text: '2 tbs butter', checkable: true }] },
      ],
    })
    expect(text).toBe('1 egg\n\nTopping:\n1 cup flour\n2 tbs butter')
  })
})
