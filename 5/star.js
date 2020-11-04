export class Star {
  constructor(x, y, r, v, rad, maxTrailLength) {
    this.x = x
    this.y = y
    this.r = r
    this.v = r * v
    this.vX = Math.cos(rad) * this.v
    this.vY = Math.sin(rad) * this.v
    this.trailLength = 0
    this.maxTrailLength = maxTrailLength
  }

  move() {
    this.x += this.vX
    this.y += this.vY
    if (this.trailLength < this.maxTrailLength) {
      this.trailLength += this.v
    }
  }
}