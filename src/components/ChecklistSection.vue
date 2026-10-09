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
    <div v-if="section.checkable" class="toolbar">
      <span class="progress">{{ count }} / {{ total }} done</span>
      <button type="button" class="reset" :disabled="count === 0" @click="reset">Reset</button>
    </div>

    <div v-for="(g, gi) in section.groups" :key="gi" class="group">
      <h3 v-if="g.heading">{{ g.heading }}</h3>
      <ul>
        <li v-for="(item, ii) in g.items" :key="ii">
          <label v-if="item.checkable" class="row" :class="{ done: isChecked(offsets[gi] + ii) }">
            <input type="checkbox" :checked="isChecked(offsets[gi] + ii)" @change="toggle(offsets[gi] + ii)" />
            <span v-html="renderInline(item.text)" />
          </label>
          <span v-else class="plain" v-html="renderInline(item.text)" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-muted);
  font-size: 0.9rem;
}
.reset {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 2px 10px;
}
.reset:disabled {
  opacity: 0.5;
  cursor: default;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  border-bottom: 1px solid var(--color-border);
}
.row {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  padding: var(--space-3) var(--space-1);
  cursor: pointer;
}
.row input {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.15rem;
  flex-shrink: 0;
  accent-color: var(--color-accent);
}
.row.done span {
  text-decoration: line-through;
  color: var(--color-done);
}
.plain {
  display: block;
  padding: var(--space-2) var(--space-1);
}
</style>
