import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import RecipeView from './views/RecipeView.vue'

// Hash history works on GitHub Pages without a 404.html workaround.
// Swap to createWebHistory(import.meta.env.BASE_URL) if you add one.
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/recipe/:slug', name: 'recipe', component: RecipeView, props: true },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
