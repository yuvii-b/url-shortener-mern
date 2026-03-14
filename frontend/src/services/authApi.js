import apiClient, { authHeaders } from './apiClient.js';

export async function registerUser(payload) {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
}

export async function getCurrentUser(token) {
  const { data } = await apiClient.get('/auth/me', authHeaders(token));
  return data;
}