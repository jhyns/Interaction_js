export class Ball {
  constructor(x, y, r) {
    this.x = x
    this.y = y
    this.r = r
    this.v = 0
    this.moving = true
  }

  move(acc, skyHeight, bounce) {
    if(this.moving) {
      const maxY = skyHeight - this.r
      this.v += acc
      this.y += this.v
      if (this.y + this.v * .0 > maxY) {
        this.y = 2 * maxY - this.y + acc
        this.v *= -bounce
        if (this.v > -acc) {
          this.y = maxY
          this.moving = false
        }
      }
    }
  }
}