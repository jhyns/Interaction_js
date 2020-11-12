import {
  CanvasApp
} from './canvasApp.js'

(() => {
  new CanvasApp({
    bgColor: 'vec4(.1, .1, .1, 1.0)',
    color: 'vec4(.2, .3, .7, 1.0)',
    // ballNum: 20,
    minR: 10,
    maxR: 70,
    maxV: 3,
  })
})()