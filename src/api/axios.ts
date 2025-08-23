import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://sp-globalnomad-api.vercel.app';
const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? '16-2';

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/${TEAM_ID}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
