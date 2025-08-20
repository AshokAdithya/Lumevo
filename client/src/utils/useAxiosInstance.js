import axios from "axios";
import { fetchCsrfToken } from "./GetCsrfToken";

const server = `${process.env.REACT_APP_API_SERVER}/api`;

export const api = axios.create({
  baseURL: server,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const token = await fetchCsrfToken();
  if (token) {
    config.headers["X-CSRF-Token"] = token;
  }
  return config;
});
