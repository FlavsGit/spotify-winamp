import { SPRITES } from './skin-sprites.js';
import { SKIN_PATH } from './constants.js';

export class TimeDisplay {
  constructor(containerEl) {
    this.container = containerEl;
    this.showRemaining = false;
    this.digits = [];
    this._numbersImg = null;
    this._loaded = false;

    // Create 4 digit canvases + minus sign
    const ids = ['minus', 'min-h', 'min-l', 'sec-h', 'sec-l'];
    ids.forEach(id => {
      const canvas = document.createElement('canvas');
      canvas.width = 9;
      canvas.height = 13;
      canvas.className = 'time-digit';
      canvas.dataset.id = id;
      this.container.appendChild(canvas);
      this.digits.push(canvas);
    });

    // Load numbers sprite
    this._numbersImg = new Image();
    this._numbersImg.onload = () => { this._loaded = true; };
    this._numbersImg.src = `${SKIN_PATH}/NUMBERS.png`;

    // Toggle remaining on click
    this.container.addEventListener('click', () => {
      this.showRemaining = !this.showRemaining;
    });
  }

  update(progressMs, durationMs) {
    if (!this._loaded) return;

    let totalSeconds;
    if (this.showRemaining) {
      totalSeconds = Math.max(0, Math.ceil((durationMs - progressMs) / 1000));
    } else {
      totalSeconds = Math.floor(progressMs / 1000);
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const minH = Math.floor(minutes / 10);
    const minL = minutes % 10;
    const secH = Math.floor(seconds / 10);
    const secL = seconds % 10;

    // Draw minus sign (visible only in remaining mode)
    this._drawDigit(this.digits[0], this.showRemaining ? 'MINUS' : 'BLANK');
    this._drawDigit(this.digits[1], minH);
    this._drawDigit(this.digits[2], minL);
    this._drawDigit(this.digits[3], secH);
    this._drawDigit(this.digits[4], secL);
  }

  _drawDigit(canvas, value) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 9, 13);

    let sprite;
    if (value === 'BLANK') {
      sprite = SPRITES.NUMBERS.BLANK;
    } else if (value === 'MINUS') {
      // The minus is at position after 9, before blank in NUMBERS.png
      // Actually in the extended numbers (NUMS_EX) — use a simple approach
      // Draw a small green dash
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(1, 6, 7, 1);
      return;
    } else {
      sprite = SPRITES.NUMBERS[value];
    }

    if (sprite) {
      ctx.drawImage(
        this._numbersImg,
        sprite.x, sprite.y, sprite.w, sprite.h,
        0, 0, sprite.w, sprite.h
      );
    }
  }
}
