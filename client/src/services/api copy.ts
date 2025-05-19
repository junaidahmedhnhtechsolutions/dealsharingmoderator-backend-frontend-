import axios from "axios";

const API = axios.create({
  baseURL: "https://dealsharingapi.dev-nuh.xyz/api", // Change this to your API base URL
  // baseURL: "https://dealsharingapi.dev-nuh.xyz/api", // Change this to your API base URL
  // headers: {
  //   "Content-Type": "application/json",
  // },
  // withCredentials: false, // If you need to send cookies with requests
  // // withCredentials: true, // If you need to send cookies with requests
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle Unauthorized Access
      if (error.response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
        // Redirect to login or handle logout
      }
      return Promise.reject(error.response.data);
    } else {
      console.error("Network Error!", error);
      return Promise.reject({ message: "Network Error" });
    }
  }
);

export default API;
