import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://maxrep-back.onrender.com/api',
});

export default axiosInstance;