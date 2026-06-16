import axios from "axios";

const API = axios.create({
  // baseURL: "http://127.0.0.1:8000/api/",`
  baseURL: "http://192.168.100.101:8000/api/",
  // baseURL: "http://98.82.139.187/api/",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Token ${token}`;
  }
  return req;
});

export default API;
