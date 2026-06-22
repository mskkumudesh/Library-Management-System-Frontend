import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { fetchSummary } from "./dashboardSlice";
import Navbar from "../../components/Navbar";

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {value}
          </h3>
        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { summary, status, error } = useAppSelector(
    (s) => s.dashboard
  );

  useEffect(() => {
    dispatch(fetchSummary());
  }, [dispatch]);


return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />

    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Library Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor books, loans and member activity.
        </p>
      </div>

      {status === "loading" && (
        <div className="bg-white rounded-2xl p-6 shadow">
          Loading dashboard...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6">
          {error}
        </div>
      )}

      {summary && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">

            <StatCard
              label="Titles"
              value={summary.totalTitles}
              icon="📚"
              color="bg-blue-100"
            />

            <StatCard
              label="Copies"
              value={summary.totalCopies}
              icon="📖"
              color="bg-green-100"
            />

            <StatCard
              label="Available"
              value={summary.availableCopies}
              icon="✅"
              color="bg-emerald-100"
            />

            <StatCard
              label="Borrowed"
              value={summary.borrowedCount}
              icon="🔄"
              color="bg-yellow-100"
            />

            <StatCard
              label="Overdue"
              value={summary.overdueCount}
              icon="⚠️"
              color="bg-red-100"
            />
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Top Categories
              </h2>

              {summary.topCategories.length === 0 ? (
                <p className="text-gray-500">
                  No books available.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={summary.topCategories}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                  >
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="category"
                      width={120}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      fill="#2563eb"
                      radius={[0, 10, 10, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Library Overview
              </h2>

              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span>Total Titles</span>
                  <span>{summary.totalTitles}</span>
                </div>

                <div className="flex justify-between">
                  <span>Available Copies</span>
                  <span>{summary.availableCopies}</span>
                </div>

                <div className="flex justify-between">
                  <span>Borrowed Books</span>
                  <span>{summary.borrowedCount}</span>
                </div>

                <div className="flex justify-between">
                  <span>Overdue Books</span>
                  <span>{summary.overdueCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Returns */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Recent Returns
            </h2>

            {summary.recentReturns.length === 0 ? (
              <p className="text-gray-500">
                No returns yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">
                        Book
                      </th>
                      <th className="text-left py-3">
                        Member
                      </th>
                      <th className="text-left py-3">
                        Return Date
                      </th>
                      <th className="text-left py-3">
                        Fine
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {summary.recentReturns.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 font-medium">
                          {r.bookTitle}
                        </td>

                        <td>{r.memberName}</td>

                        <td>
                          {new Date(
                            r.returnedAt
                          ).toLocaleDateString()}
                        </td>

                        <td>
                          {r.fineAmount > 0 ? (
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                              ${r.fineAmount.toFixed(2)}
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                              No Fine
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  </div>
);

}
