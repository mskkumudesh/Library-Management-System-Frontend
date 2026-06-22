import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { fetchMemberHistory } from "./borrowSlice";
import Navbar from "../../components/Navbar";

export default function MyLoans() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { myHistory } = useAppSelector((s) => s.borrow);

  useEffect(() => {
    if (user) dispatch(fetchMemberHistory(user.id));
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 font-ui">
        <h1 className="text-2xl font-bold text-spine mb-6">My borrowed books</h1>

        {myHistory.length === 0 && <p className="text-ink/60">You haven't borrowed any books yet.</p>}

        <div className="bg-white border border-ink/10 rounded-lg shadow-sm divide-y divide-ink/10">
          {myHistory.map((loan) => (
            <div key={loan._id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-ink">{loan.book.title}</p>
                <p className="text-sm text-ink/60">{loan.book.author}</p>
              </div>
              <div className="text-right text-sm">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                    loan.status === "returned"
                      ? "bg-ink/10 text-ink/60"
                      : new Date(loan.dueDate) < new Date()
                      ? "bg-red-100 text-red-700"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  {loan.status === "returned" ? "Returned" : "Borrowed"}
                </span>
                <p className="text-ink/40 mt-1">Due {new Date(loan.dueDate).toLocaleDateString()}</p>
                {loan.fineAmount > 0 && (
                  <p className="text-red-600 mt-1">Fine: ${loan.fineAmount.toFixed(2)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
