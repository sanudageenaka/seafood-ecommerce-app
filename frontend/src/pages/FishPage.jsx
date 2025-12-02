import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Map imports
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Products
const products = [
  { id: 1, name: "Decapterus russelli", localName: "LINNA", price: 120, image: " /seafoods/fish14.jpg" },
  { id: 2, name: "Istiophorus Platypterus", localName: "THALAPATH", price: 90, image: " /seafoods/fish15.jpg" },
  { id: 3, name: "Skipjack Tuna", localName: "BALAYA", price: 75, image: " /seafoods/fish16.jpg" },
  { id: 4, name: "Narrow-barred Spanish mackerel", localName: "THORA", price: 45, image: " /seafoods/fish17.jpg" },
  { id: 5, name: "Yellowfin tuna", localName: "KELAWALLA", price: 85, image: " /seafoods/fish18.jpg" },
  { id: 6, name: "Bigeye scad", localName: "BOLLA", price: 130, image: "/seafoods/fish19.jpg" },
];

// Delivery circle center + radius (10km example)
const DELIVERY_CENTER = { lat: 6.9271, lng: 79.8612 };
const DELIVERY_RADIUS_METERS = 10000;

// FIXED distance function
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Click map to select location + fetch address
function ClickToSetLocation({ onLocationSelect, onAddressSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
      onAddressSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function Shop() {
  const { items, add, remove, clear, total } = useCart();
  const navigate = useNavigate();

  const [kgInputs, setKgInputs] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState("");

  const handleKgChange = (id, value) => {
    setKgInputs({ ...kgInputs, [id]: value });
  };

  const addKgToCart = (product) => {
    const kg = Number(kgInputs[product.id]) || 0;
    if (kg <= 0) return alert("Enter a valid kg.");
    add(product, kg);

     // CLEAR INPUT FIELD AFTER ADDING
  setKgInputs((prev) => ({ 
    ...prev, 
    [product.id]: "" 
  }));
  };

  // Fetch address using reverse geocoding
  async function fetchAddress(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();

      if (data?.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress("Unknown location");
      }
    } catch (error) {
      setAddress("Unable to fetch address");
    }
  }

  const handleBuy = () => {
    if (items.length === 0) return alert("Cart is empty!");

    const totalKg = items.reduce((sum, item) => sum + item.qty, 0);
    if (totalKg < 10)
      return alert(`Minimum total order is 10kg. You have ${totalKg}kg.`);

    if (!userLocation)
      return alert("Click the map to choose your delivery location.");

    if (!address)
      return alert("Address not loaded. Please click again.");

    const distance = getDistanceMeters(
      DELIVERY_CENTER.lat,
      DELIVERY_CENTER.lng,
      userLocation.lat,
      userLocation.lng
    );

    if (distance > DELIVERY_RADIUS_METERS)
      return alert("Delivery not available for your location.");

    const deliveryFee = totalKg >= 20 ? 0 : 5;
    const finalTotal = total + deliveryFee;

    alert(
      `Order Summary:
Total Weight: ${totalKg}kg
Items Price: $${total}
Delivery Fee: $${deliveryFee}
Address: ${address}
Final Total: $${finalTotal}`
    );

    navigate("/checkoutpage");
  };

  const totalKg = items.reduce((sum, i) => sum + i.qty, 0);
  const deliveryFee = totalKg >= 20 ? 0 : 5;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* PRODUCTS */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">🛍️ Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border rounded-xl p-4 shadow bg-white">
              <img src={p.image} className="w-32 h-32 object-cover mb-3 rounded-lg" />

              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm italic text-gray-600">{p.localName}</p>
              <p className="font-medium text-gray-700">${p.price}</p>

              <input
                type="number"
                min="0"
                placeholder="Enter kg"
                className="mt-2 border rounded px-3 py-2 w-full text-center"
                value={kgInputs[p.id] || ""}
                onChange={(e) => handleKgChange(p.id, e.target.value)}
                onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
    }
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

      {/* CART + MAP */}
      <div className="space-y-6">
        {/* CART */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-bold">🛒 Your Cart</h2>

          {items.length === 0 ? (
            <p>No items added.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between border-b py-2">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.qty}kg × ${item.price}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 border-t pt-3 space-y-1 text-sm">
            <p>Total Weight: {totalKg}kg</p>
            <p>Items Price: ${total}</p>
            <p>Delivery Fee: {totalKg === 0 ? "-" : deliveryFee === 0 ? "FREE" : `$${deliveryFee}`}</p>
            <p>Total: ${totalKg === 0 ? 0 : total + deliveryFee}</p>

            <button
              onClick={handleBuy}
              className="w-full mt-3 bg-green-600 text-white py-2 rounded"
            >
              Buy Now
            </button>

            {items.length > 0 && (
              <button onClick={clear} className="w-full mt-2 text-sm underline">
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {/* MAP */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-bold">📍 Delivery Area</h2>
          <p className="text-xs mb-2">
            Click on the map to select your delivery location.
          </p>

          <div style={{ height: "260px", width: "100%" }}>
            <MapContainer
              center={DELIVERY_CENTER}
              zoom={12}
              className="h-full w-full"
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Circle
                center={DELIVERY_CENTER}
                radius={DELIVERY_RADIUS_METERS}
                pathOptions={{ color: "green" }}
              />

              {userLocation && <Marker position={userLocation} />}

              <ClickToSetLocation
                onLocationSelect={setUserLocation}
                onAddressSelect={fetchAddress}
              />
            </MapContainer>
          </div>

          {userLocation && (
            <p className="text-xs mt-2">
              Selected: {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
            </p>
          )}

          {address && (
            <p className="text-xs mt-1">
              <strong>Address:</strong> {address}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
