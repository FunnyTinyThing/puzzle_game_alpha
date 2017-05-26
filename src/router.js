module.exports = {
    routes: [
        {
            path: '/',
            name: 'index',
            component: require('./views/index.vue')
        },
        {
            path: '/error',
            name: '404',
            component: require('./views/404.vue')
        }
    ]
}