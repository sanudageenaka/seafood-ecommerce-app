import { useCart } from '../context/CartContext'

const products = [
  { id: 1, name: 'Decapterus russelli', localName: 'LINNA', price: 120, image: 'public/seafoods/fish14.jpg' },
  { id: 2, name: 'Istiophorus Platypterus', localName: 'THALAPATH', price: 90, image: 'public/seafoods/fish15.jpg' },
  { id: 3, name: 'Skipjack Tuna', localName: 'BALAYA', price: 75, image: 'public/seafoods/fish16.jpg' },
  { id: 4, name: 'Narrow-barred Spanish mackerel', localName: 'THORA', price: 45, image: 'public/seafoods/fish17.jpg' },
  { id: 5, name: 'Yellowfin tuna', localName: 'KELAWALLA', price: 85, image: 'public/seafoods/fish18.jpg' },
  { id: 6, name: 'Bigeye scad', localName: 'BOLLA', price: 130, image: 'public/seafoods/fish19.jpg' },
]

export default function Shop() {
  const { items, add, remove, clear, total } = useCart()

  const handleBuy = () => {
    if (items.length === 0) {
      alert('Your cart is empty!')
      return
    }
    alert(`🛒 Purchase successful! Total: $${total}`)
    clear()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Left: Products list */}
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold mb-4">🛍️ Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border rounded-xl p-4 shadow-sm flex flex-col items-center bg-white">
              <img src={p.image} alt={p.name} className="w-32 h-32 object-cover mb-3 rounded-lg" />
              <h2 className="font-semibold text-lg">{p.name}</h2>
              <p className="text-gray-500 text-sm italic mb-1">{p.localName}</p> {/* Sri Lankan name line */}
              <p className="text-gray-700 font-medium">${p.price}</p>
              <button
                onClick={() => add(p, 1)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Cart summary */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-3">🛒 Your Cart</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">No items added yet.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.qty} × ${item.price}</p>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 border-t pt-3">
          <p className="font-semibold">Total: ${total}</p>
          <button
            onClick={handleBuy}
            className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Buy Now
          </button>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="w-full mt-2 text-sm text-gray-500 underline"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
