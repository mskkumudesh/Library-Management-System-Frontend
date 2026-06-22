import { useEffect, useState, useCallback, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { fetchMembers, checkoutBook } from "./borrowSlice";
import Navbar from "../../components/Navbar";
import ScannerView from "../scanner/ScannerView";

export default function Checkout() {
  const dispatch = useAppDispatch();
  const { members, error } = useAppSelector((s) => s.borrow);

  const [isbn, setIsbn] = useState("");
  const [memberId, setMemberId] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [justScanned, setJustScanned] = useState(false);

  const handleScan = useCallback((decodedText: string) => {
    setIsbn(decodedText);
    setScanning(false);
    setJustScanned(true);
  }, []);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleMemberSearch = (e: FormEvent) => {
    e.preventDefault();
    dispatch(fetchMembers(memberSearch));
  };

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(null);

    if (!memberId) {
      setLocalError("Select a member first");
      return;
    }

    setSubmitting(true);
    const result = await dispatch(checkoutBook({ isbn, memberId }));
    setSubmitting(false);

    if (checkoutBook.fulfilled.match(result)) {
      setSuccess(`"${result.payload.book.title}" checked out successfully.`);
      setIsbn("");
      setJustScanned(false);
    } else {
      setLocalError((result.payload as string) || "Checkout failed");
    }
  };


return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />

    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-8">

        {/* Scanner Side */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            📚 Book Scanner
          </h2>

          <p className="text-gray-500 mb-6">
            Scan a barcode or enter the ISBN manually.
          </p>

          <div className="flex items-center justify-between mb-4">
            <label className="font-medium text-gray-700">
              ISBN / Barcode
            </label>

            <button
              type="button"
              onClick={() => {
                setScanning((s) => !s);
                setJustScanned(false);
              }}
              className={`px-4 py-2 rounded-xl text-white font-medium transition ${
                scanning
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {scanning ? "Stop Camera" : "📷 Scan Barcode"}
            </button>
          </div>

          {scanning && (
            <div className="mb-4">
              <div className="border-2 border-dashed border-blue-300 rounded-2xl overflow-hidden">
                <ScannerView
                  active={scanning}
                  onScan={handleScan}
                />
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Point the camera at the barcode.
              </p>
            </div>
          )}

          <input
            required
            value={isbn}
            onChange={(e) => {
              setIsbn(e.target.value);
              setJustScanned(false);
            }}
            placeholder="9780132350884"
            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${
              justScanned
                ? "border-green-500 bg-green-50"
                : "border-gray-300"
            }`}
          />

          {justScanned && (
            <div className="mt-3 bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl">
              ✓ Barcode scanned successfully
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <div className="w-48 h-64 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-6xl shadow-lg">
              📖
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Checkout Book
          </h1>

          <p className="text-gray-500 mb-6">
            Assign a book to a library member.
          </p>

          {(localError || error) && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
              {localError || error}
            </div>
          )}

          {success && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl">
              {success}
            </div>
          )}

          <form
            onSubmit={handleCheckout}
            className="space-y-5"
          >
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Search Member
              </label>

              <div className="flex gap-3">
                <input
                  value={memberSearch}
                  onChange={(e) =>
                    setMemberSearch(e.target.value)
                  }
                  placeholder="Search by name or email"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <button
                  type="button"
                  onClick={handleMemberSearch}
                  className="bg-gray-100 hover:bg-gray-200 px-5 rounded-xl transition"
                >
                  Search
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Select Member
              </label>

              <select
                required
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">
                  Select a member
                </option>

                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
            >
              {submitting
                ? "Processing Checkout..."
                : "📚 Checkout Book"}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}
