'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [health, setHealth] = useState(null)
  const [formData, setFormData] = useState({ email: '', name: '' })

  useEffect(() => {
    fetchUsers()
    checkHealth()
  }, [])

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      setHealth(data)
    } catch (error) { console.error(error) }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data.data || [])
    } finally { setLoading(false) }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setFormData({ email: '', name: '' })
        fetchUsers()
        alert('User created!')
      }
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Management System</h1>
        
        {health && (
          <div className="bg-green-100 p-4 mb-6 rounded border border-green-200 text-green-700">
            ✓ System Status: <strong>{health.status}</strong>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <form onSubmit={handleCreateUser} className="flex gap-4">
            <input 
              className="border p-2 rounded w-full" 
              type="email" placeholder="Email" required
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              className="border p-2 rounded w-full" 
              type="text" placeholder="Name"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded" disabled={loading}>
              {loading ? '...' : 'Add'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users List ({users.length})</h2>
          <ul className="divide-y">
            {users.map(u => (
              <li key={u.id} className="py-2 flex justify-between">
                <span><strong>{u.name || 'No Name'}</strong> ({u.email})</span>
                <span className="text-gray-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}