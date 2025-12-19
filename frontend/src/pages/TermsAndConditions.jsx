import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero – match Home styling */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#002B5B]">
            Terms & <span className="text-blue-600">Conditions</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using Ocean Wave services.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-10 w-full">
        <div className="bg-white rounded-2xl border shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">1. Introduction</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Welcome to Ocean Wave. By accessing or using our website and services, you agree
              to be bound by these Terms & Conditions. If you do not agree, please refrain from
              using our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">2. Eligibility</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              You must be at least 18 years old to place orders on Ocean Wave. By using this
              website, you confirm that the information you provide is accurate and complete.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">3. Products & Availability</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              All products displayed are subject to availability. We reserve the right to limit
              quantities, discontinue products, or modify product details without prior notice.
              Images are for illustration purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">4. Pricing & Payments</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Prices are displayed in Sri Lankan Rupees (LKR) unless stated otherwise. Payments
              must be completed using approved payment methods. Ocean Wave reserves the right
              to cancel orders in case of pricing or payment errors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">5. Delivery</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Delivery times and availability depend on your location and selected delivery
              option. While we strive for timely delivery, delays due to external factors may
              occur and will be communicated when possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">6. Returns & Refunds</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Due to the perishable nature of our products, returns are limited. If you receive
              a damaged or incorrect item, please contact our support team immediately upon
              delivery for assistance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">7. User Responsibilities</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              You agree not to misuse the website, attempt unauthorized access, or engage in
              activities that may harm Ocean Wave, its customers, or partners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">8. Intellectual Property</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              All content on this website, including text, images, logos, and designs, is the
              property of Ocean Wave and may not be reproduced without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">9. Limitation of Liability</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Ocean Wave shall not be liable for any indirect, incidental, or consequential
              damages arising from the use of our services or products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">10. Changes to Terms</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              We reserve the right to update these Terms & Conditions at any time. Continued
              use of the website constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">11. Contact Information</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              If you have any questions regarding these Terms & Conditions, please contact us
              through our official communication channels listed on the website.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
