<template>
    <main class="pagecontent">
		<div class="scroll" v-if="!loading">
			<header class="full-width">
				<h1>Add Text Widget</h1>
                <div class="actions">
                    <button class="btn icon mr-3" @click="saveWidget()">
                        <font-awesome-icon icon="save" />
                        <span>Save</span>
                    </button>
                    <button class="btn btn-red icon" @click="$router.push({path:prevRoute})">
                        <font-awesome-icon icon="ban" />
                        <span>Cancel</span>
                    </button>
                </div>
			</header>
            <section class="edit-widget">
                <div class="row">
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group">
                            <label for="title">Title(EN):</label>
                            <input type="text" id="title" v-model="widget.title_en" placeholder="Widget Title">
                        </div>
                        <div class="form-group mt-4">
                            <label>Widget Content(EN):</label>
                            <ckeditor :editor="editor" v-model="widget.content_en" :config="editorConfig"></ckeditor>
                        </div>
                    </div>
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group">
                            <label for="title">Title(FR):</label>
                            <input type="text" id="title" v-model="widget.title_fr" placeholder="Widget Title">
                        </div>
                        <div class="form-group mt-4">
                            <label>Widget Content(FR):</label>
                            <ckeditor :editor="editor" v-model="widget.content_fr" :config="editorConfig"></ckeditor>
                        </div>
                    </div>
                </div>
			</section>
		</div>
        <div class="loading" v-if="loading"><img src="/img/loading.gif"></div>
    </main>
</template>
<script>
import Vue from "vue"
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSave, faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

library.add(faSave, faBan)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr, CKEditor)
export default {
    name: 'addWidget',
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.prevRoute = from.path
        })
    },
    components: {
        ckeditor: CKEditor.component
    },
	data: function () {
		return {
            ps:null,
            widget:{
                section_id: this.$route.query.from == 'section' ? this.$route.query.id : null,
                subsection_id: this.$route.query.from == 'subsection' ? this.$route.query.id : null,
                index: 1,
                title_en: '',
                content_en: '',
                title_fr: '',
                content_fr:''
            },
            editor: ClassicEditor,
            editorConfig: {
                toolbar: [
                    'bold',
                    'italic',
                    'bulletedList',
                    'numberedList',
                    'blockQuote',
                    '|',
                    'undo',
                    'redo'
                ]
            },
            prevRoute: null,
            loading:false
		}
	},
	mounted: function() {
	},
	methods: {
        saveWidget: function(){
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.post(process.env.VUE_APP_URL+'text_content', {
                section_id: this.widget.section_id,
                subsection_id: this.widget.subsection_id,
                index: this.widget.index,
                title_en: this.widget.title_en,
                content_en: this.widget.content_en,
                title_fr: this.widget.title_fr,
                content_fr: this.widget.content_fr
            })
            .then(response => {
                this.showSuccess('Widget was Added', 'Widget data was added successfuly.')
                this.$router.push({path:this.prevRoute})
            })
        },
        showSuccess: function(title, msg) {
            this.$toast.success({
                title:title,
                message:msg,
                position: 'top right',
                timeOut: 5000
            })
        },
        showError: function(title, msg) {
            this.$toast.error({
                title:title,
                message:msg,
                position: 'top right',
                timeOut: 5000
            })
        },
		perfectScrollInit: function() { // perfect scroll init goes after dom update
			var container = document.querySelector('.scroll')
			if(!this.ps && container) {
				this.ps = new PerfectScrollbar(container)
			} else if(container) {
				this.ps.destroy()
				this.ps = null
				this.ps = new PerfectScrollbar(container)
				container.scrollTop = 0
			}
		}
	}
}
</script>