import { SPRITES, TEXT_CHAR_MAP } from './skin-sprites.js';
import { SKIN_PATH } from './constants.js';

export class Marquee {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.text = '';
    this.scrollOffset = 0;
    this._textImg = null;
    this._loaded = false;
    this._offscreen = null;
    this._offscreenWidth = 0;
    this._animFrame = null;
    this._lastTick = 0;
    this._scrollSpeed = 50; // ms per pixel

    this._textImg = new Image();
    this._textImg.onload = () => {
      this._loaded = true;
      this._renderOffscreen();
    };
    this._textImg.src = `${SKIN_PATH}/TEXT.png`;

    this._startScroll();
  }

  setText(text) {
    const newText = text.toUpperCase() + '  ***  ';
    if (newText !== this.text) {
      this.text = newText;
      this.scrollOffset = 0;
      this._renderOffscreen();
    }
  }

  _renderOffscreen() {
    if (!this._loaded || !this.text) return;

    const cw = SPRITES.TEXT.CHAR_WIDTH;
    const ch = SPRITES.TEXT.CHAR_HEIGHT;
    this._offscreenWidth = this.text.length * cw;

    this._offscreen = document.createElement('canvas');
    this._offscreen.width = this._offscreenWidth;
    this._offscreen.height = ch;
    const ctx = this._offscreen.getContext('2d');

    for (let i = 0; i < this.text.length; i++) {
      const char = this.text[i];
      const pos = TEXT_CHAR_MAP[char] || TEXT_CHAR_MAP[' '];
      if (pos) {
        ctx.drawImage(
          this._textImg,
          pos.x, pos.y, cw, ch,
          i * cw, 0, cw, ch
        );
      }
    }
  }

  _startScroll() {
    const tick = (timestamp) => {
      if (!this._lastTick) this._lastTick = timestamp;
      const delta = timestamp - this._lastTick;

      if (delta >= this._scrollSpeed) {
        this._lastTick = timestamp;
        this.scrollOffset++;
        if (this._offscreenWidth > 0 && this.scrollOffset >= this._offscreenWidth) {
          this.scrollOffset = 0;
        }
        this._draw();
      }

      this._animFrame = requestAnimationFrame(tick);
    };
    this._animFrame = requestAnimationFrame(tick);
  }

  _draw() {
    if (!this._offscreen) return;

    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    // Draw the scrolling text, wrapping around
    const srcX = this.scrollOffset;
    const remaining = this._offscreenWidth - srcX;

    if (remaining >= w) {
      // Enough text to fill the visible area
      this.ctx.drawImage(this._offscreen, srcX, 0, w, h, 0, 0, w, h);
    } else {
      // Need to wrap: draw end of text, then start
      this.ctx.drawImage(this._offscreen, srcX, 0, remaining, h, 0, 0, remaining, h);
      this.ctx.drawImage(this._offscreen, 0, 0, w - remaining, h, remaining, 0, w - remaining, h);
    }
  }

  destroy() {
    cancelAnimationFrame(this._animFrame);
  }
}
