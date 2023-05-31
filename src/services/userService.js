import { createAxiosInstance, createPublicAxiosInstance } from "../config/axiosInstance";
const axiosInstance = createAxiosInstance(process.env.REACT_APP_SERVICE_API, "/api/");
const publicAxiosInstance = createPublicAxiosInstance(process.env.REACT_APP_SERVICE_API, "/api/");

export const getUserData = () => {
  return axiosInstance.post(`user/getUserData`);
};

export const getUsersFullName = userIdArr => {
  return axiosInstance.post(`user/getUsersNames`, { users: userIdArr });
};

export const loginRequest = user => {
  return publicAxiosInstance.post(`login`, user);
}