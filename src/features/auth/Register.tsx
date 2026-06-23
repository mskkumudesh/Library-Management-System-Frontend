import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { registerUser, UserRole } from "./authSlice";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("member");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ name, email, password, role }));
    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4 py-10">

    <div className="w-full max-w-md">

      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md text-5xl shadow-xl">
          📚
        </div>

        <h1 className="mt-5 text-4xl font-bold text-white">
          ShelfScan
        </h1>

        <p className="text-blue-100 mt-2">
          Create your library account
        </p>
      </div>

      {/* Register Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Join ShelfScan
        </h2>

        <p className="text-gray-500 mb-6">
          Register to access the library management system.
        </p>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Full Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-700">
              Account Type
            </label>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => setRole("member")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  role === "member"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-3xl mb-2">👤</div>
                <div className="font-semibold text-gray-800">
                  Member
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Borrow books
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("librarian")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  role === "librarian"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-3xl mb-2">📚</div>
                <div className="font-semibold text-gray-800">
                  Librarian
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Manage library
                </div>
              </button>

            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-lg disabled:opacity-60"
          >
            {status === "loading"
              ? "Creating Account..."
              : "Create Account"}
          </button>

          <div className="text-center pt-2">
            <span className="text-gray-500 text-sm">
              Already have an account?
            </span>

            <Link
              to="/login"
              className="ml-2 text-blue-600 font-semibold hover:text-blue-700"
            >
              Sign In
            </Link>
          </div>

        </form>
      </div>

      <p className="text-center text-blue-100 text-sm mt-6">
        © 2026 ShelfScan Library System
      </p>

    </div>
  </div>
);
}
