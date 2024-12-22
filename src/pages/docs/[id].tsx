import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Spinner } from '@/components/ui/spinner'

const MarkdownRenderer = dynamic(() => import('@/components/MarkdownRenderer.vue').then(mod => mod.default), {
  ssr: false,
  loading: () => <Spinner />
})
const CommentSection = dynamic(() => import('@/components/CommentSection.vue').then(mod => mod.default), {
  ssr: false,
  loading: () => <Spinner />
})
const AuthGuard = dynamic(() => import('@/components/AuthGuard.vue').then(mod => mod.default), {
  ssr: false,
  loading: () => <Spinner />
})

interface DocumentPageProps {
  document: {
    id: string
    title: string
    content: string
    requiresAuth: boolean
  }
}

export default function DocumentPage({ document }: DocumentPageProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>
  }

  return (
    <>
      <Head>
        <title>{document.title} | Docs</title>
        <meta name="description" content={`Documentation for ${document.title}`} />
      </Head>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{document.title}</h1>
        {document.requiresAuth ? (
          <AuthGuard>
            <MarkdownRenderer content={document.content} />
          </AuthGuard>
        ) : (
          <MarkdownRenderer content={document.content} />
        )}
        <CommentSection documentId={document.id} />
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all document IDs
  const res = await fetch('https://api.example.com/docs')
  const documents = await res.json()

  const paths = documents.map((doc: { id: string }) => ({
    params: { id: doc.id },
  }))

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.id) {
    return { notFound: true }
  }

  // Fetch document data
  const res = await fetch(`https://api.example.com/docs/${params.id}`)
  const document = await res.json()

  if (!document) {
    return { notFound: true }
  }

  return {
    props: { document },
    revalidate: 60, // Revalidate every 60 seconds
  }
}

