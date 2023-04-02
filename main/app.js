import { Phone } from './phone.js';

(() => {
  new Phone({
    x: 0.5,
    y: 0.5,
    size: 0.4,
    dialButtonRad: 0.45,
    fingerStopRad: 1,
    callFunction: number => {
      window.location.href = number * 1;
    },
  });
})();
