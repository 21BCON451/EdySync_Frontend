import axios from 'axios';

// Create an Axios instance with your backend base URL
const api = axios.create({
  baseURL: 'https://edusyncwebapi20250619155635-dtdshzeucsa8hca9.centralindia-01.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor to attach token before every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token attached:", token);
    } else {
      console.warn("⚠️ No token found in localStorage");
    }

    return config;
  },
  error => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Optional: global response logger
api.interceptors.response.use(
  response => response,
  error => {
    console.error("❌ API Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;