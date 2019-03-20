<template>
	<main id="pagecontent">
		<div class="scroll" v-if="!loading">
			<header>
				<h1>Sections</h1>
				<!-- <a href="#" class="btn icon">
					<font-awesome-icon icon="plus" />
					<span>Add New</span>
				</a> -->
			</header>
			<section class="sections-list">
				<div class="list-group">
					<div class="list-group-item" v-for="section in sections" :key="section.id">
						<div>
							<span class="p-2 d-inline-block">
								{{section.title}}
								<template v-if="section.primary == '1'">
									<sup class="primary">primary</sup>
								</template>
							</span>
							<span class="action">
								<button class="btn btn-blue icon mr-4" @click="$router.push({name:'editSection', params:{name:section.name}})">
									<font-awesome-icon icon="pencil-alt" />
									<span>Edit</span>
								</button>
							</span>
						</div>
						<div class="list-group mt-4 mb-4" v-if="section.subsections.length > 0">
							<div class="list-group-item" v-for="subsection in section.subsections" :key="subsection.id">
								<div>
									<span class="p-2 d-inline-block">
										{{subsection.title_en}}
									</span>
									<span class="action">
										<button class="btn btn-blue icon mr-1" @click="$router.push({name:'editSubsection', params:{id:subsection.id}})">
											<font-awesome-icon icon="pencil-alt" />
											<span>Edit</span>
										</button>
									</span>
								</div>
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
import { faPlus, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlus, faPencilAlt, faTrashAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)

export default {
	name: 'sections',
	data: function () {
		return {
			ps:null,
			sections: [],
			loading:true
		}
	},
	mounted: function() {
		this.getSections()
	},
	methods: {
		getSections: function() {
			this.axios.get(process.env.VUE_APP_URL+'sections', {params:{language: 'en'}})
			.then(response => {
				this.sections = response.data
				this.loading = false
				this.$nextTick(() => {
					this.perfectScrollInit()
				})
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
