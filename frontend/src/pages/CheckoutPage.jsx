import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    instructions: "",
    paymentMethod: "online",
    cardType: "debit", // new field for card type
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!form.firstName || !form.phone || !form.address) {
      alert("Please fill in all required fields.");
      return;
    }

    if (form.paymentMethod === "online") {
      // Navigate to payment page with card type
      navigate("/payment", { state: { cardType: form.cardType, total } });
    } else {
      alert("✅ Order placed successfully! Pay on delivery.");
      clear();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-xl p-8 grid md:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            🧾 Checkout Details
          </h2>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name*"
              className="border rounded-lg px-3 py-2 col-span-1"
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border rounded-lg px-3 py-2 col-span-1"
            />
          </div>

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            type="email"
            className="border rounded-lg px-3 py-2 w-full mt-4"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Mobile Number*"
            className="border rounded-lg px-3 py-2 w-full mt-4"
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Delivery Address*"
            className="border rounded-lg px-3 py-2 w-full mt-4"
          />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City / Town"
            className="border rounded-lg px-3 py-2 w-full mt-4"
          />

          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            placeholder="Additional Instructions (optional)"
            className="border rounded-lg px-3 py-2 w-full mt-4 h-24"
          />

          {/* Payment Method */}
          <h3 className="font-semibold text-gray-800 mt-6 mb-2">
            💳 Payment Method
          </h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={form.paymentMethod === "online"}
                onChange={handleChange}
              />
              Pay Online
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={form.paymentMethod === "cod"}
                onChange={handleChange}
              />
              Pay on Delivery
            </label>
          </div>

          {/* Card Type Options */}
          {form.paymentMethod === "online" && (
            <div className="mt-4 pl-4 border-l-4 border-green-500">
              <h4 className="font-medium mb-2">Select Card Type:</h4>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cardType"
                    value="debit"
                    checked={form.cardType === "debit"}
                    onChange={handleChange}
                  />
                  Debit Card
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cardType"
                    value="credit"
                    checked={form.cardType === "credit"}
                    onChange={handleChange}
                  />
                  Credit Card
                </label>
              </div>
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Place Your Order Rs.{total}
          </button>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            🛍 Your Order
          </h2>

          <ul className="divide-y divide-gray-300 mb-4">
            {items.map((item) => (
              <li key={item.id} className="py-3 flex justify-between">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>Rs.{item.price * item.qty}</span>
              </li>
            ))}
          </ul>

          <p className="text-right font-bold text-lg mb-4">
            Total : Rs.{total}
          </p>

          <p className="text-sm text-gray-500">
            Delivery within 30 – 60 minutes in Colombo area.
          </p>
        </div>
      </div>
    </div>
  );
}

