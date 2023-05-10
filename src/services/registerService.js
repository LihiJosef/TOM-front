import { createAxiosInstance } from "../config/axiosInstance";
const axiosInstance = createAxiosInstance(process.env.REACT_APP_SERVICE_API, "/api/");

export const createUser = user => {
  console.log(user);
  return axiosInstance.post(`register/createUser`, user);
};
