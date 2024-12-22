// v1.0
import React from 'react'
import Link from 'next/link'

interface Doc {
  id: string
  title: string
  path: string
}

interface RecentDocsProps {
  docs: Doc[]
}

export const RecentDocs: React.FC<RecentDocsProps> = ({ docs }) => {
  return (
    <ul className="space-y-2">
      {docs.map((doc) => (
        <li key={doc.id}>
          <Link href={`/docs/${doc.path}`} className="text-blue-500 hover:underline">
            {doc.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

