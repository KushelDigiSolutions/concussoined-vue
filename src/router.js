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
import addVideoWidget from './views/widgets/add/video.vue'
import addGalleryWidget from './views/widgets/add/gallery.vue'
import addAccordionWidget from './views/widgets/add/accordion.vue'
import mediaManager from './views/MediaManager.vue'
import editSymptom from './views/Symptoms.vue'
import addAdmin from './views/AddAdmin.vue'
import listAdmin from './views/ListAdmin.vue'
import changePassword from './views/ChangePassword.vue'
import NotFound from './views/404.vue'
import Reset from './views/ResetPwd.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/404',
      component: NotFound },
    {
      path: '*',
      redirect: '/404'
    },
    {
      path: '/',
      name: 'sections',
      component: Sections
    },
    {
      path: '/settings/admins',
      name: 'listAdmin',
      component: listAdmin
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
      path: '/forgot/*',
      name: 'reset',
      component: Reset
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
    {
      path: '/widget/add/videowidget',
      name: 'add-video',
      component: addVideoWidget,
      props: true
    },
    {
      path: '/widget/add/gallerywidget',
      name: 'add-gallery',
      component: addGalleryWidget,
      props: true
    },
    {
      path: '/widget/add/accordionwidget',
      name: 'add-accordion',
      component: addAccordionWidget,
      props: true
    },
  ]
})
