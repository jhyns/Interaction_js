export class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.color = Math.floor(Math.random() * 16777216).toString(16)
  }

  move(canvasWidth, canvasHeight) {
    const maxMove = 50
    if (this.x > canvasWidth) {
      this.x -= Math.random() * maxMove
    } else if (this.x < 0) {
      this.x += Math.random() * maxMove
    } else {
      this.x += Math.random() * maxMove * 2 - maxMove
    }
    if (this.y > canvasHeight) {
      this.y -= Math.random() * maxMove
    } else if (this.y < 0) {
      this.y += Math.random() * maxMove
    } else {
      this.y += Math.random() * maxMove * 2 - maxMove
    }
  }

  draw(ctx, canvasWidth, canvasHeight) {
    ctx.beginPath()
    ctx.strokeStyle = `#${this.color}`
    ctx.moveTo(this.x, this.y)
    this.move(canvasWidth, canvasHeight)
    ctx.lineTo(this.x, this.y)
    ctx.stroke()
    ctx.closePath()
  }
}
