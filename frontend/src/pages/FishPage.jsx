import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Products (daily prices for display ONLY)
const products = [
  { id: 2, name: "Istiophorus Platypterus", localName: "THALAPATH", price: 1700, image: "/seafoods/fish15.jpg" },
  { id: 3, name: "Skipjack Tuna", localName: "BALAYA", price: 800, image: "/seafoods/fish16.jpg" },
  { id: 5, name: "Yellowfin tuna", localName: "KELAWALLA", price: 1100, image: "/seafoods/fish18.jpg" },
  { id: 7, name: "Marlin", localName: "KOPPARA", price: 2000, image: "/seafoods/fish20.jpg" },
  { id: 8, name: "trevally", localName: "PARAW", price: 900, image: "/seafoods/fish21.jpg" },
  { id: 9, name: "Swordfish", localName: "SAPPARA", price: 1100, image: "/seafoods/fish22.jpg" },
];

export default function FishPage() {
  // ✅ updated context values (NO total here)
  const { items, add, remove, clear, totalKg } = useCart();
  const navigate = useNavigate();

  const [kgInputs, setKgInputs] = useState({});

  const handleKgChange = (id, value) => {
    setKgInputs((prev) => ({ ...prev, [id]: value }));
  };

  const addKgToCart = (product) => {
    const kg = Number(kgInputs[product.id]) || 0;
    if (kg <= 0) return alert("Enter a valid kg.");

    // ✅ DO NOT pass price into cart (daily price is display-only)
    add(
      {
        id: product.id,
        name: product.localName, // cart display name
        scientificName: product.name, // optional
        image: product.image,
      },
      kg
    );

    setKgInputs((prev) => ({ ...prev, [product.id]: "" }));
  };

  const handleBuy = () => {
    if (items.length === 0) return alert("Cart is empty!");
    if (totalKg < 10) return alert(`Minimum total order is 10kg. You have ${totalKg}kg.`);
    navigate("/delivery-location");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 items-start">
      {/* PRODUCTS */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">🛍️ Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border rounded-xl p-4 shadow bg-white">
              <img
                src={p.image}
                className="w-37 h-32 object-cover mb-3 rounded-lg mx-auto"
                alt={p.name}
              />

              <p className="font-semibold text-center">{p.localName}</p>
              <h2 className="text-sm italic text-gray-600 text-center">{p.name}</h2>

              {/* ✅ Daily price shown ONLY for information */}
              <p className="text-center font-bold text-green-700 mt-1">
                LKR {Number(p.price).toLocaleString("en-LK")} / 1kg <span className="text-xs text-gray-500">(Today’s price)</span>
              </p>

              <input
                type="number"
                min="0"
                placeholder="Enter kg"
                className="mt-2 border rounded px-3 py-2 w-full text-center"
                value={kgInputs[p.id] || ""}
                onChange={(e) => handleKgChange(p.id, e.target.value)}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                }}
              />

              <button
                onClick={() => addKgToCart(p)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CART */}
      <div className="lg:sticky lg:top-24 self-start space-y-4">
        <div className="bg-white p-5 rounded-xl shadow max-h-[calc(100vh-6rem)] flex flex-col">
          <h2 className="text-xl font-bold">🛒 Your Cart</h2>

          {/* Scroll area */}
          <div className="mt-3 flex-1 overflow-y-auto pr-1">
            {items.length === 0 ? (
              <p className="text-gray-600">No items added.</p>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between border-b py-2">
                    <div className="pr-3">
                      <p className="font-medium">{item.name}</p>

                      {/* ✅ Show only kg (NOT price) */}
                      <p className="text-sm text-gray-500">{item.qty}kg</p>

                      {/* optional */}
                      {item.scientificName && (
                        <p className="text-xs italic text-gray-400">{item.scientificName}</p>
                      )}
                    </div>

                    <button
                      onClick={() => remove(item.id)}
                      className="text-red-600 hover:underline whitespace-nowrap"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom section */}
          <div className="mt-4 border-t pt-3 text-sm space-y-2">
            <p>Total Weight: <span className="font-semibold">{totalKg}kg</span></p>

            {/* ✅ No total price here */}
            <p className="text-xs text-gray-500">
              Final total will be calculated using the fish price on the delivery date (2 days later).
            </p>

            <button
              onClick={handleBuy}
              className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Buy Now
            </button>

            {items.length > 0 && (
              <button
                onClick={clear}
                className="w-full mt-2 text-sm underline text-gray-700 hover:text-black"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}