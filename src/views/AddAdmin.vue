<template>
    <main class="pagecontent">
		<div class="scroll" v-if="!loading">
			<header class="full-width">
				<h1>Add Administrator</h1>
			</header>
            <section class="edit-widget">
                <div class="row">
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group" v-if="password.length == 0">
                            <label for="title">New Administrator Email:</label>
                            <input type="text" id="title" v-model="email" placeholder="email@example.com">
                        </div>
                        <button class="btn icon mr-3" @click="register()" v-if="password.length == 0">
                            <font-awesome-icon icon="user-plus" />
                            <span>Register</span>
                        </button>
                        <p class="mt-4" v-if="password.length > 0">New admin password: {{password}}</p>
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
import { faUserPlus, faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserPlus, faBan)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)
export default {
    name: 'addAdmin',
	data: function () {
		return {
            ps:null,
            email:'',
            password:'',
            loading:false
		}
	},
	mounted: function() {
	},
	methods: {
        register: function(){
            this.password = ''
            if(this.email.length > 0) {
                this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
                this.axios.post(process.env.VUE_APP_URL+'administrator',{
                    email: this.email
                })
                .then(response => {
                    this.password = response.data.password
                    this.showSuccess('New admin was created', 'Save password or send it to the new user')
                })
            } else {
                this.showError('Missing data', 'Input new admin email')
            }
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