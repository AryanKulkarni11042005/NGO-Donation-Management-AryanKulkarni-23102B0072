import axios from "axios";

// nginx proxies /store to the Spring Boot backend deployed on Tomcat.
export const apiClient = axios.create({
  baseURL: "/store",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
