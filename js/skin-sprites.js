// Sprite region definitions for the Winamp 2.x default skin
// Each entry: { x, y, w, h } representing the region within the sprite sheet PNG

export const SPRITES = {
  // CBUTTONS.png (136x36) - Transport buttons
  CBUTTONS: {
    PREV:           { x: 0,   y: 0,  w: 23, h: 18 },
    PREV_ACTIVE:    { x: 0,   y: 18, w: 23, h: 18 },
    PLAY:           { x: 23,  y: 0,  w: 23, h: 18 },
    PLAY_ACTIVE:    { x: 23,  y: 18, w: 23, h: 18 },
    PAUSE:          { x: 46,  y: 0,  w: 23, h: 18 },
    PAUSE_ACTIVE:   { x: 46,  y: 18, w: 23, h: 18 },
    STOP:           { x: 69,  y: 0,  w: 23, h: 18 },
    STOP_ACTIVE:    { x: 69,  y: 18, w: 23, h: 18 },
    NEXT:           { x: 92,  y: 0,  w: 22, h: 18 },
    NEXT_ACTIVE:    { x: 92,  y: 18, w: 22, h: 18 },
    EJECT:          { x: 114, y: 0,  w: 22, h: 16 },
    EJECT_ACTIVE:   { x: 114, y: 16, w: 22, h: 16 },
  },

  // TITLEBAR.png (344x87) - Title bar states
  TITLEBAR: {
    ACTIVE:           { x: 27,  y: 0,  w: 275, h: 14 },
    INACTIVE:         { x: 27,  y: 15, w: 275, h: 14 },
    // Shade mode title bars
    SHADE_ACTIVE:     { x: 27,  y: 29, w: 275, h: 14 },
    SHADE_INACTIVE:   { x: 27,  y: 42, w: 275, h: 14 },
    // Title bar buttons (from the left area of the sprite)
    OPTION_ACTIVE:    { x: 0,   y: 0,  w: 9,   h: 9 },
    OPTION_PRESSED:   { x: 0,   y: 9,  w: 9,   h: 9 },
    MINIMIZE_NORM:    { x: 9,   y: 0,  w: 9,   h: 9 },
    MINIMIZE_PRESSED: { x: 9,   y: 9,  w: 9,   h: 9 },
    SHADE_BTN_NORM:   { x: 0,   y: 18, w: 9,   h: 9 },
    SHADE_BTN_PRESSED:{ x: 9,   y: 18, w: 9,   h: 9 },
    CLOSE_NORM:       { x: 18,  y: 0,  w: 9,   h: 9 },
    CLOSE_PRESSED:    { x: 18,  y: 9,  w: 9,   h: 9 },
  },

  // SHUFREP.png (92x85) - Shuffle, Repeat, EQ, PL buttons
  SHUFREP: {
    REPEAT_OFF:          { x: 0,  y: 0,  w: 28, h: 15 },
    REPEAT_OFF_PRESSED:  { x: 0,  y: 15, w: 28, h: 15 },
    REPEAT_ON:           { x: 0,  y: 30, w: 28, h: 15 },
    REPEAT_ON_PRESSED:   { x: 0,  y: 45, w: 28, h: 15 },
    SHUFFLE_OFF:         { x: 28, y: 0,  w: 47, h: 15 },
    SHUFFLE_OFF_PRESSED: { x: 28, y: 15, w: 47, h: 15 },
    SHUFFLE_ON:          { x: 28, y: 30, w: 47, h: 15 },
    SHUFFLE_ON_PRESSED:  { x: 28, y: 45, w: 47, h: 15 },
    EQ_OFF:              { x: 0,  y: 61, w: 23, h: 12 },
    EQ_ON:               { x: 0,  y: 73, w: 23, h: 12 },
    PL_OFF:              { x: 23, y: 61, w: 23, h: 12 },
    PL_ON:               { x: 23, y: 73, w: 23, h: 12 },
  },

  // NUMBERS.png (99x13) - Time display digits 0-9 and blank
  // Each digit is 9x13. Order: 0,1,2,3,4,5,6,7,8,9,blank
  NUMBERS: {
    0:     { x: 0,  y: 0, w: 9, h: 13 },
    1:     { x: 9,  y: 0, w: 9, h: 13 },
    2:     { x: 18, y: 0, w: 9, h: 13 },
    3:     { x: 27, y: 0, w: 9, h: 13 },
    4:     { x: 36, y: 0, w: 9, h: 13 },
    5:     { x: 45, y: 0, w: 9, h: 13 },
    6:     { x: 54, y: 0, w: 9, h: 13 },
    7:     { x: 63, y: 0, w: 9, h: 13 },
    8:     { x: 72, y: 0, w: 9, h: 13 },
    9:     { x: 81, y: 0, w: 9, h: 13 },
    BLANK: { x: 90, y: 0, w: 9, h: 13 },
  },

  // PLAYPAUS.png (42x9) - Play/Pause/Stop state indicator
  // 3 states side by side, but actually the layout is:
  // Play indicator, Pause indicator, Stop indicator, work indicator, etc.
  PLAYPAUS: {
    PLAY:    { x: 1,  y: 0, w: 8, h: 9 },   // Playing state (right arrow)
    PAUSE:   { x: 10, y: 0, w: 8, h: 9 },   // Paused state (two bars)
    STOP:    { x: 19, y: 0, w: 8, h: 9 },   // Stopped state (empty/blank)
    // Work indicator (the small spinning thing)
    WORK_ON: { x: 28, y: 0, w: 3, h: 9 },
    WORK_OFF:{ x: 31, y: 0, w: 3, h: 9 },
  },

  // MONOSTER.png (58x24) - Mono and Stereo indicators
  MONOSTER: {
    STEREO_ON:  { x: 0,  y: 0,  w: 29, h: 12 },
    STEREO_OFF: { x: 0,  y: 12, w: 29, h: 12 },
    MONO_ON:    { x: 29, y: 0,  w: 27, h: 12 },
    MONO_OFF:   { x: 29, y: 12, w: 27, h: 12 },
  },

  // VOLUME.png (68x433) - Volume bar backgrounds + thumb
  // 28 frames of 68x13 stacked vertically (frames 0-27, 0=min, 27=max)
  // Thumb buttons at the bottom: 2 states, each 14x11
  VOLUME: {
    FRAME_HEIGHT: 13,
    FRAME_WIDTH: 68,
    FRAME_COUNT: 28,
    THUMB_NORM:    { x: 15, y: 422, w: 14, h: 11 },
    THUMB_PRESSED: { x: 0,  y: 422, w: 14, h: 11 },
  },

  // BALANCE.png (68x433) - Balance bar backgrounds + thumb
  // Same structure as volume
  BALANCE: {
    FRAME_HEIGHT: 13,
    FRAME_WIDTH: 38,
    FRAME_COUNT: 28,
    THUMB_NORM:    { x: 15, y: 422, w: 14, h: 11 },
    THUMB_PRESSED: { x: 0,  y: 422, w: 14, h: 11 },
  },

  // POSBAR.png (307x10) - Seek/position bar
  // Background: 248x10 at (0,0)
  // Thumb: two states
  POSBAR: {
    BG:            { x: 0,   y: 0, w: 248, h: 10 },
    THUMB_NORM:    { x: 248, y: 0, w: 29,  h: 10 },
    THUMB_PRESSED: { x: 278, y: 0, w: 29,  h: 10 },
  },

  // TEXT.png (155x74) - Character sprites for marquee
  // Each character is 5x6 pixels
  // Row 0 (y=0):  A-Z (uppercase)
  // Row 1 (y=6):  A-Z (with quotes as special chars)
  // Row 2 (y=12): 0-9 and symbols
  // Row 3 (y=18): same as row 0 but different color (for selected text)
  TEXT: {
    CHAR_WIDTH: 5,
    CHAR_HEIGHT: 6,
  },
};

