import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/UserSlice";
import { setUnauthenticated } from "../redux/AuthSlice";
import { useNavigate } from "react-router-dom";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearUser());
    dispatch(setUnauthenticated());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  }, [dispatch, navigate]);

  return <div>Logging out...</div>;
}

export default Logout;
