import axios from "axios";

const injectTokenInRequest = () => config => {
  console.log(localStorage.getItem("token"));
  config.headers = {
    authorization: localStorage.getItem("token"),
    "Content-Type": "application/json"
  };

  return config;
}

export const createAxiosInstance = (service, prefix) => {
  const instance = axios.create({
    baseURL: service + prefix
  });
  const injectTokenFunc = injectTokenInRequest(service);
  instance.interceptors.request.use(injectTokenFunc);

  return instance;
};

export const createPublicAxiosInstance = (service, prefix) => {
  const instance = axios.create({
    baseURL: service + prefix
  });

  return instance;
}