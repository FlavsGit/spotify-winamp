# Spotify Winamp Project Status

## Overview

A browser-based web application that replicates the classic Winamp 2.x default skin and uses the Spotify Web API to remotely control the user's Spotify desktop app. The app sends play/pause/skip/seek/volume commands to Spotify — it does not stream audio itself.

**Tech Stack:** Vanilla HTML, CSS, JavaScript (no frameworks, no build tools)
**Spotify Integration:** Web API remote control via OAuth 2.0 PKCE flow
**Skin Assets:** Extracted from the Webamp open-source project's default Winamp 2.91 skin

---

## Current Status: BLOCKED

**Reason:** Spotify has disabled access to create new Web API applications.

**What's Complete:** All code is written and ready. The project just needs a Spotify Client ID to function.

**To Resume:** Once Spotify re-enables Web API app creation:
1. Go to https://developer.spotify.com/dashboard
2. Create a new app
3. Set redirect URI to `http://localhost:3000/`
4. Copy the Client ID
5. Edit `js/constants.js` line 4: replace `'YOUR_CLIENT_ID_HERE'` with your Client ID
6. Run `npx serve . -p 3000` in the project directory
7. Open `http://localhost:3000` in browser

---

## Project Structure

```
spotify-winamp/
├── index.html                 # Main HTML file with all UI elements
├── PROJECT_STATUS.md          # This file
├── css/
│   ├── reset.css              # CSS reset and body styles
│   ├── main-window.css        # Main player window layout (275x116 pixels)
│   └── playlist-window.css    # Playlist panel styles
├── js/
│   ├── app.js                 # Entry point, initializes all components
│   ├── auth.js                # Spotify OAuth 2.0 PKCE authentication flow
│   ├── spotify-api.js         # Spotify Web API wrapper (all endpoints)
│   ├── constants.js           # Configuration, layout positions, colors
│   ├── skin-sprites.js        # Sprite coordinate definitions for skin assets
│   ├── player-state.js        # Polling loop, state management, events
│   ├── time-display.js        # MM:SS digit rendering from NUMBERS.png
│   ├── marquee.js             # Scrolling track title using TEXT.png sprites
│   ├── visualization.js       # Fake spectrum analyzer / album art display
│   ├── transport.js           # Play/pause/stop/next/prev button handlers
│   ├── volume.js              # Volume slider with 28-frame background
│   ├── playlist.js            # Playlist window with queue display
│   └── drag.js                # Window dragging via title bar
└── assets/skins/default/      # Winamp 2.91 skin sprites (PNG format)
    ├── MAIN.png               # Main window background (275x116)
    ├── TITLEBAR.png           # Title bar states and buttons (344x87)
    ├── CBUTTONS.png           # Transport buttons (136x36)
    ├── NUMBERS.png            # Time display digits 0-9 (99x13)
    ├── TEXT.png               # Character sprites for marquee (155x74)
    ├── PLAYPAUS.png           # Play/pause/stop indicators (42x9)
    ├── MONOSTER.png           # Mono/stereo indicators (58x24)
    ├── VOLUME.png             # Volume bar frames + thumb (68x433)
    ├── BALANCE.png            # Balance bar frames + thumb (68x433)
    ├── POSBAR.png             # Seek bar background + thumb (307x10)
    ├── SHUFREP.png            # Shuffle, repeat, EQ, PL buttons (92x85)
    ├── PLEDIT.png             # Playlist editor skin (280x186)
    ├── EQMAIN.png             # Equalizer window (275x315)
    ├── EQ_EX.png              # Equalizer extended (275x82)
    ├── PLEDIT.TXT             # Playlist color configuration
    └── VISCOLOR.TXT           # Visualization color palette
```

---

## Implementation Plan

### Phase 1: Auth + API Foundation ✅ COMPLETE
- [x] Project directory structure created
- [x] Skin assets downloaded from Webamp and converted to PNG
- [x] `auth.js` — PKCE flow with code verifier/challenge, token storage, auto-refresh
- [x] `spotify-api.js` — Fetch wrapper with Bearer token, 401 retry, 429 rate-limit backoff
- [ ] **BLOCKED:** Cannot verify without Spotify Client ID

### Phase 2: Static UI Shell ✅ COMPLETE
- [x] `skin-sprites.js` — All sprite region coordinates
- [x] `constants.js` — Layout positions, API config, colors
- [x] `main-window.css` — Pixel-perfect absolute positioning
- [x] `index.html` — All UI elements as positioned divs with sprite backgrounds

### Phase 3: Live Playback State ✅ COMPLETE
- [x] `player-state.js` — Polling (1s playing, 5s paused), interpolated progress, event emission
- [x] `time-display.js` — Digit rendering, click to toggle elapsed/remaining
- [x] `marquee.js` — Scrolling text using TEXT.png character sprites on canvas

