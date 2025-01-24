import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContexts";
import ProtectedRoute from "./components/protectedRouted";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/dashboardAdmin";
import DashboardUser from "./pages/dashboardUser";
import CheckoutPage from "./pages/checkout"; // Import halaman Checkout

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <DashboardUser />
              </ProtectedRoute>
            }
          />
          {/* Tambahkan rute untuk halaman Checkout */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
