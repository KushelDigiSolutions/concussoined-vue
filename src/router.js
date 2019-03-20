import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Sections from './views/Sections.vue'
import editSection from './views/sections/editSection.vue'
import editSubsection from './views/sections/editSubsection.vue'
import editTextWidget from './views/widgets/edit/textcontent.vue'
import editVideoWidget from './views/widgets/edit/video.vue'
import editGalleryWidget from './views/widgets/edit/gallery.vue'
import editAccordionWidget from './views/widgets/edit/accordion.vue'
import addTextWidget from './views/widgets/add/textcontent.vue'
import mediaManager from './views/MediaManager.vue'
import editSymptom from './views/Symptoms.vue'
import addAdmin from './views/AddAdmin.vue'
import changePassword from './views/ChangePassword.vue'

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
      path: '/settings/admin',
      name: 'addAdmin',
      component: addAdmin
    },
    {
      path: '/settings/password',
      name: 'changePassword',
      component: changePassword
    },
    {
      path: '/media',
      name: 'mediaManager',
      component: mediaManager
    },
    {
      path: '/symptoms',
      name: 'symptoms',
      component: editSymptom
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
      path: '/subsection/:id',
      name: 'editSubsection',
      component: editSubsection,
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
    {
      path: '/widget/accordion/:id',
      name: 'edit-accordionwidget',
      component: editAccordionWidget,
      props: true
    },
    {
      path: '/widget/subsection/:id',
      name: 'edit-subsectionwidget',
      redirect: '/subsection/:id'
    },
    {
      path: '/widget/add/textcontent',
      name: 'add-textcontent',
      component: addTextWidget,
      props: true
    },
  ]
})
