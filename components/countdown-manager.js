import { loadSounds, setupSoundControls } from './sound-manager.js';
import { updateHealthDisplays, handleHit } from './health-manager.js';
import { fireCannonBall } from './projectile-manager.js';

AFRAME.registerComponent('countdown-manager', {
  init: function () {
    this.isGreenTurn = true;
    this.countdown = 5;
    this.isRunning = false;

    this.greenHealth = 3;
    this.blueHealth = 3;

    loadSounds.call(this);
    setupSoundControls.call(this);

    this.greenText = document.querySelector('#greenTimer');
    this.blueText = document.querySelector('#blueTimer');
    this.greenBall = document.querySelector('#greenBall');
    this.blueBall = document.querySelector('#blueBall');
    this.greenCannon = document.querySelector('#greenCannon');
    this.blueCannon = document.querySelector('#blueCannon');
    this.greenHitPlane = document.querySelector('#greenHitPlane');
    this.blueHitPlane = document.querySelector('#blueHitPlane');

    updateHealthDisplays.call(this);

    this.el.sceneEl.addEventListener('markerFound', () => {
      if (!this.isRunning) {
        this.startCountdown();
      }
    });
  },

  startCountdown: function () {
    this.isRunning = true;
    this.countdown = 5;

    const timer = setInterval(() => {
      if (this.greenHealth <= 0 || this.blueHealth <= 0) {
        clearInterval(timer);
        return;
      }

      const activeText = this.isGreenTurn ? this.greenText : this.blueText;
      activeText.setAttribute('value', `Health: ${this.isGreenTurn ? this.greenHealth : this.blueHealth}\n${this.countdown}`);

      if (this.countdown === 5) {
        this.warningSound.play();
      }

      this.countdown--;

      if (this.countdown < 0) {
        clearInterval(timer);
        fireCannonBall.call(
          this,
          this.isGreenTurn ? this.greenBall : this.blueBall,
          this.isGreenTurn ? this.greenCannon : this.blueCannon,
          this.isGreenTurn ? 'blue' : 'green'
        );

        setTimeout(() => {
          this.isGreenTurn = !this.isGreenTurn;
          this.startCountdown();
        }, 500);
      }
    }, 1000);
  },
});
