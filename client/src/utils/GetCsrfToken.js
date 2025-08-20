import axios from "axios";

let csrfToken = null;

const server = `${process.env.REACT_APP_API_SERVER}/api`;

export const fetchCsrfToken = async () => {
  if (csrfToken) return csrfToken;

  const response = await axios.get(`${server}/csrf-token`, {
    withCredentials: true,
  });
  csrfToken = response.data.csrfToken;
  return csrfToken;
};
