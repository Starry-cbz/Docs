// v1.1
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { SearchBar } from '../components/SearchBar'
import { RecentDocs } from '../components/RecentDocs'
import { FeaturedDocs } from '../components/FeaturedDocs'

const Home: NextPage = () => {
  const [recentDocs, setRecentDocs] = useState([])
  const [featuredDocs, setFeaturedDocs] = useState([])

  useEffect(() => {
    // Fetch recent and featured docs
    const fetchDocs = async () => {
      const recentResponse = await fetch('/api/recent-docs')
      const recentData = await recentResponse.json()
      setRecentDocs(recentData.docs)

      const featuredResponse = await fetch('/api/featured-docs')
      const featuredData = await featuredResponse.json()
      setFeaturedDocs(featuredData.docs)
    }

    fetchDocs()
  }, [])

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Docs - Home</title>
        <meta name="description" content="Welcome to our documentation site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to Docs</h1>
        <p className="text-xl mb-8">Your central hub for all documentation needs.</p>
        
        <SearchBar className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Documents</h2>
            <RecentDocs docs={recentDocs} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Featured Documents</h2>
            <FeaturedDocs docs={featuredDocs} />
          </div>
        </div>

        <div className="mt-12">
          <Link 
            href="/docs" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Browse All Documentation
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home

