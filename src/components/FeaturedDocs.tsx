// v1.0
import React from 'react'
import Link from 'next/link'

interface Doc {
  id: string
  title: string
  path: string
  description: string
}

interface FeaturedDocsProps {
  docs: Doc[]
}

export const FeaturedDocs: React.FC<FeaturedDocsProps> = ({ docs }) => {
  return (
    <div className="space-y-4">
      {docs.map((doc) => (
        <div key={doc.id} className="border p-4 rounded-lg">
          <Link href={`/docs/${doc.path}`} className="text-lg font-semibold text-blue-500 hover:underline">
            {doc.title}
          </Link>
          <p className="mt-2 text-gray-600">{doc.description}</p>
        </div>
      ))}
    </div>
  )
}

