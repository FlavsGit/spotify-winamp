import { redirectToSpotifyAuth, handleCallback, isAuthenticated } from './auth.js';
import * as api from './spotify-api.js';
import { PlayerState } from './player-state.js';
import { TimeDisplay } from './time-display.js';
import { Marquee } from './marquee.js';
import { Visualization } from './visualization.js';
import { Transport } from './transport.js';
import { VolumeSlider } from './volume.js';
import { WindowDrag } from './drag.js';
import { Playlist } from './playlist.js';
import { SKIN_PATH } from './constants.js';

async function init() {
  // Handle OAuth callback
  if (window.location.search.includes('code=')) {
    const ok = await handleCallback();
    if (!ok) {
      console.error('Auth callback failed');
    }
  }

  const loginScreen = document.getElementById('login-screen');
  const player = document.getElementById('player');

  if (!isAuthenticated()) {
    loginScreen.style.display = 'flex';
    player.style.display = 'none';
    document.getElementById('login-btn').addEventListener('click', redirectToSpotifyAuth);
    return;
  }

  loginScreen.style.display = 'none';
  player.style.display = 'block';

  // Initialize player state
  const playerState = new PlayerState();

  // Initialize UI components
  const timeDisplay = new TimeDisplay(document.getElementById('time-display'));

  const marquee = new Marquee(document.getElementById('marquee'));
  marquee.setText('Spotify Winamp');

  const visualization = new Visualization(document.getElementById('visualizer'));

  const transport = new Transport({
    prevBtn: document.getElementById('prev-btn'),
    playBtn: document.getElementById('play-btn'),
    pauseBtn: document.getElementById('pause-btn'),
    stopBtn: document.getElementById('stop-btn'),
    nextBtn: document.getElementById('next-btn'),
    ejectBtn: document.getElementById('eject-btn'),
    seekBar: document.getElementById('seek-bar'),
    seekThumb: document.getElementById('seek-thumb'),
  }, playerState);

  const volumeSlider = new VolumeSlider(
    document.getElementById('volume-bar'),
    document.getElementById('volume-thumb'),
    playerState
  );

  const playlist = new Playlist(
    document.getElementById('playlist-window'),
    document.getElementById('pl-btn')
  );

  // Window dragging
  new WindowDrag(document.getElementById('title-bar'), player);

  // Shuffle button
  const shuffleBtn = document.getElementById('shuffle-btn');
  shuffleBtn.addEventListener('click', async () => {
    const newState = !playerState.state.shuffleState;
    try {
      await api.toggleShuffle(newState);
      playerState.setLocalState({ shuffleState: newState });
      shuffleBtn.classList.toggle('active', newState);
    } catch (e) { console.error('Shuffle error:', e); }
  });

  // Repeat button
  const repeatBtn = document.getElementById('repeat-btn');
  repeatBtn.addEventListener('click', async () => {
    // Cycle: off -> context -> track -> off
    const modes = ['off', 'context', 'track'];
    const current = modes.indexOf(playerState.state.repeatState);
    const next = modes[(current + 1) % modes.length];
    try {
      await api.setRepeatMode(next);
      playerState.setLocalState({ repeatState: next });
      repeatBtn.classList.remove('repeat-off', 'repeat-context', 'repeat-track');
      repeatBtn.classList.add(`repeat-${next}`);
    } catch (e) { console.error('Repeat error:', e); }
  });

  // Close button
  document.getElementById('close-btn').addEventListener('click', () => {
    player.style.display = 'none';
    loginScreen.style.display = 'flex';
    playerState.stop();
  });

  // Play/pause indicator
  const playPauseInd = document.getElementById('play-pause-ind');

  // Subscribe to state changes
  playerState.addEventListener('trackchange', (e) => {
    const s = e.detail;
    marquee.setText(`${s.artistName} - ${s.trackName}`);
    visualization.setAlbumArt(s.albumArtUrl);
  });

  playerState.addEventListener('playstatechange', (e) => {
    const s = e.detail;
    visualization.setPlaying(s.isPlaying);
    playPauseInd.className = 'play-pause-ind ' + (s.isPlaying ? 'playing' : 'paused');
  });

  playerState.addEventListener('volumechange', (e) => {
    volumeSlider.update(e.detail.volumePercent);
  });

  playerState.addEventListener('shufflechange', (e) => {
    shuffleBtn.classList.toggle('active', e.detail.shuffleState);
  });

  playerState.addEventListener('repeatchange', (e) => {
    const mode = e.detail.repeatState;
    repeatBtn.classList.remove('repeat-off', 'repeat-context', 'repeat-track');
    repeatBtn.classList.add(`repeat-${mode}`);
  });

  playerState.addEventListener('progress', (e) => {
    const s = e.detail;
    timeDisplay.update(s.progressMs, s.durationMs);
    transport.updateSeekPosition(s.progressMs, s.durationMs);
  });

  playerState.addEventListener('statechange', (e) => {
    const s = e.detail;
    // Update mono/stereo (always stereo for Spotify)
    document.getElementById('stereo-ind').classList.add('on');
    document.getElementById('mono-ind').classList.remove('on');
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        if (playerState.state.isPlaying) {
          api.pause().then(() => playerState.setLocalState({ isPlaying: false }));
        } else {
          api.play().then(() => playerState.setLocalState({ isPlaying: true }));
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        api.seekToPosition(playerState.state.progressMs + 5000);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        api.seekToPosition(Math.max(0, playerState.state.progressMs - 5000));
        break;
      case 'ArrowUp':
        e.preventDefault();
        api.setVolume(Math.min(100, playerState.state.volumePercent + 5));
        break;
      case 'ArrowDown':
        e.preventDefault();
        api.setVolume(Math.max(0, playerState.state.volumePercent - 5));
        break;
    }
  });

  // Start polling
  playerState.start();
}

init().catch(console.error);
