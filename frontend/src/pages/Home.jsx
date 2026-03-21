import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard.jsx";

const bannerImages = [
  "/seafoods/fish1.jpg",
  "/seafoods/fish2.jpg",
  "/seafoods/fish3.jpg",
  "/seafoods/fish4.jpg",
];

const categories = [
  { name: "Fresh Fish", image: "/seafoods/fish6.jpg", path: "/fish" },
  { name: "Crabs", image: "/seafoods/fish7.jpg", path: "/crab" },
  { name: "Prawns", image: "/seafoods/fish8.jpg", path: "/prawns" },
  { name: "Lobsters", image: "/seafoods/fish9.jpg", path: "/lobster" },
  { name: "Shellfish", image: "/seafoods/fish10.jpg", path: "/cuttlefish" },
  { name: "Frozen Items", image: "/seafoods/fish11.jpg", path: "/frozen-items" },
  { name: "Smoked Seafood", image: "/seafoods/fish12.jpg", path: "/smoked-seafood" },
  { name: "Caviar", image: "/seafoods/fish13.jpg", path: "/caviar" },
];

const testimonials = [
  {
    name: "Ruvindu Geethisha",
    image: "/users/person1.jpg",
    review:
      "Absolutely love the freshness! The fish arrived on time and tasted incredible. Highly recommend this service!",
    rating: 5,
  },
  {
    name: "Sanidi Uthsari",
    image: "/users/person2.jpg",
    review:
      "Best seafood delivery I've tried. The prawns and crabs were perfectly packed. Will definitely order again!",
    rating: 5,
  },
  {
    name: "Sanuda Geenaka",
    image: "/users/person4.jpg",
    review:
      "Great quality and variety. The smoked salmon was delicious and the customer service was top-notch.",
    rating: 5,
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerFade, setBannerFade] = useState(false);

  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerFade(true);

      const timeout = setTimeout(() => {
        setBannerIndex((prev) => (prev + 1) % bannerImages.length);
        setBannerFade(false);
      }, 400);

      return () => clearTimeout(timeout);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/products", { params: { q } });
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [q]);

  const nextBanner = () => {
    setBannerIndex((prev) => (prev + 1) % bannerImages.length);
  };

  const prevBanner = () => {
    setBannerIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Premium seafood for your{" "}
              <span className="text-blue-600">perfect meal</span>
            </h1>

            <p className="mt-5 text-lg text-gray-600 max-w-xl">
              Discover the freshest fish, prawns, crabs, lobsters, and more.
              Clean quality, quick delivery, and a shopping experience made to
              feel simple and beautiful.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/fish"
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
              >
                Shop Now
              </Link>

              <Link
                to="/about"
                className="px-6 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50 transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[320px] md:h-[450px] rounded-3xl overflow-hidden">
              <img
                src={bannerImages[bannerIndex]}
                alt="Seafood Banner"
                className={`w-full h-full object-contain transition-opacity duration-700 ${
                  bannerFade ? "opacity-0" : "opacity-100"
                }`}
              />

              <button
                onClick={prevBanner}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white shadow flex items-center justify-center text-lg transition"
              >
                ❮
              </button>

              <button
                onClick={nextBanner}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white shadow flex items-center justify-center text-lg transition"
              >
                ❯
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {bannerImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setBannerIndex(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      bannerIndex === index ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* Category Section */}
        <section className="py-12 bg-white">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Shop by Category
          </h2>

          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
            {categories.map((cat, index) => (
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
              {testimonials.map((customer, index) => (
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

                  <p className="text-gray-600 italic mb-4">
                    "{customer.review}"
                  </p>

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
      </main>

      {/* Footer */}
      <footer className="bg-black text-white pt-14 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Now</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/fish" className="hover:text-white transition">
                  Fresh Fish
                </Link>
              </li>
              <li>
                <Link to="/crabs" className="hover:text-white transition">
                  Crabs
                </Link>
              </li>
              <li>
                <Link to="/prawns" className="hover:text-white transition">
                  Prawns
                </Link>
              </li>
              <li>
                <Link to="/lobsters" className="hover:text-white transition">
                  Lobsters
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-white transition">
                  Feedback
                </Link>
              </li>
              <li>
                <Link to="/hotline" className="hover:text-white transition">
                  Hotline
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Policy</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="hover:text-white transition"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">My Account</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Sign in / Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} E4S. All rights reserved.
        </div>
      </footer>
    </div>
  );
}