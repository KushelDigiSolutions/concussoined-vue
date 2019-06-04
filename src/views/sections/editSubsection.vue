<template>
	<main class="pagecontent">
		<div class="scroll" v-if="!loading">
			<header class="full-width">
				<h1>Edit Subsection</h1>
                <div class="actions">
                    <button class="btn icon mr-3" @click="updateSection()">
                        <font-awesome-icon icon="sync-alt" />
                        <span>Update</span>
                    </button>
                    <button class="btn btn-red icon" @click="$router.push({name:'sections'})">
                        <font-awesome-icon icon="ban" />
                        <span>Cancel</span>
                    </button>
                </div>
			</header>
			<section class="edit-section">
                <div class="row subs">
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group">
                            <label for="title">Title(EN):</label>
                            <input type="text" id="title" v-model="subsection.titleEN" placeholder="Section Title">
                        </div>
                        <div class="form-group">
                            <label for="desc_en">Subsection Description(EN):</label>
                            <ckeditor :editor="editor" v-model="subsection.descriptionEN" :config="editorConfig"></ckeditor>
                        </div>
                    </div>
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group">
                            <label for="title">Title(FR):</label>
                            <input type="text" id="title" v-model="subsection.titleFR" placeholder="Section Title">
                        </div>
                        <div class="form-group">
                            <label for="desc_en">Subsection Description(FR):</label>
                            <ckeditor :editor="editor" v-model="subsection.descriptionFR" :config="editorConfig"></ckeditor>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 col-lg-6">
                        <label for="parent">Parent Section:</label>
                        <select class="full-width" name="parent" v-model="subsection.parent_id">
                            <option :value="section.id" v-for="section in sections" :key="section.id">{{section.title}}</option>
                        </select>
                    </div>
                </div>
			</section>
            <header class="full-width mt-3">
                <div>
                    <h1>Edit Widgets</h1>
                    <div class="checkboxes pl-1 ml-3">
                        <input class="form-check-input" type="checkbox" id="wlang" v-model="widgetsLang">
                        <label class="form-check-label" for="wlang">French</label>
                    </div>
                </div>
                <button class="btn icon" @click="$modal.show('addwidget')">
					<font-awesome-icon icon="plus" />
					<span>Add New</span>
				</button>
			</header>
            <widgetlist :widgets="widgets" :update="update" @del="modalDel" v-if="widgets"/>
		</div>
         <modal
                name="addwidget"
                transition="nice-modal-fade"
                classes="addwidget"
                :reset="true"
                width="350"
                height="300"
                @before-close="files = []">
                <div class="modal-title">Add New Widget</div>
                <div class="form-group">
                    <label for="newwidget">Select type of widget:</label>
                    <select name="newwidget" id="newwidget" v-model="newWidget">
                        <option value="textcontent">Text Widget</option>
                        <option value="videowidget">Video Widget</option>
                        <option value="gallerywidget">Gallery Widget</option>
                        <option value="accordionwidget">Accordion Widget</option>
                    </select>
                </div>
                <div class="actions">
                    <button class="btn icon mr-3" @click="addWidget()">
                        <font-awesome-icon icon="check" />
                        <span>Confirm</span>
                    </button>
                    <button class="btn btn-red icon" @click="$modal.hide('addwidget')">
                        <font-awesome-icon icon="ban" />
                        <span>Cancel</span>
                    </button>
                </div>
            </modal>
            <modal
                name="delwidget"
                transition="nice-modal-fade"
                classes="addwidget"
                :reset="true"
                width="350"
                height="200"
                @before-close="files = []">
                <div class="modal-title">Delete Widget</div>
                <div class="form-group">
                    <label for="newwidget text-center">Are you sure?</label>
                </div>
                <div class="actions">
                    <button class="btn icon mr-3" @click="deleteWidget()">
                        <font-awesome-icon icon="check" />
                        <span>Confirm</span>
                    </button>
                    <button class="btn btn-red icon" @click="$modal.hide('delwidget')">
                        <font-awesome-icon icon="ban" />
                        <span>Cancel</span>
                    </button>
                </div>
            </modal>
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
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import VModal from 'vue-js-modal'
import widgetlist from '../widgets/widgetList'

