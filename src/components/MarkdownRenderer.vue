<!-- v1.6 -->
<template>
  <div class="markdown-body" ref="contentRef"></div>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import mermaid from 'mermaid'

export default defineComponent({
  name: 'MarkdownRenderer',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const contentRef = ref(null)

    const renderer = new marked.Renderer()

    renderer.code = (code, language) => {
      if (language === 'mermaid') {
        return `<div class="mermaid">${code}</div>`
      }

      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
      const highlightedCode = hljs.highlight(validLanguage, code).value
      return `<pre><code class="hljs ${validLanguage}">${highlightedCode}</code></pre>`
    }

    marked.setOptions({
      renderer,
      highlight: null,
      breaks: true,
      gfm: true
    })

    const renderContent = () => {
      if (contentRef.value) {
        const sanitizedContent = DOMPurify.sanitize(marked(props.content), {
          ADD_ATTR: ['target']
        })
        contentRef.value.innerHTML = sanitizedContent
        mermaid.init(undefined, contentRef.value.querySelectorAll('.mermaid'))
      }
    }

    watch(() => props.content, renderContent)

    onMounted(() => {
      renderContent()
    })

    return {
      contentRef
    }
  }
})
</script>

<style>
@import 'highlight.js/styles/github-dark.css';
@import 'mermaid/dist/mermaid.css';

.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  color: #333;
  line-height: 1.6;
}

.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 { font-size: 2em; }
.markdown-body h2 { font-size: 1.5em; }
.markdown-body h3 { font-size: 1.25em; }
.markdown-body h4 { font-size: 1em; }
.markdown-body h5 { font-size: 0.875em; }
.markdown-body h6 { font-size: 0.85em; }

.markdown-body p, .markdown-body blockquote, .markdown-body ul, .markdown-body ol, .markdown-body dl, .markdown-body table, .markdown-body pre {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-body pre code {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

.dark .markdown-body {
  color: #e2e8f0;
}

.dark .markdown-body code {
  background-color: rgba(200,200,200,0.1);
}

.dark .markdown-body pre {
  background-color: #2d3748;
}

.mermaid {
  margin-bottom: 16px;
}
</style>

