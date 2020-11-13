import { CanvasBase } from '../global/canvasBase.js'
import { Point } from './point.js'

export class CanvasApp extends CanvasBase {
  constructor(data={}) {
    super({bgColor: data.bgColor})
    this.drawReady = true
    this.mouseX = 0
    this.mouseY = 0
    this.pointer = {x: 0, y: 0}
    this.prevMousePos = 0
    this.pointGap = data.gap
    this.pointCount = data.points
    this.point = []
    for (let i = 0; i < this.pointCount; i++) {
      const base = this.canvasWidth / 2 + (i + .5 - this.pointCount / 2) * this.pointGap
      this.point.push(new Point({base: base}))
    }
    this.mouseDown = false
    window.onmousedown = this.startMove.bind(this)
    window.ontouchstart = e => this.startMove(e, true)
    window.onmouseup = this.endMove.bind(this)
    window.ontouchend = this.endMove.bind(this)
    window.ontouchmove = this.onMove.bind(this)
    window.onmousemove = this.onMove.bind(this)
    requestAnimationFrame(this.draw.bind(this))
  }

  resizeCanvas() {
    CanvasBase.prototype.resizeCanvas.call(this)
    this.point?.forEach((point, index) => {
      const base = this.canvasWidth / 2 + (index + .5 - this.pointCount / 2) * this.pointGap
      point.resize(base)
    })
  }


  startMove(event, isTouch) {
    const e = event || window.event
    this.mouseDown = true
    if (isTouch) {
      this.pointer = e.type === 'touchmove'
      ? {x: e.touches[0].pageX, y:e.touches[0].pageY}
      : {x: e.pageX, y: e.pageY}
    }
    this.prevMousePos = this.pointer.x
  }

  endMove() {
    this.mouseDown = false
    this.point.forEach(point => {
      point.pointerDrop()
    })
  }

  onMove(event) {
    const e = event || window.event
    this.pointer = e.type === 'touchmove'
      ? {x: e.touches[0].pageX, y:e.touches[0].pageY}
      : {x: e.pageX, y: e.pageY}
  }

  checkGrab() {
    if (this.mouseDown) {
      this.point.forEach(point => {
        if (this.prevMousePos < point.x ^ this.pointer.x < point.x) {
          point.active = true
        }
        if (point.active) {
          point.moveTo(this.pointer.x, this.pointer.y)
          if (Math.abs(this.pointer.x - point.base) > this.pointGap) {
            point.pointerDrop()
          }
        }
      })
      this.prevMousePos = this.pointer.x
    }
  }

  draw() {
    this.checkGrab()
    const canvas = this.canvas
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    ctx.lineWidth = 2
    this.point.forEach(point => {
      ctx.beginPath()
      ctx.moveTo(point.base, - 5)
      ctx.lineTo(point.x, point.y)
      ctx.lineTo(point.base, this.canvasHeight + 5)
      ctx.stroke()
      point.active || point.release()
    });

    requestAnimationFrame(this.draw.bind(this))
  }

}