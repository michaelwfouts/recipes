import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatDuration, remaining, useTimers } from './useTimers'

describe('formatDuration', () => {
  it('formats minutes and hours, rounding up', () => {
    expect(formatDuration(0)).toBe('0:00')
    expect(formatDuration(65_000)).toBe('1:05')
    expect(formatDuration(64_001)).toBe('1:05')
    expect(formatDuration(3_725_000)).toBe('1:02:05')
  })
})

describe('useTimers', () => {
  const store = useTimers()

  beforeEach(() => {
    vi.useFakeTimers()
    store.timers.value = []
  })
  afterEach(() => {
    store.timers.value = []
    vi.useRealTimers()
  })

  it('counts down and finishes', () => {
    store.add('Pasta', 10_000)
    const [t] = store.timers.value
    expect(t.label).toBe('Pasta')

    vi.advanceTimersByTime(4_000)
    expect(remaining(t, store.now.value)).toBe(6_000)
    expect(store.nextUp.value?.id).toBe(t.id)

    vi.advanceTimersByTime(6_000)
    expect(store.finished.value.map((f) => f.id)).toEqual([t.id])
    expect(store.nextUp.value).toBeUndefined()
  })

  it('pauses, resumes and adds time', () => {
    store.add('', 60_000)
    const [t] = store.timers.value
    expect(t.label).toBe('Timer 1')

    vi.advanceTimersByTime(20_000)
    store.pause(t.id)
    vi.advanceTimersByTime(100_000)
    expect(remaining(t, Date.now())).toBe(40_000)

    store.addMinute(t.id)
    store.resume(t.id)
    vi.advanceTimersByTime(30_000)
    expect(remaining(t, store.now.value)).toBe(70_000)
  })

  it('adding a minute to a finished timer starts it again', () => {
    store.add('Eggs', 1_000)
    const [t] = store.timers.value
    vi.advanceTimersByTime(5_000)
    expect(store.finished.value).toHaveLength(1)

    store.addMinute(t.id)
    expect(store.finished.value).toHaveLength(0)
    expect(remaining(t, Date.now())).toBe(60_000)
  })

  it('restarts and removes timers', () => {
    store.add('Rice', 30_000)
    const [t] = store.timers.value
    vi.advanceTimersByTime(25_000)
    store.restart(t.id)
    expect(remaining(t, Date.now())).toBe(30_000)

    store.remove(t.id)
    expect(store.timers.value).toHaveLength(0)
  })
})
