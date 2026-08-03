export function AboutSection() {
  return (
    <section id="about" className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center">About Us</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mt-3">
          Make India Compassionate Foundation (MICF) is a nonprofit dedicated to building
          stronger, healthier communities across India.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900">Mission</h3>
            <p className="text-sm text-gray-600 mt-2">
              To connect generous donors with communities in need, delivering clean water,
              education, and essential resources with transparency and care.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900">Vision</h3>
            <p className="text-sm text-gray-600 mt-2">
              A compassionate India where every community has access to the resources it
              needs to thrive.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900">Values</h3>
            <p className="text-sm text-gray-600 mt-2">
              Transparency, accountability, and respect for the communities and donors we
              serve.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
