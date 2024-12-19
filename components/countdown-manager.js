/**
 * @component countdown-manager
 * @description Manages turn-based countdown system between two cannons and firing mechanism.
 */
AFRAME.registerComponent('countdown-manager', {
  init: function () {
    this.isGreenTurn = true; // Start with green cannon
    this.countdown = 5;
    this.isRunning = false;

    // Get references to text elements, cannonballs, and cannons
    this.greenText = document.querySelector('#greenTimer');
    this.blueText = document.querySelector('#blueTimer');
    this.greenBall = document.querySelector('#greenBall');
    this.blueBall = document.querySelector('#blueBall');
    this.greenCannon = document.querySelector('#greenCannon');
    this.blueCannon = document.querySelector('#blueCannon');

    // Start countdown when a marker is found
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
      // Update the countdown for the active cannon
      if (this.isGreenTurn) {
        this.greenText.setAttribute('value', this.countdown.toString());
        this.blueText.setAttribute('value', '');
      } else {
        this.blueText.setAttribute('value', this.countdown.toString());
        this.greenText.setAttribute('value', '');
      }

      this.countdown--;

      if (this.countdown < 0) {
        clearInterval(timer);
        this.fireCannonBall(
          this.isGreenTurn ? this.greenBall : this.blueBall,
          this.isGreenTurn ? this.greenCannon : this.blueCannon
        );

        setTimeout(() => {
          this.isGreenTurn = !this.isGreenTurn; // Switch turns
          this.startCountdown();
        }, 500);
      }
    }, 1000);
  },

  fireCannonBall: function (ball, cannon) {
    ball.setAttribute('visible', 'true');

    // Get references to hit planes
    const greenHitPlane = document.querySelector('#greenHitPlane');
    const blueHitPlane = document.querySelector('#blueHitPlane');

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

      // Collision detection using bounding box
      if (this.checkCollisionWithBoundingBox(ball, greenHitPlane)) {
        this.showHitbox(greenHitPlane);
      }

      if (this.checkCollisionWithBoundingBox(ball, blueHitPlane)) {
        this.showHitbox(blueHitPlane);
      }

      if (newY <= -0.25 || newZ < -5) {
        clearInterval(interval);
        ball.setAttribute('visible', 'false');
        ball.setAttribute('position', { x: 0, y: 0.2, z: 0 }); // Reset position
      }
    }, 50);
  },

  checkCollisionWithBoundingBox: function (ball, plane) {
    const ballBox = new THREE.Box3().setFromObject(ball.object3D);
    const planeBox = new THREE.Box3().setFromObject(plane.object3D);
    return ballBox.intersectsBox(planeBox);
  },

  showHitbox: function (hitPlane) {
    hitPlane.setAttribute('visible', 'true');
    setTimeout(() => {
      hitPlane.setAttribute('visible', 'false');
    }, 1000); // Hide after 1 second
  },
});
