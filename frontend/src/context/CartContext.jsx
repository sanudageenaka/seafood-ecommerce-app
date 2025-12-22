import { createContext, useContext, useState, useMemo } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])

  const add = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p =>
          p.id === product.id ? { ...p, qty: p.qty + qty } : p
        )
      }
      return [...prev, { ...product, qty }]
    })
  }

  const remove = (id) => setItems(prev => prev.filter(p => p.id !== id))
  const clear = () => setItems([])

  const total = useMemo(
    () => items.reduce((sum, p) => sum + Number(p.price) * Number(p.qty), 0),
    [items]
  )

  // ✅ add formatter here
const formatLKR = (amount) =>
  `LKR ${Number(amount).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  return (
    <CartContext.Provider value={{ items, add, remove, clear, total, formatLKR }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
