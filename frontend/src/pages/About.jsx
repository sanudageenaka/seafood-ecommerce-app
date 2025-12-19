import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero (match Home) */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#002B5B]">
            About <span className="text-blue-600">Ocean Wave</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Premium-quality seafood, carefully handled and delivered with a smooth, reliable
            experience.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition"
            >
              Shop Now
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-white text-gray-900 font-semibold border shadow-sm hover:bg-gray-50 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-10 w-full">
        {/* Who we are */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-2xl font-bold text-[#002B5B]">Who we are</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Ocean Wave is built on one promise: you should be able to order seafood with
              confidence—knowing it is selected carefully, packed hygienically, and delivered
              on time.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We work with trusted suppliers and follow strict quality checks to keep freshness
              and taste at the center of every order.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gradient-to-b from-white to-gray-50 border p-4">
                <p className="text-sm text-gray-500">Focus</p>
                <p className="font-semibold">Freshness & Quality</p>
              </div>
              <div className="rounded-xl bg-gradient-to-b from-white to-gray-50 border p-4">
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-semibold">Fast & Reliable</p>
              </div>
            </div>
          </div>

          {/* Image card (kept neat, not large) */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center justify-center">
            <img
              src="/seafoods/logo.jpg"
              alt="Ocean Wave"
              className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover border bg-gray-50"
              loading="lazy"
            />
          </div>
        </section>

        {/* Values */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#002B5B]">What we stand for</h2>
              <p className="mt-2 text-gray-600">
                The standards we follow to keep your experience consistent and trusted.
              </p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Freshness",
                desc: "Handled with care and kept at the right temperature from source to delivery.",
              },
              {
                title: "Quality",
                desc: "Selected with clear grading and strict checks before packing.",
              },
              {
                title: "Hygiene",
                desc: "Clean packing practices to protect taste, safety, and confidence.",
              },
              {
                title: "Trust",
                desc: "Clear communication, honest pricing, and support when you need it.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border flex items-center justify-center text-blue-600 font-bold">
                  {v.title.slice(0, 1)}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{v.title}</h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats (same clean blocks as Home style) */}
        <section className="mt-10 bg-gradient-to-b from-white to-gray-50 border rounded-2xl">
          <div className="px-6 py-10">
            <h2 className="text-2xl font-bold text-[#002B5B] text-center">By the numbers</h2>
            <p className="mt-2 text-gray-600 text-center max-w-2xl mx-auto">
              A few quick highlights that reflect our commitment to service.
            </p>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[ 
                { k: "10k+", l: "Happy Customers" },
                { k: "100+", l: "Trusted Suppliers" },
                { k: "Same-day", l: "Delivery Options" },
                { k: "Support", l: "Quick Assistance" },
              ].map((s) => (
                <div key={s.l} className="bg-white rounded-2xl border shadow-sm p-5">
                  <p className="text-3xl font-extrabold text-[#002B5B]">{s.k}</p>
                  <p className="mt-1 text-sm text-gray-600">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promise */}
        <section className="mt-10 bg-white rounded-2xl border shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-[#002B5B]">Our promise</h2>
          <p className="mt-3 text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Every order should feel simple and premium—from browsing to checkout to delivery.
            We continuously improve sourcing, packing, and service so you can order with
            confidence every time.
          </p>

          <div className="mt-6">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition"
            >
              Explore Products
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
