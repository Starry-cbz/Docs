// v1.0
import { marked } from 'marked'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

// Configure marked options
marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-',
})

// Custom renderer to add IDs to headings
const renderer = new marked.Renderer()
renderer.heading = function (text, level) {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
  return `
    <h${level} id="${escapedText}">
      ${text}
    </h${level}>
  `
}

// Function to parse and sanitize markdown
export function parseMarkdown(markdown) {
  const rawHtml = marked(markdown, { renderer })
  return DOMPurify.sanitize(rawHtml)
}

// Function to extract table of contents from markdown
export function extractTOC(markdown) {
  const tokens = marked.lexer(markdown)
  const toc = []

  tokens.forEach(token => {
    if (token.type === 'heading') {
      toc.push({
        level: token.depth,
        text: token.text,
        id: token.text.toLowerCase().replace(/[^\w]+/g, '-')
      })
    }
  })

  return toc
}

// Function to render Mermaid diagrams
export function renderMermaidDiagrams() {
  import('mermaid').then((mermaid) => {
    mermaid.initialize({ startOnLoad: true })
    mermaid.init(undefined, '.mermaid')
  })
}

