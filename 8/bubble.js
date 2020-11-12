export class Bubble {
  constructor(x, y) {
    this.x = x
    this.y = y
    // this.dx = 0
    // this.dy = 0
    this.vx = Math.random() * 2 - 1
    this.vy = Math.random() * 2 - 1
    this.r = Math.random() * 90 + 10
  }

  draw(ctx) {
    ctx.beginPath()
    // ctx.arc(this.x + this.dx, this.y + this.dy, this.r, 0, Math.PI * 2, false)
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
    ctx.fill()
  }

  // move(x, y, canvasWidth, canvasHeight) {
  //   this.dx = (x - this.x) / canvasWidth * this.r / 2
  //   this.dy = (y - this.y)  / canvasHeight * this.r / 2
  move(x, y) {
    const dx = this.x - x
    const dy = this.y - y
    if (dx * dx + dy * dy < this.r * this.r) {
      this.vx += dx * .001
      this.vy += dy * .001
    } else {
      if (Math.abs(this.vx) > this.r * .01) {
        this.vx *= .97
      }
      if (Math.abs(this.vy) > this.r * .01) {
        this.vy *= .97
      }
    }
    this.x += this.vx
    this.y += this.vy
  }
}

export class Drop {
  constructor(x, y, r, vx, vy) {
    const rad = Math.random() * 2 * Math.PI
    this.x = Math.sin(rad) * r * Math.random() + x
    this.y = Math.cos(rad) * r * Math.random() + y
    this.r = Math.random() * r / 10 + 1
    this.vx = (this.x - x) / 10 + vx
    this.vy = (this.y - y) / 10 + vy
    this.acc = .7
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
    // ctx.fill()
    ctx.stroke()
  }

  move() {
    this.vx *= .99
    this.vy += this.acc
    this.x += this.vx
    this.y += this.vy
  }
}