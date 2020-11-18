export class Bubble {
  constructor(x, y, r) {
    this.x = x
    this.y = y
    // this.dx = 0
    // this.dy = 0
    this.vx = Math.random() * 2 - 1
    this.vy = Math.random() * 5 - 10
    // this.r = Math.random() * 90 + 10
    this.r = r
  }

  draw(ctx) {
    ctx.lineWidth = this.r * .1
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r * .78, 5, 6.5, false)
    ctx.stroke()
  }

  move(x, y) {
    if (x && y) {
      const dx = this.x - x
      const dy = this.y - y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < this.r) {
        this.vx += dx * (1 - dist / this.r) * .03
        this.vy += dy * (1 - dist / this.r) * .03
      } else {
        this.setSpeed()
      }
    } else {
      this.setSpeed()
    }
    this.x += this.vx
    this.y += this.vy
  }

  setSpeed() {
    if (Math.abs(this.vx) > this.r * .01) {
      this.vx *= .99
    }
    if (Math.abs(this.vy) > this.r * .01) {
      this.vy *= .99
    }
  }
}

export class Drop {
  constructor(x, y, r, vx, vy) {
    const rad = Math.random() * 2 * Math.PI
    this.x = Math.sin(rad) * r * Math.random() + x
    this.y = Math.cos(rad) * r * Math.random() + y
    this.r = Math.random() * r / 15 + 2
    this.vx = (this.x - x) / 10 + vx
    this.vy = (this.y - y) / 10 + vy
    this.acc = .7
  }

  draw(ctx) {
    ctx.lineWidth = this.r * .2
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.stroke()
  }

  move() {
    this.vx *= .99
    this.vy += this.acc
    this.x += this.vx
    this.y += this.vy
  }
}