import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { loginUser } from "./authSlice";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };
return (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4">

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
          Library Management System
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome Back
        </h2>

        <p className="text-gray-500 mb-6">
          Sign in to continue
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
              placeholder="you@library.com"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-lg disabled:opacity-60"
          >
            {status === "loading"
              ? "Signing In..."
              : "Sign In"}
          </button>

          <div className="text-center pt-2">
            <span className="text-gray-500 text-sm">
              New here?
            </span>

            <Link
              to="/register"
              className="ml-2 text-blue-600 font-semibold hover:text-blue-700"
            >
              Create Account
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
