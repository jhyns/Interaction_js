import {
  CanvasBase
} from '../global/canvasBase.js'

export class Phone extends CanvasBase {
  constructor(data) {
    super({
      bgColor: '#121212'
    })
    this.number = ''
    this.inputX = data.hasOwnProperty('x') ? data.x : 100
    this.inputY = data.hasOwnProperty('y') ? data.y : 100
    this.inputSize = data.hasOwnProperty('size') ? data.size : 200
    this.dialButtonRad = data.hasOwnProperty('dialButtonRad') ? data.dialButtonRad : .5
    this.fingerStopRad = data.hasOwnProperty('fingerStopRad') ? data.fingerStopRad : 1
    this.dialWidth = data.hasOwnProperty('dialWidth') ? data.dialWidth : 3
    this.sizeRatio = data.hasOwnProperty('sizeRatio') ? data.sizeRatio : 4
    this.callFunction = data.hasOwnProperty('callFunction') ? data.callFunction : n => { console.log(n) }
    this.stickWidth = data.hasOwnProperty('stickWidth') ? data.stickWidth : .1
    this.buttonCount = data.hasOwnProperty('buttonCount') ? data.buttonCount : 10
    this.startRad = data.hasOwnProperty('startRad') ? data.startRad : 0
    this.speed = data.hasOwnProperty('speed') ? data.speed : .1
    this.inputTime = data.hasOwnProperty('inputTime') ? data.inputTime : 2000
    this.moving = false
    this.prevRad = 0
    this.rad = 0
    this.pointerRad = 0
    this.rotateRad = 0
    this.maxRad = 0
    this.setPhoneSize()

    window.onmousedown = this.moveStart.bind(this)
    window.onmousemove = this.pointerMove.bind(this)
    window.onmouseup = this.moveEnd.bind(this)

    window.ontouchstart = this.moveStart.bind(this)
    window.ontouchmove = this.pointerMove.bind(this)
    window.ontouchend = this.moveEnd.bind(this)

    requestAnimationFrame(this.loop.bind(this))
  }

  setPhoneSize() {
    this.x = this.inputX < 1 ? this.canvasWidth * this.inputX : this.inputX
    this.y = this.inputY < 1 ? this.canvasHeight * this.inputY : this.inputY
    this.size = this.inputSize < 1 ? Math.min(this.canvasWidth, this.canvasHeight) * this.inputSize : this.inputSize
    this.r = this.size / 2
    this.lineWidth = Math.max(Math.floor(this.r * .01) * 2, 2)
    this.dialInnerWidth = this.r / 2
    this.dialR = this.r * .75
    this.dialWidth = this.r / this.dialWidth
    this.dialButtonR = this.dialWidth * .4
  }

  resizeCanvas() {
    CanvasBase.prototype.resizeCanvas.call(this)
    this.setPhoneSize()
  }

  getRad(x, y) {
    const dx = this.x - x
    const dy = this.y - y
    return Math.atan2(dy, dx) + Math.PI
  }

  moveStart(e) {
    const pointer = e.touches ? {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    } : {
      x: e.pageX,
      y: e.pageY,
    }
    const pointerDistance = Math.sqrt(Math.pow(pointer.x - this.x, 2) + Math.pow(pointer.y - this.y, 2))
    const dialRad = this.fingerStopRad + this.dialButtonRad * this.buttonCount
    this.prevRad = this.getRad(pointer.x, pointer.y)
    if (
      pointerDistance < this.r &&
      pointerDistance > this.dialInnerWidth &&
      this.prevRad < dialRad + this.rotateRad + this.startRad &&
      (this.prevRad > this.fingerStopRad + this.rotateRad + this.startRad || this.prevRad < dialRad - Math.PI * 2 + this.rotateRad + this.startRad)
    ) {
      const maxRad = (this.fingerStopRad - this.stickWidth - this.prevRad + this.rotateRad) % (Math.PI * 2)
      window.clearTimeout(this.timeout)
      this.maxRad = maxRad < 0 ? maxRad + Math.PI * 2 : maxRad
      this.rad = this.prevRad
      this.moving = true
    }
  }

