<template>
    <main class="pagecontent">
		<div class="scroll" v-if="!loading">
			<header class="full-width">
				<h1>List of Administrators</h1>
                <div class="actions">
                    <button class="btn icon mr-3" @click="$router.push({name:'addAdmin'})">
                        <font-awesome-icon icon="user-plus" />
                        <span>Add Administrator</span>
                    </button>
                </div>
			</header>
            <section class="sections-list">
                <ul class="list-group">
                    <li class="list-group-item" v-for="admin in admins" :key="admin.email">
                        <div>
                            <span class="p-2 d-inline-block">{{admin.email}}</span>
                            <span class="action">
                                <button class="btn btn-red icon" @click="deleteAdmin(admin.id)">
                                    <font-awesome-icon icon="trash-alt" />
                                    <span>Delete</span>
                                </button>
                            </span>
                        </div>
                    </li>
                </ul>
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
    name: 'listAdmin',
	data: function () {
		return {
            ps:null,
            admins:'',
            loading:false
		}
	},
	mounted: function() {
        this.getAdmins()
	},
	methods: {
        getAdmins: function(){
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.get(process.env.VUE_APP_URL+'administrators')
            .then(response => {
                this.admins = response.data.administrators
            })
        },
        deleteAdmin: function(id) {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.delete(process.env.VUE_APP_URL+'user/'+id)
            .then(response => {
                this.showSuccess('Delete User','User was deleted successfuly')
                this.getAdmins()
            })
            .catch(error => {
                this.showError('Action Failure', 'You cant delete yourself')
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