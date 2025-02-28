import axios from 'axios';

// Replace with your Ngrok backend URL
const API_URL = "https://95ee-2409-40c1-1000-def2-64cc-ff58-402d-3776.ngrok-free.app";

const api = axios.create({
  baseURL: API_URL, // Use the full Ngrok URL instead of relative '/api'
});

export const loginUser = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const fetchMenuItems = async () => {
  const response = await api.get('/menu');
  return response.data;
};
