import apiClient, { authHeaders } from './apiClient.js';

export async function shortenUrl(token, originalUrl) {
  const { data } = await apiClient.post('/url/shorten', { originalUrl }, authHeaders(token));
  return data;
}

export async function getUserUrls(token) {
  const { data } = await apiClient.get('/url/user', authHeaders(token));
  return data.data || [];
}

export async function deleteUrl(token, urlId) {
  const { data } = await apiClient.delete(`/url/${urlId}`, authHeaders(token));
  return data;
}