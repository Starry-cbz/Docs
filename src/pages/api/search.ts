// v1.0
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ message: 'Invalid search query' })
  }

  const docsDir = path.join(process.cwd(), 'public', 'docs')
  const results = searchDocs(docsDir, q.toLowerCase())

  res.status(200).json({ results })
}

function searchDocs(dir: string, query: string): Array<{ title: string; url: string }> {
  const results: Array<{ title: string; url: string }> = []

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      results.push(...searchDocs(filePath, query))
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(filePath, 'utf8')
      if (content.toLowerCase().includes(query)) {
        const relativePath = path.relative(path.join(process.cwd(), 'public', 'docs'), filePath)
        const url = `/docs/${relativePath.replace(/\.md$/, '')}`
        results.push({ title: file.replace(/\.md$/, ''), url })
      }
    }
  }

  return results
}

