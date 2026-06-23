import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/store";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to={user?.role === "librarian" ? "/dashboard" : "/books"}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
            📚
          </div>

          <div>
            <h1 className="font-bold text-xl text-gray-800">
              ShelfScan
            </h1>
            <p className="text-xs text-gray-500">
              Library Management
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-5">
          <Link
            to="/books"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Books
          </Link>

          {user?.role === "librarian" && (
            <>
              <Link
                to="/books/new"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Add Book
              </Link>

              <Link
                to="/checkout"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Check Out
              </Link>

              <Link
                to="/borrow/active"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Issued Books
              </Link>
            </>
          )}

          {user?.role === "member" && (
            <Link
              to="/borrow/mybooks"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              My Books
            </Link>
          )}

          {/* User Info */}
          <div className="flex items-center gap-3 border-l pl-5">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name}
              </p>

              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

