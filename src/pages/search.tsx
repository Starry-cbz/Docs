import { useState, useCallback, KeyboardEvent, useRef, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { SearchResult } from '@/types/search'

const SearchBar = dynamic(() => import('../components/SearchBar.vue').then(mod => mod.default), { 
  ssr: false,
  loading: () => <Spinner />
})
const SearchResults = dynamic(() => import('../components/SearchResults.vue').then(mod => mod.default), { 
  ssr: false,
  loading: ()=> <Spinner />
})

const SearchPage = () => {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const searchResultsRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Search failed')
      const data = await response.json()
      setResults(data.results)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Error performing search:', error)
      setError('Search failed. Please try again.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      router.push(results[selectedIndex].url)
    }
  }, [results, selectedIndex, router])

  const handleResultSelect = useCallback((result: SearchResult) => {
    router.push(result.url)
  }, [router])

  useEffect(() => {
    if (searchResultsRef.current && selectedIndex >= 0) {
      const selectedElement = searchResultsRef.current.querySelector(`li:nth-child(${selectedIndex + 1})`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedIndex])

  return (
    <>
      <NextSeo
        title="Search Documentation"
        description="Search through our documentation to find the information you need."
        openGraph={{
          title: "Search Documentation",
          description: "Search through our documentation to find the information you need.",
          type: 'website',
        }}
      />
      <div 
        className="container mx-auto px-4" 
        role="search"
        aria-label="Documentation search"
      >
        <Head>
          <title>Docs - Search</title>
          <meta name="description" content="Search documentation" />
        </Head>

        <main className="py-10">
          <h1 className="text-3xl font-bold mb-6">Search Documentation</h1>
          <SearchBar onSearch={handleSearch} />
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 mt-4" role="alert">
              {error}
            </div>
          ) : (
            <div 
              ref={searchResultsRef}
              role="region"
              aria-label="Search results"
            >
              <SearchResults 
                results={results} 
                selectedIndex={selectedIndex}
                onResultSelect={handleResultSelect}
                onKeyDown={handleKeyDown}
                tabIndex={0}
              />
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default SearchPage

