export class WindowDrag {
  constructor(dragHandle, windowEl) {
    this._window = windowEl;
    this._dragging = false;
    this._offsetX = 0;
    this._offsetY = 0;

    dragHandle.addEventListener('mousedown', (e) => {
      // Don't drag if clicking on title bar buttons
      if (e.target.closest('.title-btn')) return;
      this._dragging = true;
      const rect = this._window.getBoundingClientRect();
      this._offsetX = e.clientX - rect.left;
      this._offsetY = e.clientY - rect.top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!this._dragging) return;
      const x = e.clientX - this._offsetX;
      const y = e.clientY - this._offsetY;
      this._window.style.left = `${x}px`;
      this._window.style.top = `${y}px`;
    });

    document.addEventListener('mouseup', () => {
      this._dragging = false;
    });
  }
}
