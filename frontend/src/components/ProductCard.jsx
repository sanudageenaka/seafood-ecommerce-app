import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ p }) {
  const { add } = useCart();
  const [kg, setKg] = useState("");

  const todayPrice = Number(p.price);
  const imageSrc =
    p.image || p.image_url || `https://picsum.photos/seed/${p.id}/800/800`;

  const handleAdd = () => {
    const qty = Number(kg);

    if (!Number.isFinite(qty) || qty <= 0) {
      alert("Enter a valid kg amount.");
      return;
    }

    add(
      {
        id: p.id,
        name: p.name,
        image: imageSrc,
      },
      qty
    );

    setKg("");
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-3 hover:shadow-md transition">
      {/* Product link */}
      <Link to={`/product/${p.id}`} className="block group">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={imageSrc}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        </div>

        <div className="pt-3">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {p.name}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2">
            {p.description}
          </p>

          <p className="pt-2 font-bold text-green-700">
            {Number.isFinite(todayPrice)
              ? `LKR ${todayPrice.toLocaleString("en-LK")} / kg`
              : "Daily price"}
          </p>

          <p className="text-xs text-gray-400">
            Final price confirmed on delivery day
          </p>
        </div>
      </Link>

      {/* Add kg */}
      <div className="mt-3 flex gap-2">
        <input
          type="number"
          min="0"
          step="1"
          value={kg}
          onChange={(e) => setKg(e.target.value)}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
          }}
          placeholder="kg"
          className="flex-1 border rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}