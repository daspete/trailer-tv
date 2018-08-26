import Sockets from './sockets'
require('dotenv').config();

const { Nuxt, Builder } = require('nuxt')
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'

// const api = require('../api');

// app.use('/api', api);

var config = require('../nuxt.config.js')
config.dev = !isProd

const nuxt = new Nuxt(config)

if (config.dev) {
    const builder = new Builder(nuxt)
    builder.build()
}
app.use(nuxt.render)

server.listen(port, '0.0.0.0')
console.log('Server listening on localhost:' + port) // eslint-disable-line no-console

const sockets = new Sockets(io)

// //sockets(io);
// io.on('connection', (socket) => {
//     console.log('connection: ', socket.id);

//     socket.on('get-socket-id', function(callback){
//         console.log(socket.id);
//         callback(socket.id);
//     })

//     // socket.on('last-messages', function (fn) {
//     //     fn(messages.slice(-50))
//     // })

//     // socket.on('send-message', function (message) {
//     //     messages.push(message)
//     //     socket.broadcast.emit('new-message', message)
//     // })
// })

// // Socket.io
// var messages = []
// io.on('connection', (socket) => {
//     console.log('connection');
    
//     socket.on('last-messages', function (fn) {
//         fn(messages.slice(-50))
//     })
//     socket.on('send-message', function (message) {
//         messages.push(message)
//         socket.broadcast.emit('new-message', message)
//     })
// })