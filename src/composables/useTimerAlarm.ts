import { watch } from 'vue'
import { useTimers } from './useTimers'

let audio: AudioContext | undefined

/**
 * Browsers only allow sound after a user gesture, so call this from a click
 * (e.g. starting a timer) to make sure the alarm can play later.
 */
export function unlockAudio() {
  try {
    audio ??= new AudioContext()
    void audio.resume()
  } catch {
    // No Web Audio: the toast and tab title still announce the timer.
  }
}

function beep() {
  if (!audio || audio.state !== 'running') return
  const start = audio.currentTime
  for (const offset of [0, 0.25]) {
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.0001, start + offset)
    gain.gain.exponentialRampToValueAtTime(0.3, start + offset + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.2)
    osc.connect(gain).connect(audio.destination)
    osc.start(start + offset)
    osc.stop(start + offset + 0.22)
  }
}

/**
 * Announces finished timers: a repeating beep, a toast, a flashing tab title
 * and (if allowed) a system notification. The alarm stops once every finished
 * timer is dismissed, restarted or given more time. Call once, from the app shell.
 */
export function useTimerAlarm() {
  const { finished, remove } = useTimers()
  const toast = useToast()
  const announced = new Set<string>()
  const originalTitle = document.title
  let loop: ReturnType<typeof setInterval> | undefined
  let flip = false

  watch(
    () => finished.value.map((t) => t.id).join(),
    () => {
      const current = finished.value
      for (const t of current) {
        if (announced.has(t.id)) continue
        announced.add(t.id)
        toast.add({
          title: `${t.label} is done!`,
          icon: 'i-lucide-alarm-clock',
          color: 'primary',
          duration: 0,
          actions: [{ label: 'Dismiss', color: 'neutral', variant: 'outline', onClick: () => remove(t.id) }],
        })
        try {
          if (Notification.permission === 'granted') new Notification(`${t.label} is done!`)
        } catch {
          // Notifications unsupported.
        }
      }
      for (const id of announced) {
        if (!current.some((t) => t.id === id)) announced.delete(id)
      }

      if (current.length && !loop) {
        beep()
        loop = setInterval(() => {
          beep()
          flip = !flip
          const label = finished.value.map((t) => t.label).join(', ')
          document.title = flip ? `⏰ ${label} done!` : originalTitle
        }, 1000)
      } else if (!current.length && loop) {
        clearInterval(loop)
        loop = undefined
        document.title = originalTitle
      }
    },
    { immediate: true },
  )
}
