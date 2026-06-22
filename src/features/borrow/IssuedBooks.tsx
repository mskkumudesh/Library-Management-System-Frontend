import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { fetchActiveLoans, returnBook } from "./borrowSlice";
import Navbar from "../../components/Navbar";

function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date();
}

export default function ActiveLoans() {
  const dispatch = useAppDispatch();
  const { activeLoans, status, error } = useAppSelector((s) => s.borrow);

  useEffect(() => {
    dispatch(fetchActiveLoans());
  }, [dispatch]);

  const handleReturn = (id: string, title: string) => {
    if (window.confirm(`Mark "${title}" as returned?`)) {
      dispatch(returnBook(id));
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />

    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Active Loans
        </h1>
        <p className="text-gray-500 mt-2">
          Monitor currently borrowed books and overdue returns.
        </p>
      </div>

      {status === "loading" && (
        <div className="bg-white rounded-2xl shadow p-6">
          Loading active loans...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6">
          {error}
        </div>
      )}

      {status === "succeeded" && activeLoans.length === 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-700">
            No Active Loans
          </h2>
          <p className="text-gray-500 mt-2">
            All books have been returned.
          </p>
        </div>
      )}

      {activeLoans.length > 0 && (
        <div className="grid gap-5">
          {activeLoans.map((loan) => {
            const overdue = isOverdue(loan.dueDate);

            return (
              <div
                key={loan._id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  {/* Left Section */}
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl">
                      📖
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {loan.book.title}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        Borrowed by{" "}
                        <span className="font-medium">
                          {loan.member.name}
                        </span>
                      </p>

                      <p className="text-sm text-gray-400">
                        {loan.member.email}
                      </p>
                    </div>
                  </div>

                  {/* Middle Section */}
                  <div className="flex flex-col items-start lg:items-center">
                    <span className="text-sm text-gray-500">
                      Due Date
                    </span>

                    <span
                      className={`mt-1 px-4 py-2 rounded-full text-sm font-medium ${
                        overdue
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {new Date(
                        loan.dueDate
                      ).toLocaleDateString()}
                      {overdue && " • OVERDUE"}
                    </span>
                  </div>

                  {/* Right Section */}
                  <div>
                    <button
                      onClick={() =>
                        handleReturn(
                          loan._id,
                          loan.book.title
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition shadow"
                    >
                      Mark Returned
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);
}
