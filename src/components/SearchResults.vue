<!-- v1.6 -->
<template>
  <div class="search-results mt-6">
    <h2 class="text-2xl font-bold mb-4">Search Results</h2>
    <ul v-if="results.length > 0" role="listbox">
      <li 
        v-for="(result, index) in results" 
        :key="result.url" 
        :class="['mb-4 p-4 rounded-lg transition-colors duration-200', { 'bg-blue-100 dark:bg-blue-900': index === selectedIndex }]"
        @click="$emit('resultSelect', result)"
        @mouseover="$emit('resultHover', index)"
        role="option"
        :aria-selected="index === selectedIndex"
        tabindex="0"
        @keydown.enter="$emit('resultSelect', result)"
      >
        <a :href="result.url" class="text-blue-500 hover:underline dark:text-blue-300 text-lg font-semibold">{{ result.title }}</a>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ result.snippet }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ result.url }}</p>
      </li>
    </ul>
    <p v-else-if="searched" class="text-gray-600 dark:text-gray-400">No results found.</p>
    <p v-else class="text-gray-600 dark:text-gray-400">Enter a search query to see results.</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchResults',
  props: {
    results: {
      type: Array,
      required: true
    },
    searched: {
      type: Boolean,
      default: false
    },
    selectedIndex: {
      type: Number,
      default: -1
    }
  },
  emits: ['resultSelect', 'resultHover']
})
</script>

<style scoped>
.search-results {
  max-width: 800px;
  margin: 0 auto;
}
</style>

