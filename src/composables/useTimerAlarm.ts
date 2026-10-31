import { computed, watch } from 'vue'
import { formatDuration, isFinished, remaining, useTimers } from './useTimers'

type Sound = 'off' | 'silence' | 'alarm'

const SAMPLE_RATE = 22_050

/** A one-second mono WAV clip; `beepAt` lists the start times (s) of 0.2 s, 880 Hz beeps. */
function clip(beepAt: number[]): string {
  const samples = SAMPLE_RATE
  const view = new DataView(new ArrayBuffer(44 + samples * 2))
  const text = (offset: number, s: string) => [...s].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)))
  text(0, 'RIFF')
  view.setUint32(4, 36 + samples * 2, true)
  text(8, 'WAVE')
  text(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, SAMPLE_RATE, true)
  view.setUint32(28, SAMPLE_RATE * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  text(36, 'data')
  view.setUint32(40, samples * 2, true)
  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE
    const start = beepAt.find((b) => t >= b && t < b + 0.2)
    let v = 0
    if (start !== undefined) {
      const local = t - start
      const envelope = Math.min(1, local / 0.02, (0.2 - local) / 0.05)
      v = 0.3 * envelope * Math.sin(2 * Math.PI * 880 * t)
    }
    view.setInt16(44 + i * 2, v * 0x7fff, true)
  }
  return URL.createObjectURL(new Blob([view], { type: 'audio/wav' }))
}

const urls: Partial<Record<Exclude<Sound, 'off'>, string>> = {}
const urlFor = (sound: Exclude<Sound, 'off'>) => (urls[sound] ??= clip(sound === 'alarm' ? [0, 0.25] : []))

// A looping <audio> element rather than Web Audio: iOS keeps media playing after
// the screen locks, so a silent loop while a timer runs keeps the page alive and
// the alarm can sound on the lock screen.
let player: HTMLAudioElement | undefined
let playing: Sound = 'off'
let wanted: Sound = 'off'

function apply() {
  if (!player) return
  if (wanted === 'off') {
    player.pause()
    playing = 'off'
    return
  }
  if (playing !== wanted) {
    player.src = urlFor(wanted)
    playing = wanted
  }
  if (player.paused) void player.play().catch(() => {})
}

/**
 * Browsers only allow sound after a user gesture, so call this from a click
 * (e.g. starting a timer) to make sure the alarm can play later.
 */
export function unlockAudio() {
  try {
    // iOS 17+: treat our sound as media playback so the silent switch doesn't mute it.
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession
    if (session) session.type = 'playback'
    if (!player) {
      player = new Audio()
      player.loop = true
      // Background pages get their intervals throttled, but playback events keep coming,
      // so they drive the clock that decides when a timer is done.
      const { now } = useTimers()
      player.addEventListener('timeupdate', () => (now.value = Date.now()))
    }
    if (!player.paused) return
    // Playing inside the gesture is what unlocks the element for later, gesture-free play() calls.
    if (!player.src) {
      player.src = urlFor('silence')
      playing = 'silence'
    }
    void player.play().then(apply, () => {})
  } catch {
    // No audio support: the toast and tab title still announce the timer.
  }
}

/**
 * Announces finished timers: a repeating beep, a toast, a flashing tab title
 * and (if allowed) a system notification. While a timer runs it plays silence
 * so phones keep the page awake through the lock screen, with the timer shown
 * as "Now Playing". The alarm stops once every finished timer is dismissed,
 * restarted or given more time. Call once, from the app shell.
 */
export function useTimerAlarm() {
  const { timers, now, finished, nextUp, remove } = useTimers()
  const toast = useToast()
  const announced = new Set<string>()
  const originalTitle = document.title
  let loop: ReturnType<typeof setInterval> | undefined
  let flip = false

  const sound = computed<Sound>(() => {
    if (finished.value.length) return 'alarm'
    return timers.value.some((t) => t.endsAt !== null && !isFinished(t, now.value)) ? 'silence' : 'off'
  })
  watch(
    sound,
    (value) => {
      wanted = value
      apply()
    },
    { immediate: true },
  )

  const dismissFinished = () => finished.value.forEach((t) => remove(t.id))

  // After a reload the element isn't unlocked yet; any tap on the page fixes that.
  // Only while a timer needs sound, so stray taps don't interrupt the user's music.
  for (const type of ['click', 'touchend', 'keydown']) {
    document.addEventListener(type, () => sound.value !== 'off' && unlockAudio(), { capture: true })
  }
  // iOS can pause our audio (a call, another app); pick it back up when the page returns.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') apply()
  })

  if ('mediaSession' in navigator) {
    // Lock-screen pause/stop silences a ringing alarm; otherwise it's ignored so the timer keeps watching.
    const handlers = { pause: dismissFinished, stop: dismissFinished, play: apply }
    for (const [action, handler] of Object.entries(handlers)) {
      try {
        navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler)
      } catch {
        // Action unsupported.
      }
    }

    const nowPlaying = computed(() => {
      if (finished.value.length) return `${finished.value.map((t) => t.label).join(', ')} done!`
      return nextUp.value ? `${nextUp.value.label}: ${formatDuration(remaining(nextUp.value, now.value))}` : ''
    })
    watch(nowPlaying, (title) => {
      navigator.mediaSession.metadata = title ? new MediaMetadata({ title, artist: 'Kitchen timer' }) : null
    })
  }

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
        loop = setInterval(() => {
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
