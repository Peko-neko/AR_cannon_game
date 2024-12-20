export function updateHealthDisplays() {
  this.greenText.setAttribute('value', `Health: ${this.greenHealth}`);
  this.blueText.setAttribute('value', `Health: ${this.blueHealth}`);
}

export function handleHit(target) {
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
    updateHealthDisplays.call(this);
  }
}
