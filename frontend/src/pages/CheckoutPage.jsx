import { useCart } from "../context/CartContext";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { items, total, clear, formatLKR } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    instructions: "",
    paymentMethod: "",
    cardType: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.phone.trim()) next.phone = "Mobile number is required";
    if (!form.address.trim()) next.address = "Delivery address is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;

    if (form.paymentMethod === "online") {
      navigate("/payment", { state: { cardType: form.cardType, total } });
    } else {
      alert("✅ Order placed successfully! Pay on delivery.");
      clear();
      navigate("/");
    }
  };

  const deliveryFee = 0; // change if needed
  const grandTotal = useMemo(() => total + deliveryFee, [total, deliveryFee]);

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
    {/* Country Code */}
    <div className="flex items-center rounded-l-xl border border-r-0 bg-gray-50 px-4 text-sm text-gray-600">
      +94
    </div>

    {/* Mobile Number */}
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
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
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

                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <label
                    className={`rounded-2xl border p-4 cursor-pointer transition ${
                      form.paymentMethod === "online"
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={form.paymentMethod === "online"}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Pay online</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Debit or credit card.
                        </p>
                      </div>
                    </div>

                    {form.paymentMethod === "online" && (
                      <div className="mt-4 pl-7">
                        <p className="text-sm font-medium text-gray-700">
                          Card type
                        </p>
                        <div className="mt-2 flex flex-wrap gap-3">
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="radio"
                              name="cardType"
                              value="debit"
                              checked={form.cardType === "debit"}
                              onChange={handleChange}
                            />
                            Debit
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="radio"
                              name="cardType"
                              value="credit"
                              checked={form.cardType === "credit"}
                              onChange={handleChange}
                            />
                            Credit
                          </label>
                        </div>
                      </div>
                    )}
                  </label>

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
                  disabled={!items.length}
                >
                  Place order • {formatLKR(grandTotal)}
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
                  {deliveryFee === 0 ? "Free" : formatLKR(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
                <span>Total</span>
                <span>{formatLKR(grandTotal)}</span>
              </div>
            </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
  Estimated delivery:{" "}
  <span className="font-semibold text-blue-800">30–60 min</span>{" "}
  within Colombo area.
</div>


            <button
              type="button"
              onClick={() => {
                clear();
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
