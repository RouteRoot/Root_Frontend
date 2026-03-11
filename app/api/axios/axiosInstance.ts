import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://3.106.248.91:8080/api"
    : "/proxy";

export const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
 