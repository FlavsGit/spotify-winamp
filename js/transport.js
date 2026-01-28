import * as api from './spotify-api.js';

export class Transport {
  constructor(elements, playerState) {
    this.state = playerState;
    this._seekDragging = false;
    this._seekThumb = elements.seekThumb;
    this._seekBar = elements.seekBar;

    // Transport buttons
    elements.prevBtn.addEventListener('mousedown', () => this._pressBtn(elements.prevBtn));
    elements.prevBtn.addEventListener('mouseup', () => this._releaseBtn(elements.prevBtn));
    elements.prevBtn.addEventListener('mouseleave', () => this._releaseBtn(elements.prevBtn));
    elements.prevBtn.addEventListener('click', () => this._prev());

    elements.playBtn.addEventListener('mousedown', () => this._pressBtn(elements.playBtn));
    elements.playBtn.addEventListener('mouseup', () => this._releaseBtn(elements.playBtn));
    elements.playBtn.addEventListener('mouseleave', () => this._releaseBtn(elements.playBtn));
    elements.playBtn.addEventListener('click', () => this._play());

    elements.pauseBtn.addEventListener('mousedown', () => this._pressBtn(elements.pauseBtn));
    elements.pauseBtn.addEventListener('mouseup', () => this._releaseBtn(elements.pauseBtn));
    elements.pauseBtn.addEventListener('mouseleave', () => this._releaseBtn(elements.pauseBtn));
    elements.pauseBtn.addEventListener('click', () => this._pause());

    elements.stopBtn.addEventListener('mousedown', () => this._pressBtn(elements.stopBtn));
    elements.stopBtn.addEventListener('mouseup', () => this._releaseBtn(elements.stopBtn));
    elements.stopBtn.addEventListener('mouseleave', () => this._releaseBtn(elements.stopBtn));
    elements.stopBtn.addEventListener('click', () => this._stop());

    elements.nextBtn.addEventListener('mousedown', () => this._pressBtn(elements.nextBtn));
    elements.nextBtn.addEventListener('mouseup', () => this._releaseBtn(elements.nextBtn));
    elements.nextBtn.addEventListener('mouseleave', () => this._releaseBtn(elements.nextBtn));
    elements.nextBtn.addEventListener('click', () => this._next());

    elements.ejectBtn.addEventListener('mousedown', () => this._pressBtn(elements.ejectBtn));
    elements.ejectBtn.addEventListener('mouseup', () => this._releaseBtn(elements.ejectBtn));
    elements.ejectBtn.addEventListener('mouseleave', () => this._releaseBtn(elements.ejectBtn));

    // Seek bar
    this._setupSeekBar();
  }

  _pressBtn(el) { el.classList.add('pressed'); }
  _releaseBtn(el) { el.classList.remove('pressed'); }

  async _play() {
    try {
      await api.play();
      this.state.setLocalState({ isPlaying: true });
    } catch (e) { console.error('Play error:', e); }
  }

  async _pause() {
    try {
      await api.pause();
      this.state.setLocalState({ isPlaying: false });
    } catch (e) { console.error('Pause error:', e); }
  }

  async _stop() {
    try {
      await api.pause();
      await api.seekToPosition(0);
      this.state.setLocalState({ isPlaying: false, progressMs: 0 });
    } catch (e) { console.error('Stop error:', e); }
  }

  async _next() {
    try {
      await api.skipToNext();
    } catch (e) { console.error('Next error:', e); }
  }

  async _prev() {
    try {
      await api.skipToPrevious();
    } catch (e) { console.error('Prev error:', e); }
  }

  _setupSeekBar() {
    const bar = this._seekBar;
    const thumb = this._seekThumb;
    const barWidth = 248;
    const thumbWidth = 29;
    const range = barWidth - thumbWidth;

    const getPosition = (e) => {
      const rect = bar.getBoundingClientRect();
      const scale = parseFloat(getComputedStyle(bar.closest('#player')).getPropertyValue('--scale') || '2');
      const x = (e.clientX - rect.left) / scale;
      return Math.max(0, Math.min(1, x / barWidth));
    };

    bar.addEventListener('mousedown', (e) => {
      this._seekDragging = true;
      thumb.classList.add('pressed');
      const pos = getPosition(e);
      this._updateSeekThumb(pos);
    });

    document.addEventListener('mousemove', (e) => {
      if (!this._seekDragging) return;
      const pos = getPosition(e);
      this._updateSeekThumb(pos);
    });

    document.addEventListener('mouseup', (e) => {
      if (!this._seekDragging) return;
      this._seekDragging = false;
      thumb.classList.remove('pressed');
      const pos = getPosition(e);
      const seekMs = pos * this.state.state.durationMs;
      this.state.setLocalState({ progressMs: seekMs });
      api.seekToPosition(seekMs).catch(e => console.error('Seek error:', e));
    });
  }

  _updateSeekThumb(pos) {
    const range = 248 - 29;
    this._seekThumb.style.left = `${Math.round(pos * range)}px`;
  }

  updateSeekPosition(progressMs, durationMs) {
    if (this._seekDragging || durationMs === 0) return;
    const pos = progressMs / durationMs;
    const range = 248 - 29;
    this._seekThumb.style.left = `${Math.round(pos * range)}px`;
  }
}
