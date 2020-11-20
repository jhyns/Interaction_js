import { CanvasBase } from '../global/canvasBase.js'
import { Point } from './point.js'

export class CanvasApp extends CanvasBase {
  constructor(data) {
    super({bgColor: data.bgColor})
    this.point = []
    this.point.push(new Point(this.canvasWidth / 2, this.canvasHeight / 2))
    this.x = this.canvasWidth / 2
    this.y = this.canvasHeight / 2
    // this.ctx.strokeStyle = '#fafafa'
    this.ctx.lineWidth = 2
    this.ctx.lineCap = 'round'

    window.onclick = this.onClick.bind(this)

    requestAnimationFrame(this.loop.bind(this))
  }

  onClick(e) {
    this.point.push(new Point(e.pageX, e.pageY))
  }

  loop() {
    this.drawPoint()
    requestAnimationFrame(this.loop.bind(this))
  }

  drawPoint() {
    this.point.forEach(point => {
      point.draw(this.ctx, this.canvasWidth, this.canvasHeight)
    })
  }
}