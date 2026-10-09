<script setup lang="ts">
defineProps<{ tags: string[]; selected: string[] }>()
defineEmits<{ toggle: [tag: string] }>()
</script>

<template>
  <div class="chips">
    <button
      v-for="t in tags"
      :key="t"
      type="button"
      class="chip"
      :class="{ active: selected.includes(t) }"
      :aria-pressed="selected.includes(t)"
      @click="$emit('toggle', t)"
    >
      {{ t }}
    </button>
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
.chip {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 999px;
  padding: 2px 12px;
  font-size: 0.85rem;
}
.chip.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}
</style>
