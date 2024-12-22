<!-- v1.0 -->
<template>
  <div class="responsive-layout flex h-screen bg-gray-100 dark:bg-gray-900">
    <aside
      class="sidebar w-64 bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out"
      :class="{ '-translate-x-full': !isSidebarOpen }"
    >
      <div class="p-4">
        <slot name="sidebar"></slot>
      </div>
    </aside>
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white dark:bg-gray-800 shadow-sm z-10">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              @click="toggleSidebar"
              class="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <slot name="header"></slot>
          </div>
        </div>
      </header>
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <slot name="main"></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ResponsiveLayout',
  setup() {
    const isSidebarOpen = ref(false)

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value
    }

    return {
      isSidebarOpen,
      toggleSidebar
    }
  }
}
</script>

<style scoped>
@media (min-width: 1024px) {
  .sidebar {
    transform: translateX(0) !important;
  }
}
</style>

