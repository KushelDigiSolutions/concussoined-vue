<template>
    <main class="pagecontent">
		<div class="scroll" v-if="!loading">
			<header class="full-width">
				<h1>Add Widget</h1>
                <div class="actions">
                    <button class="btn icon mr-3" @click="updateWidget()">
                        <font-awesome-icon icon="sync-alt" />
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
                            <label for="title">Title:</label>
                            <input type="text" id="title" v-model="widget.title" placeholder="Widget Title">
                        </div>
                    </div>
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group">
                            <label for="lang">Language:</label>
                            <select class="full-width" id="lang" v-model="widget.language">
                                <option value="en">English</option>
                                <option value="fr">French</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="url">Url:</label>
                            <input type="text" id="url" v-model="widget.video" placeholder="Video url">
                        </div>
                    </div>
                    <div class="col-6">
                        <label>Preview:</label>
                        <iframe width="560" height="315" :src="video_preview" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
    name: 'editWidget',
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.prevRoute = from.path
        })
    },
    computed: {
        video_preview() {
            return this.widget.video.includes('watch') ? this.widget.video.replace('watch?v=', 'embed/') : this.widget.video
        }
    },
	data: function () {
		return {
            ps:null,
            widget:{
                section_id: this.$route.query.from == 'section' ? this.$route.query.id : null,
                subsection_id: this.$route.query.from == 'subsection' ? this.$route.query.id : null,
                index: 1,
                language: 'en',
                title: '',
                video: ''
            },
            prevRoute: null,
            loading:false
		}
	},
	methods: {
        // sending data to the server
        updateWidget: function(){
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.post(process.env.VUE_APP_URL+'video', this.widget)
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