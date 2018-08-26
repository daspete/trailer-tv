<template>
    <div class="controller">
        <app-controller 
            v-if="connected"
            :socket-id="socketId"
            :display-id="displayId"
        ></app-controller>
    </div>
</template>

<script>

export default {
    
    asyncData({ app, params }){
        return {
            socketId: null,
            connected: false,
            displayId: params.id
        }
    },

    beforeMount(){
        socket.emit('connection.details', (details) => {
            this.socketId = details.id;

            this.OnConnected();
        });
    },

    methods: {
        OnConnected(){
            this.connected = true;
        }
    }

}
</script>
