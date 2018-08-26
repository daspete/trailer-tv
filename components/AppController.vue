<template>
    <div class="app-controller">
        <div class="app-controller__movie-list-container">
            <movie-card v-if="movie" :movie="movie"></movie-card>
        </div>
        
        <div class="app-controller__video-controller" v-if="trailerActive">
            <div class="app-controller__video-controller__control" v-on:click="OnTrailerControlClick">
                <div class="app-controller__video-controller__control-position" :style="`width: ${ trailer.position / trailer.length * 100 }%`"></div>
                <span>{{ FormattedTrailerPosition }}</span>
            </div>
        </div>
        
        <div class="app-controller__actions" v-if="!searchActive">
            <div class="row">
                <div class="col-4">
                    <button v-on:click="VoteUp" class="app-controller__vote-button"><i class="fa fa-thumbs-up"></i></button>
                    <button v-on:click="VoteDown" class="app-controller__vote-button"><i class="fa fa-thumbs-up" style="transform: rotate(180deg)"></i></button>
                </div>
                <div class="col-4">
                    <button 
                        v-on:click="ToggleTrailer" 
                        class="app-controller__trailer-button"
                    ><i :class="`fa fa-${ trailerActive ? 'stop' : 'film' }`"></i></button>

                    <button v-on:click="StartSearch" class="app-controller__search-button"><i class="fa fa-search"></i></button>        
                </div>
                <div class="col-4">
                    <button v-on:click="MoveUp" class="app-controller__move-button"><i class="fa fa-arrow-up"></i></button>
                    <button v-on:click="MoveDown" class="app-controller__move-button"><i class="fa fa-arrow-down"></i></button>
                </div>
            </div>
        </div>

        <div class="app-controller__search" :style="`display: ${ searchActive ? 'block' : 'none' }`">
            <form v-on:submit.prevent="SendSearch">
                <input ref="searchInput" v-on:blur="StopSearch" type="text" v-model="search">
                <button type="submit">
                    <i class="fa fa-search"></i>
                </button>
            </form>
        </div>

        
    </div>
</template>

<script>
export default {
    
    props: {
        socketId: {
            type: String,
            default: null
        },
        displayId: {
            type: String,
            default: null
        }
    },

    data(){
        return {
            movie: null,
            movies: [],
            currentMovieId: 0,
            moviesInView: 10,
            trailerActive: false,
            search: '',
            searchActive: false,

            trailer: {
                length: 0,
                position: 0,
                volume: 50
            }
        }
    },

    computed: {
        FormattedTrailerPosition(){
            var date = new Date(1970,0,1);
            date.setSeconds(this.trailer.position);
            let dateString = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
            return dateString.replace('00:00:', '00:');
        }
    },

    // computed: {
    //     CurrentMovies: {
    //         get(){
    //             let movies = this.FilterMovies().slice(this.currentMovieId, this.currentMovieId + this.moviesInView);

    //             return movies;
    //         }
    //     },

    //     FilteredMovies: {
    //         get(){
    //             return JSON.parse(JSON.stringify(this.movies));
    //         }
    //     }
    // },

    mounted(){
        //this.GetMovies();

        socket.emit('controller.connect', {
            displayId: this.displayId,
            controllerId: this.socketId
        });

        socket.on('movie.update', (data) => {
            console.log(data);
            this.movie = data
        });

        socket.on('trailer.update', (data) => {
            this.trailer.length = Math.round(data.length);
            this.trailer.position = Math.round(data.position);
            this.trailer.volume = data.volume;
        });
    },

    methods: {
        // async GetMovies(){
        //     let movies = await this.$axios.$get('/data/movies.json');

        //     this.movies = movies;
        // },
        // FilterMovies(){
        //     return this.movies;
        //     //return JSON.parse(JSON.stringify(this.movies));
        // },

        MoveUp(){
            socket.emit('controller.up', {
                displayId: this.displayId,
                controllerId: this.socketId
            });
        },

        MoveDown(){
            socket.emit('controller.down', {
                displayId: this.displayId,
                controllerId: this.socketId
            });
        },

        VoteUp(){
            // socket.emit('controller.vote.up', {
            //     displayId: this.displayId,
            //     controllerId: this.socketId
            // });
        },

        VoteDown(){
            // socket.emit('controller.vote.down', {
            //     displayId: this.displayId,
            //     controllerId: this.socketId
            // });
        },

        StartTrailer(){
            this.trailerActive = true;

            socket.emit('trailer.start', {
                displayId: this.displayId,
                controllerId: this.socketId
            });
        },

        StopTrailer(){
            this.trailerActive = false;
            this.trailer.position = 0;
            this.trailer.length = 0;
            
            socket.emit('trailer.stop', {
                displayId: this.displayId,
                controllerId: this.socketId
            });
        },

        StartSearch(){
            this.searchActive = true;

            this.$nextTick(() => {
                this.$refs.searchInput.focus();
            })
        },

        StopSearch(){
            this.searchActive = false;

            this.$refs.searchInput.blur();
        },

        SendSearch(){
            socket.emit('search.send', {
                displayId: this.displayId,
                controllerId: this.controllerId,
                search: this.search
            });

            this.StopSearch();
        },

        ToggleTrailer(){
            if(this.trailerActive) this.StopTrailer();
            else this.StartTrailer();
        },

        OnTrailerControlClick(e){
            console.log(e);
            let x = e.x;
            let width = e.target.clientWidth;

            console.log(x, width);

            let position = (x / width) * this.trailer.length;

            socket.emit('trailer.seekTo', { 
                displayId: this.displayId,
                position: position 
            });
        }
    }

}
</script>

