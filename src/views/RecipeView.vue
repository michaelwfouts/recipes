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
  <p v-if="!recipe"><router-link to="/">&larr; All recipes</router-link> &middot; Recipe not found.</p>
  <article v-else class="recipe">
    <router-link to="/" class="back">&larr; All recipes</router-link>
    <h1>{{ meta!.title }}</h1>

    <dl class="facts">
      <div v-if="meta!.prep_time !== undefined"><dt>Prep</dt><dd>{{ meta!.prep_time }} min</dd></div>
      <div v-if="meta!.cook_time !== undefined"><dt>Cook</dt><dd>{{ meta!.cook_time }} min</dd></div>
      <div v-if="meta!.servings !== undefined"><dt>Servings</dt><dd>{{ meta!.servings }}</dd></div>
      <div v-if="meta!.difficulty"><dt>Difficulty</dt><dd>{{ meta!.difficulty }}</dd></div>
    </dl>

    <p v-if="meta!.tags?.length" class="tags">
      <span v-for="t in meta!.tags" :key="t" class="tag">{{ t }}</span>
    </p>
    <p v-if="meta!.source || meta!.credit" class="source">
      <template v-if="meta!.credit">By {{ meta!.credit }}</template>
      <template v-if="meta!.credit && meta!.source"> &middot; </template>
      <a v-if="meta!.source" :href="meta!.source" target="_blank" rel="noopener noreferrer">Original recipe</a>
    </p>

    <TabPanel v-if="tabs.length" :tabs="tabs" :model-value="activeTab" @update:model-value="setTab">
      <ChecklistSection v-if="activeSection" :key="activeSection.id" :slug="recipe.slug" :section="activeSection" />
    </TabPanel>

    <section v-for="s in otherSections" :key="s.id" class="extra">
      <h2>{{ s.title }}</h2>
      <ChecklistSection :slug="recipe.slug" :section="s" />
    </section>
  </article>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: var(--space-3);
  text-decoration: none;
}
.facts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin: var(--space-3) 0;
}
.facts div {
  display: flex;
  flex-direction: column;
}
.facts dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted);
}
.facts dd {
  margin: 0;
  font-weight: 600;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.tag {
  background: var(--color-accent-soft);
  color: var(--color-accent);
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
}
.source {
  color: var(--color-muted);
}
.extra {
  margin-top: var(--space-4);
}
</style>
