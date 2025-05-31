import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // gunakan env agar mudah pindah server
});

export default AxiosInstance;