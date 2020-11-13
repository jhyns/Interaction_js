import { CanvasBase } from '../global/canvasBase.js'
import { Person } from './person.js'

export class CanvasApp extends CanvasBase {
  constructor(data={}) {
    super({bgColor: data.bgColor})
    this.x = this.canvasWidth / 2
    this.y = this.canvasHeight / 2
    this.person = new Person({
      color: '#fafafa',
      bgColor: this.bgColor,
      x: this.canvasWidth / 2,
      y: this.canvasHeight / 2,
      r: 5,
      distance: 150,
      fov: .75,
      speed: .075,
    })
    window.onmousemove = this.mouseMove.bind(this)
    window.ontouchmove = e => this.mouseMove(e, true)

    requestAnimationFrame(this.draw.bind(this))
  }

  mouseMove(event, isTouch=false) {
    const e = event || window.event
    if (isTouch) {
      this.x = e.touches[0].pageX
      this.y = e.touches[0].pageY
    } else {
      this.x = e.pageX
      this.y = e.pageY
    }
  }

  draw() {
    this.ctx.fillStyle = this.bgColor
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.person.draw(this.ctx)
    this.person.moveTo(this.x, this.y)

    requestAnimationFrame(this.draw.bind(this))
  }

}