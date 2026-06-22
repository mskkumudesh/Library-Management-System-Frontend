
import { useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { fetchBooks, deleteBook } from "./booksSlice";
import Navbar from "../../components/Navbar";

export default function BookList() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((s) => s.books);
  const user = useAppSelector((s) => s.auth.user);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    dispatch(fetchBooks({ search }));
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Remove "${title}" from the catalog?`)) {
      dispatch(deleteBook(id));
    }
  };

  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 font-ui">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-spine">
            📚 Library Catalog
          </h1>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, author or ISBN"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
        </div>

        {status === "loading" && (
          <p className="text-gray-500">Loading books...</p>
        )}

        {error && (
          <p className="text-red-600 text-sm mb-4">
            {error}
          </p>
        )}

        {status === "succeeded" && items.length === 0 && (
          <p className="text-gray-500">
            No books found.
            {user?.role === "librarian" && " Add the first one."}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col"
            >
              <div className="h-72 bg-gray-100 overflow-hidden">
                <img
                  src={
                    book.coverUrl ||
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f"
                  }
                  alt={book.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-2">
                  <h2 className="font-bold text-lg text-gray-800 line-clamp-2">
                    {book.title}
                  </h2>

                  <span
                    className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                      book.availableCopies > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {book.availableCopies > 0
                      ? "Available"
                      : "Out"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  {book.author}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  ISBN: {book.isbn}
                </p>

                <div className="mt-3">
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                    {book.category}
                  </span>
                </div>

                <div className="mt-4 text-sm">
                  <span className="font-bold text-green-600">
                    {book.availableCopies}
                  </span>
                  <span className="text-gray-500">
                    {" "}of {book.totalCopies} copies available
                  </span>
                </div>

                {user?.role === "librarian" && (
                  <div className="mt-auto pt-5 flex gap-2">
                    <Link
                      to={`/books/${book._id}/edit`}
                      className="flex-1 text-center py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(book._id, book.title)
                      }
                      className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

