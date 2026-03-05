import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import ChatPage from "../pages/dashboard/ChatPage";
import TicketsPage from "../pages/dashboard/TicketsPage";
import AnalyticsPage from "../pages/dashboard/AnalyticsPage";
import EmbedPage from "../pages/dashboard/EmbedPage";
import GoogleAuthSuccess from "../pages/auth/GoogleAuthSuccess";

import ProtectedRoute from "../routes/ProtectedRoute";
import BusinessGuard from "../routes/BusinessGuard";
import DashboardLayout from "../layouts/DashboardLayout";
import BusinessSetup from "../layouts/BusinessSetup";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

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
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="knowledge" element={<Dashboard />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="embed" element={<EmbedPage />} />
        </Route>

        <Route
          path="/business-setup"
          element={
            <ProtectedRoute>
              <BusinessSetup />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}