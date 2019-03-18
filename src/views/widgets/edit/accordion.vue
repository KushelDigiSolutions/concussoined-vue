<template>
    <main class="pagecontent">
		<div class="scroll">
			<header class="full-width">
				<h1>Edit Widget</h1>
                <div class="actions">
                    <button class="btn icon mr-3" @click="updateWidget()">
                        <font-awesome-icon icon="sync-alt" />
                        <span>Update</span>
                    </button>
                    <button class="btn btn-red icon" @click="$router.go(-1)">
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
            <header class="full-width mt-4">
				<h1>Edit Elements</h1>
			</header>
            <section class="edit-widget elemets">
                <draggable v-model="elements" group="widgets" @start="drag=true" @end="drag=false" class="list-group">
                    <transition-group type="transition" :name="'flip-list'">
                        <div class="row pt-4 pb-4 mt-2 mb-2" v-for="element in elements" :key="element.id">
                            <div class="col-md-12 col-lg-6">
                                <div class="form-group">
                                    <label for="title">Question(EN):</label>
                                    <input type="text" id="title" v-model="element.question_en" placeholder="Question EN">
                                </div>
                                <div class="form-group">
                                    <label for="desc_en">Answer(EN):</label>
                                    <textarea id="desc_en" class="full-width" v-model="element.answer_en"></textarea>
                                </div>
                            </div>
                            <div class="col-md-12 col-lg-6">
                                <div class="form-group">
                                    <label for="title">Question(FR):</label>
                                    <input type="text" id="title" v-model="element.question_fr" placeholder="Question EN">
                                </div>
                                <div class="form-group">
                                    <label for="desc_en">Answer(FR):</label>
                                    <textarea id="desc_en" class="full-width" v-model="element.answer_fr"></textarea>
                                </div>
                            </div>
                        </div>
                    </transition-group>
                </draggable>
			</section>
		</div>
    </main>
</template>
<script>
import Vue from "vue"
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import draggable from 'vuedraggable'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSyncAlt, faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSyncAlt, faBan)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)
export default {
    name: 'editAccordion',
    components: {
        draggable,
    },
	data: function () {
		return {
            ps:null,
            widget:[],
            elements:[]
		}
	},
	mounted: function() {
        this.getWidgetData()
	},
	methods: {
        // getting widget
		getWidgetData: function() {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.get(process.env.VUE_APP_URL+'accordion/'+this.$route.params.id)
            .then(response => {
                this.widget = response.data
                this.getElements()
            })
        },
		getElements: function() {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.get(process.env.VUE_APP_URL+'accordion/'+this.$route.params.id+'/accordion_elements')
            .then(response => {
                this.elements = response.data
                this.$nextTick(() => {
					this.perfectScrollInit()
				})
            })
        },
        updateWidget: function(){
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.patch(process.env.VUE_APP_URL+'accordion/'+this.$route.params.id, {
                title_en: this.widget.title_en,
                title_fr: this.widget.title_fr
            })
            .then(response => {
                this.updateElements()
                this.showSuccess('Widget was Updated', 'Widget data was updated successfuly.')
            })
        },
        updateElements: function(){
            this.elements.map((element, index) => {
                index++
                this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
                this.axios.patch(process.env.VUE_APP_URL+'accordion_element/'+element.id, {
                    index: index,
                    question_en: element.question_en,
                    content_en: element.content_en,
                    question_fr: element.question_fr,
                    content_fr: element.content_fr
                })
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