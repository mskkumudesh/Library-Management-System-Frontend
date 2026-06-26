import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import BookList from "./features/books/BookList";
import BookForm from "./features/books/BookForm";
import Checkout from "./features/borrow/IssuedBooks";
import ActiveLoans from "./features/borrow/MyBooks";
import MyLoans from "./features/borrow/MyBooks";
import Dashboard from "./features/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import HomePage from "./components/HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <BookList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/books/new"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["librarian"]}>
              <BookForm />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/books/:id/edit"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["librarian"]}>
              <BookForm />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["librarian"]}>
              <Checkout />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/borrow/active"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["librarian"]}>
              <ActiveLoans />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/borrow/mybooks"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["member"]}>
              <MyLoans />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["librarian"]}>
              <Dashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}