import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/UserSlice";
import { setUnauthenticated } from "../redux/AuthSlice";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/useAxiosInstance";
import { toast } from "react-toastify";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const logoutFunction = async () => {
      try {
        await api.post("/auth/logout");
        dispatch(clearUser());
        dispatch(setUnauthenticated());
        toast.success("Logged out successfully!");
        navigate("/", { replace: true });
      } catch (err) {
        console.error(err);
        toast.error("Failed to logout!");
        navigate("/", { replace: true });
      }
    };

    logoutFunction();
  }, [dispatch, navigate]);

  return null;
}

export default Logout;
