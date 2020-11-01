export class Point {
  constructor(input) {
    // this.canvas = canvas
    this.base = input.base || 0
    this.x = input.base || 0
    this.y = 0
    this.acc = 0
    this.v = 0
    this.force = .8
    this.active = false
  }

  moveTo(x, y) {
    this.x = x
    this.y = y
  }

  resize(base) {
    this.base = base
    this.x = base
  }

  pointerDrop() {
    if (this.active) {
      this.active = false
      this.acc = 0
      this.v = 0
    }
  }

  release() {
    const dx = this.x > this.base
    if (this.acc === 0 && this.x != this.base) {
      this.acc = (this.base - this.x) / 5
    }
    this.v = (this.v + this.acc) * this.force
    if (dx ^ this.x + this.v > this.base) {
      this.changeDirection()
    } else {
      this.x += this.v
    }
    if (this.acc && Math.abs(this.x - this.base) < .2 && Math.abs(this.acc) < .2) {
      this.init()
    }
  }
  
  changeDirection() {
    this.x = this.base + (this.base - this.x) * this.force
    this.acc = -this.acc * this.force
  }

  init() {
    this.x = this.base
    this.y = 0
    // this.prevX = centerX
    this.acc = 0
    this.v = 0
    this.active = false
  }
}