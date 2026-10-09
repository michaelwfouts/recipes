<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipes } from '../composables/useRecipes'
import TabPanel from '../components/TabPanel.vue'
import ChecklistSection from '../components/ChecklistSection.vue'

const props = defineProps<{ slug: string }>()
const route = useRoute()
const router = useRouter()
const { bySlug } = useRecipes()

const recipe = computed(() => bySlug(props.slug))
const tabSections = computed(() => recipe.value?.sections.filter((s) => s.checkable) ?? [])
const otherSections = computed(() => recipe.value?.sections.filter((s) => !s.checkable) ?? [])
const tabs = computed(() => tabSections.value.map((s) => ({ id: s.id, label: s.title })))

const activeTab = computed(() => {
  const q = route.query.tab
  return tabs.value.some((t) => t.id === q) ? (q as string) : (tabs.value[0]?.id ?? '')
})
const activeSection = computed(() => tabSections.value.find((s) => s.id === activeTab.value))

function setTab(id: string) {
  router.replace({ query: { ...route.query, tab: id } })
}

const meta = computed(() => recipe.value?.meta)
</script>

<template>
  <p v-if="!recipe">
    <UButton to="/" variant="link" icon="i-lucide-arrow-left">All recipes</UButton>
    Recipe not found.
  </p>
  <article v-else>
    <UButton to="/" variant="link" color="neutral" icon="i-lucide-arrow-left" class="-ml-2">All recipes</UButton>
    <h1 class="mt-2 text-4xl font-bold tracking-tight text-highlighted">{{ meta!.title }}</h1>

    <dl class="my-4 flex flex-wrap gap-6">
      <div v-if="meta!.prep_time !== undefined">
        <dt class="text-xs uppercase tracking-wide text-muted">Prep</dt>
        <dd class="font-semibold">{{ meta!.prep_time }} min</dd>
      </div>
      <div v-if="meta!.cook_time !== undefined">
        <dt class="text-xs uppercase tracking-wide text-muted">Cook</dt>
        <dd class="font-semibold">{{ meta!.cook_time }} min</dd>
      </div>
      <div v-if="meta!.servings !== undefined">
        <dt class="text-xs uppercase tracking-wide text-muted">Servings</dt>
        <dd class="font-semibold">{{ meta!.servings }}</dd>
      </div>
      <div v-if="meta!.difficulty">
        <dt class="text-xs uppercase tracking-wide text-muted">Difficulty</dt>
        <dd class="font-semibold">{{ meta!.difficulty }}</dd>
      </div>
    </dl>

    <div v-if="meta!.tags?.length" class="flex flex-wrap gap-2">
      <UBadge v-for="t in meta!.tags" :key="t" color="primary" variant="subtle">{{ t }}</UBadge>
    </div>
    <p v-if="meta!.source || meta!.credit" class="mt-3 text-muted">
      <template v-if="meta!.credit">By {{ meta!.credit }}</template>
      <template v-if="meta!.credit && meta!.source"> &middot; </template>
      <a v-if="meta!.source" :href="meta!.source" target="_blank" rel="noopener noreferrer" class="text-primary underline">
        Original recipe
      </a>
    </p>

    <TabPanel v-if="tabs.length" :tabs="tabs" :model-value="activeTab" @update:model-value="setTab">
      <ChecklistSection v-if="activeSection" :key="activeSection.id" :slug="recipe.slug" :section="activeSection" />
    </TabPanel>

    <section v-for="s in otherSections" :key="s.id" class="mt-6">
      <h2 class="mb-2 text-xl font-semibold tracking-tight text-highlighted">{{ s.title }}</h2>
      <ChecklistSection :slug="recipe.slug" :section="s" />
    </section>
  </article>
</template>
