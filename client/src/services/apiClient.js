import axios from "axios";
import  store  from "../store";// access redux outside React
import { setLoading } from "../store/app.slice";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST =================
// runs before EVERY api call
apiClient.interceptors.request.use(
  (config) => {
     console.log("API REQUEST:", config.method, config.url);
    //  start global loader
    store.dispatch(setLoading(true));

    // attach auth token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // attach business context (which company is active)
    const business = localStorage.getItem("business");
    if (business) {
      const parsed = JSON.parse(business);
      config.headers["x-business-id"] = parsed._id;
    }

    return config;
  },
  (error) => {
    store.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);

// ================= RESPONSE =================
// runs after EVERY api response
apiClient.interceptors.response.use(
  (response) => {
    // stop loader
    store.dispatch(setLoading(false));
    return response;
  },
  (error) => {
    store.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);

export default apiClient;