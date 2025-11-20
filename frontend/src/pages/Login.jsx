import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="text-gray-500 mb-6">Log in to manage your account.</p>
      <form onSubmit={onSubmit} className="bg-white card shadow-soft p-5 space-y-3">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <button className="w-full py-2 rounded-xl bg-gray-900 text-white">
          Login
        </button>

        {/* Added Register link here */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
