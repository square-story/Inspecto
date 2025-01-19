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
import UserRegister from "./pages/user/UserRegister";
import UserForget from "./pages/user/ForgetPasswordPreview";
import UserInputOTP from "./pages/user/UserInputOTP";
import FAQPage from "./routes/FAQPage";
import ContactPage from "./routes/ContactPage";
import ResetPasswordPreview from "./pages/user/ResetPassword";
import InspectorRegister from "./pages/inspector/InspectorRegister";
import InspectorOTPVerification from "./pages/inspector/VerifyOTP";
import DetailedForm from "./pages/inspector/DataRegisteration";

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

        <Route
          path="/questions"
          element={
            <FAQPage />
          }
        />

        <Route
          path="/contact"
          element={
            <ContactPage />
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
          path="/forget/:role"
          element={
            <PublicRoute>
              <UserForget />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPasswordPreview />
            </PublicRoute>
          }
        />
        <Route
          path="/user/register"
          element={
            <PublicRoute>
              <UserRegister />
            </PublicRoute>
          }
        />
        <Route
          path="/user/verify-otp"
          element={
            <PublicRoute>
              <UserInputOTP />
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
        <Route
          path="/inspector/register"
          element={
            <PublicRoute>
              <InspectorRegister />
            </PublicRoute>
          }
        />
        <Route
          path="/inspector/verify-otp"
          element={
            <PublicRoute>
              <InspectorOTPVerification />
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
          path="/inspector/form-fill/*"
          element={
            <ProtectedRoute role="inspector">
              <DetailedForm />
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