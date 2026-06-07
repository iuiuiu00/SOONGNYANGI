// music.js
let bgm;

function preloadMusic() {
  soundFormats('mp3');
  bgm = loadSound('assets/Void_Lantern.mp3');
}

function playBGM() {
  if (bgm && !bgm.isPlaying()) {
    bgm.setVolume(0.5);
    bgm.loop();
  }
}

function stopBGM() {
  if (bgm && bgm.isPlaying()) {
    bgm.stop();
  }
}

function setBGMVolume(v) {
  if (bgm) bgm.setVolume(v);
}
