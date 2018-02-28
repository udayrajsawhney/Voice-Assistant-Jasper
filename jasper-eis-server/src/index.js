// all module imports here
import express from 'express' // for rendering documents and handling requests
import http from 'http' // http connects both express and socket.io
import { listen } from 'socket.io' // for real time data streaming
import io from 'socket.io-client'
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

// all http routes here
app.get('/*', (req, res) => res.send('hello')) // TODO: render the actual frontend

// all socket routes goes here
clients.sockets.on('connection', socket => {
    console.log('A fucker just joined on', socket.id)
    socket.on('message', data => {
        const rpi = io.connect('http://192.168.43.179:8080') // RPi's address            
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