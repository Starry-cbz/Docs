<!-- v1.0 -->
<template>
  <div class="version-selector">
    <label for="version-select" class="sr-only">Select version</label>
    <select
      id="version-select"
      v-model="selectedVersion"
      @change="changeVersion"
      class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      <option v-for="version in versions" :key="version" :value="version">
        {{ version }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'VersionSelector',
  setup() {
    const router = useRouter()
    const versions = ref([])
    const selectedVersion = ref('')

    onMounted(async () => {
      try {
        const response = await fetch('/api/versions')
        const data = await response.json()
        versions.value = data.versions
        selectedVersion.value = data.currentVersion
      } catch (error) {
        console.error('Error fetching versions:', error)
      }
    })

    const changeVersion = () => {
      const currentPath = router.currentRoute.value.path
      const newPath = currentPath.replace(/^\/v[^/]+/, `/v${selectedVersion.value}`)
      router.push(newPath)
    }

    return {
      versions,
      selectedVersion,
      changeVersion
    }
  }
}
</script>

