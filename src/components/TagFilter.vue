<script setup lang="ts">
defineProps<{ tags: string[]; selected: string[] }>()
defineEmits<{ toggle: [tag: string] }>()
</script>

<template>
  <div class="mt-4 flex flex-wrap gap-2">
    <UButton
      v-for="t in tags"
      :key="t"
      size="xs"
      class="rounded-full"
      :color="selected.includes(t) ? 'primary' : 'neutral'"
      :variant="selected.includes(t) ? 'solid' : 'outline'"
      :aria-pressed="selected.includes(t)"
      @click="$emit('toggle', t)"
    >
      {{ t }}
    </UButton>
  </div>
</template>
