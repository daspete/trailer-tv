require('dotenv').config();

module.exports = {

    env: process.env,

    head: {
        meta: [
            {
                charset: 'utf-8'
            }, {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1, user-scalable=no'
            }
        ],
    },

    css: [
        '~/assets/scss/app.scss'
    ],

    modules: [
        '@nuxtjs/axios'
    ],

    plugins: [
        { src: '~/plugins/Components', ssr: false }
    ]

}