import { useEffect, useState } from 'react'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Admin() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image_url: '' })
  const [error, setError] = useState('')

  const load = async () => {
    const { data } = await api.get('/api/products')
    setProducts(data)
  }

  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/products', {...form, price: Number(form.price)})
      setForm({ name: '', description: '', price: '', category: '', image_url: '' })
      load()
    } catch (e) {
      setError(e?.response?.data?.error || 'Save failed')
    }
  }

  const del = async (id) => {
    await api.delete(`/api/products/${id}`)
    load()
  }

  if (!user || user.role !== 'admin') return <div className="max-w-4xl mx-auto px-4 py-10">Admins only.</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin</h1>

      <form onSubmit={save} className="bg-white card shadow-soft p-5 grid md:grid-cols-2 gap-4 mb-8">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input placeholder="Name" className="border rounded-lg px-3 py-2" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
        <input placeholder="Category" className="border rounded-lg px-3 py-2" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} />
        <input placeholder="Price" type="number" className="border rounded-lg px-3 py-2" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} />
        <input placeholder="Image URL" className="border rounded-lg px-3 py-2" value={form.image_url} onChange={e=>setForm({...form, image_url: e.target.value})} />
        <textarea placeholder="Description" className="border rounded-lg px-3 py-2 md:col-span-2" rows={3} value={form.description} onChange={e=>setForm({...form, description: e.target.value})}></textarea>
        <button className="px-5 py-2 rounded-xl bg-gray-900 text-white md:col-span-2">Add product</button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white card shadow-soft p-3">
            {/* eslint-disable-next-line */}
            <img src={p.image_url || 'https://picsum.photos/seed/' + p.id + '/800/800'} alt={p.name} className="w-full h-40 object-cover rounded-lg" />
            <div className="pt-2">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">${Number(p.price).toFixed(2)}</p>
              <button onClick={()=>del(p.id)} className="mt-2 text-sm text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
