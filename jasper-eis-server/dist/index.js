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

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// for real time data streaming
// http connects both express and socket.io
// all module imports here
var _require = require('./models/models'),
    Stamp = _require.Stamp,
    Appliance = _require.Appliance,
    rPi = _require.rPi; // for rendering documents and handling requests


var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/eis');
// import PythonShell from 'python-shell' // for doing nlp
// import nlp from 'compromise' // for nlp

// console.log(nlp(`Turn on the lights.`).normalize().out('text'))

// all relative imports here
// this file contains all the configs.

// global variables
var PORT = _config2.default.port;
var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);
var clients = (0, _socket.listen)(app.server, { pingTimeout: 30000 }); // { pingTimeout: 30000 } => makes compatible with react-native

app.use(_express2.default.static(__dirname));
// all http routes here
app.get('/*', function (req, res) {
    return res.sendFile(_path2.default.join(__dirname, './index.html'));
}); // TODO: render the actual frontend

// database from rpi
var dbrpi = _socket3.default.connect('http://192.168.43.178:8080');
dbrpi.emit('database', 'database');
dbrpi.on('dbtime', function (data) {
    console.log(data);
    var t = Stamp({
        timeSt: data.time,
        type: data.type
    });
    t.save().then(function (res) {
        console.log(res);
    }, function (err) {
        return console.log(err);
    });
});

var getDur = function getDur(aid) {
    return new Promise(function (resolve, reject) {
        Stamp.find({}).then(function (docs) {
            var dat = docs;
            // console.log(dat)
            var give = [];
            for (var i = 0; i < 2 || i < dat.length - 2; i += 2) {
                var start = dat[i].timeSt;
                var stop = dat[i + 1].timeSt;
                give.push({ start: start, stop: stop, duration: (0, _moment2.default)(stop) - (0, _moment2.default)(start) });
            }
            resolve(give);
            // socket.to('iwant').emit('durdat', { aid: 0, tab: give })
        }, function (err) {
            return reject('oh no!!');
        });
    });
};

// const giveData = io.connect('http://localhost:4500')

// all socket routes goes here
clients.sockets.on('connection', function (socket) {
    console.log('A client just joined on', socket.id);
    socket.on('iwant', function (room) {
        socket.join(room);
        console.log('iwant');
    });

    socket.on('durreq', function (d) {
        console.log(d.aid);
        getDur(0).then(function (give) {
            console.log(give);
            socket.emit('durdat', { aid: 0, tab: give });
            console.log('what');
        });
    });

    socket.on('message', function (data) {
        var rpi = _socket3.default.connect('http://192.168.43.178:8080'); // RPi's ad 
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