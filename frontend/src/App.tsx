// src/App.tsx
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./routes/ProtectedRoute";
import HomePage from "./routes/HomePage";
import LoginPage from "./pages/user/UserLoginPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import InspectorLoginPage from "./pages/inspector/InspectorLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import InspectorDashboard from "./pages/inspector/InspectorDashboard";
import UserDashboard from "./pages/user/UserDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />

        {/* Login Routes - Protected from authenticated users */}
        <Route
          path="/user/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/admin/login"
          element={
            <PublicRoute>
              <AdminLoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/inspector/login"
          element={
            <PublicRoute>
              <InspectorLoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/admin/dashboard/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inspector/dashboard/*"
          element={
            <ProtectedRoute role="inspector">
              <InspectorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard/*"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;