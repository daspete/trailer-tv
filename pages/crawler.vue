<template>
    <div class="crawler">
        <div class="crawler__status" v-if="crawlerStarted">
            <i class="fa fa-people-carry"></i> crawling
        </div>

        <button class="crawler__start" v-on:click="StartCrawler" v-if="crawlerStarted == false && connected">
            START CRAWLER
        </button>

        <div class="crawler__infos">
            <div 
                class="crawler__info"
                v-for="(message, messageId) in CrawlerMessages"
                :key="`message-${ messageId }-${message}-${Math.random()}`"
                v-html="message"
            ></div>
        </div>
    </div>
</template>

<script>

export default {
    
    asyncData({ app, params }){
        return {
            socketId: null,
            connected: false,
            crawlerStarted: false,
            crawlerMessages: []
        }
    },

    beforeMount(){
        socket.emit('connection.details', (details) => {
            this.socketId = details.id;

            this.OnConnected();
        });
    },

    computed: {
        CrawlerMessages(){
            let messages = this.crawlerMessages;
            let maxLines = 24;

            let start = Math.max(messages.length - maxLines, 0);
            let end = start + maxLines;
            

            return messages.slice(start, end).reverse();
        }
    },

    methods: {
        OnConnected(){
            this.connected = true;

            socket.on('crawler.started', () => {
                this.crawlerStarted = true;
            })

            socket.on('crawler.status', (data) => {
                this.crawlerStarted = data.isCrawling;
            })

            socket.on('crawler.message', (data) => {
                this.crawlerMessages.push(data.message);
            })

            socket.emit('crawler.status', {
                socketId: this.socketId
            })
        },

        StartCrawler(){
            socket.emit('crawler.start', {
                socketId: this.socketId
            })
        }
    }

}
</script>
