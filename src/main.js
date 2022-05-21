import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
import '@/layouts/export'
import permission from './components/Permission'
import dict from './components/Dict'
Vue.use(permission)
Vue.use(dict)


Vue.config.productionTip = false

new Vue({
  el: '#yuxuan-basic-admin-app',
  router,
  store,
  render: (h) => h(App),
})
