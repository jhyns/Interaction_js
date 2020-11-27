import {
  Phone
} from './phone.js'

(() => {
  new Phone({
    x: .5,
    y: .5,
    size: .4,
    dialButtonRad: .45,
    fingerStopRad: 1,
    callFunction: number => {
      window.location.href = number * 1
    },
  })
})()