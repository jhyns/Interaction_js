import {
  CanvasApp
} from './canvasApp.js'

(() => {
  new CanvasApp({
    bgColor: '#212c5a',
    color: '#de002f',
    groundFactor: .2,
    minR: 1,
    maxR: 2,
    v: 2,
    maxTrailLength: 100,
  })
})()