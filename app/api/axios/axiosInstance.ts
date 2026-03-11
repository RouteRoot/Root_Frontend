import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://3.106.248.91:8080/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
