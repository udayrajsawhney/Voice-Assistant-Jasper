'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _socket = require('socket.io');

var _socket2 = require('socket.io-client');

var _socket3 = _interopRequireDefault(_socket2);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this file contains all the configs.

// global variables
// for real time data streaming
// http connects both express and socket.io
// all module imports here
var PORT = _config2.default.port;
// import PythonShell from 'python-shell' // for doing nlp
// import nlp from 'compromise' // for nlp

// console.log(nlp(`Turn on the lights.`).normalize().out('text'))

// all relative imports here
// for rendering documents and handling requests

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);
var clients = (0, _socket.listen)(app.server, { pingTimeout: 30000 }); // { pingTimeout: 30000 } => makes compatible with react-native

app.use(_express2.default.static(__dirname));
// all http routes here
app.get('/*', function (req, res) {
    return res.sendFile(_path2.default.join(__dirname, './index.html'));
}); // TODO: render the actual frontend

// all socket routes goes here
clients.sockets.on('connection', function (socket) {
    console.log('A fucker just joined on', socket.id);
    socket.on('message', function (data) {
        var rpi = _socket3.default.connect('http://192.168.43.179:8080'); // RPi's address            
        // process the message here... using nlp techniques, then emit the reply to client and also to raspberry pi server
        // const options = {
        //     mode: 'text',
        //     scriptPath: __dirname + '/../',
        //     args: [ data.msg ]
        // }
        // PythonShell.run('nlp.py', options, (err, results) => {
        //     if (err) throw err;
        //     // results is an array consisting of messages collected during execution
        //     console.log(results[0]);
        // })
        // let message = data.msg
        // let normailzed_message = nlp(data.msg).normalize().out('text')
        // let verbs = nlp(normailzed_message).verbs().out('array')
        // let nouns = nlp(normailzed_message).nouns().out('array')
        // let isQuestion = nlp(normailzed_message).questions().out('array').length > 0      
        // console.log(`🐱‍👤Verbs:\n${verbs}\n✨Nouns:\n${nouns}\n🙋‍Question:\n${isQuestion}`)    
        console.log('client -->', data.msg);
        rpi.emit('light', { message: data.msg });
        rpi.on('reply', function (data) {
            socket.emit('reply', { message: data.mg });
            console.log('PI --->', data.mg);
        });
    });
});

// tell our app to listen to our port
app.server.listen(process.env.PORT || PORT, function (_) {
    return console.log('Magic happens on ' + app.server.address().port);
});
//# sourceMappingURL=index.js.map