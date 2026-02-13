'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [health, setHealth] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  })

  // Fetch all data on load
  useEffect(() => {
    fetchUsers()
    fetchPosts()
    checkHealth()
  }, [])

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      setHealth(data)
    } catch (error) {
      console.error('Health check failed:', error)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data.data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts?limit=5')
      const data = await res.json()
      setPosts(data.data || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    if (!formData.email) {
      alert('Email is required')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setFormData({ email: '', name: '' })
        fetchUsers()
        alert('User created successfully!')
      } else {
        alert('Error creating user')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Next.js + PostgreSQL Full-Stack
          </h1>
          <p className="text-lg text-gray-600">
            Production-ready application with Serverless APIs, Edge Functions & Advanced Monitoring
          </p>
        </div>

        {/* Health Status */}
        {health && (
          <div className="bg-green-100 border border-green-400 rounded-lg p-4 mb-8 text-center">
            <p className="text-green-800">
              ✓ System Status: <strong>{health.status}</strong> | Uptime: {health.uptime.toFixed(2)}s
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Create User Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Name (optional)"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Serverless API Routes (/api/*)</li>
              <li>✓ Edge Functions for Geo-Location</li>
              <li>✓ PostgreSQL with Prisma ORM</li>
              <li>✓ Web Vitals Monitoring</li>
              <li>✓ Security Headers (CSP, HSTS)</li>
              <li>✓ Aggressive Caching (ISR)</li>
              <li>✓ GitHub Actions CI/CD</li>
              <li>✓ Vercel Deployment Ready</li>
            </ul>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Users ({users.length})
          </h2>
          {users.length === 0 ? (
            <p className="text-gray-600">No users found. Create one above!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 font-semibold">ID</th>
                    <th className="px-4 py-2 font-semibold">Email</th>
                    <th className="px-4 py-2 font-semibold">Name</th>
                    <th className="px-4 py-2 font-semibold">Posts</th>
                    <th className="px-4 py-2 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{user.id}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.name || '-'}</td>
                      <td className="px-4 py-2">{user.posts?.length || 0}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Latest Posts ({posts.length})
          </h2>
          {posts.length === 0 ? (
            <p className="text-gray-600">No posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <h3 className="font-semibold text-gray-900">{post.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    By <strong>{post.author.name || post.author.email}</strong>
                  </p>
                  <p className="text-gray-700 mt-2">{post.content}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>Status: {post.published ? 'Published' : 'Draft'}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documentation Links */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            API Endpoints Available
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <a href="/api/users" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              GET /api/users
            </a>
            <a href="/api/posts" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              GET /api/posts
            </a>
            <a href="/api/health" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              GET /api/health
            </a>
            <a href="/api/geo-location" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              GET /api/geo-location (Edge)
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
