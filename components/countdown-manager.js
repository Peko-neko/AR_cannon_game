AFRAME.registerComponent('countdown-manager', {
  init: function () {
    this.isGreenTurn = true; // Start with green cannon
    this.countdown = 5;
    this.isRunning = false;

    // Initialize health for both cannons
    this.greenHealth = 3;
    this.blueHealth = 3;

    // Get references to text elements, cannonballs, and cannons
    this.greenText = document.querySelector('#greenTimer');
    this.blueText = document.querySelector('#blueTimer');
    this.greenBall = document.querySelector('#greenBall');
    this.blueBall = document.querySelector('#blueBall');
    this.greenCannon = document.querySelector('#greenCannon');
    this.blueCannon = document.querySelector('#blueCannon');

    // Get hit planes
    this.greenHitPlane = document.querySelector('#greenHitPlane');
    this.blueHitPlane = document.querySelector('#blueHitPlane');

    // Update health displays
    this.updateHealthDisplays();

    // Start countdown when a marker is found
    this.el.sceneEl.addEventListener('markerFound', () => {
      if (!this.isRunning) {
        this.startCountdown();
      }
    });
  },

  updateHealthDisplays: function () {
    this.greenText.setAttribute('value', `Health: ${this.greenHealth}`);
    this.blueText.setAttribute('value', `Health: ${this.blueHealth}`);
  },

  startCountdown: function () {
    this.isRunning = true;
    this.countdown = 5;

    const timer = setInterval(() => {
      if (this.greenHealth <= 0 || this.blueHealth <= 0) {
        clearInterval(timer);
        return;
      }

      // Update the countdown for the active cannon
      if (this.isGreenTurn) {
        this.greenText.setAttribute('value', `Health: ${this.greenHealth}\n${this.countdown}`);
        this.blueText.setAttribute('value', `Health: ${this.blueHealth}`);
      } else {
        this.blueText.setAttribute('value', `Health: ${this.blueHealth}\n${this.countdown}`);
        this.greenText.setAttribute('value', `Health: ${this.greenHealth}`);
      }

      this.countdown--;

      if (this.countdown < 0) {
        clearInterval(timer);
        this.fireCannonBall(
          this.isGreenTurn ? this.greenBall : this.blueBall,
          this.isGreenTurn ? this.greenCannon : this.blueCannon,
          this.isGreenTurn ? 'blue' : 'green'
        );

        setTimeout(() => {
          this.isGreenTurn = !this.isGreenTurn; // Switch turns
          this.startCountdown();
        }, 500);
      }
    }, 1000);
  },

  fireCannonBall: function (ball, cannon, target) {
    ball.setAttribute('visible', 'true');

    const targetPlane = document.querySelector(`#${target}HitPlane`);

    // Get cannon position
    const cannonPos = cannon.object3D.position;

    // Start position of the cannonball (from the cannon tip)
    const startPos = {
      x: cannonPos.x,
      y: cannonPos.y + 0.6,
      z: cannonPos.z + 0.9,
    };

    ball.setAttribute('position', startPos);

    let time = 0;
    const g = 9.8; // Gravity
    const initialSpeed = 5;
    const angle = Math.PI / 6;

    const vY = initialSpeed * Math.sin(angle);
    const vZ = initialSpeed * Math.cos(angle);

    const interval = setInterval(() => {
      time += 0.05;

      const newX = startPos.x;
      const newY = startPos.y + vY * time - 0.5 * g * time * time;
      const newZ = startPos.z + vZ * time;

      ball.setAttribute('position', { x: newX, y: newY, z: newZ });

      if (this.checkCollisionWithBoundingBox(ball, targetPlane)) {
        this.handleHit(target);
        this.showHitbox(targetPlane);
        clearInterval(interval);
        ball.setAttribute('visible', 'false');
        return;
      }

      if (newY <= -0.25 || newZ < -5) {
        clearInterval(interval);
        ball.setAttribute('visible', 'false');
      }
    }, 50);
  },

  handleHit: function (target) {
    if (target === 'green') {
      this.greenHealth--;
    } else {
      this.blueHealth--;
    }

    if (this.greenHealth <= 0) {
      this.greenText.setAttribute('value', 'You Lost!');
      this.blueText.setAttribute('value', 'You Won!');
    } else if (this.blueHealth <= 0) {
      this.greenText.setAttribute('value', 'You Won!');
      this.blueText.setAttribute('value', 'You Lost!');
    } else {
      this.updateHealthDisplays();
    }
  },

  showHitbox: function (hitPlane) {
    hitPlane.setAttribute('visible', 'true');
    setTimeout(() => {
      hitPlane.setAttribute('visible', 'false');
    }, 1000); // Hide after 1 second
  },

  checkCollisionWithBoundingBox: function (ball, plane) {
    const ballBox = new THREE.Box3().setFromObject(ball.object3D);
    const planeBox = new THREE.Box3().setFromObject(plane.object3D);
    return ballBox.intersectsBox(planeBox);
  }
});
