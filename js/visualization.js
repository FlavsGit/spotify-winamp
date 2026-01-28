import { VIS_COLORS } from './constants.js';

export class Visualization {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.width = canvasEl.width;   // 76
    this.height = canvasEl.height; // 16
    this.mode = 'analyzer'; // 'analyzer', 'albumart', 'off'
    this.isPlaying = false;
    this._bars = new Array(19).fill(0); // 19 bars, 4px each = 76px
    this._peaks = new Array(19).fill(0);
    this._peakDecay = new Array(19).fill(0);
    this._albumArtImg = null;
    this._animFrame = null;

    this.canvas.addEventListener('click', () => {
      const modes = ['analyzer', 'albumart', 'off'];
      const idx = (modes.indexOf(this.mode) + 1) % modes.length;
      this.mode = modes[idx];
    });

    this._animate();
  }

  setPlaying(playing) {
    this.isPlaying = playing;
  }

  setAlbumArt(url) {
    if (!url) {
      this._albumArtImg = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { this._albumArtImg = img; };
    img.src = url;
  }

  _animate() {
    const tick = () => {
      this._update();
      this._draw();
      this._animFrame = requestAnimationFrame(tick);
    };
    this._animFrame = requestAnimationFrame(tick);
  }

  _update() {
    for (let i = 0; i < this._bars.length; i++) {
      if (this.isPlaying) {
        // Random fake spectrum data
        const target = Math.random() * this.height;
        this._bars[i] += (target - this._bars[i]) * 0.3;
      } else {
        this._bars[i] *= 0.9;
      }

      // Peak management
      if (this._bars[i] > this._peaks[i]) {
        this._peaks[i] = this._bars[i];
        this._peakDecay[i] = 0;
      } else {
        this._peakDecay[i]++;
        if (this._peakDecay[i] > 10) {
          this._peaks[i] -= 0.5;
          if (this._peaks[i] < 0) this._peaks[i] = 0;
        }
      }
    }
  }

  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (this.mode === 'off') {
      // Black
      ctx.fillStyle = `rgb(${VIS_COLORS[0].join(',')})`;
      ctx.fillRect(0, 0, this.width, this.height);
      return;
    }

    if (this.mode === 'albumart' && this._albumArtImg) {
      ctx.drawImage(this._albumArtImg, 0, 0, this.width, this.height);
      return;
    }

    // Analyzer mode
    const bg = VIS_COLORS[0];
    ctx.fillStyle = `rgb(${bg.join(',')})`;
    ctx.fillRect(0, 0, this.width, this.height);

    const barWidth = 3;
    const gap = 1;

    for (let i = 0; i < this._bars.length; i++) {
      const barHeight = Math.floor(this._bars[i]);
      const x = i * (barWidth + gap);

      // Draw bar from bottom up
      for (let y = 0; y < barHeight && y < this.height; y++) {
        // Color gradient: bottom (green) to top (red)
        // Map y position to color index 17 (bottom) to 2 (top)
        const colorIdx = 17 - Math.floor((y / this.height) * 15);
        const clampedIdx = Math.max(2, Math.min(17, colorIdx));
        const color = VIS_COLORS[clampedIdx];
        ctx.fillStyle = `rgb(${color.join(',')})`;
        ctx.fillRect(x, this.height - 1 - y, barWidth, 1);
      }

      // Draw peak dot
      const peakY = Math.floor(this._peaks[i]);
      if (peakY > 0) {
        const peakColor = VIS_COLORS[23];
        ctx.fillStyle = `rgb(${peakColor.join(',')})`;
        ctx.fillRect(x, this.height - 1 - peakY, barWidth, 1);
      }
    }
  }

  destroy() {
    cancelAnimationFrame(this._animFrame);
  }
}
