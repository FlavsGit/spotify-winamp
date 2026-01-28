import { CLIENT_ID, REDIRECT_URI, SCOPES, SPOTIFY_AUTH_URL, SPOTIFY_TOKEN_URL } from './constants.js';

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, v => chars[v % chars.length]).join('');
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

function base64urlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function redirectToSpotifyAuth() {
  const verifier = generateRandomString(64);
  const challenge = base64urlEncode(await sha256(verifier));
  sessionStorage.setItem('code_verifier', verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: SCOPES,
  });

  window.location.href = `${SPOTIFY_AUTH_URL}?${params}`;
}

export async function handleCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) return false;

  const verifier = sessionStorage.getItem('code_verifier');
  if (!verifier) return false;

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: verifier,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    console.error('Token exchange failed:', response.status);
    return false;
  }

  const data = await response.json();
  storeTokens(data);
  sessionStorage.removeItem('code_verifier');

  // Clean URL
  window.history.replaceState({}, document.title, REDIRECT_URI);
  return true;
}

function storeTokens(data) {
  localStorage.setItem('spotify_access_token', data.access_token);
  localStorage.setItem('spotify_refresh_token', data.refresh_token);
  localStorage.setItem('spotify_expires_at', String(Date.now() + data.expires_in * 1000));
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  if (!refreshToken) {
    logout();
    return null;
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    console.error('Token refresh failed:', response.status);
    logout();
    return null;
  }

  const data = await response.json();
  storeTokens(data);
  return data.access_token;
}

export async function getValidToken() {
  const expiresAt = parseInt(localStorage.getItem('spotify_expires_at') || '0');
  // Refresh if within 60 seconds of expiry
  if (Date.now() > expiresAt - 60000) {
    return refreshAccessToken();
  }
  return localStorage.getItem('spotify_access_token');
}

export function isAuthenticated() {
  return !!localStorage.getItem('spotify_access_token');
}

export function logout() {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_expires_at');
}
