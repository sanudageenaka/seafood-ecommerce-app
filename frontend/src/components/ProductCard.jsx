import { Link } from 'react-router-dom'

export default function ProductCard({ p }) {
  return (
    <Link to={`/product/${p.id}`} className="group block bg-white card shadow-soft p-3 hover:-translate-y-0.5 hover:shadow-lg transition">
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
        {/* eslint-disable-next-line */}
        <img src={p.image_url || 'https://picsum.photos/seed/' + p.id + '/800/800'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
      </div>
      <div className="pt-3">
        <h3 className="font-semibold line-clamp-1">{p.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
        <p className="pt-2 font-bold">${Number(p.price).toFixed(2)}</p>
      </div>
    </Link>
  )
}
