import { SPOTIFY_API_BASE } from './constants.js';
import { getValidToken, refreshAccessToken, logout } from './auth.js';

async function apiRequest(endpoint, method = 'GET', body = null, retried = false) {
  const token = await getValidToken();
  if (!token) {
    logout();
    window.location.reload();
    return null;
  }

  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, options);

  // No content (success)
  if (response.status === 204) return null;

  // Unauthorized - try refresh once
  if (response.status === 401 && !retried) {
    await refreshAccessToken();
    return apiRequest(endpoint, method, body, true);
  }

  // Rate limited
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10);
    await new Promise(r => setTimeout(r, retryAfter * 1000));
    return apiRequest(endpoint, method, body, retried);
  }

  if (!response.ok) {
    throw new Error(`Spotify API ${response.status}: ${endpoint}`);
  }

  return response.json();
}

// Playback state
export function getPlaybackState() {
  return apiRequest('/me/player');
}

export function getCurrentlyPlaying() {
  return apiRequest('/me/player/currently-playing');
}

export function getAvailableDevices() {
  return apiRequest('/me/player/devices');
}

export function getQueue() {
  return apiRequest('/me/player/queue');
}

// Playback control
export function play(deviceId) {
  const q = deviceId ? `?device_id=${deviceId}` : '';
  return apiRequest(`/me/player/play${q}`, 'PUT');
}

export function pause(deviceId) {
  const q = deviceId ? `?device_id=${deviceId}` : '';
  return apiRequest(`/me/player/pause${q}`, 'PUT');
}

export function skipToNext(deviceId) {
  const q = deviceId ? `?device_id=${deviceId}` : '';
  return apiRequest(`/me/player/next${q}`, 'POST');
}

export function skipToPrevious(deviceId) {
  const q = deviceId ? `?device_id=${deviceId}` : '';
  return apiRequest(`/me/player/previous${q}`, 'POST');
}

export function seekToPosition(positionMs) {
  return apiRequest(`/me/player/seek?position_ms=${Math.round(positionMs)}`, 'PUT');
}

export function setVolume(volumePercent) {
  return apiRequest(`/me/player/volume?volume_percent=${Math.round(volumePercent)}`, 'PUT');
}

export function setRepeatMode(state) {
  // state: 'off', 'context', 'track'
  return apiRequest(`/me/player/repeat?state=${state}`, 'PUT');
}

export function toggleShuffle(state) {
  return apiRequest(`/me/player/shuffle?state=${state}`, 'PUT');
}

export function transferPlayback(deviceId) {
  return apiRequest('/me/player', 'PUT', { device_ids: [deviceId], play: true });
}
