export class CanvasBase {
  constructor(bgColor='#fff', is2d=true) {
    this.is2d = is2d
    this.initCanvas(bgColor)
    // this.activeDotCount = 0
    document.body.appendChild(this.canvas)
    window.addEventListener('resize', () => this.resizeCanvas())
    // this.canvas.addEventListener('click', e => this.clickCanvas(e))
  }

  initCanvas(bgColor) {
    this.canvas = document.createElement('canvas')
    if (this.is2d) {
      this.ctx = this.canvas.getContext('2d')
      this.bgColor = bgColor
      this.ctx.fillStyle = bgColor
      const dpr = window.devicePixelRatio || 1
      const bsr = this.ctx.webkitBackingStorePixelRatio ||
      this.ctx.mozBackingStorePixelRatio ||
      this.ctx.backingStorePixelRatio || 1
      const scale = Math.max(2, dpr / bsr)
      this.canvas.width = window.innerWidth * scale
      this.canvas.height = window.innerHeight * scale
      this.canvasWidth = window.innerWidth
      this.canvasHeight = window.innerHeight
      this.ctx.fillStyle = this.bgColor
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.scale(scale, scale)
    } else {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      this.canvasWidth = window.innerWidth
      this.canvasHeight = window.innerHeight
      this.gl?.viewport(0, 0, this.canvas.width, this.canvas.height)
    }
  }
  
  initWebGL(canvas) {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      console.log('unable webgl')
    }
    return gl
  }

  resizeCanvas() {
    const width = window.innerWidth
    const height = window.innerHeight
    if (this.is2d) {
      const ctx = this.canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1
      const bsr = ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1
      const scale = Math.max(2, dpr / bsr)
      this.canvas.width = width * scale
      this.canvas.height = height * scale
      this.canvasWidth = width
      this.canvasHeight = height
      ctx.fillStyle = this.bgColor
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      ctx.scale(scale, scale)
    } else {
      this.canvas.width = width
      this.canvas.height = height
      this.canvasWidth = width
      this.canvasHeight = height
      this.gl?.viewport(0, 0, this.canvas.width, this.canvas.height)
    }
  }
}
