// v1.0
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Head from 'next/head'
import { SearchBar } from '@/components/SearchBar.vue'
import { SearchResults } from '@/components/SearchResults.vue'

export default function Search() {
  const router = useRouter()
  const searchQuery = ref('')
  const searchResults = ref([])
  const isLoading = ref(false)

  watch(() => router.query.q, (newQuery) => {
    if (newQuery) {
      searchQuery.value = newQuery
      performSearch()
    }
  }, { immediate: true })

  const performSearch = async () => {
    if (!searchQuery.value) return

    isLoading.value = true
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.value)}`)
      searchResults.value = await response.json()
    } catch (error) {
      console.error('Error performing search:', error)
    } finally {
      isLoading.value = false
    }
  }

  const handleSearch = (query) => {
    searchQuery.value = query
    router.push(`/search?q=${encodeURIComponent(query)}`, undefined, { shallow: true })
  }

  return (
    <div>
      <Head>
        <title>Search Documentation</title>
        <meta name="description" content="Search our documentation" />
      </Head>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Search Documentation</h1>
        
        <SearchBar onSearch={handleSearch} initialQuery={searchQuery.value} className="mb-8" />

        {isLoading.value ? (
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <SearchResults results={searchResults.value} />
        )}
      </main>
    </div>
  )
}

