import apiClient, { authHeaders } from './apiClient.js';

export async function getDashboardAnalytics(token) {
  const { data } = await apiClient.get('/analytics/dashboard', authHeaders(token));
  return data.data;
}

export async function getUrlAnalytics(token, urlId) {
  const { data } = await apiClient.get(`/analytics/url/${urlId}`, authHeaders(token));
  return data.data;
}