import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import HomePage from "./routes/HomePage"
import LoginPage from "./pages/inspector/InspectorLoginPage"
import AdminLoginPage from "./pages/admin/AdminLoginPage"
import InspectorDashboard from "./pages/inspector/InspectorDashboard"
import InspectorLoginPage from "./pages/inspector/InspectorLoginPage"
import ProtectedRoute from "./routes/ProtectedRoute"
import AdminDashboard from "./pages/admin/AdminDashboard"
import UserDashboard from "./pages/user/UserDashboard"


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/inspector/login" element={<InspectorLoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>} />
        <Route path="/inspector/dashboard" element={<ProtectedRoute role="inspector" >
          <InspectorDashboard />
        </ProtectedRoute>} />
        <Route path="/user/dashboard" element={<ProtectedRoute role="user" >
          <UserDashboard />
        </ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App