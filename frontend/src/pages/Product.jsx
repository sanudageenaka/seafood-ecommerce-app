import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { useCart } from '../context/CartContext.jsx'

export default function Product() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [qty, setQty] = useState(1)
  const { add } = useCart()

  useEffect(() => {
    api.get(`/api/products/${id}`).then(({data}) => setP(data))
  }, [id])

  if (!p) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="bg-white card shadow-soft p-3">
        {/* eslint-disable-next-line */}
        <img className="w-full rounded-xl" src={p.image_url || 'https://picsum.photos/seed/' + p.id + '/1200/1200'} alt={p.name} />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{p.name}</h1>
        <p className="text-gray-600 mt-2">{p.description}</p>
        <p className="text-2xl font-extrabold mt-4">${Number(p.price).toFixed(2)}</p>

        <div className="mt-6 flex items-center gap-3">
          <input type="number" min="1" value={qty} onChange={(e)=>setQty(Number(e.target.value))}
                 className="w-20 border rounded-lg px-2 py-1" />
          <button onClick={()=>add(p, qty)} className="px-5 py-2 rounded-xl bg-gray-900 text-white hover:opacity-90">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}
