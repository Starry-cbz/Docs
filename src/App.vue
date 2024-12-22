<!-- v1.0 -->
<template>
  <div id="app" :class="{ 'dark': isDarkMode }">
    <ResponsiveLayout>
      <template #sidebar>
        <SidebarMenu />
      </template>
      <template #header>
        <header class="bg-white dark:bg-gray-800 shadow">
          <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ pageTitle }}
            </h1>
            <div class="flex items-center">
              <VersionSelector class="mr-4" />
              <ThemeToggler @toggle="toggleDarkMode" />
            </div>
          </div>
        </header>
      </template>
      <template #main>
        <main>
          <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <router-view></router-view>
          </div>
        </main>
      </template>
    </ResponsiveLayout>
  </div>
</template>

<script>
import { ref, computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import ResponsiveLayout from './components/ResponsiveLayout.vue'
import SidebarMenu from './components/SidebarMenu.vue'
import VersionSelector from './components/VersionSelector.vue'
import ThemeToggler from './components/ThemeToggler.vue'

export default {
  name: 'App',
  components: {
    ResponsiveLayout,
    SidebarMenu,
    VersionSelector,
    ThemeToggler
  },
  setup() {
    const route = useRoute()
    const isDarkMode = ref(false)

    const pageTitle = computed(() => {
      return route.meta.title || 'Documentation'
    })

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
      localStorage.setItem('darkMode', isDarkMode.value.toString())
    }

    // Initialize dark mode from localStorage
    isDarkMode.value = localStorage.getItem('darkMode') === 'true'

    // Provide dark mode state to child components
    provide('isDarkMode', isDarkMode)

    return {
      pageTitle,
      isDarkMode,
      toggleDarkMode
    }
  }
}
</script>

<style>
@import './styles/theme.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.dark #app {
  color: #e2e8f0;
  background-color: #1a202c;
}
</style>

