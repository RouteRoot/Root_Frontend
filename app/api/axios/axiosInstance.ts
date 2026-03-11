import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://13.239.246.72:8080/api"
    : "api/proxy";

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

// import axios from "axios";

// const baseURL = "http://13.239.246.72:8080/api";

// export const axiosInstance = axios.create({
//   baseURL,
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });