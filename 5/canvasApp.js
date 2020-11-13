import { CanvasBase } from '../global/canvasBase.js'
import { Star } from './star.js'

export class CanvasApp extends CanvasBase {
  constructor(data={}) {
    super({bgColor: data.bgColor})
    this.color = data.color || '#fff'
    this.groundColor = data.groundColor || '#121212'
    this.groundFactor = 1 - data.groundFactor || .7
    this.skyHeight = this.groundFactor * this.canvasHeight
    this.maxTrailLength = data.maxTrailLength || 50
    this.rad = data.rad || 2.7
    this.v = data.v || 3
    this.minR = data.minR || 1
    this.maxR = data.maxR || 5
    this.star = []
    this.resizeBackground()

    requestAnimationFrame(this.draw.bind(this))
  }

  resizeCanvas() {
    CanvasBase.prototype.resizeCanvas.call(this)
    this.resizeBackground()
  }

  resizeBackground() {
    this.skyHeight = this.groundFactor * this.canvasHeight
    this.skygradient = this.ctx.createLinearGradient(0, 0, 0, this.skyHeight)
    this.skygradient.addColorStop(0, '#121212')
    this.skygradient.addColorStop(1, this.bgColor)
  }

  makeStar() {
    if (Math.random() < .02) {
      // this.star.push(new Star(Math.floor(Math.random() * this.canvasWidth * 2), Math.floor(Math.random() * this.skyHeight / 2), Math.floor(Math.random() * (this.maxR - this.minR) + this.minR), this.v, this.rad, this.maxTrailLength))
      this.star.push(new Star(Math.random() * this.canvasWidth * 2, Math.random() * this.skyHeight / 2, Math.random() * (this.maxR - this.minR) + this.minR, this.v, this.rad, this.maxTrailLength))
    }
  }

  draw() {
    this.drawBackground()
    this.makeStar()
    this.drawStar()
    this.drawGround()
    requestAnimationFrame(this.draw.bind(this))
  }

  drawBackground() {
    // this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.ctx.fillStyle = this.skygradient
    this.ctx.fillRect(0, 0, this.canvasWidth, this.skyHeight)
  }

  drawGround() {
    this.ctx.fillStyle = this.groundColor
    this.ctx.fillRect(0, this.skyHeight, this.canvasWidth, this.canvasHeight - this.skyHeight)
  }

  drawStar() {
    this.ctx.beginPath()
    this.star.forEach((star, index) => {
      // const trailLength = star.time * star.maxTrailLength
      const trailX = star.x + Math.cos(Math.PI - this.rad) * star.trailLength
      const trailY = star.y - Math.sin(Math.PI - this.rad) * star.trailLength
      const angle = this.rad - Math.asin(star.v / this.maxTrailLength)
      const startAngle = angle - Math.PI / 2
      const endAngle = angle + Math.PI / 2
      this.ctx.fillStyle = '#fafafaa0'
      this.ctx.moveTo(trailX, trailY)
      this.ctx.arc(star.x, star.y, star.r, startAngle, endAngle, false)
      this.ctx.lineTo(trailX, trailY)
      // this.ctx.closePath()
      if (star.x < -star.maxTrailLength || star.y > this.skyHeight + star.maxTrailLength) {
        this.star.splice(index, 1)
      }
      star.move()
    })
    this.ctx.fill()
  }

}