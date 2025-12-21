import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function PaymentPage() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) navigate('/fish')
  }, [items, navigate])

  // ✅ Hard lock body scroll on this page
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [])

  const formatLKR = (amount) =>
    `Rs. ${Number(amount).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`

  const handleConfirmPayment = () => {
    alert('✅ Payment successful! Thank you for your order.')
    clear()
    navigate('/')
  }

  return (
    // ✅ Covers the screen fully (even if App has other content)
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          💳 Payment
        </h1>

        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Order Summary
        </h2>

        {/* ✅ If there are many items, scroll only inside this box */}
        <div className="max-h-56 overflow-auto divide-y divide-gray-200 mb-4">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between text-sm">
              <span>{item.name} × {item.qty}</span>
              <span className="font-medium">{formatLKR(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <p className="text-right font-bold text-lg mb-6 text-gray-800">
          Total: {formatLKR(total)}
        </p>

        <button
          onClick={handleConfirmPayment}
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          Proceed to Pay
        </button>

        <button
          onClick={() => navigate('/fish')}
          className="w-full mt-3 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Back to Shop
        </button>
      </div>
    </div>
  )
}
