import axios from "axios";

const api = axios.create({
  // Proxy
  baseURL: '/api'  
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { api };