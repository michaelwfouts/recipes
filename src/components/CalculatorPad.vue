<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { evaluate, formatResult } from '../calculator/evaluate'

const HISTORY_KEY = 'calculator-history:v1'
const HISTORY_SIZE = 10

interface Entry {
  expr: string
  result: string
}

function readHistory(): Entry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.slice(0, HISTORY_SIZE) : []
  } catch {
    return []
  }
}

function writeHistory(value: Entry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(value))
  } catch {
    // Storage unavailable: history just won't persist.
  }
}

const OPERATORS = ['+', '−', '×', '÷']
const KEYS = ['C', '(', ')', '⌫', '7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '%', '+']

const expr = ref('')
const error = ref(false)
const history = ref<Entry[]>(readHistory())
// After "=", typing a number starts fresh while an operator continues from the result.
let justEvaluated = false

const preview = computed(() => {
  try {
    const value = formatResult(evaluate(expr.value))
    return value === expr.value ? '' : value
  } catch {
    return ''
  }
})

function press(key: string) {
  error.value = false
  if (key === 'C') {
    expr.value = ''
  } else if (key === '⌫') {
    expr.value = expr.value.slice(0, -1)
  } else if (key === '=') {
    equals()
    return
  } else if (OPERATORS.includes(key)) {
    const last = expr.value.slice(-1)
    const negativeAfterOp = key === '−' && (last === '×' || last === '÷')
    if (OPERATORS.includes(last) && !negativeAfterOp) expr.value = expr.value.slice(0, -1)
    expr.value += key
  } else {
    if (justEvaluated) expr.value = ''
    expr.value += key
  }
  justEvaluated = false
}

function equals() {
  if (!expr.value) return
  try {
    const result = formatResult(evaluate(expr.value))
    if (result !== expr.value) {
      history.value = [{ expr: expr.value, result }, ...history.value].slice(0, HISTORY_SIZE)
      writeHistory(history.value)
    }
    expr.value = result
    justEvaluated = true
  } catch {
    error.value = true
  }
}

function clearHistory() {
  history.value = []
  writeHistory([])
}

const KEYBOARD: Record<string, string> = {
  '*': '×',
  x: '×',
  '/': '÷',
  '-': '−',
  Enter: '=',
  Backspace: '⌫',
  Delete: 'C',
  c: 'C',
}

function onKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null
  if (target?.closest('input, textarea, select') || e.ctrlKey || e.metaKey || e.altKey) return
  const key = KEYBOARD[e.key] ?? e.key
  if (key === '=' || KEYS.includes(key)) {
    e.preventDefault()
    press(key)
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-lg border border-default bg-elevated p-4 text-right" aria-live="polite">
      <p class="min-h-9 break-all font-mono text-3xl font-semibold text-highlighted">{{ expr || '0' }}</p>
      <p class="min-h-6 font-mono" :class="error ? 'text-error' : 'text-muted'">
        {{ error ? "Can't calculate that" : preview && `= ${preview}` }}
      </p>
    </div>

    <div class="grid grid-cols-4 gap-2">
      <UButton
        v-for="k in KEYS"
        :key="k"
        size="xl"
        block
        class="font-mono text-lg"
        :color="OPERATORS.includes(k) ? 'primary' : 'neutral'"
        :variant="OPERATORS.includes(k) ? 'soft' : /[\d.]/.test(k) ? 'outline' : 'subtle'"
        :aria-label="k === '⌫' ? 'Backspace' : k === 'C' ? 'Clear' : k"
        @click="press(k)"
      >
        {{ k }}
      </UButton>
      <UButton size="xl" block class="col-span-4 font-mono text-lg" @click="press('=')">=</UButton>
    </div>

    <div v-if="history.length">
      <div class="mb-1 flex items-center justify-between">
        <span class="text-xs uppercase tracking-wide text-muted">History</span>
        <UButton size="xs" color="neutral" variant="link" @click="clearHistory">Clear</UButton>
      </div>
      <ul class="divide-y divide-default">
        <li v-for="(h, i) in history" :key="i">
          <button
            type="button"
            class="flex w-full justify-between gap-4 py-2 text-left font-mono text-sm hover:text-primary"
            title="Use this result"
            @click="press(h.result)"
          >
            <span class="truncate text-muted">{{ h.expr }}</span>
            <span class="font-semibold">= {{ h.result }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
