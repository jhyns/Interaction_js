export class Bolt {
  constructor(x, y, canvasHeight) {
    this.flashOpacity = 1
    this.boltOpacity = 1
    this.x = x
    this.y = y
    this.thickness = Math.floor(Math.random() * 3 + 2)
    this.branch = []
    this.direction = Math.PI * 1.5
    this.createLightning(x, y, canvasHeight)
  }

  createLightning(initX, initY, canvasHeight) {
    let x = initX
    let y = initY
    while (y < canvasHeight) {
      x += Math.random() * 10 - 5
      y += Math.random() * 10
      this.branch.push({
        x: x,
        y: y,
      })
    }
  }
  
  moveFlash() {
    if (this.flashOpacity > 0) {
      this.flashOpacity -= .1
    }
    if (this.boltOpacity > 0) {
      this.boltOpacity -= .02
    }
  }

  flashBolt(ctx, canvasWidth, canvasHeight) {
    if (this.flashOpacity > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.flashOpacity})`
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    }
    this.moveFlash()
  }

  drawLightning(ctx) {
    ctx.beginPath()
    ctx.lineWidth = this.thickness
    ctx.moveTo(this.x, this.y)
    this.branch.forEach(branch => {
      ctx.lineTo(branch.x, branch.y)
    })
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.boltOpacity})`
    ctx.stroke()
    ctx.closePath()
  }

  draw(ctx, canvasWidth, canvasHeight) {
    this.flashBolt(ctx, canvasWidth, canvasHeight)
    this.drawLightning(ctx)
    this.moveFlash()
  }
}