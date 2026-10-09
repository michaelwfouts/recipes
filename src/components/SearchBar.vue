<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <UInput
    :model-value="modelValue"
    icon="i-lucide-search"
    size="xl"
    class="w-full"
    placeholder="Search recipes, ingredients, tags..."
    aria-label="Search recipes"
    @update:model-value="$emit('update:modelValue', String($event ?? ''))"
  />
</template>
