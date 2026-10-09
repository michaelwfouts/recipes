<script setup lang="ts">
defineProps<{
  tabs: { id: string; label: string }[]
  modelValue: string
}>()
defineEmits<{ 'update:modelValue': [id: string] }>()
</script>

<template>
  <div class="tabs">
    <div class="tablist" role="tablist">
      <button
        v-for="t in tabs"
        :id="`tab-${t.id}`"
        :key="t.id"
        type="button"
        role="tab"
        class="tab"
        :class="{ active: t.id === modelValue }"
        :aria-selected="t.id === modelValue"
        :aria-controls="`panel-${modelValue}`"
        @click="$emit('update:modelValue', t.id)"
      >
        {{ t.label }}
      </button>
    </div>
    <div :id="`panel-${modelValue}`" class="panel" role="tabpanel" :aria-labelledby="`tab-${modelValue}`">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.tablist {
  display: flex;
  gap: var(--space-2);
  border-bottom: 2px solid var(--color-border);
  margin-top: var(--space-4);
}
.tab {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  font-weight: 600;
  color: var(--color-muted);
}
.tab.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}
.panel {
  padding-top: var(--space-3);
}
</style>
