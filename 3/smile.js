export class Smile {
  constructor(data) {
    this.x = data.x || 0
    this.y = data.y || window.innerHeight
    this.initSpeed = data.initSpeed || .05
    this.v = this.initSpeed
    this.color = data.color || '#000'
    this.size = data.size || 100
    this.point = new Point(this.x + this.size / 2, this.size / 2)
  }

  resize(x, y, size) {
    this.x = x
    this.y = y
    this.size = size
    this.point.resize(x + size / 2, size / 2)
  }
  
  setV(dx) {
    this.v = dx === 0 ? this.initSpeed : dx
  }
  
  draw(ctx, mouseDown) {
    const centerX = this.x + this.size / 2
    const centerY = this.y - this.size / 2
    const lineWidth = this.size * .1
    const isLeft = this.point.pos < centerX ? 1 : -1
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    ctx.fillRect(this.x, this.y - lineWidth, this.size / 2, lineWidth)
    ctx.fillRect(centerX - lineWidth / 2, this.y - (this.size + lineWidth) / 2, lineWidth, (this.size + lineWidth) / 2)
    ctx.beginPath()
    ctx.moveTo(this.point.pos, centerY)
    ctx.lineTo(centerX - isLeft, centerY - this.size / 2)
    ctx.lineTo(centerX + isLeft, centerY - this.size / 2)
    ctx.lineTo(2 * centerX - this.point.pos, centerY)
    ctx.lineWidth = this.size * .1
    ctx.stroke()
    if (!mouseDown) {
      if (Math.abs(this.v) > this.initSpeed) {
        this.v *= .98
      }
      this.point.move(this.v)
    }
  }
}


class Point {
  constructor(center, size) {
    this.center = center
    this.x = 0
    this.size = size
    this.pos = center
    // this.min = min
    // this.max = max
  }

  resize(center, size) {
    this.center = center
    this.size = size
    this.move(0)
  }

  move(dx) {
    this.x += dx
    this.pos = this.center + Math.cos(this.x) * this.size
  }
}