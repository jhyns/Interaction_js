import { CanvasBase } from '../global/canvasBase.js'
import { Ball } from './ball.js'

export class CanvasApp extends CanvasBase {
  constructor(data={}) {
    super({bgColor: data.bgColor})
    this.canvas.addEventListener('click', e => this.clickCanvas(e))
  }
  
  clickCanvas(e) {
    const x = e.pageX
    const y = e.pageY
    this.balls?.some((ball, index, obj) => {
      const dx = ball.x - x
      const dy = ball.y - y
      if (dx * dx + dy * dy < ball.r * ball.r) {
        obj.splice(index, 1)
        return true
      }
    }) || this.createBall(x, y)
  }

  drawClick(x, y, r, maxR) {
    const ctx = this.canvas.getContext('2d')
    ctx.beginPath()
    ctx.fillStyle = `rgba(0, 0, 0, ${1 - r / maxR})`
    ctx.filter = `blur(${r / 10}px)`
    ctx.arc(x, y, r * 1.1, 0, Math.PI * 2, false)
    ctx.fill()
    const raf = requestAnimationFrame(() => this.drawClick(x, y, r + 2, maxR))
    if (r > maxR) {
      cancelAnimationFrame(raf)
      this.activeDotCount--
    }
  }

  createBall(x, y) {
    // if (!this.balls) this.balls = []
    this.balls || (this.balls = [])
    this.balls.push(new Ball(x, y, this.canvasWidth, this.canvasHeight))
    if (this.balls.length === 1) requestAnimationFrame(this.drawBall.bind(this))
  }

  drawBall() {
    const canvas = this.canvas
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(0, 0, 0, .075)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    this.balls.forEach(ball => {
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, false)
      ctx.fillStyle = `rgba(${ball.brightness}, ${ball.brightness}, ${ball.brightness})`
      ctx.fill()
      ball.move()
    })
    requestAnimationFrame(this.drawBall.bind(this))
  }
}
