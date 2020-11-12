export class Ball {
  constructor(x, y, minR, maxR, maxV, canvasWidth, canvasHeight) {
    this.r = Math.random() * (maxR - minR) + minR
    this.x = x || Math.random() * canvasWidth,
    this.y = y || Math.random() * canvasHeight,
    this.vx = Math.random() * 2 * maxV - maxV
    this.vy = Math.random() * 2 * maxV - maxV
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
  }

  move() {
    this.x += this.vx
    if (this.x - this.r < 0) {
      this.x = this.r + 1
      this.vx = Math.abs(this.vx)
    } else if (this.x + this.r > this.canvasWidth) {
      this.x = this.canvasWidth - this.r
      this.vx = -Math.abs(this.vx)
    }
    this.y += this.vy
    if (this.y - this.r < 0) {
      this.y = this.r + 1
      this.vy = Math.abs(this.vy)
    } else if (this.y + this.r > this.canvasHeight) {
      this.y = this.canvasHeight - this.r
      this.vy = -Math.abs(this.vy)
    }
  }
}