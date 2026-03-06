import apiClient from "../../services/apiClient";

import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from "../../store/auth.slice";

import { setBusiness, clearBusiness } from "../../store/business.slice";

/**
 * LOGIN
 */
export const loginUser = (formData) => async (dispatch) => {
  try {
    dispatch(loginStart());

    // login request
    const response = await apiClient.post("/auth/login", formData);
    const { token, user } = response.data;

    // persist token
    localStorage.setItem("token", token);

    //  set axios auth immediately
    apiClient.defaults.headers.common.Authorization =
      `Bearer ${token}`;

    // update auth state
    dispatch(
      loginSuccess({
        user,
        token,
      })
    );

    // load business if exists
    try {
      const businessRes = await apiClient.get("/business/my");
      dispatch(setBusiness(businessRes.data));
    } catch (err) {
      // 404 = onboarding state (no business yet)
      if (err.response?.status !== 404) {
        console.error(err);
      }
    }

  } catch (error) {
    dispatch(
      loginFailure(
        error.response?.data?.message || "Login failed"
      )
    );
  }
};

/**
 * REGISTER
 */
export const registerUser = (formData) => async (dispatch) => {
  try {
    dispatch(loginStart());

    const response = await apiClient.post("/auth/register", formData);
    const { token, user } = response.data;

    // persist token
    localStorage.setItem("token", token);

    //  sync axios auth
    apiClient.defaults.headers.common.Authorization =
      `Bearer ${token}`;

    dispatch(
      loginSuccess({
        user,
        token,
      })
    );

    // try loading business
    try {
      const businessRes = await apiClient.get("/business/me");
      dispatch(setBusiness(businessRes.data));
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error(err);
      }
    }

  } catch (error) {
    dispatch(
      loginFailure(
        error.response?.data?.message ||
        "Registration failed"
      )
    );
  }
};

/**
 * LOGOUT
 */
export const logoutUser = () => (dispatch) => {
  // remove persisted session
  localStorage.removeItem("token");
  localStorage.removeItem("business");

  // remove axios auth header
  delete apiClient.defaults.headers.common.Authorization;

  // reset redux
  dispatch(logout());
  dispatch(clearBusiness());
};