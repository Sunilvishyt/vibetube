import axios from "axios";

// Get the URL from the environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
