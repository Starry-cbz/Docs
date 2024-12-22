<!-- v1.0 -->
<template>
  <div>
    <slot v-if="isAuthenticated"></slot>
    <div v-else class="text-center py-8">
      <p class="text-xl mb-4">You need to be logged in to view this content.</p>
      <button
        @click="login"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Log In
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AuthGuard',
  setup() {
    const router = useRouter()
    const isAuthenticated = ref(false)

    onMounted(() => {
      checkAuthStatus()
    })

    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status')
        const data = await response.json()
        isAuthenticated.value = data.isAuthenticated
      } catch (error) {
        console.error('Error checking auth status:', error)
        isAuthenticated.value = false
      }
    }

    const login = () => {
      router.push('/login')
    }

    return {
      isAuthenticated,
      login
    }
  }
}
</script>

