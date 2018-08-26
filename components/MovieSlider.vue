<template>
    <div class="movie-slider">
        <div 
            class="movie-slider__slide"
            v-for="movie in CurrentMovies"
            :key="movie.title"
            :style="`background-image: url(${ movie.poster });`"
        ></div>
    </div>
</template>

<script>
export default {
    props: {
        movies: {
            type: Array,
            default: []
        }
    },

    computed: {
        CurrentMovies(){
            return this.movies.slice(1, this.movies.length - 1);
        }
    }
}
</script>
