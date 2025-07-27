import axios from "axios";
import { getUserStorage } from "./CustomeHelper";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://codeyiizen.com/dev/trustamaster/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(async function (config) {
  const token: any = getUserStorage();
  if (token?.token) {
    config.headers.Authorization = `Bearer ${token?.token}`;
  }
  return config;
});
api.interceptors.response.use(function (response) {
  return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
export default api;
