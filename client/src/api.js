const API_BASE = '/api';
const TOKEN_KEY = 'meridian.api.token';

export function getApiToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setApiToken(token) {
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const token = getApiToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success !== true) {
    const error = new Error(payload.error || `API request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

export async function login(email, password) {
  const result = await apiRequest('/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setApiToken(result.data.token);
  return result.data.user;
}

export async function updateProfile(profile) {
  const result = await apiRequest('/v1/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(profile),
  });
  setApiToken(result.data.token);
  return result.data.user;
}

export async function logout() {
  setApiToken(null);
}
