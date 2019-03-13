import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Sections from './views/Sections.vue'
import editSection from './views/sections/editSection.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'sections',
      component: Sections
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/section/:name',
      name: 'editSection',
      component: editSection,
      props: true
    }
  ]
})
