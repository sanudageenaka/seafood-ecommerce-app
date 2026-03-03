import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { items: cartItems, total: cartTotal, clear, formatLKR } = useCart();
  const { api, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ cart snapshot (state -> sessionStorage -> cart fallback)
  const checkoutSnapshot = useMemo(() => {
    const fromState =
      location.state?.checkoutSnapshot && location.state.checkoutSnapshot.items
        ? location.state.checkoutSnapshot
        : null;

    let fromSession = null;
    try {
      const raw = sessionStorage.getItem("checkout_snapshot");
      fromSession = raw ? JSON.parse(raw) : null;
    } catch {
      fromSession = null;
    }

    return (
      fromState ||
      fromSession || {
        items: cartItems || [],
        total: cartTotal || 0,
      }
    );
  }, [location.state, cartItems, cartTotal]);

  const items = checkoutSnapshot.items || [];
  const total = Number(checkoutSnapshot.total || 0);

  // ✅ delivery location (state -> localStorage)
  const deliveryLocation = useMemo(() => {
    const fromState = location.state?.deliveryLocation || null;
    if (fromState) return fromState;

    try {
      const raw = localStorage.getItem("delivery_location");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [location.state]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    instructions: "",
    paymentMethod: "", // only "cod" will be available
  });

  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [serverError, setServerError] = useState("");

  // ✅ Prefill address using delivery_location
  useEffect(() => {
    if (deliveryLocation?.address) {
      setForm((p) => ({ ...p, address: deliveryLocation.address }));
    }
  }, [deliveryLocation]);

  // ✅ If cart empty, push user back
  useEffect(() => {
    if (!items.length) {
      navigate("/checkout", { replace: true });
    }
  }, [items.length, navigate]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.phone.trim()) next.phone = "Mobile number is required";
    if (!form.address.trim()) next.address = "Delivery address is required";
    if (!form.city.trim()) next.city = "City is required";
    if (!form.paymentMethod) next.paymentMethod = "Select a payment method";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const deliveryFee = 0;
  const grandTotal = useMemo(() => total + deliveryFee, [total, deliveryFee]);

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    // ✅ require login (because /api/orders uses auth middleware)
    if (!isAuthenticated) {
      setServerError("Please login to place an order.");
      navigate("/login");
      return;
    }

    // ✅ require location selected (recommended)
    if (!deliveryLocation?.lat || !deliveryLocation?.lng) {
      setServerError("Please select your delivery location first.");
      navigate("/delivery-location");
      return;
    }

    setPlacing(true);
    setServerError("");

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        instructions: form.instructions,

        paymentMethod: form.paymentMethod, // "cod" only

        items: items.map((it) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          qty: it.qty,
        })),

        deliveryFee,

        // optional extra info (backend can ignore if you want)
        deliveryLocation: {
          lat: deliveryLocation.lat,
          lng: deliveryLocation.lng,
        },
      };

      const { data } = await api.post("/api/orders", payload);

      const orderId = data?.orderId;

      // ✅ clear cart snapshot after create
      sessionStorage.removeItem("checkout_snapshot");

      // COD only
      clear();
      localStorage.removeItem("delivery_location");
      alert(`✅ Order placed! Your Order ID: ${orderId}`);
      navigate("/");
    } catch (e) {
      console.log("ORDER ERROR FULL:", e?.response?.data);
      setServerError(
        e?.response?.data?.details ||
          e?.response?.data?.error ||
          "Failed to create order"
      );
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Top bar */}
      <section className="border-b bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#002B5B]">
              Checkout
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Complete your delivery details and payment method.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-blue-700 hover:underline"
            type="button"
          >
            ← Back
          </button>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Details */}
          <div className="lg:col-span-3 bg-white rounded-2xl border shadow-sm p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delivery details
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Fields marked with * are required.
                </p>
              </div>

              <span className="px-3 py-1 rounded-xl text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                Secure checkout
              </span>
            </div>

            {/* ✅ show server error */}
            {serverError ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {serverError}
              </div>
            ) : null}

            {/* Form */}
            <div className="mt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    First name *
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    placeholder="First name"
                    onChange={handleChange}
                    className={`mt-1 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-200 outline-none ${
                      errors.firstName ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  {errors.firstName ? (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.firstName}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <input
                    name="lastName"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    placeholder="mail@example.com"
                    onChange={handleChange}
                    type="email"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Mobile number *
                  </label>

                  <div className="mt-1 flex">
                    <div className="flex items-center rounded-l-xl border border-r-0 bg-gray-50 px-4 text-sm text-gray-600">
                      +94
                    </div>

                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="7X XXX XXXX"
                      className={`w-full rounded-r-xl border px-4 py-3 focus:ring-2 focus:ring-blue-200 outline-none ${
                        errors.phone ? "border-red-300" : "border-gray-200"
                      }`}
                    />
                  </div>

                  {errors.phone ? (
                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Delivery address *
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House No or Name"
                  className={`mt-1 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-200 outline-none ${
                    errors.address ? "border-red-300" : "border-gray-200"
                  }`}
                />
                {errors.address ? (
                  <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                ) : null}

                <button
                  type="button"
                  onClick={() => navigate("/delivery-location")}
                  className="mt-2 text-xs font-semibold text-blue-700 hover:underline"
                >
                  Change delivery location
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    City / Town *
                  </label>
                  <input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className={`mt-1 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-200 outline-none ${
                      errors.city ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  {errors.city ? (
                    <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                  ) : null}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Delivery note
                  </label>
                  <input
                    name="instructions"
                    placeholder="E.g., Landmark, floor, etc."
                    value={form.instructions}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-bold text-gray-900">
                  Payment method
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choose how you’d like to pay.
                </p>

                {errors.paymentMethod ? (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.paymentMethod}
                  </p>
                ) : null}

                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {/* ✅ Only COD option */}
                  <label
                    className={`rounded-2xl border p-4 cursor-pointer transition ${
                      form.paymentMethod === "cod"
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={form.paymentMethod === "cod"}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Pay on delivery
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Cash or card at your doorstep.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  type="button"
                  className="mt-6 w-full rounded-2xl bg-blue-600 text-white py-3.5 font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                  disabled={!items.length || placing}
                >
                  {placing
                    ? "Placing order..."
                    : `Place order • ${formatLKR(grandTotal)}`}
                </button>

                {!items.length ? (
                  <p className="mt-2 text-sm text-gray-500">
                    Your cart is empty.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <aside className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6 md:p-8 h-fit">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Order summary</h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-xl border bg-gray-50 text-gray-700">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-5 divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Qty: <span className="font-medium">{item.qty}</span>
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatLKR(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal</span>
                <span className="font-medium">{formatLKR(total)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? "Delivery charges will be applied later.We will inform you" : formatLKR(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
                <span>Total</span>
                <span>{formatLKR(grandTotal)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              Estimated delivery:{" "}
              <span className="font-semibold text-blue-800">1-2 days</span>{" "}
              within Colombo area.
            </div>

            <button
              type="button"
              onClick={() => {
                clear();
                sessionStorage.removeItem("checkout_snapshot");
                localStorage.removeItem("delivery_location");
                navigate("/");
              }}
              className="mt-4 w-full rounded-2xl border border-gray-200 py-3 font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              Clear cart
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}