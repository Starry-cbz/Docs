// v1.4
import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import vueApp from '../utils/vueApp'
import ErrorBoundary from '../components/ErrorBoundary'
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const mountVueApp = () => {
      const vueRoot = document.getElementById('vue-app')
      if (vueRoot && !vueRoot.hasChildNodes()) {
        vueApp.mount(vueRoot)
      }
    }

    if (typeof window !== 'undefined') {
      mountVueApp()
    }

    return () => {
      if (typeof window !== 'undefined') {
        vueApp.unmount()
      }
    }
  }, [])

  return (
    <ThemeProvider attribute="class">
      <ErrorBoundary>
        <Layout>
          <Component {...pageProps} />
          {isClient && <div id="vue-app"></div>}
        </Layout>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default MyApp

