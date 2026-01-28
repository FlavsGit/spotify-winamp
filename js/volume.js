import * as api from './spotify-api.js';
import { SKIN_PATH } from './constants.js';

export class VolumeSlider {
  constructor(containerEl, thumbEl, playerState) {
    this.container = containerEl;
    this.thumb = thumbEl;
    this.state = playerState;
    this._dragging = false;
    this._debounceTimer = null;
    this._sliderWidth = 68;
    this._thumbWidth = 14;
    this._range = this._sliderWidth - this._thumbWidth;

    this.container.addEventListener('mousedown', (e) => {
      this._dragging = true;
      this.thumb.classList.add('pressed');
      this._handleMove(e);
    });

    document.addEventListener('mousemove', (e) => {
      if (!this._dragging) return;
      this._handleMove(e);
    });

    document.addEventListener('mouseup', () => {
      if (!this._dragging) return;
      this._dragging = false;
      this.thumb.classList.remove('pressed');
      // Final API call
      this._setVolume(this._currentPercent);
    });
  }

  _handleMove(e) {
    const rect = this.container.getBoundingClientRect();
    const scale = parseFloat(getComputedStyle(this.container.closest('#player')).getPropertyValue('--scale') || '2');
    const x = (e.clientX - rect.left) / scale;
    const percent = Math.max(0, Math.min(100, (x / this._sliderWidth) * 100));
    this._currentPercent = percent;
    this._updateThumbPosition(percent);
    this._updateBackground(percent);

    // Debounced API call while dragging
    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => this._setVolume(percent), 200);
  }

  _setVolume(percent) {
    api.setVolume(Math.round(percent)).catch(e => console.error('Volume error:', e));
    this.state.setLocalState({ volumePercent: Math.round(percent) });
  }

  _updateThumbPosition(percent) {
    const pos = (percent / 100) * this._range;
    this.thumb.style.left = `${Math.round(pos)}px`;
  }

  _updateBackground(percent) {
    // Select the correct frame from the 28 volume bar frames
    const frameIndex = Math.round((percent / 100) * 27);
    const frameY = frameIndex * 13;
    this.container.style.backgroundPosition = `0px -${frameY}px`;
  }

  update(volumePercent) {
    if (this._dragging) return;
    this._updateThumbPosition(volumePercent);
    this._updateBackground(volumePercent);
  }
}
