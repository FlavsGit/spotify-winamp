import * as api from './spotify-api.js';
import { PLAYLIST_COLORS } from './constants.js';

export class Playlist {
  constructor(containerEl, toggleBtn) {
    this.container = containerEl;
    this.toggleBtn = toggleBtn;
    this.visible = false;
    this.tracks = [];
    this._listEl = containerEl.querySelector('.pl-tracks');

    toggleBtn.addEventListener('click', () => {
      this.visible = !this.visible;
      this.container.style.display = this.visible ? 'block' : 'none';
      toggleBtn.classList.toggle('active', this.visible);
      if (this.visible) this.refresh();
    });
  }

  async refresh() {
    try {
      const data = await api.getQueue();
      if (!data) return;
      this.tracks = [];
      if (data.currently_playing) {
        this.tracks.push({ name: data.currently_playing.name, artist: data.currently_playing.artists?.map(a => a.name).join(', ') || '', current: true });
      }
      if (data.queue) {
        data.queue.slice(0, 20).forEach(item => {
          this.tracks.push({ name: item.name, artist: item.artists?.map(a => a.name).join(', ') || '', current: false });
        });
      }
      this._render();
    } catch (e) {
      console.error('Queue fetch error:', e);
    }
  }

  _render() {
    if (!this._listEl) return;
    this._listEl.innerHTML = '';
    this.tracks.forEach((track, i) => {
      const div = document.createElement('div');
      div.className = 'pl-track' + (track.current ? ' pl-current' : '');
      div.textContent = `${i + 1}. ${track.artist} - ${track.name}`;
      this._listEl.appendChild(div);
    });
  }
}
