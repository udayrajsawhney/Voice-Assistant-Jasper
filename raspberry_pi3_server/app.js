const PythonShell = require('python-shell')
const Gpio = require('onoff').Gpio
const http = require('http').createServer((req,res) => {
    res.writeHead(200)
    res.end("Hello world")
})
// const fs = require('fs')
const io = require('socket.io')(http)

const LED = new Gpio(3, 'out')

// PythonShell.run('read.py', (err, results) => {
//   err && console.log(err)
//   // results is an array consisting of messages collected during execution
//   console.log(results[0])
// })

http.listen(8080)

io.sockets.on('connection', socket => {

  socket.on('light', data => {
    // log = fs.readFileSync(__dirname+ '/log.txt');
    console.log('eis server --->', data.message)
    if(data.message.search('on') > -1) LED.writeSync(1)
    if(data.message.search('off') > -1) LED.writeSync(0)

    if(data.message.search('temperature') > -1) {
      PythonShell.run('read.py', (err, results) => {
        err && console.log(err)
        // results is an array consisting of messages collected during execution
          // console.log(results)
          socket.emit('reply', { mg: results[0] })               
      })
    }
      // fs.writeFileSync(__dirname+'/log.txt', log);
    })
})

process.on('SIGINT', _ => { //on ctrl+c
  // LED.writeSync(0); // Turn LED off
  // LED.unexport(); // Unexport LED GPIO to free resources
  // pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});