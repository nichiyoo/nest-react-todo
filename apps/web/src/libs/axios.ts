import axios from 'axios';

declare global {
  interface ImportMeta {
    env: Record<string, string | undefined>;
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const instance = axios.create({
  baseURL: API_BASE_URL,
});

export default instance;
