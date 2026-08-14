// frontend/src/lib/api.js
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

  try {
    const response = await fetch(`${API_URL}${path}`, { 
      ...options, 
      headers,
      credentials: 'include'  // ✅ Include credentials for CORS
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // ✅ Enhanced error messages
      const errorMsg = data.message || `Request failed (${response.status})`;
      console.error(`API Error at ${path}:`, {
        status: response.status,
        message: errorMsg,
        data
      });
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`Fetch error for ${path}:`, err.message);
    
    // ✅ Distinguish between network and server errors
    if (err instanceof TypeError) {
      throw new Error('नेटवर्क त्रुटि। इंटरनेट कनेक्शन जाँचें या API सर्वर जाँचें।');
    }
    throw err;
  }
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
