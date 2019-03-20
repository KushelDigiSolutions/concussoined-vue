<template>
    <main class="pagecontent">
		<div class="scroll" v-if="!loading">
			<header class="full-width">
				<h1>Change Password</h1>
			</header>
            <section class="edit-widget">
                <div class="row">
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group" >
                            <label for="old">Old password:</label>
                            <input class="full-width" type="password" id="old" v-model="oldPassword">
                        </div>
                        <div class="form-group" >
                            <label for="new">New password:</label>
                            <input class="full-width" type="password" id="new" v-model="newPassword">
                        </div>
                        <div class="form-group" >
                            <label for="new">Confirm password:</label>
                            <input class="full-width" type="password" id="new" v-model="confirmPassword">
                        </div>
                        <button class="btn icon mt-3" @click="changePassword()">
                            <font-awesome-icon icon="sync-alt" />
                            <span>Update password</span>
                        </button>
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
    name: 'changePassword',
	data: function () {
		return {
            ps:null,
            email:'',
            oldPassword:'',
            newPassword:'',
            confirmPassword:'',
            errorInput: false,
            loading:false
		}
	},
	mounted: function() {
	},
	methods: {
        changePassword: function(){
            this.errorInput = false
            if(this.oldPassword.length == 0) {
                this.showError('Update Error', 'Enter old Password')
                this.errorInput = true
            }
            if(this.newPassword.length < 6) {
                this.showError('Update Error', 'The New password must be at least 6 characters')
                this.errorInput = true
            }
            if(this.confirmPassword != this.newPassword) {
                this.showError('Update Error', 'New password and password confirmation must be the same')
                this.errorInput = true
            }
            if(!this.errorInput) {
                this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
                this.axios.patch(process.env.VUE_APP_URL+'update/password',{
                    old_password: this.oldPassword,
                    password: this.newPassword,
                    password_confirmation: this.confirmPassword
                })
                .then(response => {
                    this.showSuccess('Update Password', 'Your password was updated successfuly. You need to relogin.')
                    localStorage.token = ''
                    this.$router.push({path:'/login'})
                })
                .catch(error => {
                    this.showError('Update Error', 'Incorrect old password')
                })
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