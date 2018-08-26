class Connection {

    constructor(socket){
        this.socket = socket;

        this.socketId = this.socket.id;
        this.foreignId = null;
    }

    GetSocketId(){
        return this.socketId;
    }

    GetForeignId(){
        return this.foreignId;
    }

    ConnectForeign(foreignId){
        this.foreignId = foreignId;
    }

}

export default Connection;