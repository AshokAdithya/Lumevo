import axios from "axios";
import { api } from "./useAxiosInstance";

const refreshAccessToken = async () => {
  // const refreshToken = localStorage.getItem("refreshToken");

  try {
    // const response = await axios.post(
    //   "http://localhost:8080/api/refresh-token",
    //   {
    //     refreshToken: refreshToken,
    //   }
    // );

    const response = await api.post("/refresh-token", {});

    return true;
  } catch (error) {
    console.error("Unable to refresh token:", error);

    return false;
  }
};

export { refreshAccessToken };
