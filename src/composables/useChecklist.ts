import { computed, ref, watch, type Ref } from 'vue'

const PREFIX = 'recipe-checks:v1'

function read(key: string): number[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((n) => Number.isInteger(n)) : []
  } catch {
    return []
  }
}

function write(key: string, value: number[]) {
  try {
    if (value.length) localStorage.setItem(key, JSON.stringify(value))
    else localStorage.removeItem(key)
  } catch {
    // Storage unavailable (private mode / quota): checks just won't persist.
  }
}

/**
 * Checked-state for one section of one recipe, persisted in localStorage.
 * Items are identified by their flat index within the section.
 * This file is the only place that knows about the storage backend.
 */
export function useChecklist(slug: Ref<string>, sectionId: Ref<string>, total: Ref<number>) {
  const storageKey = computed(() => `${PREFIX}:${slug.value}:${sectionId.value}`)
  const checked = ref<number[]>(read(storageKey.value))

  watch(storageKey, (key) => {
    checked.value = read(key)
  })

  function isChecked(index: number): boolean {
    return checked.value.includes(index)
  }

  function toggle(index: number) {
    checked.value = isChecked(index)
      ? checked.value.filter((i) => i !== index)
      : [...checked.value, index]
    write(storageKey.value, checked.value)
  }

  function reset() {
    checked.value = []
    write(storageKey.value, [])
  }

  const count = computed(() => checked.value.filter((i) => i < total.value).length)

  return { isChecked, toggle, reset, count }
}
