/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueAxios from 'vue-axios'
import axios from 'axios'
import CxltToastr from 'cxlt-vue2-toastr'
import jQuery from "jquery"

// Bootstrap 5 imports
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Perfect Scrollbar
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

// Custom styles
import './assets/saas/app.scss'

// Make global libraries available
window.$ = window.jQuery = jQuery
window.PerfectScrollbar = PerfectScrollbar
Vue.prototype.$PerfectScrollbar = PerfectScrollbar

const tokenMeta = document.querySelector('meta[name="csrf-token"]')
if (tokenMeta) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = tokenMeta.getAttribute('content')
}
// Modern browsers support Object.assign natively
// Removed IE11 polyfill for cleaner modern code

Vue.config.productionTip = false

// Vue.use(VueAxios, axios, CxltToastr)
Vue.use(VueAxios, axios)
Vue.use(CxltToastr)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
