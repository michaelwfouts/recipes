<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatDuration, remaining, useTimers } from '../composables/useTimers'
import { useTimerAlarm } from '../composables/useTimerAlarm'
import TimerPanel from './TimerPanel.vue'

const { finished, nextUp, now } = useTimers()
useTimerAlarm()

const open = ref(false)
const badge = computed(() => {
  if (finished.value.length) return 'Done!'
  return nextUp.value ? formatDuration(remaining(nextUp.value, now.value)) : ''
})
</script>

<template>
  <USlideover v-model:open="open" title="Timers" description="Run as many as you need. They keep going while you browse.">
    <UButton
      icon="i-lucide-timer"
      :color="finished.length ? 'primary' : 'neutral'"
      :variant="finished.length ? 'solid' : 'ghost'"
      :class="finished.length ? 'animate-pulse' : ''"
      aria-label="Timers"
    >
      <span v-if="badge" class="font-mono text-sm tabular-nums">{{ badge }}</span>
    </UButton>
    <template #body>
      <TimerPanel />
    </template>
  </USlideover>
</template>
