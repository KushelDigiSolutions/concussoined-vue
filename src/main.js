/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueAxios from 'vue-axios'
import axios from 'axios'
import CxltToastr from 'cxlt-vue2-toastr'
import jQuery from "jquery"
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/saas/app.scss'
import dotenv from 'dotenv'
dotenv.config()


//ie11 fix
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

Vue.config.productionTip = false

Vue.use(VueAxios, axios, CxltToastr)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
