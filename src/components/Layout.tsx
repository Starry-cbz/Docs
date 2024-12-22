import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Spinner } from '@/components/ui/spinner'
import { useTheme } from 'next-themes'
import { Menu, X, Sun, Moon } from 'lucide-react'

const ThemeToggler = dynamic(() => import('./ThemeToggler'), { 
  ssr: false,
  loading: () => <Spinner />
})
const SidebarMenu = dynamic(() => import('./SidebarMenu'), { 
  ssr: false,
  loading: () => <Spinner />
})

interface MenuItem {
  title: string;
  url?: string;
  children?: MenuItem[];
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/menu')
        if (!response.ok) throw new Error('Failed to fetch menu items')
        const data = await response.json()
        setMenuItems(data.menuItems)
      } catch (error) {
        console.error('Error fetching menu items:', error)
        setError('Failed to load menu. Please try refreshing the page.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <nav className={`bg-gray-100 dark:bg-gray-800 w-64 fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}>
        <div className="flex justify-between items-center p-4 md:hidden">
          <h1 className="text-2xl font-bold dark:text-white">Docs</h1>
          <button onClick={toggleMobileMenu} className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600" aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-full">
          <h1 className="text-2xl font-bold mb-6 dark:text-white hidden md:block">Docs</h1>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <SidebarMenu menuItems={menuItems} />
          )}
          <div className="mt-6">
            <ThemeToggler />
          </div>
        </div>
      </nav>
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center">
          <button onClick={toggleMobileMenu} className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600 md:hidden" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link href="/search" className="ml-4 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
              Search
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6 bg-white dark:bg-gray-900 dark:text-white overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout

