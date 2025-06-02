// import { useEffect, useState } from "react";
// import { refreshAccessToken, axiosInstance } from "../utils/TokenRefresh";
// import { useDispatch, useSelector } from "react-redux";
// import { clearUser, setUser } from "../redux/UserSlice";
// import { setAuthenticated, setUnauthenticated } from "../redux/AuthSlice";
// import { useNavigate, useLocation } from "react-router-dom";

// const useAuth = () => {
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user.user);
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchData = async () => {
//       const accessToken = localStorage.getItem("accessToken");
//       const refreshToken = localStorage.getItem("refreshToken");

//       if (!refreshToken) {
//         localStorage.removeItem("accessToken");
//         dispatch(clearUser());
//         dispatch(setUnauthenticated());
//         if (location.pathname !== "/") {
//           navigate("/");
//         }
//         return;
//       }

//       if (!accessToken) {
//         const newAccessToken = await refreshAccessToken();
//         if (newAccessToken) {
//           fetchUserData(newAccessToken);
//         } else {
//           if (location.pathname !== "/") {
//             navigate("/");
//           }
//         }
//       } else {
//         try {
//           const response = await axiosInstance.get(`/user/${accessToken}`);
//           dispatch(setAuthenticated());
//           dispatch(setUser(response.data.user));
//           setLoading(false);
//         } catch (error) {
//           if (error.response && error.response.status === 403) {
//             const newAccessToken = await refreshAccessToken();
//             if (newAccessToken) {
//               fetchUserData(newAccessToken);
//             } else {
//               if (location.pathname !== "/") {
//                 navigate("/");
//               }
//             }
//           } else {
//             console.error("An error occurred:", error);
//             dispatch(setUnauthenticated());
//             dispatch(clearUser());
//             if (location.pathname !== "/") {
//               navigate("/");
//             }
//           }
//         }
//       }
//     };

//     fetchData();
//   }, [navigate, location.pathname]);

//   const fetchUserData = async (accessToken) => {
//     try {
//       const response = await axiosInstance.get(`/user/${accessToken}`);
//       dispatch(setAuthenticated());
//       dispatch(setUser(response.data.user));
//       setLoading(false);
//     } catch (error) {
//       console.error("An error occurred:", error);
//       dispatch(setUnauthenticated());
//       dispatch(clearUser());
//       if (location.pathname !== "/") {
//         navigate("/");
//       }
//     }
//   };

//   return { loading, user, isAuthenticated };
// };

// export default useAuth;

// import { useEffect, useState, useCallback } from "react";
// import { refreshAccessToken } from "../utils/TokenRefresh";
// import { useDispatch, useSelector } from "react-redux";
// import { clearUser, setUser } from "../redux/UserSlice";
// import { setAuthenticated, setUnauthenticated } from "../redux/AuthSlice";
// import { useNavigate, useLocation } from "react-router-dom";
// import { api } from "../utils/useAxiosInstance";

// const useAuth = () => {
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user.user);
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const location = useLocation();

//   const fetchUserData = useCallback(async () => {
//     const response = await api.get("/user/access");
//     return response.data.user;
//   }, []);

//   useEffect(() => {
//     const authenticate = async () => {
//       try {
//         const userData = await fetchUserData();
//         dispatch(setAuthenticated());
//         dispatch(setUser(userData));
//         setLoading(false);
//       } catch (error) {
//         console.log("Auth error response:", error.response);
//         if (error.response?.status === 401 || error.response?.status === 403) {
//           try {
//             const refreshSuccess = await refreshAccessToken();
//             if (refreshSuccess) {
//               const userData = await fetchUserData();
//               dispatch(setAuthenticated());
//               dispatch(setUser(userData));
//               setLoading(false);
//             } else {
//               dispatch(setUnauthenticated());
//               dispatch(clearUser());
//               setLoading(false);
//             }
//           } catch (refreshError) {
//             dispatch(setUnauthenticated());
//             dispatch(clearUser());
//             setLoading(false);
//             if (location.pathname !== "/") {
//               navigate("/");
//             }
//           }
//         } else {
//           dispatch(setUnauthenticated());
//           dispatch(clearUser());
//           setLoading(false);
//           if (location.pathname !== "/") {
//             navigate("/");
//           }
//         }
//       }
//     };

//     authenticate();
//   }, [fetchUserData, dispatch, navigate, location.pathname]);

//   return { loading, user, isAuthenticated };
// };

// export default useAuth;

import { useEffect, useState, useCallback } from "react";
import { refreshAccessToken } from "../utils/TokenRefresh";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "../redux/UserSlice";
import { setAuthenticated, setUnauthenticated } from "../redux/AuthSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/useAxiosInstance";
import { match } from "path-to-regexp";

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  const publicRoutePatterns = [
    "/signin",
    "/signup",
    "about-us",
    "achievements",
    "contact-us",
    "/forgot-password",
    "/",
    "insights",
    "/password-reset/:id/:token",
    "/users/:id/verify/:token",
  ];

  const fetchUserData = useCallback(async () => {
    // try {
    const response = await api.get("/user/access");
    return response.data.user;
    // } catch (error) {
    //   console.error("Fetch user error:", error);
    //   return null;
    // }
  }, []);

  const isPublicRoute = (pathname) => {
    return publicRoutePatterns.some((pattern) => match(pattern)(pathname));
  };

  const handleLogoutRedirect = () => {
    dispatch(setUnauthenticated());
    dispatch(clearUser());
    if (!isPublicRoute(location.pathname)) {
      navigate("/");
    }
  };

  useEffect(() => {
    const authenticate = async () => {
      try {
        const userData = await fetchUserData();
        if (userData) {
          dispatch(setAuthenticated());
          dispatch(setUser(userData));
        } else {
          console.log("HI");
          throw new Error("No user data returned");
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          try {
            const refreshSuccess = await refreshAccessToken();
            if (refreshSuccess) {
              const userData = await fetchUserData();
              if (userData) {
                dispatch(setAuthenticated());
                dispatch(setUser(userData));
              } else {
                handleLogoutRedirect();
              }
            } else {
              handleLogoutRedirect();
            }
          } catch {
            handleLogoutRedirect();
          }
        } else {
          handleLogoutRedirect();
        }
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, [fetchUserData, dispatch, navigate, location.pathname]);

  return { loading, user, isAuthenticated };
};

export default useAuth;
