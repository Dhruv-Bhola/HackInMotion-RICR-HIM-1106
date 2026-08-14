const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kisanToken');
}

export function setAuth(token, user) {
  localStorage.setItem('kisanToken', token);
  localStorage.setItem('kisanUser', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('kisanToken');
  localStorage.removeItem('kisanUser');
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('kisanUser');
  return raw ? JSON.parse(raw) : null;
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export async function registerUser(payload) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function loginUser(payload) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function analyzeCropHealth(imageFile, crop) {
  const form = new FormData();
  form.append('image', imageFile);
  form.append('crop', crop);

  return apiFetch('/api/crop-health/analyze', {
    method: 'POST',
    body: form
  });
}

export async function getScanHistory() {
  return apiFetch('/api/crop-health/history');
}
