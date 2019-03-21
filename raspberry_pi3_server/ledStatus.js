const Gpio = require ("onoff").Gpio
const LED = new Gpio(3, 'out')
setInterval(_=> console.log(LED.readSync()), 500)
