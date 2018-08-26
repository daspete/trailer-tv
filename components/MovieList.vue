<template>
    <div class="movie-list">
        <movie-card
            v-for="movie in movies"
            :key="movie.title"
            :movie="movie"
        />
    </div>
</template>

<script>
export default {
    props: {
        movies: {
            type: Array,
            default: []
        }
        

    }
}
</script>
