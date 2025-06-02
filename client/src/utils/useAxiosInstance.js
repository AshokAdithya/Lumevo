import axios from "axios";
import { fetchCsrfToken } from "./GetCsrfToken";

const server = "http://localhost:8080/api";

export const api = axios.create({
  baseURL: server,
  withCredentials: true, // needed to send cookies
});

api.interceptors.request.use(async (config) => {
  const token = await fetchCsrfToken();
  if (token) {
    config.headers["X-CSRF-Token"] = token;
  }
  return config;
});
