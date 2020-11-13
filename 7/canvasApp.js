import { WebglCanvasBase } from '../global/canvasBase.js'
import { Ball } from './ball.js'

export class CanvasApp extends WebglCanvasBase {
  constructor(data={}) {
    super()
    this.color = data.color || 'vec4(.9, .9, .9, 1.0)'
    this.bgColor = data.bgColor || 'vec4(.0, .0, .0, 1.0)'
    // this.ballNum = data.ballNum || 5
    this.minR = data.minR || 10
    this.maxR = data.maxR || 50
    this.maxV = data.maxV || 5
    this.balls = []
    this.initProgram()
    window.onclick = this.createBall.bind(this)

    requestAnimationFrame(this.draw.bind(this))
  }

  initProgram() {
    this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, .0, 1.0);
    }
    `),
    this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, `
    precision highp float;
    uniform vec3 metaballs[${this.balls.length || 1}];
    const float WIDTH = ${this.canvasWidth}.0;
    const float HEIGHT = ${this.canvasHeight}.0;
    void main() {
      float x = gl_FragCoord.x;
      float y = gl_FragCoord.y;
      float v = .0;
      for (int i = 0; i < ${this.balls.length}; i++) {
        vec3 mb = metaballs[i];
        float dx = mb.x - x;
        float dy = mb.y - y;
        float r = mb.z;
        v += r * r / (dx * dx + dy * dy);
      }
      if (v > 1.0) {
        gl_FragColor = ${this.color};
      } else {
        gl_FragColor = ${this.bgColor};
      }
    }
    `),
    this.program = this.createProgram(this.vertexShader, this.fragmentShader)

    this.gl.useProgram(this.program)
    const vertexData = new Float32Array([
        -1.0,   1.0,
        -1.0,  -1.0,
         1.0,   1.0,
         1.0,  -1.0,
    ])
    const vertexDataBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexDataBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexData, this.gl.STATIC_DRAW)

    const positionHandle = this.gl.getAttribLocation(this.program, 'position')
    this.gl.enableVertexAttribArray(positionHandle)
    this.gl.vertexAttribPointer(
      positionHandle,
      2,
      this.gl.FLOAT,
      false,
      8,
      0
    )

    this.ballsHandle = this.gl.getUniformLocation(this.program, 'metaballs')
  }

  resizeCanvas() {
    WebglCanvasBase.prototype.resizeCanvas.call(this)
    this.balls.forEach(ball => {
      ball.canvasWidth = this.canvasWidth
      ball.canvasHeight = this.canvasHeight
    })
  }

  createBall(event) {
    const e = event || window.event
    this.balls.push(new Ball(
      e.pageX, this.canvasHeight - e.pageY,
      this.minR, this.maxR, this.maxV
      , this.canvasWidth, this.canvasHeight
    ))
    this.initProgram()
  }

  draw() {
    if (this.balls.length) {
      const dataToSend = new Float32Array(3 * this.balls.length)
      this.balls.forEach((ball, index) => {
        const baseIndex = 3 * index
        ball.move()
        dataToSend[baseIndex] = ball.x
        dataToSend[baseIndex + 1] = ball.y
        dataToSend[baseIndex + 2] = ball.r
      })
      this.gl.uniform3fv(this.ballsHandle, dataToSend)
    }
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)


    requestAnimationFrame(this.draw.bind(this))
  }

}