<template>
    <main class="pagecontent">
		<div class="scroll" v-if="!loading">
			<header class="full-width">
				<h1>Add Accordion</h1>
                <div class="actions">
                    <button class="btn icon mr-3" @click="saveWidget()">
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
                            <label for="title">Title(EN):</label>
                            <input type="text" id="title" v-model="widget.title_en" placeholder="Widget Title">
                        </div>
                    </div>
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group">
                            <label for="title">Title(FR):</label>
                            <input type="text" id="title" v-model="widget.title_fr" placeholder="Widget Title">
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
import { faSyncAlt, faBan, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSyncAlt, faBan, faPencilAlt, faPlus)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)
export default {
    name: 'addAccordion',
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.prevRoute = from.path
        })
    },
	data: function () {
		return {
            ps:null,
            widget:{
                section_id: this.$route.query.from == 'section' ? this.$route.query.id : null,
                subsection_id: this.$route.query.from == 'subsection' ? this.$route.query.id : null,
                index:1,
                title_en: '',
                title_fr: ''
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
            this.axios.post(process.env.VUE_APP_URL+'accordion', this.widget)
            .then(response => {
                this.showSuccess('Widget was Saved', 'New accordion was added successfuly.')
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