  pointerMove(e) {
    const pointer = e.touches ? {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    } : {
      x: e.pageX,
      y: e.pageY,
    }
    if (this.moving) {
      this.prevRad = this.rad
      this.rad = this.getRad(pointer.x, pointer.y)
      const dRad = this.rad - this.prevRad
      if (dRad < -4) {
        this.pointerRad += dRad + Math.PI * 2
      } else if (dRad > 4) {
        this.pointerRad += dRad - Math.PI * 2
      } else {
        this.pointerRad += dRad
      }
    }
  }

  moveEnd() {
    if (this.moving) {
      this.moving = false
      if (this.rotateRad !== 0) {
        const number = (Math.floor((this.rotateRad - Math.PI * 2 + this.dialButtonRad * this.buttonCount + this.stickWidth + this.startRad) / this.dialButtonRad)) % this.buttonCount
        if (number >= 0) {
          this.number += ((number + 1) % 10).toString()
          if (this.number) {
            this.timeout = setTimeout(() => {
              this.callFunction(this.number)
            }, this.inputTime)
          }
        }
      }
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.drawNumber()
    this.drawDial()
    this.drawDialFrame()
    this.moveDial()

    requestAnimationFrame(this.loop.bind(this))
  }

  moveDial() {
    if (!this.moving && this.pointerRad) {
      this.pointerRad = Math.max(this.rotateRad - this.speed, 0)
    }
    this.rotateRad = Math.min(Math.max(this.pointerRad, 0), this.maxRad)
  }

  drawDialFrame() {
    const innerX = this.dialInnerWidth
    this.ctx.lineWidth = this.lineWidth
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true)
    this.ctx.moveTo(this.x + innerX, this.y)
    this.ctx.arc(this.x, this.y, innerX, 0, Math.PI * 2, true)
    this.ctx.stroke()
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.r * 1.05, this.fingerStopRad, this.fingerStopRad - this.stickWidth, true)
    this.ctx.arc(this.x, this.y, innerX * 1.2, this.fingerStopRad - this.stickWidth * .7, this.fingerStopRad - this.stickWidth * .3, false)
    this.ctx.fill()
  }

  drawDial() {
    const initFrameRad = this.rotateRad + this.fingerStopRad + this.dialButtonRad / 2
    this.ctx.lineCap = 'round'
    this.ctx.textBaseline = 'middle'
    this.ctx.font = `${this.dialWidth / 2}px malgun gothic`
    this.ctx.textAlign = 'center'
    this.ctx.strokeStyle = '#404040'
    this.ctx.fillStyle = '#fafafa'
    this.ctx.lineWidth = this.dialWidth
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.dialR, initFrameRad + this.dialButtonRad * (this.buttonCount - 1) + this.startRad, initFrameRad + this.startRad, true)
    this.ctx.stroke()
    this.ctx.strokeStyle = '#fafafa'
    this.ctx.lineWidth = this.lineWidth / 2
    this.ctx.beginPath()
    for (let i = 0; i < this.buttonCount; i++) {
      const rad = i * this.dialButtonRad + this.rotateRad + this.fingerStopRad + this.dialButtonRad / 2 + this.startRad
      const x = this.x + Math.cos(rad) * this.dialR;
      const y = this.y + Math.sin(rad) * this.dialR;
      this.ctx.moveTo(x + this.dialButtonR, y)
      this.ctx.arc(x, y, this.dialButtonR, 0, Math.PI * 2, false)
      this.ctx.fillText((this.buttonCount - i) % 10, x, y)
    }
    this.ctx.stroke()
  }

  drawNumber() {
    this.ctx.fillText(this.number, this.x, this.y, this.dialInnerWidth * 2)
  }
}