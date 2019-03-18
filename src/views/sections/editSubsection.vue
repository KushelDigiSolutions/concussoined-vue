<template>
	<main class="pagecontent">
		<div class="scroll">
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
                <div class="row">
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group">
                            <label for="title">Title(EN):</label>
                            <input type="text" id="title" v-model="subsection.titleEN" placeholder="Section Title">
                        </div>
                        <div class="form-group">
                            <label for="desc_en">Subsection Description(EN):</label>
                            <textarea id="desc_en" class="full-width" v-model="subsection.descriptionEN"></textarea>
                        </div>
                    </div>
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group">
                            <label for="title">Title(FR):</label>
                            <input type="text" id="title" v-model="subsection.titleFR" placeholder="Section Title">
                        </div>
                        <div class="form-group">
                            <label for="desc_en">Subsection Description(FR):</label>
                            <textarea id="desc_en" class="full-width" v-model="subsection.descriptionFR"></textarea>
                        </div>
                    </div>
                </div>
			</section>
            <header class="full-width mt-3">
				<h1>Edit Widgets</h1>
                <button class="btn icon" @click="showError('TODO','That func is not exist')">
					<font-awesome-icon icon="plus" />
					<span>Add New</span>
				</button>
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

import widgetlist from '../widgets/widgetList'

library.add(faSyncAlt, faBan)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)

export default {
    name: 'editSection',
    components: {
        widgetlist
    },
	data: function () {
		return {
			ps:null,
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
            update:false
		}
	},
	mounted: function() {
        this.getSection()
	},
	methods: {
        // getting section data
		getSection: function() {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
			this.axios.get(process.env.VUE_APP_URL+'subsection/all/'+this.$route.params.id)
			.then(response => {
                this.subsection.titleEN = response.data.title_en
                this.subsection.titleFR = response.data.title_fr
                this.subsection.descriptionEN = response.data.description_en
                this.subsection.descriptionFR = response.data.description_fr
                this.subsection.parent_id = response.data.id
                this.subsection.name = response.data.name
                this.axios.get(process.env.VUE_APP_URL+'subsection/'+this.subsection.name, {params:{name:this.subsection.name,language:'en'}})
                .then(response => {
                    this.prepareComponents(response.data)
                })
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
        // sending updated section data to the server
        updateSection: function(){
            this.update = !this.update
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.patch(process.env.VUE_APP_URL+'subsection/'+this.$route.params.id,
            {
                title_en: this.subsection.titleEN,
                title_fr: this.subsection.titleFR,
                description_en: this.subsection.descriptionEN,
                description_fr: this.subsection.descriptionFR
            })
            .then(response => {
                this.showSuccess('Subsection was updated', 'Subection was updated successfuly.')
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
