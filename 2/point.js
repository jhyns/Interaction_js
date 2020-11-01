export class Point {
  constructor(x, y, speed) {
    this.color = '#' + (Math.random() * 16777215 << 0).toString(16).padStart(6, '0')
    this.r = 0
    this.x = x
    this.y = y
    this.speed = speed
  }

  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
    ctx.fill()
    this.r += this.speed
  }
}