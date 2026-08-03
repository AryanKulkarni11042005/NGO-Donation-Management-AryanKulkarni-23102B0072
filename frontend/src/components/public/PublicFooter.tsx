export function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-white">MICF</p>
          <p className="text-sm text-gray-400 mt-1">Make India Compassionate Foundation</p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <a href="#about" className="hover:text-white">About</a>
          <a href="#campaigns" className="hover:text-white">Campaigns</a>
          <a href="#campaigns" className="hover:text-white">Donate</a>
          <a href="#contact" className="hover:text-white">Contact</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
        </nav>
      </div>
      <div className="border-t border-gray-800">
        <p className="max-w-6xl mx-auto px-6 py-4 text-xs text-gray-500">
          © {new Date().getFullYear()} MICF — Make India Compassionate Foundation. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
