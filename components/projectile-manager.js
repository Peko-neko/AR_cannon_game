import { handleHit } from './health-manager.js';

export function fireCannonBall(ball, cannon, target) {
  ball.setAttribute('visible', 'true');
  this.fireSound.play();

  const targetPlane = document.querySelector(`#${target}HitPlane`);
  const cannonPos = cannon.object3D.position;

  const startPos = {
    x: cannonPos.x,
    y: cannonPos.y + 0.6,
    z: cannonPos.z + 0.9,
  };

  ball.setAttribute('position', startPos);

  let time = 0;
  const g = 9.8;
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

    if (checkCollisionWithBoundingBox(ball, targetPlane)) {
      handleHit.call(this, target);
      showHitbox(targetPlane);
      clearInterval(interval);
      ball.setAttribute('visible', 'false');
    } else if (newY <= -5 || newZ < -15) {
      clearInterval(interval);
      ball.setAttribute('visible', 'false');
    }
  }, 50);
}

function checkCollisionWithBoundingBox(ball, plane) {
  const ballBox = new THREE.Box3().setFromObject(ball.object3D);
  const planeBox = new THREE.Box3().setFromObject(plane.object3D);
  return ballBox.intersectsBox(planeBox);
}

function showHitbox(hitPlane) {
  hitPlane.setAttribute('visible', 'true');
  setTimeout(() => {
    hitPlane.setAttribute('visible', 'false');
  }, 1000);
}
