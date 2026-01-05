import axios from 'axios';

const BASE_URL = 'http://localhost:15026'; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const getProducts = async () => {
  try {
    const response = await api.get('/api/products');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default api;