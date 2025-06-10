'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { ItemForm } from './components/ItemForm'
import { ItemList } from './components/ItemList'

interface Item {
  id: number
  title: string
  description: string
  createdAt: string
  createdBy: number
  user: {
    name: string
    email: string
  }
}

export default function Home() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleItemCreated = (newItem: Item) => {
    setItems(prev => [newItem, ...prev])
  }

  const handleItemDeleted = (itemId: number) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              BauAI Item Manager
            </h1>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-700">
                    Welcome, {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {session && (
            <div className="mb-8">
              <ItemForm onItemCreated={handleItemCreated} />
            </div>
          )}
          
          <ItemList 
            items={items} 
            currentUserId={session?.user?.id ? parseInt(session.user.id) : null}
            onItemDeleted={handleItemDeleted}
          />
        </div>
      </main>
    </div>
  )
}

