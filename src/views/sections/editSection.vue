<template>
	<main id="pagecontent">
		<div class="scroll">
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
				<h1>Edit Widgets</h1>
                <a href="#" class="btn icon">
					<font-awesome-icon icon="plus" />
					<span>Add New</span>
				</a>
			</header>
            <widgetlist :widgets="widgets" :update="update"/>
		</div>
	</main>
</template>

<script>
import Vue from "vue"
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSyncAlt, faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import widgetlist from './widgetList'

library.add(faSyncAlt, faBan)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)

export default {
    name: 'editSection',
    props:['name'],
    components: {
        widgetlist
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
            update:false
		}
	},
	mounted: function() {
        this.getSection()
	},
	methods: {
        // getting section data
		getSection: function() {
			this.axios.get(process.env.VUE_APP_URL+'section/'+this.$route.params.name, {params:{name:this.$route.params.name,language:'en'}})
			.then(response => {
                this.section.titleEN = response.data.title
                this.section.svg = response.data.svg
                this.section.id = response.data.id
                this.section.name = response.data.name
                response.data.primary == '1' ? this.section.primary = true : this.section.primary = false
                this.axios.get(process.env.VUE_APP_URL+'section/'+this.$route.params.name, {params:{name:this.$route.params.name,language:'fr'}})
                .then(response => {
                    this.section.titleFR = response.data.title
                })
                this.prepareComponents(response.data)
            })
        },
        // making widgets array
        prepareComponents: function(data){
			if(data.accordions && data.accordions.length > 0) {
				data.accordions.map(a => {
					a.type = 'accordionwidget'
					this.widgets.push(a)
				})
			}
			if(data.galleries && data.galleries.length > 0) {
				data.galleries.map(a => {
					a.type = 'gallerywidget'
					this.widgets.push(a)
				})
			}
			if(data.subsections && data.subsections.length > 0) {
				data.subsections.map(a => {
					a.type = 'subsectionwidget'
					this.widgets.push(a)
				})
			}
			if(data.videos && data.videos.length > 0) {
				data.videos.map(a => {
					a.type = 'videowidget'
					this.widgets.push(a)
				})
			}
			if(data.text_contents && data.text_contents.length > 0) {
				data.text_contents.map(a => {
					a.type = 'textcontent'
					this.widgets.push(a)
				})
			}
			this.$nextTick(() => {
				this.sortComponents()
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
