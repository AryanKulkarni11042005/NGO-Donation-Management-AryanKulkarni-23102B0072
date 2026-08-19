export function ContactSection() {
  return (
    <section id="contact" className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Contact Us</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 text-sm">
          <div>
            <h3 className="font-semibold text-gray-900">MICF</h3>
            <p className="text-gray-600 mt-1">Make India Compassionate Foundation</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Office Address</h3>
            <p className="text-gray-600 mt-1">
              221B, MG Road, Bengaluru, Karnataka 560001, India
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Phone &amp; Email</h3>
            <p className="text-gray-600 mt-1">+91 98765 43210</p>
            <p className="text-gray-600">contact@example.org</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Office Hours</h3>
            <p className="text-gray-600 mt-1">Mon – Fri</p>
            <p className="text-gray-600">9:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
}
