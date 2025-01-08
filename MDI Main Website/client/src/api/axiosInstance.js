import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

axiosInstance.interceptors.request.use(config=>{
    const token = sessionStorage.getItem('token')

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, (err) => Promise.reject)

export default axiosInstance;