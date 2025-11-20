import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, LogIn, LogOut, User, Search } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useState } from 'react'

export default function Navbar() {
  const { items } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="font-bold text-xl tracking-tight">Ocean<span className="text-blue-600">Wave</span></Link>

        <form onSubmit={(e)=>{e.preventDefault(); navigate(`/?q=${encodeURIComponent(query)}`)}}
              className="ml-auto flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 w-full max-w-md">
          <Search className="w-4 h-4 opacity-70" />
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products..."
                 className="bg-transparent outline-none text-sm w-full"/>
        </form>

        <nav className="flex items-center gap-3">
          {user?.role === 'admin' && <Link to="/admin" className="text-sm font-medium hover:underline">Admin</Link>}
          {user ? (
            <button onClick={logout} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-gray-900 text-white hover:opacity-90">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <Link to="/login" className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-gray-900 text-white hover:opacity-90">
              <LogIn className="w-4 h-4" /> Login
            </Link>
          )}
          <Link to="/checkout" className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white">
            <ShoppingCart className="w-5 h-5" />
            {items.length > 0 && <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-blue-500 text-white rounded-full px-1.5 py-0.5">{items.length}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}
