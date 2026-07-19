import { apiFetch } from './apiClient.js';

export async function loginApi(credentials) {
  return await apiFetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
}

export async function getAdminMeApi() {
  return await apiFetch('/api/admin-users/me');
}

export async function getMeApi() {
  return await getAdminMeApi();
}
