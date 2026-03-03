import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

// Leaflet (OpenStreetMap)
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix Leaflet marker icons (Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/** ---------- helpers ---------- */
function haversineMeters(a, b) {
  const R = 6371000;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function fmtCoord(n) {
  if (n === null || n === undefined) return "";
  return Number(n).toFixed(6);
}

function MapPanTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.setView(target, 16, { animate: true });
  }, [target, map]);
  return null;
}

function ClickToPick({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// Debounce hook
function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/**
 * OSM search: Nominatim (free)
 */
async function nominatimSearch(query) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("countrycodes", "lk");
  url.searchParams.set("accept-language", "en");

  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();

  return (data || []).map((x) => ({
    id: x.place_id,
    displayName: x.display_name,
    lat: Number(x.lat),
    lng: Number(x.lon),
  }));
}

export default function DeliveryLocationLeaflet() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, total: cartTotal, formatLKR } = useCart();

  // ✅ Delivery service area
  const center = { lat: 6.9271, lng: 79.8612 }; // Colombo
  const radiusMeters = 20000; // 10km

  // ✅ checkout snapshot (router state -> sessionStorage -> cart fallback)
  const checkoutSnapshot = useMemo(() => {
    const fromState = location.state && location.state.items ? location.state : null;

    let fromSession = null;
    try {
      const raw = sessionStorage.getItem("checkout_snapshot");
      fromSession = raw ? JSON.parse(raw) : null;
    } catch {
      fromSession = null;
    }

    const fallback = {
      items: cartItems || [],
      total: cartTotal || 0,
      createdAt: new Date().toISOString(),
    };

    return fromState || fromSession || fallback;
  }, [location.state, cartItems, cartTotal]);

  // If cart is empty and no snapshot items, block checkout flow
  useEffect(() => {
    if (!checkoutSnapshot?.items?.length) {
      navigate("/checkout", { replace: true });
    }
  }, [checkoutSnapshot, navigate]);

  const [picked, setPicked] = useState(null);
  const [address, setAddress] = useState("");

  // Search
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 350);
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Dropdown UI state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // GPS
  const [loadingGps, setLoadingGps] = useState(false);
  const [gpsError, setGpsError] = useState("");

  // Control map pan target
  const [panTarget, setPanTarget] = useState(null);

  const distance = useMemo(() => {
    if (!picked) return 0;
    return haversineMeters(center, picked);
  }, [picked, center]);

  const inside = picked ? distance <= radiusMeters : false;
  const distanceKm = (distance / 1000).toFixed(2);
  const radiusKm = (radiusMeters / 1000).toFixed(0);

  const badge = useMemo(() => {
    if (!picked)
      return {
        text: "No location selected",
        cls: "bg-gray-50 text-gray-700 border-gray-200",
      };
    if (inside)
      return {
        text: "Deliverable",
        cls: "bg-green-50 text-green-700 border-green-200",
      };
    return {
      text: "Outside Area",
      cls: "bg-red-50 text-red-700 border-red-200",
    };
  }, [picked, inside]);

  // Search suggestions (Nominatim)
  useEffect(() => {
    let cancelled = false;

    const q = debouncedQuery.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setSearchError("");
      setSearchLoading(false);
      return;
    }

    (async () => {
      try {
        setSearchLoading(true);
        setSearchError("");
        const results = await nominatimSearch(q);
        if (cancelled) return;
        setSuggestions(results);
      } catch {
        if (cancelled) return;
        setSearchError("Could not fetch street suggestions. Try again.");
        setSuggestions([]);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const handleSelectSuggestion = (s) => {
    const pos = { lat: s.lat, lng: s.lng };
    setPicked(pos);
    setPanTarget(pos);
    setSuggestions([]);
    setQuery(s.displayName);
    setIsDropdownOpen(false);
  };

  const handleFindMyLocation = () => {
    setGpsError("");

    if (!("geolocation" in navigator)) {
      setGpsError("Geolocation is not supported on this device/browser.");
      return;
    }

    setLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoadingGps(false);
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPicked(p);
        setPanTarget(p);
        setIsDropdownOpen(false);
        setQuery("My current location");
      },
      (err) => {
        setLoadingGps(false);
        if (err.code === 1) {
          setGpsError(
            "Location permission denied. Please allow location access in your browser settings."
          );
        } else if (err.code === 2) {
          setGpsError(
            "Unable to determine your location. Please check GPS / network and try again."
          );
        } else if (err.code === 3) {
          setGpsError("Location request timed out. Please try again.");
        } else {
          setGpsError("Unable to get your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleSelectMyLocationFromDropdown = () => {
    setSuggestions([]);
    setIsDropdownOpen(false);
    setQuery("Detecting current location…");
    handleFindMyLocation();
  };

  const handleConfirm = () => {
    if (!picked || !inside) return;

    const deliveryLocation = {
      ...picked,
      address,
      createdAt: new Date().toISOString(),
    };

    // ✅ Save for refresh usage
    localStorage.setItem("delivery_location", JSON.stringify(deliveryLocation));

    // ✅ Go to checkout page with state (so checkout page can show & save)
    navigate("/checkoutpage", {
      state: {
        deliveryLocation,
        checkoutSnapshot,
      },
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      const el = e.target;
      if (el && el.closest && el.closest("[data-dropdown-root='true']")) return;
      setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#002B5B]">
            Delivery <span className="text-blue-600">Location</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Search your street and choose an exact point on the map. We deliver within{" "}
            <span className="font-semibold">{radiusKm} km</span>.
          </p>

          <Link to="/checkout" className="inline-block mt-4 text-sm text-blue-600 hover:underline">
            ← Back to Checkout
          </Link>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10 w-full">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-semibold text-[#002B5B]">Search & pick your location</p>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Type your street name, then click on the map to place the pin. You can re-click to adjust.
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-xl text-sm font-semibold border inline-flex items-center justify-center text-center min-w-[190px] h-8 ${badge.cls}`}
                >
                  {badge.text}
                </span>
              </div>

              {/* Search (GPS only in dropdown ✅) */}
              <div className="relative flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1" data-dropdown-root="true">
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-200"
                    placeholder="Search street / area (e.g., Galle Road, Nugegoda)..."
                  />

                  {isDropdownOpen && (
                    <div className="absolute z-[999] mt-2 w-full rounded-xl border bg-white shadow-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={handleSelectMyLocationFromDropdown}
                        disabled={loadingGps}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-60"
                      >
                        <span className="text-base">📍</span>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Use My Current Location</div>
                          <div className="text-xs text-gray-500 mt-1">Detect your position automatically</div>
                        </div>
                      </button>

                      <div className="h-px bg-gray-100" />

                      {debouncedQuery.trim().length < 3 ? (
                        <div className="px-4 py-3 text-sm text-gray-600">
                          Type at least 3 characters to search addresses.
                        </div>
                      ) : null}

                      {searchLoading ? (
                        <div className="px-4 py-3 text-sm text-gray-600 border-t">Searching...</div>
                      ) : null}

                      {searchError ? (
                        <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border-t">{searchError}</div>
                      ) : null}

                      {!searchLoading && !searchError && suggestions?.length > 0 ? (
                        <div className="max-h-64 overflow-auto border-t">
                          {suggestions.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleSelectSuggestion(s)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-t first:border-t-0"
                            >
                              <div className="text-sm font-medium text-gray-900">{s.displayName}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {fmtCoord(s.lat)} , {fmtCoord(s.lng)}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : null}

                      {!searchLoading &&
                      !searchError &&
                      debouncedQuery.trim().length >= 3 &&
                      suggestions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-600 border-t">No results found.</div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              {gpsError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {gpsError}
                </div>
              ) : null}
            </div>

            {/* Map */}
            <div className="h-[420px]">
              <MapContainer center={center} zoom={12} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Circle center={center} radius={radiusMeters} />
                <MapPanTo target={panTarget} />
                <ClickToPick onPick={(pos) => setPicked(pos)} />
                {picked && <Marker position={picked} />}
              </MapContainer>
            </div>

            <div className="p-4 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                {picked
                  ? inside
                    ? `Location selected within delivery area. (${distanceKm} km from center)`
                    : `Selected location is outside our delivery area. (${distanceKm} km from center)`
                  : "Search an address or use 'My Current Location', then click the map."}
              </p>

              <button
                onClick={handleConfirm}
                disabled={!picked || !inside}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                type="button"
              >
                Confirm Location
              </button>
            </div>
          </div>

          {/* Right panel: Address + Order Summary */}
          <aside className="bg-gray-50 border rounded-2xl p-6 h-fit space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#002B5B]">Delivery Address</h3>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                Confirm your address details (house no, lane, landmark).
              </p>

              <textarea
                rows={5}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-4 w-full h-36 resize-none rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-200"
                placeholder="House no, street, landmark..."
              />

              <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                Delivery is available only inside the highlighted circle.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">Order summary</p>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-xl border bg-gray-50 text-gray-700">
                  {checkoutSnapshot?.items?.length || 0} item
                  {(checkoutSnapshot?.items?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-3 space-y-2 max-h-56 overflow-auto pr-1">
                {(checkoutSnapshot?.items || []).map((it) => (
                  <div key={it.id} className="flex items-start justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{it.name}</p>
                      <p className="text-xs text-gray-500">Qty: {it.qty}</p>
                    </div>
                    <p className="font-semibold text-gray-900 whitespace-nowrap">
                      {formatLKR(Number(it.price) * Number(it.qty))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-3 flex items-center justify-between">
                <p className="text-sm text-gray-700">Total</p>
                <p className="text-base font-bold text-gray-900">
                  {formatLKR(checkoutSnapshot?.total || 0)}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
