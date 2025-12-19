import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero – match Home styling */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#002B5B]">
            Privacy <span className="text-blue-600">Policy</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how Ocean Wave collects,
            uses, and protects your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-10 w-full">
        <div className="bg-white rounded-2xl border shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">1. Introduction</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Ocean Wave is committed to protecting your privacy. This Privacy Policy outlines
              how we collect, use, store, and safeguard your information when you use our
              website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">2. Information We Collect</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              We may collect personal information such as your name, contact details, delivery
              address, payment-related information, and order history when you place an order
              or contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">3. How We Use Your Information</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Your information is used to process orders, manage deliveries, provide customer
              support, improve our services, and communicate important updates related to your
              orders or our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">4. Data Sharing & Disclosure</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              We do not sell or rent your personal information. Data may be shared only with
              trusted partners such as delivery providers and payment gateways, strictly for
              service fulfillment purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">5. Payment Security</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Payments are processed through secure third-party payment gateways. Ocean Wave
              does not store your card or banking details on its servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">6. Cookies & Tracking</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Our website may use cookies to enhance your browsing experience, analyze traffic,
              and improve functionality. You can manage cookie preferences through your
              browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">7. Data Protection</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              We implement reasonable security measures to protect your personal data from
              unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">8. User Rights</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              You have the right to request access to, correction of, or deletion of your
              personal information, subject to applicable legal requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">9. Policy Updates</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              This Privacy Policy may be updated from time to time. Any changes will be
              reflected on this page, and continued use of our services indicates acceptance
              of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#002B5B]">10. Contact Us</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              If you have any questions or concerns regarding this Privacy Policy, please
              contact us through the official communication channels listed on our website.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
