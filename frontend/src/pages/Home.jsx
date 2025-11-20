import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await api.get("/api/products", { params: { q } });
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [q]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Find your next <span className="text-blue-600">favorite</span> product
          </h1>
          <p className="mt-3 text-gray-600">
            Beautiful, responsive, and modern shopping experience.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Sliding Image Section */}
        <section className="relative overflow-hidden w-full bg-gradient-to-r from-blue-50 to-blue-100 py-10 rounded-xl shadow-inner">
          <div className="flex animate-scroll gap-8">
            {["fish1.jpg", "fish2.jpg", "fish3.jpg", "fish4.jpg", "fish5.jpg"].map(
              (img, index) => (
                <img
                  key={index}
                  src={`/seafoods/${img}`}
                  alt={`Seafood ${index}`}
                  className="w-80 h-90 object-cover rounded-2xl shadow-lg transition-transform duration-500 hover:scale-105"
                />
              )
            )}
          </div>
        </section>

        {/* Category Section */}
        <section className="py-12 bg-white">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Shop by Category
          </h2>

          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
            {[
              { name: "Fresh Fish", image: "/seafoods/fish6.jpg", path: "/fish" },
              { name: "Crabs", image: "/seafoods/fish7.jpg", path: "/crabs" },
              { name: "Prawns", image: "/seafoods/fish8.jpg", path: "/prawns" },
              { name: "Lobsters", image: "/seafoods/fish9.jpg", path: "/lobsters" },
              { name: "Shellfish", image: "/seafoods/fish10.jpg", path: "/shellfish" },
              { name: "Frozen Items", image: "/seafoods/fish11.jpg", path: "/frozen" },
              { name: "Smoked Seafood", image: "/seafoods/fish12.jpg", path: "/smoked" },
              { name: "Caviar", image: "/seafoods/fish13.jpg", path: "/caviar" },
            ].map((cat, index) => (
              <Link
                to={cat.path}
                key={index}
                className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
              </Link>
            ))}
          </div>
        </section>

        {/* Customer Feedback Section */}
        <section className="py-16 bg-gray-50 border-t">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-10 text-gray-800">
              What Our Customers Say
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  image: "/users/user1.jpg",
                  review:
                    "Absolutely love the freshness! The fish arrived on time and tasted incredible. Highly recommend this service!",
                  rating: 5,
                },
                {
                  name: "Michael Lee",
                  image: "/users/user2.jpg",
                  review:
                    "Best seafood delivery I've tried. The prawns were juicy and perfectly packed. Will definitely order again!",
                  rating: 4,
                },
                {
                  name: "Priya Patel",
                  image: "/users/user3.jpg",
                  review:
                    "Great quality and variety. The smoked salmon was delicious and the customer service was top-notch.",
                  rating: 5,
                },
              ].map((customer, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 transition-transform duration-500 hover:-translate-y-2"
                >
                  <div className="flex justify-center mb-4">
                    <img
                      src={customer.image}
                      alt={customer.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                    />
                  </div>
                  <p className="text-gray-600 italic mb-4">"{customer.review}"</p>
                  <div className="flex justify-center mb-2">
                    {Array.from({ length: customer.rating }).map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-yellow-400"
                      >
                        <path d="M12 .587l3.668 7.425 8.167 1.183-5.917 5.763 1.396 8.142L12 18.897l-7.314 3.863 1.396-8.142L.165 9.195l8.167-1.183z" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-semibold text-gray-800">{customer.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ====================== FOOTER SECTION ====================== */}
      <footer className="bg-black text-white py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">

          <div>
            <h3 className="text-lg font-semibold mb-4">Order Now</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Deals</li>
              <li>Pizzas</li>
              <li>Seafood</li>
              <li>Sushi</li>
              <li>Frozen Items</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-gray-300">
              <li>About Us</li>
              <li>Feedback</li>
              <li>Hotline</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Policy</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">My Account</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Sign In / Register</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-gray-400 mt-10">
          © {new Date().getFullYear()} Seafood Market. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
