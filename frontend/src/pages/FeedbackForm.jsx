// Feedback.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ adjust path if different

export default function Feedback() {
  const { api, user } = useAuth(); // ✅ uses your shared axios instance (baseURL = VITE_API_URL)

  const [form, setForm] = useState({
    name: "",
    phone: "", // expects 9 digits after +94 in your UI
    email: "",
    orderNo: "",
    category: "Delivery",
    rating: 5,
    message: "",
    consent: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "rating"
          ? Number(value)
          : value,
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.phone.trim()) return "Please enter your phone number.";
    // basic Sri Lanka mobile validation: 9 digits starting with 7
    if (!/^7\d{8}$/.test(form.phone.trim()))
      return "Please enter a valid 9-digit Sri Lanka mobile number (starts with 7).";
    if (!form.message.trim()) return "Please write your feedback.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Please enter a valid email address.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    try {
      setSubmitting(true);

      // ✅ Build payload exactly matching your backend route:
      // Body: { name, phone, email?, orderNo?, category?, rating?, message, consent?, channel?, user_id? }
      const payload = {
        user_id: user?.id ?? null,
        name: form.name.trim(),
        phone: `+94${form.phone.trim()}`, // ✅ backend will also sanitize digits
        email: form.email?.trim() || null,
        orderNo: form.orderNo?.trim() || null,
        category: form.category || "Other",
        rating: Number(form.rating) || null,
        message: form.message.trim(),
        consent: Boolean(form.consent),
        channel: "web",
      };

      // ✅ REAL API CALL (this is what was missing)
      await api.post("/api/support", payload);

      setSubmitted(true);
    } catch (error) {
      console.error("SUPPORT SUBMIT ERROR:", error?.response?.data || error);
      alert(
        error?.response?.data?.error ||
          error?.response?.data?.details ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setForm({
      name: "",
      phone: "",
      email: "",
      orderNo: "",
      category: "Delivery",
      rating: 5,
      message: "",
      consent: true,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero – match Home styling */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#002B5B]">
            Share <span className="text-blue-600">Feedback</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Your feedback helps us improve quality, delivery, and your overall
            experience.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10 w-full">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-8">
            {!submitted ? (
              <>
                <h2 className="text-2xl font-bold text-[#002B5B]">
                  Feedback Form
                </h2>
                <p className="mt-2 text-gray-600">
                  Please fill the form below. We usually respond within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  {/* Row 1 */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800">
                        Phone <span className="text-red-500">*</span>
                      </label>

                      <div className="mt-2 flex">
                        {/* Country Code (fixed to +94) */}
                        <div className="flex items-center px-4 rounded-l-xl border border-r-0 bg-gray-100 text-gray-700 font-medium">
                          +94
                        </div>

                        {/* Phone Number */}
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={(e) => {
                            // ✅ keep only digits, max 9 digits
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                            setForm((p) => ({ ...p, phone: digits }));
                          }}
                          className="w-full rounded-r-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="7X XXX XXXX"
                          maxLength={9}
                          inputMode="numeric"
                        />
                      </div>

                      <p className="mt-2 text-xs text-gray-500">
                        Enter 9 digits after +94 (Example: 7XXXXXXXX)
                      </p>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800">
                        Email (optional)
                      </label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800">
                        Order No (optional)
                      </label>
                      <input
                        name="orderNo"
                        value={form.orderNo}
                        onChange={onChange}
                        className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="OW-12345"
                      />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800">
                        Category
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={onChange}
                        className="mt-2 w-full rounded-xl border px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <option>Delivery</option>
                        <option>Product Quality</option>
                        <option>Packaging</option>
                        <option>Payment</option>
                        <option>Customer Support</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800">
                        Rating
                      </label>
                      <div className="mt-2 flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const star = i + 1;
                          const active = star <= form.rating;
                          return (
                            <button
                              type="button"
                              key={star}
                              onClick={() =>
                                setForm((p) => ({ ...p, rating: star }))
                              }
                              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition
                                ${
                                  active
                                    ? "bg-yellow-50 border-yellow-200"
                                    : "bg-white hover:bg-gray-50"
                                }`}
                              aria-label={`Set rating ${star}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`w-5 h-5 ${
                                  active ? "text-yellow-400" : "text-gray-300"
                                }`}
                              >
                                <path d="M12 .587l3.668 7.425 8.167 1.183-5.917 5.763 1.396 8.142L12 18.897l-7.314 3.863 1.396-8.142L.165 9.195l8.167-1.183z" />
                              </svg>
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Selected: {form.rating} / 5
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      rows={5}
                      className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Tell us what went well or what we can improve..."
                    />
                  </div>

                  {/* Consent */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={form.consent}
                      onChange={onChange}
                      className="mt-1 w-4 h-4"
                    />
                    <p className="text-sm text-gray-600 text-left">
                      I agree that Ocean Wave may contact me regarding this feedback.
                    </p>
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      disabled={submitting}
                      className="rounded-xl px-6 py-3 bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition disabled:opacity-60"
                      type="submit"
                    >
                      {submitting ? "Submitting..." : "Submit Feedback"}
                    </button>

                    <button
                      type="button"
                      onClick={reset}
                      className="rounded-xl px-6 py-3 bg-white text-gray-900 font-semibold border shadow-sm hover:bg-gray-50 transition"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-green-50 border flex items-center justify-center text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7"
                  >
                    <path d="M9 12.75l2.25 2.25L15 11.25l1.06 1.06-4.81 4.81L7.94 13.81 9 12.75z" />
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75S6.615 21.75 12 21.75 21.75 17.385 21.75 12 17.385 2.25 12 2.25zm0 1.5c4.557 0 8.25 3.693 8.25 8.25s-3.693 8.25-8.25 8.25-8.25-3.693-8.25-8.25 3.693-8.25 8.25-8.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <h2 className="mt-5 text-2xl font-bold text-[#002B5B]">
                  Thank you!
                </h2>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  Your feedback has been received. We’ll review it and get back to
                  you if needed.
                </p>

                <button
                  onClick={reset}
                  className="mt-6 rounded-xl px-6 py-3 bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition"
                >
                  Send Another Feedback
                </button>
              </div>
            )}
          </div>

          {/* Side Info Card */}
          <aside className="bg-gradient-to-b from-white to-gray-50 border rounded-2xl shadow-inner p-8 h-fit">
            <h3 className="text-xl font-bold text-[#002B5B]">Need faster help?</h3>
            <p className="mt-2 text-gray-600">
              For urgent order issues, please contact our hotline/WhatsApp.
            </p>

            <div className="mt-6 space-y-3 text-left">
              <div className="bg-white rounded-2xl border shadow-sm p-5">
                <p className="text-sm text-gray-500">Hotline</p>
                <p className="font-semibold text-gray-900">+94 707003766</p>
              </div>
              <div className="bg-white rounded-2xl border shadow-sm p-5">
                <p className="text-sm text-gray-500">WhatsApp</p>
                <p className="font-semibold text-gray-900">+94 707003766</p>
              </div>
              <div className="bg-white rounded-2xl border shadow-sm p-5">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">
                  oceanwaveis4u@gmail.com
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-blue-50 border">
              <p className="text-sm text-gray-700">
                Tip: Include your order number if you have one. It helps us respond
                faster.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}