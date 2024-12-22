// v1.0
import { ref, onMounted } from 'vue'
import Head from 'next/head'
import { SearchBar } from '@/components/SearchBar.vue'
import { RecentDocs } from '@/components/RecentDocs.vue'
import { FeaturedDocs } from '@/components/FeaturedDocs.vue'

export default function Home() {
  const recentDocs = ref([])
  const featuredDocs = ref([])

  onMounted(async () => {
    try {
      const [recentResponse, featuredResponse] = await Promise.all([
        fetch('/api/recent-docs'),
        fetch('/api/featured-docs')
      ])
      recentDocs.value = await recentResponse.json()
      featuredDocs.value = await featuredResponse.json()
    } catch (error) {
      console.error('Error fetching docs:', error)
    }
  })

  return (
    <div>
      <Head>
        <title>Documentation Home</title>
        <meta name="description" content="Welcome to our documentation site" />
      </Head>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Our Docs</h1>
        
        <SearchBar className="mb-12" />

        <div className="grid md:grid-cols-2 gap-8">
          <RecentDocs docs={recentDocs.value} />
          <FeaturedDocs docs={featuredDocs.value} />
        </div>
      </main>
    </div>
  )
}

