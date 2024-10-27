import axios from "axios";
import { logoutUser } from "../redux/slices/authSlice";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setupAxiosInterceptors = (dispatch) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error("Expired token:", error.response.data.message);
        localStorage.removeItem("authToken");
        dispatch(logoutUser());
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
