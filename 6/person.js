export class Person {
  constructor(data) {
    this.bgColor = data.bgColor || '#fff'
    this.color = data.color || '#121212'
    this.x = data.x || 100
    this.y = data.y || 100
    this.r = data.r || 5
    this.rad = 0
    this.prevRad = 0
    this.nextRad = 0
    this.distance = data.distance || 50
    this.fov = data.fov || .5
    this.speed = data.speed || .1
    this.light = true
    window.onclick = this.toggleLight.bind(this)
  }

  toggleLight() {
    this.light = !this.light
  }

  moveTo(x, y) {
    const dx = x - this.x
    const dy = y - this.y
    const dir = -Math.PI * (dx < 0)
    this.prevRad = this.nextRad
    this.nextRad = dx === 0 ? 0 : Math.atan(dy / dx) + dir
    if (this.nextRad - this.prevRad > 4) {  // anti clockwisw
      this.rad += Math.PI * 2
    } else if (this.prevRad - this.nextRad > 4) { // clockwise
      this.rad -= Math.PI * 2
    }
    this.rad += (this.nextRad - this.rad) * this.speed * 2
    this.x += dx * this.speed
    this.y += dy * this.speed
  }

  draw(ctx) {
    if (this.light) {
      const gradient = ctx.createRadialGradient(this.x, this.y, this.r, this.x, this.y, this.distance)
      gradient.addColorStop(0, this.color)
      gradient.addColorStop(1, this.bgColor)
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.distance, this.rad - this.fov / 2, this.rad + this.fov / 2, false)
      ctx.lineTo(this.x, this.y)
      ctx.fill()
    }
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
    ctx.fill()
  }
}