<template>
    <main class="pagecontent">
		<div class="scroll" v-if="!loading">
			<header class="full-width">
				<h1>Edit Symptoms</h1>
                <div class="actions">
                    <button class="btn icon mr-3" @click="updateSymptoms()">
                        <font-awesome-icon icon="sync-alt" />
                        <span>Update</span>
                    </button>
                    <button class="btn btn-red icon" @click="$router.push({path:prevRoute})">
                        <font-awesome-icon icon="ban" />
                        <span>Cancel</span>
                    </button>
                </div>
			</header>
            <section class="edit-widget mb-3">
                <div class="row">
                    <div class="col-md-12 col-lg-6">
                        <p class="mb-4">EN symptoms:</p>
                        <div class="form-group" v-for="cat in symptomCategories_en" :key="cat">
                            <label for="title" class="symptom-cat">{{cat}}</label>
                            <div class="mt-3 mb-3" v-for="symptom in symptomsByCat(cat,'en')" :key="symptom.id">
                                <input type="text" id="title" v-model="symptom.symptom" @change="markSymptom(symptom.id,'en')">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 col-lg-6">
                        <p class="mb-4">FR symptoms:</p>
                        <div class="form-group" v-for="cat in symptomCategories_fr" :key="cat">
                            <label for="title" class="symptom-cat">{{cat}}</label>
                            <div class="mt-3 mb-3" v-for="symptom in symptomsByCat(cat,'fr')" :key="symptom.id">
                                <input type="text" id="title" v-model="symptom.symptom" @change="markSymptom(symptom.id,'fr')">
                            </div>
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
            symptomCategories_en:[],
            symptomCategories_fr:[],
            symptoms_en:[],
            symptoms_fr:[],
            prevRoute: null,
            loading: true
		}
	},
	mounted: function() {
        this.getSymptomsList('en')
        this.getSymptomsList('fr')
	},
	methods: {
		getSymptomsList: function(lang) { // getting symptoms and parsing symptoms categories
			this.axios.get(process.env.VUE_APP_URL+'symptoms', {params: {language:lang}})
			.then(response => {
				this['symptoms_'+lang] = response.data
				this['symptoms_'+lang].map(s => {
					let exist = false
					s.edited = 0
					this['symptomCategories_'+lang].map(c => {
						c == s.category ? exist = true : ''
					})
					!exist ? this['symptomCategories_'+lang].push(s.category) : ''
                })
                this.loading = false
                this.$nextTick(() => {
                    this.perfectScrollInit()
                })
			})
        },
        symptomsByCat: function(cat, lang) { // filtering symptoms by category name
			let list = []
			this['symptoms_'+lang].map(s => {
				s.category == cat ? list.push(s) : ''
			})
			return list
        },
        markSymptom: function(symptom,lang) {
            this['symptoms_'+lang].map(s => {
                s.id == symptom ? s.edited = 1 : ''
            })
        },
        updateSymptoms: function(){
            this.symptoms_en.map(s => {
                if(s.edited == 1) {
                    this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
                    this.axios.patch(process.env.VUE_APP_URL+'symptom/'+s.id, {
                        symptom_en: s.symptom
                    })
                }
            })
            this.symptoms_fr.map(s => {
                if(s.edited == 1) {
                    this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
                    this.axios.patch(process.env.VUE_APP_URL+'symptom/'+s.id, {
                        symptom_fr: s.symptom
                    })
                }
            })
            this.showSuccess('Symptoms was Updated', 'Symptoms data was updated successfuly.')
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