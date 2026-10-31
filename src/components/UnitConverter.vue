<script setup lang="ts">
import { computed, ref } from 'vue'
import { KIND_LABELS, UNITS, convert, formatAmount, unitById, type UnitKind } from '../calculator/units'

const amount = ref('1')
const from = ref('cup')

const kinds = Object.keys(KIND_LABELS) as UnitKind[]
const items = kinds.map((kind) => [
  { type: 'label' as const, label: KIND_LABELS[kind] },
  ...UNITS.filter((u) => u.kind === kind).map((u) => ({ label: u.label, value: u.id })),
])

const value = computed(() => (amount.value === '' ? NaN : Number(amount.value)))
const fromUnit = computed(() => unitById(from.value))
const results = computed(() =>
  UNITS.filter((u) => u.kind === fromUnit.value.kind && u.id !== from.value).map((u) => ({
    unit: u,
    value: formatAmount(convert(value.value, from.value, u.id)),
  })),
)
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-3">
      <UFormField label="Amount" class="w-32">
        <UInput v-model="amount" type="number" inputmode="decimal" step="any" class="w-full" />
      </UFormField>
      <UFormField label="Unit" class="flex-1">
        <USelect v-model="from" :items="items" class="w-full" />
      </UFormField>
    </div>

    <ul v-if="Number.isFinite(value)" class="divide-y divide-default rounded-lg border border-default">
      <li v-for="r in results" :key="r.unit.id" class="flex items-baseline justify-between gap-4 px-4 py-2">
        <span class="text-muted">{{ r.unit.label }}</span>
        <span class="font-mono text-lg font-semibold text-highlighted">{{ r.value }}</span>
      </li>
    </ul>
    <p v-else class="text-sm text-muted">Enter an amount to convert.</p>

    <p class="text-xs text-muted">
      US customary measures. Volume and weight aren't converted into each other because that depends on the
      ingredient (a cup of flour and a cup of sugar weigh different amounts).
    </p>
  </div>
</template>
