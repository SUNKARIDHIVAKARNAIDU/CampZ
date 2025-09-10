import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
baseURL: process.env.REACT_APP_API_URL,
headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
(config) => {
const token = localStorage.getItem('token');
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
},
(error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
(response) => response,
async (error) => {
if (error.response?.status === 401 && !error.config._retry) {
error.config._retry = true;
try {
const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, {
refreshToken: localStorage.getItem('refreshToken'),
});
localStorage.setItem('token', data.token);
error.config.headers.Authorization = `Bearer ${data.token}`;
return axiosInstance(error.config);
} catch (refreshError) {
toast.error('Session expired. Please log in again.');
localStorage.clear();
window.location.href = '/login';
return Promise.reject(refreshError);
}
}
toast.error(error.response?.data?.message || 'An error occurred');
return Promise.reject(error);
}
);

export default axiosInstance;