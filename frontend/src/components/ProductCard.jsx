import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [kg, setKg] = useState("");

  if (!product) return null;

  const productId = product._id || product.id;
  const todayPrice = Number(product.price);
  const imageSrc =
    product.image ||
    product.image_url ||
    `https://picsum.photos/seed/${productId}/600/600`;

  const handleAdd = () => {
    const qty = Number(kg);

    if (!Number.isFinite(qty) || qty <= 0) {
      alert("Enter a valid kg amount.");
      return;
    }

    add(
      {
        id: productId,
        name: product.name,
        image: imageSrc,
        price: todayPrice,
      },
      qty
    );

    setKg("");
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 overflow-hidden">
      <Link to={`/product/${productId}`} className="block">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${productId}`}>
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-1 group-hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[40px]">
          {product.description || "Fresh and high-quality seafood available daily."}
        </p>

        <div className="mt-3">
          <p className="text-lg font-bold text-green-700">
            {Number.isFinite(todayPrice)
              ? `LKR ${todayPrice.toLocaleString("en-LK")}`
              : "Market Price"}
            <span className="text-sm font-medium text-gray-500"> / kg</span>
          </p>

          <p className="text-xs text-gray-400">
            Final price confirmed on delivery
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
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
            className="w-20 border border-gray-200 rounded-lg px-2 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleAdd}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}