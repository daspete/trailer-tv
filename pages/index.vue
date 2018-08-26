<template>
    <div class="app">
        <div class="qr-code" v-if="connected && !controllerConnected">
            <div class="qr-code__content">
                <h1>Scan this code with your smartphone to start your controller</h1>
                <a target="_blank" :href="`${ appUrl }/controller/${ socketId }`"><img :src="qrCode" v-if="qrCode"></a>
            </div>
        </div>

        <div class="app-display" v-if="controllerConnected && movies.length > 0">
            <movie-slider :movies="CurrentMovies" />
            <movie-list :movies="CurrentMovies" />

            <div class="trailer" v-if="trailerActive">
                <div class="trailer__player"  id="trailer"></div>
            </div>

            
        </div>
    </div>
</template>

<script>
import QRCode from 'qrcode'

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {

    asyncData({ env }){
        return {
            socketId: null,

            controllerId: null,

            connected: false,

            qrCode: false,

            controllerConnected: false,

            trailerActive: false,
            trailerId: '',

            currentMovieId: 0,
            moviesInView: 10,

            movies: [],

            ytPlayer: null,

            apiUrl: env.API_URL,
            appUrl: env.APP_URL,


            search: ''

        }
    },

    head(){

        return {
            title: 'TrailerTV',
            meta: [
                { name: 'description', content: 'Watch movie trailers on your TV and control the playback with your smartphone' },
                { name: 'keywords', content: 'film,trailer,tv,watch,smartphone,nuxt.js,nuxt,vue,vuejs,javascript,socket,websocket' },
                { name: 'og:title', content: 'TrailerTV' },
                { name: 'og:description', content: 'Watch movie trailers on your TV and control the playback with your smartphone' },
                { name: 'og:image', content: `${ this.appUrl }/trailertv.jpg` },
            ]
        }
    },
    
    computed: {
        CurrentMovies: {
            get(){
                let movies = this.FilterMovies().slice(this.currentMovieId, this.currentMovieId + this.moviesInView);

                return movies;
            }
        }
    },

    watch: {
        currentMovieId(value){
            console.log(this.CurrentMovies[0]);

            this.$nextTick(() => {
                socket.emit('movie.update', {
                    controllerId: this.controllerId,
                    movie: this.CurrentMovies[0]
                });
            })
            
        }
    },

    beforeMount(){
        socket.emit('connection.details', (data) => {
            this.socketId = data.id;

            this.OnConnected();
        });

        socket.on('controller.connect', (data) => {
            this.controllerId = data.controllerId;
            this.controllerConnected = true;

            this.GetMovies();
        });

        socket.on('controller.up', () => {
            if(this.currentMovieId <= 0) return;

            this.currentMovieId--;
        });

        socket.on('controller.down', () => {
            if(this.currentMovieId >= this.FilterMovies().length - 1){
                this.currentMovieId = 0;
                return;
            }        

            this.currentMovieId++;
        });

        socket.on('trailer.start', () => {
            this.trailerId = this.movies[this.currentMovieId].trailer.replace('http://www.youtube.com/watch?v=', '');
            this.StartTrailer();
        });

        socket.on('trailer.seekTo', (data) => {
            if(!this.trailerActive) return;
            if(!this.ytPlayer) return;

            this.ytPlayer.seekTo(data.position);
        });

        socket.on('trailer.setVolume', (data) => {
            if(!this.trailerActive) return;
            if(!this.ytPlayer) return;

            this.ytPlayer.setVolume(data.volume);
        });

        socket.on('trailer.stop', () => {
            this.trailerActive = false;
            if(this.ytPlayer) this.ytPlayer.destroy();

            this.trailerActive = false;
        });

        socket.on('search.receive', (data) => {
            this.SearchMovies(data.search);
        });
    },

    mounted(){
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/player_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        this.TrailerPlayerLoop();
    },

    methods: {
        OnConnected(){
            this.connected = true;

            this.$nextTick(async () => {
                this.qrCode = await QRCode.toDataURL(`${ this.appUrl }/controller/${ this.socketId }`);
            });
        },

        async TrailerPlayerLoop(){
            if(this.trailerActive && this.ytPlayer && this.ytPlayer.getDuration){
                socket.emit('trailer.update', {
                    controllerId: this.controllerId,
                    length: this.ytPlayer.getDuration(),
                    position: this.ytPlayer.getCurrentTime(),
                    volume: this.ytPlayer.getVolume()
                })
            }

            await pause(1000);

            this.TrailerPlayerLoop();
        },

        FilterMovies(){
            return this.movies;
        },

        async GetMovies(){
            this.movies = await this.$axios.$get('/movies');
        },

        async SearchMovies(search){
            this.currentMovieId = 0;
            this.movies = await this.$axios.$get('/movies?title_like=' + search);
        },

        StartTrailer(){
            this.trailerActive = true;

            this.$nextTick(() => {
                this.ytPlayer = new YT.Player('trailer', {
                    videoId: this.trailerId,
                    playerVars: { 
                        autoplay: 1, 
                        controls: 0 
                    },
                    events: {
                        onReady: (e) => { this.OnPlayerReady(e.target) },
                        // 'onPlaybackQualityChange':' onPlayerPlaybackQualityChange,
                        // onStateChange: (e) => { this.OnPlayerStateChange(e) },
                        // 'onError': onPlayerError'
                    }
                });
            })
        },

        OnPlayerReady(player){
            player.playVideo();
        }


    }

};
</script>
