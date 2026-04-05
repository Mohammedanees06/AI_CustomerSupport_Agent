import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "../store/auth.slice";
import AppRoutes from "./routes";
import { setBusiness } from "../store/business.slice";
import apiClient from "../services/apiClient";
import {Loader} from "../components/common/Loader";

export default function App() {
  const dispatch = useDispatch();

  const { initialized } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.app);
  const theme = useSelector((state) => state.app.theme);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(logout());
      return;
    }

   apiClient.get("/auth/me")
  .then(async (res) => {
    dispatch(loginSuccess({
      user: res.data.user,
      token,
    }));

    // ✅ Skip business fetch for admin
    if (res.data.user.role === "admin") return;

    try {
      const businessRes = await apiClient.get("/business/my");
      dispatch(setBusiness(businessRes.data));
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error(err);
      }
    }
  })
  .catch(() => {
    dispatch(logout());
  });
  }, [dispatch]);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-zinc-950 ${theme === "dark" ? "dark" : ""}`}>
    {loading && <Loader />}
    <AppRoutes />
  </div>
  );
}