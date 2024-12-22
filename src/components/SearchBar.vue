<template>
  <div class="search-bar relative">
    <input
      v-model="query"
      @input="debouncedSearch"
      @keydown.down.prevent="$emit('next')"
      @keydown.up.prevent="$emit('previous')"
      @keydown.enter="handleEnter"
      type="text"
      placeholder="Search docs..."
      class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      aria-label="Search documentation"
    />
    <div v-if="isLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2" aria-hidden="true">
      <Spinner class="h-5 w-5 text-gray-400" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { Spinner } from '@/components/ui/spinner'

export default defineComponent({
  name: 'SearchBar',
  components: {
    Spinner
  },
  props: {
    onSearch: {
      type: Function as PropType<(query: string) => Promise<void>>,
      required: true
    }
  },
  emits: ['next', 'previous', 'select'],
  setup(props) {
    const query = ref('')
    const isLoading = ref(false)

    const debouncedSearch = debounce(() => {
      if (query.value.length >= 2) {
        isLoading.value = true
        props.onSearch(query.value).finally(() => {
          isLoading.value = false
        })
      }
    }, 300)

    const handleEnter = () => {
      if (query.value) {
        props.onSearch(query.value)
      }
    }

    watch(query, () => {
      debouncedSearch()
    })

    return {
      query,
      isLoading,
      debouncedSearch,
      handleEnter
    }
  }
})
</script>

