import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    const response = await axios.post(
      "http://localhost:8080/api/refresh-token",
      {
        refreshToken: refreshToken,
      }
    );

    localStorage.setItem("accessToken", response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Unable to refresh token:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return null;
  }
};

export { axiosInstance, refreshAccessToken };
