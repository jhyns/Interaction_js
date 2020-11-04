export class CanvasBase {
  constructor(data) {
    this.initCanvas(data.bgColor || '#fff')
    document.body.appendChild(this.canvas)
    window.addEventListener('resize', () => this.resizeCanvas())
  }

  initCanvas(bgColor) {
    this.canvas = document.createElement('canvas')
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
  }

  resizeCanvas() {
    const width = window.innerWidth
    const height = window.innerHeight
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
  }
}

export class WebglCanvasBase {
  constructor() {
    this.initCanvas()
    document.body.appendChild(this.canvas)
    window.addEventListener('resize', () => this.resizeCanvas())
  }

  initCanvas() {
    this.canvas = document.createElement('canvas')
    this.gl = this.canvas.getContext('wdbgl') || this.canvas.getContext('experimental-webgl')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.canvasWidth = window.innerWidth
    this.canvasHeight = window.innerHeight
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  resizeCanvas() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.canvas.width = width
    this.canvas.height = height
    this.canvasWidth = width
    this.canvasHeight = height
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type)
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw this.gl.getShaderInfoLog(shader)
    }
    return shader
  }

  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram()
    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw this.gl.getProgramInfoLog(program)
    }
    return program
  }
}
