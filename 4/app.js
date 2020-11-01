import {
  CanvasApp
} from './canvasApp.js'

(() => {
  new CanvasApp({
    bgColor: '#212c5a',
    groundColor: '#121212',
    bounce: .65,
    minR: 5,
    maxR: 30,
  })
})()