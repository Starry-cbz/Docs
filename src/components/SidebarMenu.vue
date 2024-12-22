<!-- v1.0 -->
<template>
  <nav class="sidebar-menu">
    <ul class="space-y-2">
      <li v-for="(item, index) in menuItems" :key="index">
        <div
          @click="toggleSubmenu(index)"
          class="flex items-center justify-between p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
        >
          <span>{{ item.title }}</span>
          <svg
            v-if="item.children"
            class="w-4 h-4 transition-transform"
            :class="{ 'transform rotate-180': item.isOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        <transition name="submenu">
          <ul v-if="item.children && item.isOpen" class="pl-4 mt-2 space-y-1">
            <li v-for="child in item.children" :key="child.id">
              <router-link
                :to="child.path"
                class="block p-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
                :class="{ 'bg-gray-200 dark:bg-gray-600': isActive(child.path) }"
              >
                {{ child.title }}
              </router-link>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'SidebarMenu',
  setup() {
    const route = useRoute()
    const menuItems = ref([])

    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu-items')
        const data = await response.json()
        menuItems.value = data.map(item => ({ ...item, isOpen: false }))
      } catch (error) {
        console.error('Error fetching menu items:', error)
      }
    }

    const toggleSubmenu = (index) => {
      menuItems.value[index].isOpen = !menuItems.value[index].isOpen
    }

    const isActive = (path) => {
      return route.path === path
    }

    onMounted(() => {
      fetchMenuItems()
    })

    return {
      menuItems,
      toggleSubmenu,
      isActive
    }
  }
}
</script>

<style scoped>
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 300px;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>

