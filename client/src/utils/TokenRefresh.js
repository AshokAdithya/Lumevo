import { api } from "./useAxiosInstance";

const refreshAccessToken = async () => {
  try {
    await api.post("/refresh-token", {}); // backend sets the cookie
    return true;
  } catch (error) {
    console.error("Unable to refresh token:", error);
    return false;
  }
};

export { refreshAccessToken };
