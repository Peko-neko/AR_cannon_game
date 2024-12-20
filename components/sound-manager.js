export function loadSounds() {
  this.fireSound = new Audio('assets/cannon_fire.mp3');
  this.warningSound = new Audio('assets/countdown_warning.mp3');
  this.backgroundMusic = new Audio('assets/background_music.mp3');
  this.backgroundMusic.loop = true;
  this.backgroundMusic.volume = 1;
  this.backgroundMusic.play();
}

export function setupSoundControls() {
  const playButton = document.getElementById('playMusic');
  const stopButton = document.getElementById('stopMusic');
  const volumeSlider = document.getElementById('volumeControl');

  playButton.addEventListener('click', () => {
    this.backgroundMusic.play();
  });

  stopButton.addEventListener('click', () => {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  });

  volumeSlider.addEventListener('input', (event) => {
    const volume = event.target.value;
    this.backgroundMusic.volume = volume;
  });
}
