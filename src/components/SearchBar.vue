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
    placeholder="Search recipes, or use tag:dinner"
    aria-label="Search recipes"
    @update:model-value="$emit('update:modelValue', String($event ?? ''))"
  >
    <template v-if="modelValue" #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        icon="i-lucide-circle-x"
        aria-label="Clear search"
        @click="$emit('update:modelValue', '')"
      />
    </template>
  </UInput>
</template>
