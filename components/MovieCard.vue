<template>
    <div class="movie-card">
        <h1 class="movie-card__headline" v-html="movie.title"></h1>
        <div class="row">
            <div class="col-3">
                <div class="movie-card__poster"
                    :style="`background-image: url(${ movie.poster })`"
                ></div>
                <div class="movie-card__actions">
                    
                </div>
            </div>
            <div class="col-9">
                
                <div class="movie-card__info-line">
                    <div 
                        v-for="genre in movie.genres"
                        :key="genre"
                        v-html="genre"
                    >
                        
                    </div>
                    <h2 v-html="movie.year"></h2>
                </div>
                <div class="movie-card__description" v-html="movie.description"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
    props: {
        movie: {
            type: Object,
            default: {
                title: 'Film',
                poster: 'https://placeimg.com/320/480/tech/grayscale',
                genres: ['Genre 1', ['Genre 2']],
                year: 2018,
                description: 'This movie is indescribable...',
                trailer: '5-qSWrFGffc'
            }
        }
    }

}
</script>
