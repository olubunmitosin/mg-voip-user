import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_BACKEND_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
export default axiosInstance;
