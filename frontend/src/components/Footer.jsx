import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  // Do NOT show footer on home page "/"
  if (location.pathname === "/") return null;

  return (
    <footer className="border-t mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} ShopLite. All rights reserved.</p>
      </div>
    </footer>
  );
}

