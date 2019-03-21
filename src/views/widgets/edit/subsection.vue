<template>
    <main class="pagecontent">
		<div class="scroll" v-if="!loading">
			<header class="full-width">
				<h1>Edit Subsection Widget</h1>
                <div class="actions">
                    <button class="btn icon mr-3" @click="updateWidget()">
                        <font-awesome-icon icon="sync-alt" />
                        <span>Update</span>
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
                            <label for="desc_en">Subsection Description(EN):</label>
                            <textarea id="desc_en" class="form-control" v-model="description_en"></textarea>
                        </div>
                    </div>
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group">
                            <label for="title">Title(FR):</label>
                            <input type="text" id="title" v-model="widget.title_fr" placeholder="Widget Title">
                        </div>
                        <div class="form-group mt-4">
                            <label for="desc_fr">Subsection Description(EN):</label>
                            <textarea id="desc_fr" class="form-control" v-model="description_fr"></textarea>
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
import { faSyncAlt, faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSyncAlt, faBan)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)
export default {
    name: 'editSubsection',
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.prevRoute = from.path
        })
    },
	data: function () {
		return {
            ps:null,
            widget:[],
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
            loading: false
		}
	},
	mounted: function() {
        this.getWidgetData()
	},
	methods: {
        // getting widget
		getWidgetData: function() {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.get(process.env.VUE_APP_URL+'subsection/all/'+this.$route.params.id)
            .then(response => {
                this.widget = response.data
                this.loading = false
            })
        },
        updateWidget: function(){
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.patch(process.env.VUE_APP_URL+'text_content/'+this.$route.params.id, {
                title_en: this.widget.title_en,
                content_en: this.widget.content_en,
                title_fr: this.widget.title_fr,
                content_fr: this.widget.content_fr
            })
            .then(response => {
                this.showSuccess('Widget was Updated', 'Widget data was updated successfuly.')
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