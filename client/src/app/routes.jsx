import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import ChatPage from "../pages/dashboard/ChatPage";
import GoogleAuthSuccess from "../pages/auth/GoogleAuthSuccess";

import ProtectedRoute from "../routes/ProtectedRoute";
import BusinessGuard from "../routes/BusinessGuard";
import DashboardLayout from "../layouts/DashboardLayout";
import BusinessSetup from "../layouts/BusinessSetup";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

        {/* protected dashboard layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <BusinessGuard>
                <DashboardLayout />
              </BusinessGuard>
            </ProtectedRoute>
          }
        >
          {/* index page */}
          <Route index element={<Dashboard />} />

          {/* nested pages */}
          <Route path="chat" element={<ChatPage />} />
        </Route>

        <Route
          path="/business-setup"
          element={
            <ProtectedRoute>
              <BusinessSetup />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
