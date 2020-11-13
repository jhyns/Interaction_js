import { CanvasBase } from '../global/canvasBase.js'
import { Smile } from './smile.js'

export class CanvasApp extends CanvasBase {
  constructor(data={}) {
    super({bgColor: data.bgColor})
    this.groundColor = data.groundColor || '#000'
    this.color = data.color || '#fff'
    this.initSpeed = data.initSpeed || .1
    this.xFactor = data.xFactor || .4
    this.groundFactor = data.groundFactor || .2
    this.skyColor = data.dark ? '#121212' : '#fafafa'
    this.resizeSkyGradient()
    this.prevX = 0
    this.x = 0
    this.mouseDown = false
    this.smile = new Smile({
      x: this.xFactor * this.canvasWidth,
      y: (1 - this.groundFactor) * this.canvasHeight,
      initSpeed: this.initSpeed,
      color: this.color,
      size: Math.min(this.canvasWidth, this.canvasHeight) * .2,
    })
    window.onmousedown = this.moveStart.bind(this)
    window.ontouchstart = e => this.moveStart(e, true)
    window.onmouseup = this.moveEnd.bind(this)
    window.ontouchend = this.moveEnd.bind(this)
    window.onmousemove = this.onMove.bind(this)
    window.ontouchmove = e => this.onMove(e, true)
    requestAnimationFrame(this.draw.bind(this))
  }

  resizeCanvas() {
    CanvasBase.prototype.resizeCanvas.call(this)
    // resizeBackground()
    this.resizeSkyGradient()
    this.smile.resize(this.xFactor * this.canvasWidth, (1 - this.groundFactor) * this.canvasHeight, Math.min(this.canvasWidth, this.canvasHeight) * .2)
  }

  resizeSkyGradient() {
    this.skyGradient = this.ctx.createLinearGradient(0, 0, 0, (1 - this.groundFactor) * this.canvasHeight)
    this.skyGradient.addColorStop(0, this.skyColor)
    this.skyGradient.addColorStop(1, this.bgColor)
  }

  draw() {
    this.drawBackground()
    this.smile.draw(this.ctx, this.mouseDown)
    this.prevX = this.x
    requestAnimationFrame(this.draw.bind(this))
  }

  drawBackground() {
    this.ctx.fillStyle = this.skyGradient
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.ctx.fillStyle = this.groundColor
    this.ctx.fillRect(0, (1 - this.groundFactor) * this.canvasHeight, this.canvasWidth, this.groundFactor * this.canvasHeight)
    this.ctx.beginPath()
    this.ctx.fillStyle = '#fafafa'
    this.ctx.arc(this.canvasWidth * .8, this.canvasHeight * .2, 20, 0, Math.PI * 2, false)
    this.ctx.fill()
  }

  moveStart(event, isTouch=false) {
    this.mouseDown = true
    const e = event || window.event
    this.x = isTouch ? e.touches[0].pageX : e.pageX
  }

  moveEnd() {
    this.mouseDown = false
    this.smile.setV((this.x - this.prevX) / 100)
  }

  onMove(event, isTouch=false) {
    const e = event || window.event
    const x = isTouch ? e.touches[0].pageX : e.pageX
    const dx = x - this.x
    if (this.mouseDown) {
      this.smile.point.move(dx / 100)
      this.x = x
    }
  }
}