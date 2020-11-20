import { CanvasBase } from '../global/canvasBase.js'
import { Bolt } from './bolt.js'

export class CanvasApp extends CanvasBase {
  constructor(data) {
    super({bgColor: data.bgColor})
    document.body.style.backgroundColor = data.bgColor
    this.bolt = []
    this.ctx.shadowBlur = 30
    this.ctx.shadowColor = 'rgba(255, 255, 255, .3)'
    
    window.onclick = this.onClick.bind(this)

    requestAnimationFrame(this.loop.bind(this))
  }

  onClick(e) {
    this.bolt.push(new Bolt(e.pageX, e.pageY, this.canvasHeight))
  }

  loop() {
    this.clearBackground()
    this.randomBolt()
    this.drawBolt()

    requestAnimationFrame(this.loop.bind(this))
  }

  clearBackground() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  randomBolt() {
    if (Math.random() < .005) {
      this.bolt.push(new Bolt(
        Math.random() * this.canvasWidth,
        Math.random() * this.canvasHeight * .75,
        this.canvasHeight
      ))
    }
  }

  drawBolt() {
    this.bolt.forEach((bolt, index) => {
      bolt.draw(this.ctx, this.canvasWidth, this.canvasHeight)
      if (bolt.boltOpacity <= 0) {
        this.bolt.splice(index, 1)
      }
    })
  }


}