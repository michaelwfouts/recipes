import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'kitchen-timers:v1'

export interface Timer {
  id: string
  label: string
  /** Total length in ms, kept so the timer can be restarted. */
  duration: number
  /** Epoch ms when a running timer reaches zero; null while paused. */
  endsAt: number | null
  /** Ms left at the moment the timer was paused. */
  pausedRemaining: number
}

export function remaining(t: Timer, now: number): number {
  return t.endsAt === null ? t.pausedRemaining : Math.max(0, t.endsAt - now)
}

export function isFinished(t: Timer, now: number): boolean {
  return t.endsAt !== null && t.endsAt <= now
}

/** 65_000 -> "1:05", 3_725_000 -> "1:02:05". Rounds up so "0:00" only shows when done. */
export function formatDuration(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = String(total % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`
}

function read(): Timer[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((t) => typeof t?.id === 'string') : []
  } catch {
    return []
  }
}

function write(value: Timer[]) {
  try {
    if (value.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable: timers just won't survive a reload.
  }
}

// Shared across the app so the header badge and the panel agree.
// Timers store an end timestamp rather than counting down, so they stay
// accurate when the browser throttles background tabs.
const timers = ref<Timer[]>(read())
const now = ref(Date.now())
let ticker: ReturnType<typeof setInterval> | undefined

function syncTicker() {
  const anyRunning = timers.value.some((t) => t.endsAt !== null)
  if (anyRunning && !ticker) {
    ticker = setInterval(() => (now.value = Date.now()), 250)
  } else if (!anyRunning && ticker) {
    clearInterval(ticker)
    ticker = undefined
  }
}

watch(
  timers,
  (value) => {
    write(value)
    syncTicker()
  },
  { deep: true, immediate: true, flush: 'sync' },
)

export function useTimers() {
  function find(id: string) {
    return timers.value.find((t) => t.id === id)
  }

  function add(label: string, duration: number) {
    now.value = Date.now()
    timers.value.push({
      id: `${now.value}-${Math.random().toString(36).slice(2, 8)}`,
      label: label.trim() || `Timer ${timers.value.length + 1}`,
      duration,
      endsAt: now.value + duration,
      pausedRemaining: duration,
    })
  }

  function pause(id: string) {
    const t = find(id)
    if (!t || t.endsAt === null) return
    now.value = Date.now()
    t.pausedRemaining = remaining(t, now.value)
    t.endsAt = null
  }

  function resume(id: string) {
    const t = find(id)
    if (!t || t.endsAt !== null) return
    now.value = Date.now()
    t.endsAt = now.value + t.pausedRemaining
  }

  function addMinute(id: string) {
    const t = find(id)
    if (!t) return
    now.value = Date.now()
    t.duration += 60_000
    if (t.endsAt === null) t.pausedRemaining += 60_000
    else t.endsAt = Math.max(t.endsAt, now.value) + 60_000
  }

  function restart(id: string) {
    const t = find(id)
    if (!t) return
    now.value = Date.now()
    t.endsAt = now.value + t.duration
    t.pausedRemaining = t.duration
  }

  function remove(id: string) {
    timers.value = timers.value.filter((t) => t.id !== id)
  }

  const finished = computed(() => timers.value.filter((t) => isFinished(t, now.value)))

  /** The running timer that will finish soonest, for the header badge. */
  const nextUp = computed(() =>
    timers.value
      .filter((t) => t.endsAt !== null && !isFinished(t, now.value))
      .sort((a, b) => a.endsAt! - b.endsAt!)[0],
  )

  return { timers, now, finished, nextUp, add, pause, resume, addMinute, restart, remove }
}
