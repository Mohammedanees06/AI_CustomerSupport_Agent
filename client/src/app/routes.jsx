import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import ChatPage from "../pages/dashboard/ChatPage";
import ProtectedRoute from "../routes/ProtectedRoute";

const router = createBrowserRouter([
    {
    path: "/",
    element: <Login />,   // Default page
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "chat",
        element: <ChatPage />,
      },
    ],
  },
]);

export default router;