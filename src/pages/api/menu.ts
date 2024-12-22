// v1.0
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const docsDir = path.join(process.cwd(), 'public', 'docs')
  const menuItems = generateMenuItems(docsDir)

  res.status(200).json({ menuItems })
}

function generateMenuItems(dir: string, basePath: string = '/docs'): any[] {
  const items = []

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      const subItems = generateMenuItems(filePath, `${basePath}/${file}`)
      if (subItems.length > 0) {
        items.push({
          title: file,
          children: subItems
        })
      }
    } else if (file.endsWith('.md')) {
      items.push({
        title: file.replace(/\.md$/, ''),
        url: `${basePath}/${file.replace(/\.md$/, '')}`
      })
    }
  }

  return items
}

