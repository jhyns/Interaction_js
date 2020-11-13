import { CanvasBase } from '../global/canvasBase.js'
import { Point } from './point.js'

export class CanvasApp extends CanvasBase {
  constructor(data={}) {
    super({bgColor: data.bgColor})
    this.speed = data.speed || 10
    this.canvas.addEventListener('click', e => this.click(e))
    this.point = []
  }

  click(e) {
    this.point.push(new Point(e.pageX, e.pageY, this.speed))
    if (this.point.length === 1) {
      requestAnimationFrame(this.draw.bind(this))
    }
  }

  draw() {
    const ctx = this.canvas.getContext('2d')
    const maxX = Math.max(this.point[0].x, this.canvasWidth - this.point[0].x)
    const maxY = Math.max(this.point[0].y, this.canvasHeight - this.point[0].y)
    if (maxX * maxX + maxY * maxY < Math.pow(this.point[0].r, 2)) {
      this.bgColor = this.point[0].color
      this.point.shift()
    }
    ctx.fillStyle = this.bgColor
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.point.forEach(point => {
      point.draw(ctx)
    })

    const raf = requestAnimationFrame(this.draw.bind(this))
    if (this.point.length === 0) {
      cancelAnimationFrame(raf)
    }
  }

}