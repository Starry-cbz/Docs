import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Spinner } from '@/components/ui/spinner'
import { NextSeo } from 'next-seo'

const MarkdownRenderer = dynamic(() => import('../../components/MarkdownRenderer'), { 
  ssr: false,
  loading: () => <Spinner />
})

const DocPage = () => {
  const router = useRouter()
  const { slug } = router.query
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<{ title: string; description: string }>({ title: '', description: '' })

  useEffect(() => {
    const fetchContent = async () => {
      if (slug) {
        setIsLoading(true)
        setError(null)
        try {
          const response = await fetch(`/api/docs/${Array.isArray(slug) ? slug.join('/') : slug}`)
          if (!response.ok) throw new Error('Failed to fetch content')
          const data = await response.json()
          setContent(data.content)
          setMetadata({ title: data.title, description: data.description })
        } catch (error) {
          console.error('Error fetching content:', error)
          setError('Failed to load content. Please try again later.')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchContent()
  }, [slug])

  const title = metadata.title || (Array.isArray(slug) ? slug.join(' / ') : slug as string)
  const description = metadata.description || `Documentation for ${title}`

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          type: 'article',
        }}
      />
      <div className="container mx-auto px-4">
        <Head>
          <title>Docs - {title}</title>
          <meta name="description" content={description} />
        </Head>

        <main className="py-10">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <MarkdownRenderer content={content} />
          )}
        </main>
      </div>
    </>
  )
}

export default DocPage

