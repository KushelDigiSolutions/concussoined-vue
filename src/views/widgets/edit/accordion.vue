<template>
    <main class="pagecontent">
		<div class="scroll" v-if="!loading">
			<header class="full-width">
				<h1>Edit Accordion</h1>
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
                <button class="btn icon" @click="$modal.show('addelement')">
					<font-awesome-icon icon="plus" />
					<span>Add New</span>
				</button>
			</header>
            <section class="edit-widget elemets">
                <draggable v-model="elements" group="widgets" @start="drag=true" @end="drag=false" class="list-group">
                    <transition-group type="transition" :name="'flip-list'">
                        <div class="row no-pad pt-4 pb-4 mt-2 mb-2" v-for="element in elements" :key="element.id">
                            <div class="col-md-12 col-lg-4 v-align-center">
                                <p>{{element.question_en}}</p>
                            </div>
                            <div class="col-md-12 col-lg-4 v-align-center">
                                <p>{{element.question_fr}}</p>
                            </div>
                            <div class="col-md-12 col-lg-4 v-align-center" style="justify-content:flex-end;">
                                <span class="action">
                                    <button class="btn btn-blue icon mr-3"@click="editItem(element)">
                                        <font-awesome-icon icon="pencil-alt" />
                                        <span>Edit</span>
                                    </button>
                                    <button class="btn btn-red icon" @click="deleteItem(element.id)">
                                        <font-awesome-icon icon="trash-alt"/>
                                        <span>Delete</span>
                                    </button>
                                </span>
                            </div>
                        </div>
                    </transition-group>
                </draggable>
			</section>
            <modal
                name="addelement"
                transition="nice-modal-fade"
                classes="addwidget"
                :reset="true"
                width="60%"
                height="600"
                @before-close="files = []">
                <div class="modal-title">Add New Element</div>
                <div class="row" style="width:100%;min-height:350px">
                    <div class="col-6">
                        <div class="form-group">
                            <label for="title">Question(EN):</label>
                            <input type="text" id="titleen" v-model="newelement.question_en" placeholder="Question EN">
                        </div>
                        <div class="form-group accordion_text">
                            <label for="desc_en">Answer(EN):</label>
                            <ckeditor :editor="editor" v-model="newelement.answer_en" :config="editorConfig"></ckeditor>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label for="title">Question(FR):</label>
                            <input type="text" id="titlefr" v-model="newelement.question_fr" placeholder="Question FR">
                        </div>
                        <div class="form-group accordion_text">
                            <label for="desc_en">Answer(FR):</label>
                            <ckeditor :editor="editor" v-model="newelement.answer_fr" :config="editorConfig"></ckeditor>
                        </div>
                    </div>
                </div>
                <div class="actions">
                    <button class="btn icon mr-3" @click="addElement()">
                        <font-awesome-icon icon="check" />
                        <span>Confirm</span>
                    </button>
                    <button class="btn btn-red icon" @click="cancelAdding()">
                        <font-awesome-icon icon="ban" />
                        <span>Cancel</span>
                    </button>
                </div>
            </modal>
            <modal
                name="editelement"
                transition="nice-modal-fade"
                classes="editwidget"
                :reset="true"
                width="60%"
                height="600"
                @before-close="files = []">
                <div class="modal-title">Edit Element</div>
                <div class="row" style="width:100%;min-height:350px">
                    <div class="col-6">
                        <div class="form-group">
                            <label for="title">Question(EN):</label>
                            <input type="text" id="titleen" v-model="editelement.question_en" placeholder="Question EN">
                        </div>
                        <div class="form-group accordion_text">
                            <label for="desc_en">Answer(EN):</label>
                            <ckeditor :editor="editor" v-model="editelement.answer_en" :config="editorConfig"></ckeditor>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label for="title">Question(FR):</label>
                            <input type="text" id="titlefr" v-model="editelement.question_fr" placeholder="Question FR">
                        </div>
                        <div class="form-group accordion_text">
                            <label for="desc_en">Answer(FR):</label>
                            <ckeditor :editor="editor" v-model="editelement.answer_fr" :config="editorConfig"></ckeditor>
                        </div>
                    </div>
                </div>
                <div class="actions">
                    <button class="btn icon mr-3" @click="saveElement()">
                        <font-awesome-icon icon="check" />
                        <span>Confirm</span>
                    </button>
                    <button class="btn btn-red icon" @click="cancelEditing()">
                        <font-awesome-icon icon="ban" />
                        <span>Cancel</span>
                    </button>
                </div>
            </modal>
		</div>
        <div class="loading" v-if="loading"><img src="/img/loading.gif"></div>
    </main>
</template>
<script>
import Vue from "vue"
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import draggable from 'vuedraggable'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSyncAlt, faBan, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VModal from 'vue-js-modal'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

library.add(faSyncAlt, faBan, faPencilAlt, faPlus)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)
Vue.use(VModal, { componentName: "modal" })
export default {
    name: 'editAccordion',
    components: {
        draggable,
        ckeditor: CKEditor.component
    },
	data: function () {
		return {
            ps:null,
            widget:[],
            elements:[],
            newelement: {
                accordion_id: this.$route.params.id,
                index:1,
                question_en: '',
                question_fr: '',
                content_en: '',
                content_fr: ''
            },
            editelement: [],
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
            loading:true
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
                this.loading = false
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
        deleteItem: function(id) {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.delete(process.env.VUE_APP_URL+'accordion_element/'+id)
            .then(response => {
                this.showSuccess('Element was deleted', 'Element was deleted successfuly.')
                this.loading = true
                this.getWidgetData()
            })
        },
        cancelAdding: function() {
            this.$modal.hide('addelement')
            this.newelement.question_en = ''
            this.newelement.question_fr = ''
            this.newelement.answer_en = ''
            this.newelement.answer_fr = ''
        },
        cancelEditing: function() {
            this.$modal.hide('editelement')
            this.editelement = []
        },
        editItem: function(e) {
            this.editelement = e
            this.$modal.show('editelement')
        },
        addElement: function() {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.post(process.env.VUE_APP_URL+'accordion_element', this.newelement)
            .then(response => {
                this.$modal.hide('addelement')
                this.newelement.question_en = ''
                this.newelement.question_fr = ''
                this.newelement.answer_en = ''
                this.newelement.answer_fr = ''
                this.showSuccess('Element was added', 'Element was added successfuly.')
                this.loading = true
                this.getWidgetData()
            })
        },
        saveElement: function() {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.patch(process.env.VUE_APP_URL+'accordion_element/'+this.editelement.id, this.editelement)
            .then(response => {
                this.$modal.hide('editelement')
                this.editelement = []
                this.showSuccess('Element was edited', 'Element was saved successfuly.')
                this.loading = true
                this.getWidgetData()
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