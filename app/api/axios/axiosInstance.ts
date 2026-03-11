import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://3.106.248.91:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});