library.add(faSyncAlt, faBan)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr, CKEditor)
Vue.use(VModal, { componentName: "modal" })
export default {
    name: 'editSection',
    components: {
        widgetlist,
        ckeditor: CKEditor.component
    },
    watch: {
        widgetsLang(val) {
            this.widgets = val == false ? this.widgets_en : this.widgets_fr
        }
    },
	data: function () {
		return {
            ps:null,
            sections:[],
            subsection:
                {
                    parent_id: '',
                    name: '',
                    titleEN: '',
                    titleFR: '',
                    descriptionEN: '',
                    descriptionFR: ''
                },
            widgets:[],
            widgets_en:[],
            widgets_fr:[],
            widgetsLang:false,
            newWidget: 'textcontent',
            delWidget:{
                id:'',
                type:''
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
            update:false,
            loading:true
		}
	},
	mounted: function() {
        this.getSubsection()
        this.getSections()
	},
	methods: {
        // getting subsection data
		getSubsection: function() {
            this.subsection.titleEN = ''
            this.subsection.svg = ''
            this.subsection.id = ''
            this.subsection.name = ''
            this.widgets = [],
            this.widgets_en = [],
            this.widgets_fr = [],
            this.widgetsLang = false
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
			this.axios.get(process.env.VUE_APP_URL+'subsection/all/'+this.$route.params.id)
			.then(response => {
                this.subsection.titleEN = response.data.title_en
                this.subsection.titleFR = response.data.title_fr
                this.subsection.descriptionEN = response.data.description_en
                this.subsection.descriptionFR = response.data.description_fr
                this.subsection.parent_id = response.data.section_id
                this.subsection.name = response.data.name
                this.subsection.id = response.data.id
                this.axios.get(process.env.VUE_APP_URL+'subsection/'+this.subsection.name, {params:{name:this.subsection.name,language:'en'}})
                .then(response => {
                    this.prepareComponents(response.data,'en')
                    this.axios.get(process.env.VUE_APP_URL+'subsection/'+this.subsection.name, {params:{name:this.subsection.name,language:'fr'}})
                    .then(response => {
                        this.prepareComponents(response.data,'fr')
                        this.widgets = this.widgets_en
                    })
                })
            })
        },
        // getting sections list
        getSections: function() {
			this.axios.get(process.env.VUE_APP_URL+'sections', {params:{language: 'en'}})
			.then(response => {
				this.sections = response.data
				this.$nextTick(() => {
					this.perfectScrollInit()
				})
			})
		},
        // making widgets array
        prepareComponents: function(data,lang){
			if(data.accordions && data.accordions.length > 0) {
				data.accordions.map(a => {
					a.type = 'accordionwidget'
					this['widgets_'+lang].push(a)
				})
			}
			if(data.galleries && data.galleries.length > 0) {
				data.galleries.map(a => {
					a.type = 'gallerywidget'
					this['widgets_'+lang].push(a)
				})
			}
			if(data.subsections && data.subsections.length > 0) {
				data.subsections.map(a => {
					a.type = 'subsectionwidget'
					this['widgets_'+lang].push(a)
				})
			}
			if(data.videos && data.videos.length > 0) {
				data.videos.map(a => {
					a.type = 'videowidget'
					this['widgets_'+lang].push(a)
				})
			}
			if(data.text_contents && data.text_contents.length > 0) {
				data.text_contents.map(a => {
					a.type = 'textcontent'
					this['widgets_'+lang].push(a)
				})
            }
            this.loading = false
			this.$nextTick(() => {
				this.sortComponents(lang)
			})
        },
        // sorting widgets by index prop
        sortComponents: function(){
			function compare(a,b) {
				if (a.index < b.index)
					return -1;
				if (a.index > b.index)
					return 1;
				return 0;
			}

			this.widgets = this.widgets.sort(compare)

			this.$nextTick(() => {
				this.perfectScrollInit()
			})
		},
        // sending updated section data to the server
        updateSection: function(){
            this.update = !this.update
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.patch(process.env.VUE_APP_URL+'subsection/'+this.$route.params.id,
            {
                title_en: this.subsection.titleEN,
                title_fr: this.subsection.titleFR,
                description_en: this.subsection.descriptionEN,
                description_fr: this.subsection.descriptionFR,
                section_id: this.subsection.parent_id
            })
            .then(response => {
                this.showSuccess('Subsection was updated', 'Subection was updated successfuly.')
            })
            .catch(error => {
                this.showError('Update failure', 'Something went wrong.')
            })
        },
         addWidget: function() {
            this.$router.push({path:'../widget/add/'+this.newWidget, query:{from:'subsection',id:this.subsection.id}})
        },
        deleteWidget: function() {
            var url = ''
            switch(this.delWidget.type) {
                case 'textcontent':
                     url = 'text_content'
                    break;
                case 'accordionwidget':
                    url = 'accordion'
                    break;
                case 'gallerywidget':
                    url = 'gallery'
                    break;
                case 'subsectionwidget':
                    url = 'subsection'
                    break;
                case 'videowidget':
                    url = 'video'
                    break;
            }
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.delete(process.env.VUE_APP_URL+url+'/'+this.delWidget.id,
            {
                id: this.delWidget.id
            })
            .then(response => {
                this.showSuccess('Widget was deleted', 'Widget was deleted successfuly.')
                this.$modal.hide('delwidget')
                this.loading = true
                this.getSubsection()
            })
        },
        modalDel: function(type, id) {
            this.delWidget.type = type
            this.delWidget.id = id
            this.$modal.show('delwidget')
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
