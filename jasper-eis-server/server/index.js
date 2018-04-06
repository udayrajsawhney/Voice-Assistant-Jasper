// all module imports here
import express from 'express' // for rendering documents and handling requests
import http from 'http' // http connects both express and socket.io
import path from 'path'
import { listen } from 'socket.io' // for real time data streaming
import io from 'socket.io-client';
import moment from 'moment';
const {Stamp, Appliance, rPi} = require('./models/models');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/eis');
// import PythonShell from 'python-shell' // for doing nlp
// import nlp from 'compromise' // for nlp

// console.log(nlp(`Turn on the lights.`).normalize().out('text'))

// all relative imports here
import config from '../config.json' // this file contains all the configs.

// global variables
const PORT = config.port
const app = express()
app.server = http.createServer(app)
const clients = listen(app.server, { pingTimeout: 30000 }) // { pingTimeout: 30000 } => makes compatible with react-native

app.use(express.static(__dirname))
// all http routes here
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, './index.html'))) // TODO: render the actual frontend

// database from rpi
const dbrpi = io.connect('http://192.168.43.178:8080')
dbrpi.emit('database', 'database')
dbrpi.on('dbtime', data => {
    console.log(data)
    var t = Stamp({
        timeSt: data.time,
        type: data.type
    });
    t.save().then(
        (res) => {
            console.log(res);
        },
        (err) => console.log(err)
    );
})

const getDur = (aid) => new Promise((resolve, reject) => {
    Stamp.find({}).then(
        (docs) => {
            const dat = docs
            // console.log(dat)
            const give = []
            for(let i = 0; i < 2 || i < dat.length - 2; i += 2) {
                let start = dat[i].timeSt
                let stop = dat[i + 1].timeSt               
                give.push({ start, stop, duration: moment(stop)-moment(start) })
            }
            resolve(give)
            // socket.to('iwant').emit('durdat', { aid: 0, tab: give })
        },
        (err) => reject('oh no!!')
    );
})

// const giveData = io.connect('http://localhost:4500')

// all socket routes goes here
clients.sockets.on('connection', socket => {
    console.log('A client just joined on', socket.id)
    socket.on('iwant', room => {
        socket.join(room);
        console.log('iwant');
    })

    socket.on('durreq', d => {
        console.log(d.aid)
        getDur(0).then(give => {
            console.log(give)
            socket.emit('durdat', { aid: 0, tab: give });
            console.log('what');
        })
    })
    
    socket.on('message', data => {
        const rpi = io.connect('http://192.168.43.178:8080') // RPi's ad 
        console.log('client -->', data.msg)
        rpi.emit('light', { message : data.msg })
        rpi.on('reply', data => {
            socket.emit('reply', { message: data.mg })

            console.log('PI --->', data.mg)        
        })
    })
})

// tell our app to listen to our port
app.server.listen(process.env.PORT || PORT, _ => console.log(`Magic happens on ${app.server.address().port}`))