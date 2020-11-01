import {
  CanvasApp
} from './canvasApp.js'

(() => {
  new CanvasApp({
    bgColor: '#212c5a',
    groundColor: '#121212',
    dark: true,
    color: '#de002f',
    groundFactor: .2,
    xFactor: .2,
    sizeFactor: .2,
    initSpeed: .001,
  })
})()