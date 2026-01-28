// Spotify API configuration
// Register your app at https://developer.spotify.com/dashboard
// and paste your Client ID here
export const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
export const REDIRECT_URI = window.location.origin + window.location.pathname;
export const SCOPES = 'user-read-playback-state user-modify-playback-state user-read-currently-playing';
export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Polling intervals (ms)
export const POLL_PLAYING = 1000;
export const POLL_PAUSED = 5000;
export const POLL_NO_DEVICE = 10000;

// Main window dimensions
export const WINDOW_WIDTH = 275;
export const WINDOW_HEIGHT = 116;
export const SCALE = 2;

// Skin asset path
export const SKIN_PATH = 'assets/skins/default';

// Main window element positions { top, left, width, height }
export const LAYOUT = {
  titleBar:       { t: 0,  l: 0,   w: 275, h: 14 },
  optionBtn:      { t: 3,  l: 6,   w: 9,   h: 9 },
  minimizeBtn:    { t: 3,  l: 244, w: 9,   h: 9 },
  shadeBtn:       { t: 3,  l: 254, w: 9,   h: 9 },
  closeBtn:       { t: 3,  l: 264, w: 9,   h: 9 },
  clutterBar:     { t: 22, l: 10,  w: 8,   h: 43 },
  playPauseInd:   { t: 26, l: 24,  w: 11,  h: 9 },
  timeDisplay:    { t: 26, l: 48,  w: 63,  h: 13 },
  timeMinuteH:    { t: 26, l: 48,  w: 9,   h: 13 },
  timeMinuteL:    { t: 26, l: 60,  w: 9,   h: 13 },
  timeSecondH:    { t: 26, l: 78,  w: 9,   h: 13 },
  timeSecondL:    { t: 26, l: 90,  w: 9,   h: 13 },
  visualization:  { t: 43, l: 24,  w: 76,  h: 16 },
  marquee:        { t: 24, l: 111, w: 154, h: 6 },
  kbps:           { t: 43, l: 111, w: 15,  h: 6 },
  khz:            { t: 43, l: 156, w: 10,  h: 6 },
  monoStereo:     { t: 41, l: 212, w: 56,  h: 12 },
  mono:           { t: 41, l: 212, w: 27,  h: 12 },
  stereo:         { t: 41, l: 239, w: 29,  h: 12 },
  volumeSlider:   { t: 57, l: 107, w: 68,  h: 13 },
  balanceSlider:  { t: 57, l: 177, w: 38,  h: 13 },
  eqBtn:          { t: 58, l: 219, w: 23,  h: 12 },
  plBtn:          { t: 58, l: 242, w: 23,  h: 12 },
  seekBar:        { t: 72, l: 16,  w: 248, h: 10 },
  prevBtn:        { t: 88, l: 16,  w: 23,  h: 18 },
  playBtn:        { t: 88, l: 39,  w: 23,  h: 18 },
  pauseBtn:       { t: 88, l: 62,  w: 23,  h: 18 },
  stopBtn:        { t: 88, l: 85,  w: 23,  h: 18 },
  nextBtn:        { t: 88, l: 108, w: 22,  h: 18 },
  ejectBtn:       { t: 89, l: 136, w: 22,  h: 16 },
  shuffleBtn:     { t: 89, l: 164, w: 47,  h: 15 },
  repeatBtn:      { t: 89, l: 210, w: 28,  h: 15 },
};

// Visualization colors from VISCOLOR.TXT
export const VIS_COLORS = [
  [0,0,0],       // 0 - background
  [24,33,41],    // 1 - dots
  [239,49,16],   // 2 - top of spectrum
  [206,41,16],   // 3
  [214,90,0],    // 4
  [214,102,0],   // 5
  [214,115,0],   // 6
  [198,123,8],   // 7
  [222,165,24],  // 8
  [214,181,33],  // 9
  [189,222,41],  // 10
  [148,222,33],  // 11
  [41,206,16],   // 12
  [50,190,16],   // 13
  [57,181,16],   // 14
  [49,156,8],    // 15
  [41,148,0],    // 16
  [24,132,8],    // 17 - bottom of spectrum
  [255,255,255], // 18 - osc 1
  [214,214,222], // 19 - osc 2
  [181,189,189], // 20 - osc 3
  [160,170,175], // 21 - osc 4
  [148,156,165], // 22 - osc 5
  [150,150,150], // 23 - analyzer peaks
];

// Playlist colors from PLEDIT.TXT
export const PLAYLIST_COLORS = {
  normal: '#00FF00',
  current: '#FFFFFF',
  normalBG: '#000000',
  selectedBG: '#0000C6',
  font: 'Arial',
};
