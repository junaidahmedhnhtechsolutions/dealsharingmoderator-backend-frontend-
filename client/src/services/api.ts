import axios from "axios";
import { ACCESS_DENIED } from "../helper/constants";
import routes from "../helper/routes";

const API = axios.create({
  baseURL: "https://dealsharingapi.dev-nuh.xyz/api",
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle server-side errors
    if (response) {
      const { status, data } = response;
      const message = data?.message;
      const isUnauthenticated = message === "Unauthenticated.";
      const isAccessDenied = status === 403 && message === ACCESS_DENIED;
      if (isAccessDenied || isUnauthenticated) {
        console.warn("User is not authorized or session expired. Logging out.");

        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = routes.signin;
        }, 3000);
      }

      return Promise.reject(response?.data); // Return the error message from server
    }

    // Handle network or unexpected errors
    console.error("Network or unexpected error occurred:", error);
    return Promise.reject({ message: "Network Error" });
  }
);

export default API;
