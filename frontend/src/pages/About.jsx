import React from "react";

export default function About() {
  return (
    <div className="bg-[#f9fbff] min-h-screen text-gray-800">

      {/* Top Heading */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#002B5B]">
          About Us
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-base">
          We deliver premium seafood — fresh, sustainable, and sourced directly from trusted fisheries.
        </p>
      </section>

      {/* Who We Are */}
      <section className="max-w-4xl mx-auto px-6 py-10 text-center">
        <img
          src="/seafoods/logo.jpg"
          alt="OceanWave Seafood"
          className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover mx-auto border border-gray-300 shadow-md mb-8"
        />

        <h2 className="text-3xl font-semibold text-[#002B5B] mb-3">
          Who We Are
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed text-base">
          OceanWave4U was founded to make fresh and responsibly harvested seafood
          accessible to everyone. We work with experienced coastal communities and
          ensure cold-chain handling for unmatched taste and nutrition.
        </p>
      </section>

      {/* What We Focus On */}
      <section className="bg-white py-20 shadow-inner rounded-t-[40px]">
        <div className="max-w-6xl mx-auto text-center px-6">

          <h2 className="text-3xl font-semibold text-[#002B5B] mb-12">
            Our Core Focus
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Freshness", desc: "Fast delivery ensures true ocean flavor." },
              { title: "Sustainability", desc: "We support ethical fishing practices." },
              { title: "Trust", desc: "Quality inspected from sea to doorstep." },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 bg-[#f3f7ff] rounded-2xl shadow-sm border border-blue-100"
              >
                <h3 className="font-bold text-[#002B5B] text-xl">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 max-w-6xl mx-auto text-center px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            ["10,000+", "Happy Customers"],
            ["200+", "Seafood Products"],
            ["10+ Years", "Trusted Expertise"],
          ].map(([num, label], i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-blue-100 p-12 shadow-sm"
            >
              <p className="text-4xl font-bold text-[#0A4E96]">{num}</p>
              <p className="text-gray-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="pb-24 text-center">
        <p className="text-gray-600 text-base mb-4">
          Taste the ocean delivered to your door.
        </p>
        <a
          href="/products"
          className="bg-[#0A4E96] hover:bg-[#063a73] text-white px-10 py-3 rounded-full text-sm shadow-md transition duration-200"
        >
          Shop Now
        </a>
      </section>

    </div>
  );
}
