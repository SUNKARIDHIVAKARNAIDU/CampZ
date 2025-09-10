import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);

useEffect(() => {
const token = localStorage.getItem('token');
if (token) {
axiosInstance.get('/api/auth/me').then(({ data }) => setUser(data.user)).catch(() => localStorage.clear());
}
}, []);

const login = async (email, password) => {
const { data } = await axiosInstance.post('/api/auth/login', { email, password });
localStorage.setItem('token', data.token);
localStorage.setItem('refreshToken', data.refreshToken);
setUser(data.user);
toast.success('Login successful');
};

const logout = () => {
localStorage.clear();
setUser(null);
toast.info('Logged out');
window.location.href = '/login';
};

return (
<AuthContext.Provider value={{ user, login, logout }}>
{children}
</AuthContext.Provider>
);
};