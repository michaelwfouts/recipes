<script setup lang="ts">
import { ref } from 'vue'
import { formatDuration, isFinished, remaining, useTimers } from '../composables/useTimers'
import { unlockAudio } from '../composables/useTimerAlarm'

const { timers, now, add, pause, resume, addMinute, restart, remove } = useTimers()

const PRESETS = [1, 3, 5, 10, 15, 30]

const label = ref('')
const minutes = ref(5)
const seconds = ref(0)

function start(ms: number) {
  if (ms <= 0) return
  unlockAudio()
  add(label.value, ms)
  label.value = ''
}

const notifySupported = typeof Notification !== 'undefined'
const notifyPermission = ref(notifySupported ? Notification.permission : 'denied')

async function enableNotifications() {
  notifyPermission.value = await Notification.requestPermission()
}

// iPadOS reports itself as a Mac, so also check for a touch screen.
const isIOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
const SHORTCUT_NAME = 'Set Timer'

/** Runs the user's "Set Timer" shortcut, which starts a Clock app timer, then comes back here. */
function sendToClock(ms: number) {
  if (ms <= 0) return
  const seconds = Math.ceil(ms / 1000)
  const params = { name: SHORTCUT_NAME, input: 'text', text: String(seconds), 'x-success': location.href }
  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  location.href = `shortcuts://x-callback-url/run-shortcut?${query}`
}
</script>

<template>
  <div class="space-y-6">
    <form class="space-y-3" @submit.prevent="start(((minutes || 0) * 60 + (seconds || 0)) * 1000)">
      <UInput v-model="label" placeholder="Label, e.g. Pasta (optional)" class="w-full" aria-label="Timer label" />
      <div class="flex items-end gap-3">
        <UFormField label="Minutes" class="flex-1">
          <UInputNumber v-model="minutes" :min="0" :max="999" class="w-full" />
        </UFormField>
        <UFormField label="Seconds" class="flex-1">
          <UInputNumber v-model="seconds" :min="0" :max="59" :step="5" class="w-full" />
        </UFormField>
      </div>
      <div class="flex gap-2">
        <UButton type="submit" icon="i-lucide-play" block class="flex-1" :disabled="!minutes && !seconds">
          Start timer
        </UButton>
        <UButton
          v-if="isIOS"
          color="neutral"
          variant="outline"
          icon="i-lucide-smartphone"
          :disabled="!minutes && !seconds"
          @click="sendToClock(((minutes || 0) * 60 + (seconds || 0)) * 1000)"
        >
          Clock app
        </UButton>
      </div>
      <div class="flex flex-wrap gap-2">
        <span class="w-full text-xs uppercase tracking-wide text-muted">Quick start</span>
        <UButton
          v-for="p in PRESETS"
          :key="p"
          size="sm"
          color="neutral"
          variant="outline"
          @click="start(p * 60_000)"
        >
          {{ p }} min
        </UButton>
      </div>
    </form>

    <USeparator />

    <p v-if="!timers.length" class="text-center text-sm text-muted">No timers running.</p>
    <ul v-else class="space-y-3">
      <li
        v-for="t in timers"
        :key="t.id"
        class="rounded-lg border p-4"
        :class="isFinished(t, now) ? 'border-primary bg-primary/10' : 'border-default'"
      >
        <div class="flex items-start justify-between gap-2">
          <span class="font-semibold text-highlighted">{{ t.label }}</span>
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            :aria-label="`Remove ${t.label}`"
            @click="remove(t.id)"
          />
        </div>
        <p
          class="font-mono text-4xl font-semibold tabular-nums"
          :class="isFinished(t, now) ? 'animate-pulse text-primary' : t.endsAt === null ? 'text-muted' : 'text-highlighted'"
        >
          {{ isFinished(t, now) ? 'Done!' : formatDuration(remaining(t, now)) }}
        </p>
        <UProgress :model-value="t.duration - remaining(t, now)" :max="t.duration" size="xs" class="my-3" />
        <div class="flex flex-wrap gap-2">
          <template v-if="isFinished(t, now)">
            <UButton size="sm" icon="i-lucide-check" @click="remove(t.id)">Dismiss</UButton>
          </template>
          <UButton
            v-else-if="t.endsAt !== null"
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-lucide-pause"
            @click="pause(t.id)"
          >
            Pause
          </UButton>
          <UButton v-else size="sm" icon="i-lucide-play" @click="unlockAudio(); resume(t.id)">Resume</UButton>
          <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-plus" @click="addMinute(t.id)">
            1 min
          </UButton>
          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-lucide-rotate-ccw"
            @click="unlockAudio(); restart(t.id)"
          >
            Restart
          </UButton>
        </div>
      </li>
    </ul>

    <UButton
      v-if="notifySupported && notifyPermission === 'default'"
      size="sm"
      color="neutral"
      variant="link"
      icon="i-lucide-bell"
      @click="enableNotifications"
    >
      Also notify me when this tab is in the background
    </UButton>

    <details v-if="isIOS" class="text-sm text-muted">
      <summary class="cursor-pointer">Set up the Clock app button</summary>
      <p class="mt-2">
        "Clock app" starts the timer in your device's Clock app instead, which rings even when the browser is closed.
        It needs a shortcut, which you only set up once:
      </p>
      <ol class="mt-2 list-decimal space-y-1 pl-5">
        <li>In the Shortcuts app, create a new shortcut named <strong>{{ SHORTCUT_NAME }}</strong>.</li>
        <li>Add the <strong>Start Timer</strong> action.</li>
        <li>Tap its number and choose <strong>Shortcut Input</strong>, then tap the unit and choose <strong>seconds</strong>.</li>
      </ol>
    </details>
  </div>
</template>
