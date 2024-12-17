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
        this.fireCannonBall(this.isGreenTurn ? this.greenBall : this.blueBall, this.isGreenTurn ? this.greenCannon : this.blueCannon);

        setTimeout(() => {
          this.isGreenTurn = !this.isGreenTurn; // Switch turns
          this.startCountdown();
        }, 500);
      }
    }, 1000);
  },

  fireCannonBall: function (ball, cannon) {
    ball.setAttribute('visible', 'true');
    
    // Set ball position to the cannon tip dynamically
    const cannonPos = cannon.object3D.position;
    const cannonRot = cannon.object3D.rotation;
    
    // Start ball from the cannon tip with slight offset
    const startPos = {
      x: cannonPos.x,
      y: cannonPos.y + 0.2,
      z: cannonPos.z + 0.9, // Adjust offset based on cannon orientation
    };

    ball.setAttribute('position', startPos);

    let time = 0;

    // Simulate projectile motion (parabolic arc)
    const interval = setInterval(() => {
      time += 0.05;

      // Calculate projectile position based on time
      let newX = startPos.x; // No x-axis movement
      let newY = startPos.y + (0.5 - 0.5 * 9.8 * time * time); // Gravity effect on Y
      let newZ = startPos.z + 0.1 * time * 30; // Forward motion (adjust multiplier for speed)

      ball.setAttribute('position', { x: newX, y: newY, z: newZ });

      // Collision detection (ground plane at y <= 0)
      if (newY <= 0 || newZ < -5) {
        clearInterval(interval);
        ball.setAttribute('visible', 'false');
        ball.setAttribute('position', { x: 0, y: 0.2, z: 0 }); // Reset position
      }
    }, 50);
  },
});
