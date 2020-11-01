export class Ball {
  constructor(x, y, canvasWidth, canvasHeight) {
    const random = Math.random()
    this.x = x
    this.y = y
    this.r = random * 20 + 5
    this.v = (1 - random) * 8 + 2
    this.rad = Math.random() * Math.PI * 2
    this.brightness = Math.floor(Math.random() * 200) + 55
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
  }

  move() {
    if (this.x <= this.r || this.x >= this.canvasWidth - this.r) {
      this.rad = Math.PI - this.rad
    }
    if (this.y <= this.r || this.y >= this.canvasHeight - this.r) {
      this.rad = -this.rad
    }
    this.x += this.v * Math.cos(this.rad)
    this.y += this.v * Math.sin(this.rad)
    if (this.x <= this.r) {
      this.x = this.r
    } else if (this.x >= this.canvasWidth - this.r) {
      this.x = this.canvasWidth - this.r
    }
    if (this.y <= this.r) {
      this.y = this.r
    } else if (this.y >= this.canvasHeight - this.r) {
      this.y = this.canvasHeight - this.r
    }
  }
}
