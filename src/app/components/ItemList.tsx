'use client'

import { useState } from 'react'

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

interface ItemListProps {
  items: Item[]
  currentUserId: number | null
  onItemDeleted: (itemId: number) => void
}

export function ItemList({ items, currentUserId, onItemDeleted }: ItemListProps) {
  const [deletingItems, setDeletingItems] = useState<Set<number>>(new Set())

  const handleDelete = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return
    }

    setDeletingItems(prev => new Set(prev).add(itemId))

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onItemDeleted(itemId)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete item')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    } finally {
      setDeletingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (items.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center text-gray-500">
          <p className="text-lg">No items found</p>
          <p className="text-sm mt-2">
            {currentUserId ? 'Create your first item above!' : 'Sign in to create items.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">All Items</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                  {item.description}
                </p>
                <div className="text-sm text-gray-500">
                  <p>Created by: {item.user.name} ({item.user.email})</p>
                  <p>Created at: {formatDate(item.createdAt)}</p>
                </div>
              </div>
              
              {currentUserId === item.createdBy && (
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingItems.has(item.id)}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingItems.has(item.id) ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

