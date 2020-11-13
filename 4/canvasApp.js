import { CanvasBase } from '../global/canvasBase.js'
import { Ball } from './ball.js'

export class CanvasApp extends CanvasBase {
  constructor(data={}) {
    super({bgColor: data.bgColor})
    this.groundColor = data.groundColor || 'brown'
    this.acc = data.acc || 1
    this.bounce = data.bounce || .5
    this.minR = data.minR || 5
    this.maxR = data.maxR || 20
    this.skyHeight = this.canvasHeight * (data.groundFactor || .8)
    this.friction = data.friction || .9
    this.ctx = this.canvas.getContext('2d')
    this.skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.skyHeight)
    this.skyGradient.addColorStop(0, '#121212')
    this.skyGradient.addColorStop(1, this.bgColor)
    this.x = 0
    this.y = 0
    this.ball = []
    window.onclick = this.click.bind(this)
    requestAnimationFrame(this.draw.bind(this))
  }

  click(event) {
    const e = event || window.event
    this.ball.push(new Ball(e.pageX, e.pageY, Math.random() * (this.maxR - this.minR) + this.minR))
  }

  draw() {
    this.drawFloor()
    this.ctx.fillStyle = '#fafafa'
    this.ball.forEach(ball => {
      this.ctx.beginPath()
      this.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, false)
      this.ctx.fill()
      ball.move(this.acc, this.skyHeight, this.bounce)
    })

    requestAnimationFrame(this.draw.bind(this))
  }

  drawFloor() {
    this.ctx.fillStyle = this.skyGradient
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.ctx.fillStyle = this.groundColor
    this.ctx.fillRect(0, this.skyHeight, this.canvasWidth, this.canvasHeight - this.skyHeight)
  }
}