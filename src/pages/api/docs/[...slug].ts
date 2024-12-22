// v1.2
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query

  if (!slug || !Array.isArray(slug)) {
    return res.status(400).json({ message: 'Invalid slug' })
  }

  const filePath = path.join(process.cwd(), 'public', 'docs', ...slug) + '.md'

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Document not found' })
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    res.status(200).json({
      content,
      title: data.title || slug[slug.length - 1],
      description: data.description || '',
    })
  } catch (error) {
    console.error('Error reading file:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

