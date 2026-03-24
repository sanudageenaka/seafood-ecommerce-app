import React from "react";
import { Link } from "react-router-dom";

export default function Hotline() {
  // ✅ Change these
  const HOTLINE = "+94707003766";
  const WHATSAPP = "+94707003766";
  const EMAIL = "oceanwaveis4u@gmail.com";

  const telLink = `tel:${HOTLINE.replace(/\s/g, "")}`;
  const waLink = `https://wa.me/${WHATSAPP.replace(/\D/g, "")}`;
  const mailLink = `mailto:${EMAIL}`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero – match Home styling */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#002B5B]">
            Hotline <span className="text-blue-600">Support</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Need help with an order, delivery, or payment? Contact us using the options below.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={telLink}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition"
            >
              Call Now
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-white text-gray-900 font-semibold border shadow-sm hover:bg-gray-50 transition"
            >
              WhatsApp
            </a>
          </div>

          <div className="mt-4">
            <Link to="/" className="text-sm text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10 w-full">
        {/* Contact Cards */}
        <section className="grid md:grid-cols-3 gap-4">
          {/* Call */}
          <a
            href={telLink}
            className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-lg transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Call Us</h3>
            <p className="mt-1 text-sm text-gray-600">Speak with our support team</p>
            <p className="mt-3 font-semibold text-[#002B5B]">{HOTLINE}</p>
            <p className="mt-2 text-xs text-gray-500">Tap to call (mobile)</p>
          </a>

          {/* WhatsApp */}
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-lg transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-50 border flex items-center justify-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M12 2C6.48 2 2 6.02 2 10.98c0 2.56 1.2 4.87 3.14 6.46L4 22l4.06-2.13c1.2.33 2.54.52 3.94.52 5.52 0 10-4.02 10-8.98S17.52 2 12 2zm-1 13H9v-2h2v2zm4 0h-2V9h2v6z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">WhatsApp</h3>
            <p className="mt-1 text-sm text-gray-600">Fast replies for order updates</p>
            <p className="mt-3 font-semibold text-[#002B5B]">{WHATSAPP}</p>
            <p className="mt-2 text-xs text-gray-500">Open WhatsApp chat</p>
          </a>

          {/* Email */}
          <a
            href={mailLink}
            className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-lg transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border flex items-center justify-center text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Email</h3>
            <p className="mt-1 text-sm text-gray-600">Invoices, feedback & issues</p>
            <p className="mt-3 font-semibold text-[#002B5B]">{EMAIL}</p>
            <p className="mt-2 text-xs text-gray-500">We reply within 24 hours</p>
          </a>
        </section>

        {/* Hours + Tips */}
        <section className="mt-8 grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-gradient-to-b from-white to-gray-50 border rounded-2xl shadow-inner p-8">
            <h2 className="text-2xl font-bold text-[#002B5B]">Support Hours</h2>
            <p className="mt-2 text-gray-600">
              Messages outside these hours will be answered as soon as possible.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4 text-left">
              {[
                { day: "Monday – Friday", time: "8:00 AM – 8:00 PM" },
                { day: "Saturday", time: "8:00 AM – 6:00 PM" },
                { day: "Sunday / Poya Days", time: "Limited support" },
                { day: "Urgent order issue", time: "WhatsApp recommended" },
              ].map((row) => (
                <div key={row.day} className="bg-white rounded-2xl border shadow-sm p-5">
                  <p className="font-semibold text-gray-900">{row.day}</p>
                  <p className="text-sm text-gray-600 mt-1">{row.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-[#002B5B]">Before you contact</h2>
            <ul className="mt-3 text-sm text-gray-600 space-y-2 text-left list-disc pl-5">
              <li>Keep your order number ready (if available).</li>
              <li>For delivery issues, share your location and contact number.</li>
              <li>For payment issues, include transaction/reference ID.</li>
              <li>For quality issues, contact us immediately after delivery.</li>
            </ul>

            <div className="mt-6 p-4 rounded-2xl bg-blue-50 border text-left">
              <p className="text-sm text-gray-700">
                Tip: WhatsApp is the fastest option for urgent order updates.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
