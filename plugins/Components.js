import Vue from 'vue'

import MovieCard from '~/components/MovieCard'
import MovieList from '~/components/MovieList'
import MovieSlider from '~/components/MovieSlider'
import AppController from '~/components/AppController'

Vue.component('movie-card', MovieCard);
Vue.component('movie-list', MovieList);
Vue.component('movie-slider', MovieSlider);
Vue.component('app-controller', AppController);
