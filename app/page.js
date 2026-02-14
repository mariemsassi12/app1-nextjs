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
    } catch (error) { console.error('Health check failed', error) }
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
        alert('User created successfully!')
      }
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8 text-blue-800 border-b-4 border-blue-200 pb-2">
          Full-Stack Dashboard
        </h1>
        
        {/* Health Status Banner */}
        {health && (
          <div className="bg-emerald-100 p-4 mb-8 rounded-xl border-2 border-emerald-300 text-emerald-800 shadow-sm flex items-center gap-2">
            <span className="text-xl">✓</span>
            <span className="font-bold uppercase tracking-wider text-sm">System Status: {health.status}</span>
            <span className="ml-auto text-xs opacity-70">Uptime: {Math.floor(health.uptime)}s</span>
          </div>
        )}

        {/* Features List (أهم النقاط في مشروعك) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Active Features</h2>
            <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li className="flex items-center gap-2">✅ Serverless API (/api/users)</li>
              <li className="flex items-center gap-2">✅ Edge Geo-Location</li>
              <li className="flex items-center gap-2">✅ PostgreSQL + Prisma ORM</li>
              <li className="flex items-center gap-2">✅ Web Vitals Monitoring</li>
              <li className="flex items-center gap-2">✅ Security Headers (CSP)</li>
            </ul>
          </div>

          {/* Add User Form */}
          <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-600">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <input 
                className="w-full border-2 border-slate-200 p-2 rounded-lg outline-none focus:border-blue-500 transition" 
                type="email" placeholder="Email Address" required
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input 
                className="w-full border-2 border-slate-200 p-2 rounded-lg outline-none focus:border-blue-500 transition" 
                type="text" placeholder="Full Name"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition active:scale-95" disabled={loading}>
                {loading ? 'Processing...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>

        {/* User List Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-800 p-4">
            <h2 className="text-lg font-bold text-white flex justify-between">
              Database Records <span>Total: {users.length}</span>
            </h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {users.map(u => (
              <li key={u.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                <div>
                  <p className="font-bold text-slate-800">{u.name || 'Anonymous'}</p>
                  <p className="text-sm text-blue-600">{u.email}</p>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}