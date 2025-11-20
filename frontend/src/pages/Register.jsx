import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password)
      toast.success('Registration successful! Redirecting to login...', {
        position: 'top-right',
        autoClose: 3000,
      })
      setTimeout(() => navigate('/login'), 3000)
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Registration failed', {
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <ToastContainer />
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="text-gray-500 mb-6">Register to start managing your account.</p>

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-md p-5 space-y-3">
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-xl text-white ${loading ? 'bg-gray-500' : 'bg-gray-900'}`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
