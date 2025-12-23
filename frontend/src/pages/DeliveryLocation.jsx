import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 

// Leaflet
import { MapContainer, TileLayer, Circle, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix Leaflet marker icons (important for Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- helpers ---
function haversineMeters(a, b) {
  const R = 6371000;
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  return 2 * R * Math.asin(Math.sqrt(h));
}


function ClickToSetMarker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function DeliveryLocation() {
    const navigate = useNavigate();
  // ✅ Set your shop/warehouse center here (example Colombo)
  const center = { lat: 6.9271, lng: 79.8612 };

  // ✅ Delivery radius (meters) – change to what you want
  const radiusMeters = 10000; // 10 km

  const [picked, setPicked] = useState(null);

  const distance = useMemo(() => {
    if (!picked) return 0;
    return haversineMeters(center, picked);
  }, [picked]);

  const inside = picked ? distance <= radiusMeters : false;

  const distanceKm = (distance / 1000).toFixed(2);
  const radiusKm = (radiusMeters / 1000).toFixed(0);

 const handleConfirm = () => {
    if (!picked) return;

    // ✅ Save to localStorage (or send to backend)
    localStorage.setItem("delivery_location", JSON.stringify(picked));

    alert("Delivery location saved!");
    navigate("/checkoutpage");
  };


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#002B5B]">
            Delivery <span className="text-blue-600">Location</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Tap on the map to select your delivery location. We deliver within{" "}
            <span className="font-semibold">{radiusKm} km</span> of our service area.
          </p>

          <div className="mt-4">
            <Link to="/" className="text-sm text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10 w-full">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gradient-to-b from-white to-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">Pick your location</p>
                  <p className="text-sm text-gray-600">
                    Click anywhere on the map to place the marker.
                  </p>
                </div>

                <div
                  className={`px-3 py-2 rounded-xl text-sm font-semibold border ${
                    picked
                      ? inside
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {!picked
                    ? "No location selected"
                    : inside
                    ? "✅ Deliverable Area"
                    : "❌ Outside Delivery Area"}
                </div>
              </div>
            </div>

            <div className="h-[420px]">
              <MapContainer center={center} zoom={12} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Service circle */}
                <Circle center={center} radius={radiusMeters} pathOptions={{}} />

                {/* Center marker (optional) */}
                <Marker position={center} />

                {/* Click handler */}
                <ClickToSetMarker onPick={setPicked} />

                {/* User marker */}
                {picked && <Marker position={picked} />}
              </MapContainer>
            </div>

            <div className="p-4 border-t bg-white flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">
                {picked ? (
                  <>
                    Distance: <span className="font-semibold">{distanceKm} km</span> •
                    Radius: <span className="font-semibold">{radiusKm} km</span>
                  </>
                ) : (
                  "Select a point on the map to check delivery availability."
                )}
              </div>

              <button
                onClick={handleConfirm}
                disabled={!picked || !inside}
                className="rounded-xl px-6 py-3 bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Confirm Location
              </button>
            </div>
          </div>

          {/* Details */}
          <aside className="bg-gradient-to-b from-white to-gray-50 border rounded-2xl shadow-inner p-6 h-fit">
            <h3 className="text-xl font-bold text-[#002B5B]">Delivery Details</h3>
            <p className="mt-2 text-sm text-gray-600">
              Fill these fields for accurate delivery. (Optional)
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  Full Name
                </label>
                <input
                  className="mt-2 w-full rounded-xl border px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  Phone
                </label>
                <input
                  className="mt-2 w-full rounded-xl border px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="+94 7X XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  Address / Landmark
                </label>
                <textarea
                  rows={3}
                  className="mt-2 w-full rounded-xl border px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="House no, street, landmark..."
                />
              </div>

              <div className="rounded-2xl border bg-white p-4 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Note</p>
                <p className="mt-1 text-gray-600">
                  If your location is outside the circle, we currently cannot deliver there.
                  Please choose another nearby point or contact hotline.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
