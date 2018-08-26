<template>
    <div class="layout">
        <nuxt />    
    </div>
</template>

<script>
import socket from '~/plugins/socket.io.js'

export default {
    
    beforeMount(){
        window.socket = socket;
    }

}
</script>
