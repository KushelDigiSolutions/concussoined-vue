import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Sections from './views/Sections.vue'
import editSection from './views/sections/editSection.vue'
import editTextWidget from './views/widgets/edit/textcontent.vue'
import editVideoWidget from './views/widgets/edit/video.vue'
import editGalleryWidget from './views/widgets/edit/gallery.vue'

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
    },
    {
      path: '/widget/textcontent/:id',
      name: 'edit-textcontent',
      component: editTextWidget,
      props: true
    },
    {
      path: '/widget/video/:id',
      name: 'edit-videowidget',
      component: editVideoWidget,
      props: true
    },
    {
      path: '/widget/gallery/:id',
      name: 'edit-gallerywidget',
      component: editGalleryWidget,
      props: true
    },
  ]
})
