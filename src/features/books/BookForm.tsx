import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { createBook, updateBook, fetchBooks } from "./booksSlice";
import Navbar from "../../components/Navbar";
import BarcodePreview from "../../components/BarcodePreview";
import { generateEan13 } from "../../utils/barcode";

export default function BookForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const books = useAppSelector((s) => s.books.items);

  const existing = isEditing ? books.find((b) => b._id === id) : undefined;

  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && books.length === 0) {
      dispatch(fetchBooks());
    }
  }, [dispatch, isEditing, books.length]);

  useEffect(() => {
    if (existing) {
      setIsbn(existing.isbn);
      setTitle(existing.title);
      setAuthor(existing.author);
      setCategory(existing.category);
      setCoverUrl(existing.coverUrl || "");
      setTotalCopies(existing.totalCopies);
    }
  }, [existing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isEditing && id) {
        const result = await dispatch(
          updateBook({ id, changes: { title, author, category, coverUrl, totalCopies } })
        );
        if (updateBook.rejected.match(result)) {
          setError((result.payload as string) || "Failed to update book");
          return;
        }
      } else {
        const result = await dispatch(createBook({ isbn, title, author, category, coverUrl, totalCopies }));
        if (createBook.rejected.match(result)) {
          setError((result.payload as string) || "Failed to add book");
          return;
        }
      }
      navigate("/books");
    } finally {
      setSubmitting(false);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />

    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-8">

        {/* Preview Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Book Preview
          </h2>

          <div className="flex flex-col items-center">
            <div className="w-64 h-96 rounded-2xl overflow-hidden shadow-lg border">
              <img
                src={
                  coverUrl ||
                  "https://images.unsplash.com/photo-1544947950-fa07a98d237f"
                }
                alt="Book Cover"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="mt-5 text-xl font-bold text-center">
              {title || "Book Title"}
            </h3>

            <p className="text-gray-500">
              {author || "Author Name"}
            </p>

            {category && (
              <span className="mt-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {category}
              </span>
            )}

            {isbn && /^\d{13}$/.test(isbn) && (
              <div className="mt-6">
                <BarcodePreview value={isbn} />
              </div>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {isEditing ? "Edit Book" : "Add New Book"}
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your library catalog
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ISBN */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                ISBN / Barcode
              </label>

              <div className="flex gap-3">
                <input
                  required
                  disabled={isEditing}
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder="9780132350884"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsbn(generateEan13())}
                    className="bg-blue-600 text-white px-5 rounded-xl hover:bg-blue-700 transition"
                  >
                    Generate
                  </button>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Title
              </label>

              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Author
              </label>

              <input
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Category
              </label>

              <input
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Science, History, Fiction..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Cover URL */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Cover URL
              </label>

              <input
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Copies */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Total Copies
              </label>

              <input
                type="number"
                min={1}
                value={totalCopies}
                onChange={(e) =>
                  setTotalCopies(Number(e.target.value))
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
            >
              {submitting
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Add Book"}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}
