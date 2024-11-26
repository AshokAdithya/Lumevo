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

import { useEffect, useState, useCallback } from "react";
import { refreshAccessToken, axiosInstance } from "../utils/TokenRefresh";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "../redux/UserSlice";
import { setAuthenticated, setUnauthenticated } from "../redux/AuthSlice";
import { useNavigate, useLocation } from "react-router-dom";

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        setLoading(false);
        dispatch(clearUser());
        dispatch(setUnauthenticated());
        return;
      }

      if (!accessToken) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          fetchUserData(newAccessToken);
        }
      } else {
        try {
          const response = await axiosInstance.get(`/user/${accessToken}`);
          dispatch(setAuthenticated());
          dispatch(setUser(response.data.user));
          setLoading(false);
        } catch (error) {
          if (error.response && error.response.status === 403) {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              fetchUserData(newAccessToken);
            }
          } else {
            console.error("An error occurred:", error);
            setLoading(false);
            dispatch(setUnauthenticated());
            dispatch(clearUser());
          }
        }
      }
    };

    fetchData();
  }, [navigate, location.pathname]);

  // const fetchUserData = async (accessToken) => {
  //   try {
  //     const response = await axiosInstance.get(`/user/${accessToken}`);
  //     console.log(response);
  //     dispatch(setAuthenticated());
  //     dispatch(setUser(response.data.user));
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //     setLoading(false);
  //     dispatch(setUnauthenticated());
  //     dispatch(clearUser());
  //   }
  // };

  const fetchUserData = useCallback(
    async (accessToken) => {
      try {
        const response = await axiosInstance.get(`/user/${accessToken}`);
        dispatch(setAuthenticated());
        dispatch(setUser(response.data.user));
        setLoading(false);
      } catch (error) {
        console.error("An error occurred:", error);
        setLoading(false);
        dispatch(setUnauthenticated());
        dispatch(clearUser());
      }
    },
    [dispatch]
  );

  return { loading, user, isAuthenticated };
};

export default useAuth;
