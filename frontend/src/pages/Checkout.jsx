import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { items, total, remove, formatLKR } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    if (!items.length) return;

    // ✅ Save cart snapshot for the next page (safe even on refresh)
    const snapshot = {
      items,
      total,
      createdAt: new Date().toISOString(),
    };
    sessionStorage.setItem("checkout_snapshot", JSON.stringify(snapshot));

    // ✅ Go to delivery location page
    navigate("/delivery-location", { state: snapshot });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="bg-white card shadow-soft p-5">
          <ul className="divide-y">
            {items.map((it) => (
              <li key={it.id} className="py-3 flex items-center gap-3">
                <img
                  className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                  src={it.image || `https://picsum.photos/seed/${it.id}/200/200`}
                  alt={it.name}
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{it.name}</p>
                  <p className="text-gray-500 text-sm">Qty: {it.qty}</p>
                </div>

                <p className="font-bold whitespace-nowrap">
                  {formatLKR(it.price * it.qty)}
                </p>

                <button
                  onClick={() => remove(it.id)}
                  className="text-sm text-red-600 hover:underline"
                  type="button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between pt-4">
            <p className="text-lg font-bold">Total: {formatLKR(total)}</p>

            <button
              onClick={handlePlaceOrder}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:opacity-90 disabled:opacity-60"
              disabled={!items.length}
              type="button"
            >
              Place order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