### Phase 4: Transport Controls ✅ COMPLETE
- [x] `transport.js` — Click handlers for prev/play/pause/stop/next
- [x] Button press visual feedback (sprite swap on mousedown)
- [x] Seek bar drag interaction

### Phase 5: Sliders + Toggles ✅ COMPLETE
- [x] `volume.js` — Volume slider with 28-frame background, debounced API calls
- [x] Balance slider (decorative only, Spotify has no balance API)
- [x] Shuffle and repeat button toggles in `app.js`
- [x] Mono/stereo indicators (hardcoded to stereo)

### Phase 6: Visualization ✅ COMPLETE
- [x] `visualization.js` — Album art mode and fake spectrum analyzer
- [x] Click to cycle visualization modes

### Phase 7: Playlist Window ✅ COMPLETE
- [x] `playlist.js` — Fetch queue, render track list
- [x] `playlist-window.css` — Styled playlist panel
- [x] PL button toggles visibility

### Phase 8: Polish ✅ COMPLETE
- [x] `drag.js` — Window dragging via title bar
- [x] Close button hides player
- [x] Keyboard shortcuts (space, arrows)

### Phase 9: Optional Future Enhancements (NOT STARTED)
- [ ] Window shade mode (compact 275x14 strip)
- [ ] Eject button device picker
- [ ] Equalizer window (visual only)
- [ ] Electron wrapper for standalone desktop app

---

## Features Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| Classic Winamp 2.x skin | ✅ | All original sprites from base-2.91 |
| Play/Pause/Stop/Next/Prev | ✅ | With button press feedback |
| Volume slider | ✅ | 28-frame animated background |
| Seek bar | ✅ | Drag to seek, smooth interpolation |
| Time display | ✅ | Click to toggle elapsed/remaining |
| Scrolling marquee | ✅ | Artist - Track name |
| Spectrum analyzer | ✅ | Fake visualization with peak hold |
| Album art in viz | ✅ | Click viz to cycle modes |
| Shuffle toggle | ✅ | Syncs with Spotify state |
| Repeat toggle | ✅ | Cycles: off → context → track |
| Playlist queue | ✅ | Shows current + upcoming tracks |
| Window dragging | ✅ | Drag via title bar |
| Keyboard shortcuts | ✅ | Space, arrow keys |
| OAuth PKCE auth | ✅ | No server needed |
| Token auto-refresh | ✅ | Refreshes before expiry |

---

## Technical Notes

### Spotify API Requirements
- **Premium Required:** All playback control APIs require Spotify Premium
- **Remote Control:** The app controls the Spotify desktop/mobile app — does not stream audio
- **Required Scopes:** `user-read-playback-state user-modify-playback-state user-read-currently-playing`

### Polling Strategy
- Playing: Poll every 1 second
- Paused: Poll every 5 seconds
- No device: Poll every 10 seconds
- Progress is interpolated locally between polls for smooth seek bar/time updates

### Skin Rendering
- Native size: 275x116 pixels
- CSS scale: 2x (configurable via `--scale` CSS variable)
- All sprites use `image-rendering: pixelated` for crisp pixel art

---

## How to Run (Once Spotify Access is Restored)

1. **Get Spotify Client ID**
   - Go to https://developer.spotify.com/dashboard
   - Create app, set redirect URI to `http://localhost:3000/`
   - Copy Client ID

2. **Configure**
   ```javascript
   // Edit js/constants.js line 4:
   export const CLIENT_ID = 'your_actual_client_id_here';
   ```

3. **Run local server**
   ```bash
   cd spotify-winamp
   npx serve . -p 3000
   ```

4. **Use**
   - Open http://localhost:3000
   - Click "Connect to Spotify"
   - Have Spotify desktop app playing music
   - Control playback with the Winamp interface

---

## Files Summary

| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | 78 | Main HTML structure |
| `css/reset.css` | 18 | CSS reset |
| `css/main-window.css` | 280 | Main window styling |
| `css/playlist-window.css` | 55 | Playlist panel styling |
| `js/app.js` | 160 | Main entry point |
| `js/auth.js` | 95 | OAuth PKCE flow |
| `js/spotify-api.js` | 85 | API wrapper |
| `js/constants.js` | 95 | Configuration |
| `js/skin-sprites.js` | 140 | Sprite coordinates |
| `js/player-state.js` | 115 | State management |
| `js/time-display.js` | 75 | Time digits |
| `js/marquee.js` | 85 | Scrolling text |
| `js/visualization.js` | 105 | Spectrum/album art |
| `js/transport.js` | 130 | Transport controls |
| `js/volume.js` | 70 | Volume slider |
| `js/playlist.js` | 50 | Playlist window |
| `js/drag.js` | 30 | Window dragging |

**Total:** ~1,666 lines of code + 18 skin asset PNGs

---

*Last updated: January 2026*
*Status: Waiting for Spotify Web API access*
