<template>
	<main class="pagecontent">
		<div class="scroll" v-if="!loading">
			<header class="full-width">
				<h1>Edit Section</h1>
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
                <div class="row">
                    <div class="col-md-12 col-lg-2 mb-3">
                        <label>Icon(SVG):</label>
                        <div class="section-ico clickable">
                            <button class="sml"><font-awesome-icon icon="ban" v-if="section.svg" @click="section.svg = ''"/></button>
                            <div class="preview" v-html="section.svg"></div>
                            <input type="file" accept=".svg" @change="onFileChanged">
                        </div>
                    </div>
                    <div class="col-md-12 col-lg-10">
                        <div class="row">
                            <div class="col-md-12 col-lg-6">
                                <div class="form-group">
                                    <label for="title">Title(EN):</label>
                                    <input type="text" id="title" v-model="section.titleEN" placeholder="Section Title">
                                </div>
                            </div>
                            <div class="col-md-12 col-lg-6">
                                <div class="form-group">
                                    <label for="title">Title(FR):</label>
                                    <input type="text" id="title" v-model="section.titleFR" placeholder="Section Title">
                                </div>
                            </div>
                        </div>
                        <div class="checkboxes pt-2">
                            <input class="form-check-input" type="checkbox" id="primary" v-model="section.primary">
                            <label class="form-check-label" for="primary">Primary Section</label>
                        </div>
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
                        <option value="accordionwidget" disabled="disabled">Accordion Widget</option>
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
import { faSyncAlt, faBan, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VModal from 'vue-js-modal'
import widgetlist from '../widgets/widgetList'

library.add(faSyncAlt, faBan, faCheck)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)
Vue.use(VModal, { componentName: "modal" })
export default {
    name: 'editSection',
    components: {
        widgetlist
    },
    watch: {
        widgetsLang(val) {
            this.widgets = val == false ? this.widgets_en : this.widgets_fr
        }
    },
	data: function () {
		return {
			ps:null,
            section:
                {
                    id: '',
                    name: '',
                    titleEN: '',
                    titleFR: '',
                    svg:'',
                    primary: false
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
            update:false,
            loading: true
		}
	},
	mounted: function() {
        this.getSection()
	},
	methods: {
        // getting section data
		getSection: function() {
            this.section.titleEN = ''
            this.section.svg = ''
            this.section.id = ''
            this.section.name = ''
            this.section.primary = false
            this.widgets = [],
            this.widgets_en = [],
            this.widgets_fr = [],
            this.widgetsLang = false
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
			this.axios.get(process.env.VUE_APP_URL+'section/'+this.$route.params.name, {params:{name:this.$route.params.name,language:'en'}})
			.then(response => {
                this.section.titleEN = response.data.title
                this.section.svg = response.data.svg
                this.section.id = response.data.id
                this.section.name = response.data.name
                response.data.primary == '1' ? this.section.primary = true : this.section.primary = false
                this.prepareComponents(response.data,'en')
                this.axios.get(process.env.VUE_APP_URL+'section/'+this.$route.params.name, {params:{name:this.$route.params.name,language:'fr'}})
                .then(response => {
                    this.section.titleFR = response.data.title
                    this.prepareComponents(response.data,'fr')
                    this.widgets = this.widgets_en
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
        sortComponents: function(lang){
			function compare(a,b) {
				if (a.index < b.index)
					return -1;
				if (a.index > b.index)
					return 1;
				return 0;
			}

			this['widgets_'+lang] = this['widgets_'+lang].sort(compare)

			this.$nextTick(() => {
				this.perfectScrollInit()
			})
		},
        // storing svg for upload
        onFileChanged (event) {
            let reader = new FileReader()
            var self = this
            reader.readAsText(event.target.files[0], "UTF-8")
            reader.onload = function (evt) {
                self.section.svg = evt.target.result
            }
            reader.onerror = function (evt) {
                this.showError('File upload failed','Error reading file, try another one.')
            }
        },
        // sending updated section data to the server
        updateSection: function(){
            this.update = !this.update
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.patch(process.env.VUE_APP_URL+'section/'+this.section.id,
            {
                title_en: this.section.titleEN,
                title_fr: this.section.titleFR,
                svg: this.section.svg,
                primary: this.section.primary
            })
            .then(response => {
                this.showSuccess('Section was updated', 'Section was updated successfuly.')
            })
            .catch(error => {
                this.showError('Update failure', 'Something went wrong.')
            })
        },
        addWidget: function() {
            this.$router.push({path:'../widget/add/'+this.newWidget, query:{from:'section',id:this.section.id}})
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
                this.getSection()
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
