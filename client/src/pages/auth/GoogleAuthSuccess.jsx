import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginSuccess } from "../../store/auth.slice";

export default function GoogleAuthSuccess() { // when user logs in with google
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);

      dispatch(
        loginSuccess({ // if backend returns success (200).
          user: null,
          token,
        })
      );

      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, searchParams]);

  return null;
}