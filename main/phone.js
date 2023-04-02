import { CanvasBase } from '../global/canvasBase.js';

export class Phone extends CanvasBase {
  constructor({
    x = 100,
    y = 100,
    size = 200,
    dialButtonRad = 0.5,
    fingerStopRad = 1,
    sizeRatio = 4,
    callFunction = n => {
      console.log(n);
    },
    maxReceiverDistance = 0.2,
    stickWidth = 0.1,
    buttonCount = 10,
    startRad = 0,
    speed = 0.1,
    inputTime = 2000,
  }) {
    super({ bgColor: '#121212' });
    this.number = '';
    this.inputX = x;
    this.inputY = y;
    this.inputSize = size;
    this.dialButtonRad = dialButtonRad;
    this.fingerStopRad = fingerStopRad;
    this.dialWidth = 3;
    this.sizeRatio = sizeRatio;
    this.callFunction = callFunction;
    this.maxReceiverDistance = maxReceiverDistance;
    this.receiverDistance = 0;
    this.receiverPath = new Path2D();
    this.stickWidth = stickWidth;
    this.buttonCount = buttonCount;
    this.startRad = startRad;
    this.speed = speed;
    this.inputTime = inputTime;
    this.moving = false;
    this.hanging = false;
    this.prevRad = 0;
    this.rad = 0;
    this.pointerRad = 0;
    this.rotateRad = 0;
    this.ready = true;
    this.maxRad = 0;
    this.setPhoneSize();

    window.onmousedown = this.moveStart.bind(this);
    window.onmousemove = this.pointerMove.bind(this);
    window.onmouseup = this.moveEnd.bind(this);

    window.ontouchstart = this.moveStart.bind(this);
    window.ontouchmove = this.pointerMove.bind(this);
    window.ontouchend = this.moveEnd.bind(this);

    requestAnimationFrame(this.loop.bind(this));
  }

  setPhoneSize() {
    this.x = this.inputX < 1 ? this.canvasWidth * this.inputX : this.inputX;
    this.y = this.inputY < 1 ? this.canvasHeight * this.inputY : this.inputY;
    this.size =
      this.inputSize < 1
        ? Math.min(this.canvasWidth, this.canvasHeight) * this.inputSize
        : this.inputSize;
    this.r = this.size / 2;
    this.lineWidth = Math.max(Math.floor(this.r * 0.01) * 2, 2);
    this.dialInnerWidth = this.r / 2;
    this.dialR = this.r * 0.75;
    this.dialWidth = this.r / 3;
  }

  resizeCanvas() {
    CanvasBase.prototype.resizeCanvas.call(this);
    this.setPhoneSize();
  }

  getRad(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    return Math.atan2(dy, dx) + Math.PI;
  }

  moveStart(e) {
    const pointer = e.touches
      ? {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY,
        }
      : {
          x: e.pageX,
          y: e.pageY,
        };
    const pointerDistance = Math.sqrt(
      Math.pow(pointer.x - this.x, 2) + Math.pow(pointer.y - this.y, 2)
    );
    const dialRad = this.fingerStopRad + this.dialButtonRad * this.buttonCount;
    this.prevRad = this.getRad(pointer.x, pointer.y);
    if (
      pointerDistance < this.r &&
      pointerDistance > this.dialInnerWidth &&
      this.prevRad < dialRad + this.rotateRad + this.startRad &&
      (this.prevRad > this.fingerStopRad + this.rotateRad + this.startRad ||
        this.prevRad < dialRad - Math.PI * 2 + this.rotateRad + this.startRad)
    ) {
      const maxRad =
        (this.fingerStopRad - this.stickWidth - this.prevRad + this.rotateRad) %
        (Math.PI * 2);
      window.clearTimeout(this.timeout);
      this.maxRad = maxRad < 0 ? maxRad + Math.PI * 2 : maxRad;
      this.rad = this.prevRad;
      this.moving = true;
    }
    if (
      this.ctx.isPointInPath(this.receiverPath, 2 * pointer.x, 2 * pointer.y)
    ) {
      this.hanging = true;
      this.number = '';
      window.clearTimeout(this.timeout);
    }
  }

  pointerMove(e) {
    const pointer = e.touches
      ? {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY,
        }
      : {
          x: e.pageX,
          y: e.pageY,
        };
    if (this.moving) {
      this.prevRad = this.rad;
      this.rad = this.getRad(pointer.x, pointer.y);
      const dRad = this.rad - this.prevRad;
      if (dRad < -4 || dRad > 4) {
        this.pointerRad += dRad + Math.PI * 2;
      } else {
        this.pointerRad += dRad;
      }
    }
  }

