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
      
      const res = await fetch(`/api/users?t=${Date.now()}`)
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
        
        await fetchUsers() 
        alert('User created!')
      }
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-800 border-b pb-4">
          Full-Stack Dashboard
        </h1>
        
        {health && (
          <div className="bg-emerald-50 p-4 mb-8 rounded-xl border-2 border-emerald-200 text-emerald-800 shadow-sm">
            <span className="font-bold">✓ SYSTEM STATUS: {health.status.toUpperCase()}</span>
            <span className="ml-4 opacity-70">Uptime: {health.uptime.toFixed(0)}s</span>
          </div>
        )}

        
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New User</h2>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              className="bg-white border-2 border-slate-300 p-3 rounded-lg text-slate-900 outline-none focus:border-blue-500 transition" 
              type="email" placeholder="Email Address" required
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              className="bg-white border-2 border-slate-300 p-3 rounded-lg text-slate-900 outline-none focus:border-blue-500 transition" 
              type="text" placeholder="Full Name"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg disabled:bg-slate-400" disabled={loading}>
              {loading ? 'Adding...' : 'Create User'}
            </button>
          </form>
        </div>

        
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-800 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Database Records</h2>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">Total: {users.length}</span>
          </div>
          <ul className="divide-y divide-slate-200">
            {users.length === 0 ? (
              <li className="p-8 text-center text-slate-500 italic">No users found.</li>
            ) : (
              users.map(u => (
                <li key={u.id} className="p-5 flex justify-between items-center hover:bg-slate-50 transition">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900">{u.name || 'Anonymous User'}</span>
                    <span className="text-blue-600 font-medium">{u.email}</span>
                  </div>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </main>
  )
}