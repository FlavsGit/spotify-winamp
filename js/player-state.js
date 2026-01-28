import { getPlaybackState } from './spotify-api.js';
import { POLL_PLAYING, POLL_PAUSED, POLL_NO_DEVICE } from './constants.js';

export class PlayerState extends EventTarget {
  constructor() {
    super();
    this.state = {
      isPlaying: false,
      trackName: '',
      artistName: '',
      albumName: '',
      albumArtUrl: '',
      durationMs: 0,
      progressMs: 0,
      volumePercent: 50,
      shuffleState: false,
      repeatState: 'off',
      deviceName: '',
      deviceId: '',
      trackId: '',
    };
    this._lastPollTime = 0;
    this._lastProgressMs = 0;
    this._pollTimer = null;
    this._interpTimer = null;
  }

  async start() {
    await this._poll();
    this._startInterpolation();
  }

  stop() {
    clearTimeout(this._pollTimer);
    cancelAnimationFrame(this._interpTimer);
  }

  async _poll() {
    try {
      const data = await getPlaybackState();
      if (data) {
        this._updateFromApi(data);
      } else {
        // No active device
        this._updateState({ isPlaying: false, deviceName: '', deviceId: '' });
      }
    } catch (e) {
      console.error('Poll error:', e);
    }

    const interval = this.state.deviceId
      ? (this.state.isPlaying ? POLL_PLAYING : POLL_PAUSED)
      : POLL_NO_DEVICE;

    this._pollTimer = setTimeout(() => this._poll(), interval);
  }

  _updateFromApi(data) {
    const track = data.item;
    const newState = {
      isPlaying: data.is_playing,
      trackName: track ? track.name : '',
      artistName: track ? track.artists.map(a => a.name).join(', ') : '',
      albumName: track ? track.album.name : '',
      albumArtUrl: track ? (track.album.images[1]?.url || track.album.images[0]?.url || '') : '',
      durationMs: track ? track.duration_ms : 0,
      progressMs: data.progress_ms || 0,
      volumePercent: data.device ? data.device.volume_percent : 50,
      shuffleState: data.shuffle_state,
      repeatState: data.repeat_state,
      deviceName: data.device ? data.device.name : '',
      deviceId: data.device ? data.device.id : '',
      trackId: track ? track.id : '',
    };
    this._lastPollTime = Date.now();
    this._lastProgressMs = newState.progressMs;
    this._updateState(newState);
  }

  _updateState(updates) {
    const prev = { ...this.state };
    Object.assign(this.state, updates);

    // Fire specific change events
    if (prev.trackId !== this.state.trackId || prev.trackName !== this.state.trackName) {
      this._emit('trackchange');
    }
    if (prev.isPlaying !== this.state.isPlaying) {
      this._emit('playstatechange');
    }
    if (prev.volumePercent !== this.state.volumePercent) {
      this._emit('volumechange');
    }
    if (prev.shuffleState !== this.state.shuffleState) {
      this._emit('shufflechange');
    }
    if (prev.repeatState !== this.state.repeatState) {
      this._emit('repeatchange');
    }
    this._emit('statechange');
  }

  _startInterpolation() {
    const tick = () => {
      if (this.state.isPlaying && this._lastPollTime > 0) {
        const elapsed = Date.now() - this._lastPollTime;
        const interpolated = Math.min(
          this._lastProgressMs + elapsed,
          this.state.durationMs
        );
        // Update progressMs without triggering full state change
        this.state.progressMs = interpolated;
      }
      this._emit('progress');
      this._interpTimer = requestAnimationFrame(tick);
    };
    this._interpTimer = requestAnimationFrame(tick);
  }

  _emit(type) {
    this.dispatchEvent(new CustomEvent(type, { detail: this.state }));
  }

  // Called when user performs an action to immediately update local state
  // without waiting for next poll
  setLocalState(updates) {
    Object.assign(this.state, updates);
    if ('progressMs' in updates) {
      this._lastProgressMs = updates.progressMs;
      this._lastPollTime = Date.now();
    }
    this._emit('statechange');
  }
}
