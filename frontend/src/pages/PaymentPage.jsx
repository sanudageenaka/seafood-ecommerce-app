import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function PaymentPage() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()

  // Redirect if no items in cart
  useEffect(() => {
    if (items.length === 0) {
      navigate('/payment')
    }
  }, [items, navigate])

  const handleConfirmPayment = () => {
    alert('✅ Payment successful! Thank you for your order.')
    clear()
    navigate('/') // Back to homepage
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          💳 Payment Gateway
        </h1>

        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Order Summary
        </h2>

        <ul className="divide-y divide-gray-200 mb-4">
          {items.map((item) => (
            <li key={item.id} className="py-3 flex justify-between">
              <span>{item.name} × {item.qty}</span>
              <span>${item.price * item.qty}</span>
            </li>
          ))}
        </ul>

        <p className="text-right font-bold text-lg mb-6">
          Total: ${total}
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
