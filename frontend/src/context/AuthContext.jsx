
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// Create AuthContext
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🧠 Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // 🟢 Register
  const register = async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      })
      return res.data
    } catch (error) {
      throw error
    }
  }

  // 🟢 Login
  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      })
      const userData = res.data
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      // Optional: set default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
      return userData
    } catch (error) {
      throw error
    }
  }

  // 🔴 Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  // Provide everything to children
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext)
