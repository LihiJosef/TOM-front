import { createAxiosInstance } from "../config/axiosInstance";
const axiosInstance = createAxiosInstance(process.env.REACT_APP_SERVICE_API, "/api/");

export const checkLogin = user => {
  return axiosInstance.post(`login`, user);
};
