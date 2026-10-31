<script setup lang="ts">
import { ref } from 'vue'
import CalculatorPad from './CalculatorPad.vue'
import UnitConverter from './UnitConverter.vue'

const open = ref(false)
const tabs = [
  { label: 'Calculator', icon: 'i-lucide-calculator', slot: 'calculator' as const },
  { label: 'Convert units', icon: 'i-lucide-arrow-left-right', slot: 'convert' as const },
]
</script>

<template>
  <USlideover v-model:open="open" title="Calculator">
    <UButton icon="i-lucide-calculator" color="neutral" variant="ghost" aria-label="Calculator" />
    <template #body>
      <UTabs :items="tabs" variant="link" color="primary" class="w-full">
        <template #calculator>
          <div class="pt-4"><CalculatorPad /></div>
        </template>
        <template #convert>
          <div class="pt-4"><UnitConverter /></div>
        </template>
      </UTabs>
    </template>
  </USlideover>
</template>
