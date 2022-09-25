import axios from "axios";
import { URL_USER_SVC_REFRESH_TOKEN } from "./configs";
import { jwtDecode } from "./util/auth";

const axiosApiInstance = axios.create();

const refreshAccessToken = async (cookies, setCookie) => {
  const refresh_token = cookies.refresh_token;
  if (!refresh_token) return;

  const res = await axios.post(URL_USER_SVC_REFRESH_TOKEN, {username: jwtDecode(refresh_token).username}, {
    headers: {
        Authorization: 'Bearer ' + refresh_token
    }
  })

  if (!res.data) return;

  // set cookies
  setCookie("access_token", res.data.accessToken);
  setCookie("refresh_token", res.data.refreshToken);
  return res.data.accessToken;
}

export const initAxiosApiInstance = (cookies, setCookie) => {
  // Request interceptor for API calls
  axiosApiInstance.interceptors.request.use(
    async config => {
      config.headers = { 
        'Authorization': `Bearer ${cookies.access_token}`,
      }
      return config;
    },
    error => {
      Promise.reject(error)
  });
  
  // Response interceptor for API calls
  axiosApiInstance.interceptors.response.use((response) => {
    return response
  }, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await refreshAccessToken(cookies, setCookie);            
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
      return axiosApiInstance(originalRequest);
    }
    return Promise.reject(error);
  });
}

export default axiosApiInstance;
