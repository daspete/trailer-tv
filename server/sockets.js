import Connection from './models/Connection'
import Crawler from './crawler/Crawler'

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Sockets {
    constructor(io){
        this.io = io;

        this.connections = {};

        this.isCrawling = false;
        this.crawler = null;

        this.Start();
    }

    Start(){
        this.io.on('connection', (socket) => { 
            console.log(`User connected: ${ socket.id }`);

            let connection = new Connection(socket);

            this.connections[socket.id] = connection;

            socket.on('connection.details', (cb) => {
                cb({
                    id: this.connections[socket.id].socketId
                })
            });

            socket.on('controller.connect', (data) => {
                console.log('controller.connect');
                if(typeof this.connections[data.displayId] === 'undefined'){
                    return;
                }

                let display = this.connections[data.displayId];
                let controller = this.connections[data.controllerId];

                display.ConnectForeign(data.controllerId);
                controller.ConnectForeign(data.displayId);

                display.socket.emit('controller.connect', {
                    controllerId: data.controllerId
                })
            });

            socket.on('controller.up', (data) => {
                let display = this.GetConnection(data.displayId);

                if(display == undefined) return;

                display.socket.emit('controller.up');
            });

            socket.on('controller.down', (data) => {
                let display = this.GetConnection(data.displayId);

                if(display == undefined) return;

                display.socket.emit('controller.down');
            });

            socket.on('trailer.start', (data) => {
                let display = this.GetConnection(data.displayId);

                if(display == undefined) return;

                display.socket.emit('trailer.start');
            });

            socket.on('trailer.stop', (data) => {
                let display = this.GetConnection(data.displayId);

                if(display == undefined) return;

                display.socket.emit('trailer.stop');
            });

            socket.on('trailer.seekTo', (data) => {
                let display = this.GetConnection(data.displayId);

                if(display == undefined) return;

                display.socket.emit('trailer.seekTo', data);
            });

            socket.on('trailer.setVolume', (data) => {
                let display = this.GetConnection(data.displayId);

                if(display == undefined) return;

                display.socket.emit('trailer.setVolume', data);
            });

            socket.on('trailer.update', (data) => {
                let controller = this.GetConnection(data.controllerId);

                if(controller == undefined) return;

                controller.socket.emit('trailer.update', data);
            });

            socket.on('search.send', (data) => {
                let display = this.GetConnection(data.displayId);

                if(display == undefined) return;

                display.socket.emit('search.receive', {
                    search: data.search
                });
            });

            socket.on('crawler.status', (data) => {
                let client = this.GetConnection(data.socketId);

                if(client == undefined) return;

                client.socket.emit('crawler.status', {
                    isCrawling: this.isCrawling
                });
            });

            socket.on('crawler.start', (data) => {
                let client = this.GetConnection(data.socketId);

                if(client == undefined) return;

                client.socket.emit('crawler.started');

                if(this.isCrawling) return;

                this.isCrawling = true;

                this.crawler = new Crawler({
                    sockets: this
                });
            });

        });
    }

    GetConnection(connectionId){
        return this.connections[connectionId];
    }

    
}

export default Sockets;