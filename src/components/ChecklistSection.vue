<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useChecklist } from '../composables/useChecklist'
import { renderInline } from '../content/renderInline'
import type { RecipeSection } from '../types/recipe'

const props = defineProps<{ slug: string; section: RecipeSection }>()

const total = computed(() => props.section.groups.reduce((n, g) => n + g.items.length, 0))
const { isChecked, toggle, reset, count } = useChecklist(
  toRef(props, 'slug'),
  computed(() => props.section.id),
  total,
)

// Flat index of the first item in each group, so checks are stable per section.
const offsets = computed(() => {
  let n = 0
  return props.section.groups.map((g) => {
    const start = n
    n += g.items.length
    return start
  })
})
</script>

<template>
  <div>
    <div v-if="section.checkable" class="mb-3 flex items-center gap-4">
      <UProgress :model-value="count" :max="total" size="sm" class="flex-1" />
      <span class="text-sm text-muted">{{ count }} / {{ total }}</span>
      <UButton size="xs" color="neutral" variant="outline" :disabled="count === 0" @click="reset">Reset</UButton>
    </div>

    <div v-for="(g, gi) in section.groups" :key="gi" class="mb-4">
      <h3 v-if="g.heading" class="mb-1 font-serif text-lg font-semibold">{{ g.heading }}</h3>
      <ul class="divide-y divide-default">
        <li v-for="(item, ii) in g.items" :key="ii" class="py-3">
          <UCheckbox
            v-if="item.checkable"
            size="lg"
            :model-value="isChecked(offsets[gi] + ii)"
            @update:model-value="toggle(offsets[gi] + ii)"
          >
            <template #label>
              <span
                :class="isChecked(offsets[gi] + ii) ? 'text-muted line-through' : ''"
                v-html="renderInline(item.text)"
              />
            </template>
          </UCheckbox>
          <span v-else v-html="renderInline(item.text)" />
        </li>
      </ul>
    </div>
  </div>
</template>