  moveEnd() {
    this.moving = false;
    this.hanging = false;
    if (this.rotateRad === 0 || !this.isMovementComplete) return;
    const number =
      Math.floor(
        (this.rotateRad -
          Math.PI * 2 +
          this.dialButtonRad * this.buttonCount +
          this.stickWidth +
          this.startRad) /
          this.dialButtonRad
      ) % this.buttonCount;
    if (number < 0 || number > 10) return;
    this.number += ((number + 1) % 10).toString();
    if (this.number) {
      this.timeout = setTimeout(() => {
        this.callFunction(this.number);
      }, this.inputTime);
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawNumber();
    this.drawDial();
    this.drawDialFrame();
    this.drawReceiver();
    this.moveDial();
    this.moveReceiver();

    requestAnimationFrame(this.loop.bind(this));
  }

  moveDial() {
    if (this.rotateRad !== 0 && !this.moving) this.isMovementComplete = false;
    if (this.rotateRad === 0 && !this.moving) this.isMovementComplete = true;
    if (!this.moving && this.pointerRad) {
      this.pointerRad = Math.max(this.rotateRad - this.speed, 0);
    }
    this.rotateRad = Math.min(Math.max(this.pointerRad, 0), this.maxRad);
  }

  moveReceiver() {
    if (this.hanging) {
      this.receiverDistance = Math.min(
        this.receiverDistance + this.speed * 0.1,
        this.maxReceiverDistance
      );
    } else {
      this.receiverDistance = Math.max(
        this.receiverDistance - this.speed * 0.1,
        0
      );
    }
  }

  drawReceiver() {
    const y = this.y + this.receiverDistance * this.size;
    this.ctx.beginPath();
    this.receiverPath = new Path2D();
    this.receiverPath.moveTo(this.x + this.size, y - this.size * 0.7);
    this.receiverPath.bezierCurveTo(
      this.x + this.size,
      y - this.size * 0.85,
      this.x + this.size * 0.75,
      y - this.size * 1.1,
      this.x,
      y - this.size * 1.1
    );
    this.receiverPath.bezierCurveTo(
      this.x - this.size * 0.75,
      y - this.size * 1.1,
      this.x - this.size,
      y - this.size * 0.85,
      this.x - this.size,
      y - this.size * 0.7
    );
    this.receiverPath.quadraticCurveTo(
      this.x - this.size,
      y - this.size * 0.37,
      this.x - this.size * 0.75,
      y - this.size * 0.4
    );
    this.receiverPath.bezierCurveTo(
      this.x - this.size * 0.45,
      y - this.size * 0.45,
      this.x - this.size * 0.5,
      y - this.size * 0.6,
      this.x - this.size * 0.5,
      y - this.size * 0.7
    );
    this.receiverPath.quadraticCurveTo(
      this.x - this.size * 0.5,
      y - this.size * 0.8,
      this.x,
      y - this.size * 0.8
    );
    this.receiverPath.quadraticCurveTo(
      this.x + this.size * 0.5,
      y - this.size * 0.8,
      this.x + this.size * 0.5,
      y - this.size * 0.7
    );
    this.receiverPath.bezierCurveTo(
      this.x + this.size * 0.5,
      y - this.size * 0.6,
      this.x + this.size * 0.45,
      y - this.size * 0.45,
      this.x + this.size * 0.75,
      y - this.size * 0.4
    );
    this.receiverPath.quadraticCurveTo(
      this.x + this.size,
      y - this.size * 0.37,
      this.x + this.size,
      y - this.size * 0.7
    );
    this.ctx.closePath();
    this.ctx.stroke(this.receiverPath);
  }

  drawDialFrame() {
    const innerX = this.dialInnerWidth;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    this.ctx.moveTo(this.x + innerX, this.y);
    this.ctx.arc(this.x, this.y, innerX, 0, Math.PI * 2, true);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(
      this.x,
      this.y,
      this.r * 1.05,
      this.fingerStopRad,
      this.fingerStopRad - this.stickWidth,
      true
    );
    this.ctx.arc(
      this.x,
      this.y,
      innerX * 1.2,
      this.fingerStopRad - this.stickWidth * 0.7,
      this.fingerStopRad - this.stickWidth * 0.3,
      false
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawDial() {
    const initFrameRad =
      this.rotateRad + this.fingerStopRad + this.dialButtonRad / 2;
    this.ctx.lineCap = 'round';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = `${this.dialWidth / 2}px san-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.strokeStyle = '#404040';
    this.ctx.fillStyle = '#fafafa';
    this.ctx.lineWidth = this.dialWidth;
    this.ctx.beginPath();
    this.ctx.arc(
      this.x,
      this.y,
      this.dialR,
      initFrameRad +
        this.dialButtonRad * (this.buttonCount - 1) +
        this.startRad,
      initFrameRad + this.startRad,
      true
    );
    this.ctx.stroke();
    this.ctx.strokeStyle = '#fafafa';
    this.ctx.lineWidth = this.lineWidth / 2;
    this.ctx.beginPath();
    for (let i = 0; i < this.buttonCount; i++) {
      const rad =
        i * this.dialButtonRad +
        this.rotateRad +
        this.fingerStopRad +
        this.dialButtonRad / 2 +
        this.startRad;
      const x = this.x + Math.cos(rad) * this.dialR;
      const y = this.y + Math.sin(rad) * this.dialR;
      this.ctx.moveTo(x + this.dialWidth * 0.4, y);
      this.ctx.arc(x, y, this.dialWidth * 0.4, 0, Math.PI * 2, false);
      this.ctx.fillText((this.buttonCount - i) % 10, x, y);
    }
    this.ctx.stroke();
  }

  drawNumber() {
    this.ctx.fillText(this.number, this.x, this.y, this.dialInnerWidth * 2);
  }
}
