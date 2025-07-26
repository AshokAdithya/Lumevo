import axios from "axios";

let csrfToken = null;

export const fetchCsrfToken = async () => {
  if (csrfToken) return csrfToken;

  const response = await axios.get(
    `${process.env.REACT_APP_API_SERVER}/api/csrf-token`,
    {
      withCredentials: true,
    }
  );
  csrfToken = response.data.csrfToken;
  return csrfToken;
};
