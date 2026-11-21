<script setup lang="ts">
import { computed, onBeforeUnmount, ref, toRef } from 'vue'
import { useChecklist } from '../composables/useChecklist'
import { renderInline } from '../content/renderInline'
import { sectionToText } from '../content/sectionToText'
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

const copyable = computed(() => props.section.id === 'ingredients')
const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
let copyTimer: ReturnType<typeof setTimeout> | undefined

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // Fall through to the legacy approach (e.g. non-secure context).
    }
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  const ok = document.execCommand('copy')
  ta.remove()
  if (!ok) throw new Error('copy failed')
}

async function copy() {
  try {
    await writeClipboard(sectionToText(props.section))
    copyState.value = 'copied'
  } catch {
    copyState.value = 'failed'
  }
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copyState.value = 'idle'), 2000)
}
onBeforeUnmount(() => clearTimeout(copyTimer))
</script>

<template>
  <div>
    <div v-if="section.checkable" class="mb-3 flex items-center gap-4">
      <UProgress :model-value="count" :max="total" size="sm" class="flex-1" />
      <span class="text-sm text-muted">{{ count }} / {{ total }}</span>
      <UButton
        v-if="copyable"
        size="xs"
        :color="copyState === 'failed' ? 'error' : 'neutral'"
        variant="outline"
        :icon="copyState === 'copied' ? 'i-lucide-check' : 'i-lucide-copy'"
        @click="copy"
      >
        {{ copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy' }}
      </UButton>
      <UButton size="xs" color="neutral" variant="outline" :disabled="count === 0" @click="reset">Reset</UButton>
    </div>

    <div v-for="(g, gi) in section.groups" :key="gi" class="mb-4">
      <h3 v-if="g.heading" class="mb-1 text-lg font-semibold tracking-tight text-highlighted">{{ g.heading }}</h3>
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
                class="recipe-text"
                :class="isChecked(offsets[gi] + ii) ? 'text-muted line-through' : ''"
                v-html="renderInline(item.text)"
              />
            </template>
          </UCheckbox>
          <span v-else class="recipe-text" v-html="renderInline(item.text)" />
        </li>
      </ul>
    </div>
  </div>
</template>