// Character map for TEXT.png
// Row 0 (y=0): A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
// Row 1 (y=6): " @ ...special chars
// Row 2 (y=12): 0 1 2 3 4 5 6 7 8 9 ...symbols
// Mapping: character -> { x, y } position in TEXT.png
export const TEXT_CHAR_MAP = {};

// Row 0: A-Z (y=0)
const row0 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ"@';
for (let i = 0; i < row0.length; i++) {
  TEXT_CHAR_MAP[row0[i]] = { x: i * 5, y: 0 };
}

// Row 1 (y=6): more characters
const row1chars = 'abcdefghijklmnopqrstuvwxyz';
// In Winamp, lowercase maps to same as uppercase but we can use row 0
// Row 1 actually has: lowercase or extended chars - for now map lowercase to uppercase

// Row 2 (y=12): 0-9 and symbols
const row2 = '0123456789\u2026.:()-\'!_+\\/#[]^&%,=$';
for (let i = 0; i < row2.length; i++) {
  TEXT_CHAR_MAP[row2[i]] = { x: i * 5, y: 12 };
}

// Map space to a blank region
TEXT_CHAR_MAP[' '] = { x: 145, y: 0 }; // blank space area
// Map lowercase to uppercase positions
for (let c = 97; c <= 122; c++) {
  const lower = String.fromCharCode(c);
  const upper = String.fromCharCode(c - 32);
  if (TEXT_CHAR_MAP[upper]) {
    TEXT_CHAR_MAP[lower] = TEXT_CHAR_MAP[upper];
  }
}
// Common fallbacks
TEXT_CHAR_MAP['*'] = TEXT_CHAR_MAP['.'] || { x: 75, y: 12 };
TEXT_CHAR_MAP['?'] = TEXT_CHAR_MAP['.'] || { x: 75, y: 12 };
