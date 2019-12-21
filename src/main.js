import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Transitions from 'vue2-transitions'
import './plugins/element'
Vue.use(Transitions)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
