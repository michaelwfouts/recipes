<script setup lang="ts">
defineProps<{
  tabs: { id: string; label: string }[]
  modelValue: string
}>()
defineEmits<{ 'update:modelValue': [id: string] }>()
</script>

<template>
  <div class="mt-6">
    <UTabs
      :items="tabs.map((t) => ({ label: t.label, value: t.id }))"
      :model-value="modelValue"
      :content="false"
      variant="link"
      color="primary"
      class="w-full"
      @update:model-value="$emit('update:modelValue', String($event))"
    />
    <div class="pt-4">
      <slot />
    </div>
  </div>
</template>
