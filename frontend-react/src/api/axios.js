// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =======================
// RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // If token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;