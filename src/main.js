import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './views/App.vue'
import routes from './router.js'

Vue.use(VueRouter);

const router = new VueRouter(routes);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
