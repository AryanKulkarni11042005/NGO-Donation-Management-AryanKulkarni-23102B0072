import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="bg-primary-light">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Together We Can Create Lasting Change
          </h1>
          <p className="mt-4 text-gray-600 text-base leading-relaxed max-w-md">
            MICF partners with communities across India to deliver clean water, education,
            and essential support to those who need it most. Every donation moves us closer
            to a more compassionate India.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#campaigns"
              className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-6 py-3 rounded-md"
            >
              Donate Now
            </a>
            <a
              href="#campaigns"
              className="bg-white border border-gray-300 text-gray-700 text-sm font-semibold px-6 py-3 rounded-md hover:border-primary hover:text-primary"
            >
              View Campaigns
            </a>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1200&q=80"
            alt="Volunteers helping a community"
            className="w-full h-72 sm:h-96 object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
