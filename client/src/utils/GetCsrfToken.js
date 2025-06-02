import axios from "axios";

let csrfToken = null;

export const fetchCsrfToken = async () => {
  if (csrfToken) return csrfToken;

  const response = await axios.get("http://localhost:8080/api/csrf-token", {
    withCredentials: true,
  });
  csrfToken = response.data.csrfToken;
  return csrfToken;
};
