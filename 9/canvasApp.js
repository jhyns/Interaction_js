import {
  CanvasBase
} from '../global/canvasBase.js'
import {
  Bubble,
  Drop
} from './bubble.js'

export class CanvasApp extends CanvasBase {
  constructor(data={}) {
    super({bgColor: data.bgColor})
    this.topBgColor = data.topBgColor
    this.bottomBgColor = data.bottomBgColor
    this.x = null
    this.y = null
    this.dx = 0
    this.dy = 0
    this.bubble = []
    this.drop = []
    this.gradient = this.createGradient()
    window.onclick = this.click.bind(this)
    window.onmousemove = this.mouseMove.bind(this)
    window.ontouchstart = this.touchMove.bind(this)
    window.ontouchend = this.touchEnd.bind(this)
    window.ontouchmove = this.touchMove.bind(this)

    requestAnimationFrame(this.draw.bind(this))
  }

  resizeCanvas() {
    CanvasBase.prototype.resizeCanvas.call(this)
    this.gradient = this.createGradient()
  }

  createGradient() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight)
    gradient.addColorStop(0, this.topBgColor)
    gradient.addColorStop(1, this.bottomBgColor)

    return gradient
  }

  click(e) {
    this.touchEnd()
    this.popBubble(e.pageX, e.pageY)
  }

  mouseMove(e) {
    this.x = e.pageX
    this.y = e.pageY
  }

  touchMove(e) {
    this.x = e.touches[0].pageX
    this.y = e.touches[0].pageY
  }

  touchEnd() {
    this.x = null
    this.y = null
  }

  popBubble(x, y) {
    // this.bubble.slice().reverse().some((bubble, index) => {
    this.bubble.some((bubble, index) => {
      if (Math.pow(x - bubble.x, 2) + Math.pow(y - bubble.y, 2) < bubble.r * bubble.r) {
        for (let i = 0; i < bubble.r / 4; i++) {
          this.drop.push(new Drop(bubble.x, bubble.y, bubble.r, bubble.vx, bubble.vy))
        }
        // this.bubble.splice(-1 - index, 1)
        this.bubble.splice(index, 1)
        return true
      }
    })
  }

  draw() {
    this.createBubble()
    this.drawBackground()
    this.drawBubble()
    this.drawDrop()

    requestAnimationFrame(this.draw.bind(this))
  }

  createBubble() {
    if (Math.random() < .05) {
      const r = Math.random() * 40 + 10
      this.bubble.unshift(new Bubble(this.canvasWidth / 2, this.canvasHeight + r, r))
    }
  }

  drawBackground() {
    this.ctx.fillStyle = this.gradient
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  drawBubble() {
    this.ctx.fillStyle = '#fafafa10'
    this.ctx.strokeStyle = '#fafafa40'
    this.ctx.lineCap = 'round'
    
    this.bubble.forEach(bubble => {
      bubble.draw(this.ctx)
      bubble.move(this.x, this.y)
    })
    this.bubble.forEach((bubble, index) => {
      const r = bubble.r
      if (bubble.x < -r || bubble.x > this.canvasWidth + r || bubble.y < -r || bubble.y > this.canvasHeight + r) {
        this.bubble.splice(index, 1)
      }
    })
  }

  drawDrop() {
    this.drop.forEach(drop => {
      drop.draw(this.ctx)
      drop.move()
    })
    this.drop.forEach((drop, index) => {
      const r = drop.r
      if (drop.y > this.canvasHeight + r) {
        this.drop.splice(index, 1)
      }
    })
  }
}