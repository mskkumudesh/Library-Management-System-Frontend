import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
            📚
          </div>

          <h1 className="text-2xl font-bold text-white">
            ShelfScan
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-xl bg-white text-blue-600 font-semibold hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side */}
          <div>
            <div className="inline-block bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm mb-6">
              Modern Library Management System
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Manage Your
              <span className="block text-yellow-300">
                Library Smarter
              </span>
            </h1>

            <p className="text-xl text-blue-100 mt-6 max-w-xl">
              Track books, manage members, scan barcodes,
              monitor loans, and streamline library operations
              with ShelfScan.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition"
              >
                Sign In
              </Link>

            </div>
          </div>

          {/* Right Side */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">
              <div className="text-center">
                <div className="text-8xl mb-6">📚</div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  ShelfScan
                </h2>

                <p className="text-blue-100">
                  Barcode-powered library management
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">

                  <div className="bg-white/10 rounded-2xl p-4">
                    <h3 className="text-3xl font-bold text-white">
                      1000+
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Books
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4">
                    <h3 className="text-3xl font-bold text-white">
                      500+
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Members
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Features */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">📖</div>

              <h3 className="text-xl font-bold text-white mb-3">
                Book Management
              </h3>

              <p className="text-blue-100">
                Add, edit, search and organize books
                efficiently.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">📷</div>

              <h3 className="text-xl font-bold text-white mb-3">
                Barcode Scanning
              </h3>

              <p className="text-blue-100">
                Quickly issue and return books using
                barcode technology.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">📊</div>

              <h3 className="text-xl font-bold text-white mb-3">
                Analytics Dashboard
              </h3>

              <p className="text-blue-100">
                Monitor library performance and
                borrowing trends.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}