export const getBaseURL = () => {
  return typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || '/api/proxy' // 클라이언트
    : process.env.SERVER_API_URL || 'https://sp-globalnomad-api.vercel.app/16-2'; // SSR
};

export const BASE_URL = getBaseURL();
