<template>
  <div class="tab-pane-wrap" v-loading="loading">
    <receivable :order="order" :back="back" :tabPane="tabPane" @triggerReceiveLoading="loadingTrigger"></receivable>
  </div>
</template>
<script>
import receivable from './components/receivable'
export default {
	name: 'ReceiveTab',
	components: { receivable },
	props: {
		order: {
			type: Object,
			default: function () {
				return {}
			}
		},
		tabPane: {
			type: String,
			default() {
				return ""
			}
		},
		back: {
			type: String,
			default() {
				return ""
			}
		}
	},
	data() {
		return {
			loading: false
		}
	},
	methods: {
		loadingTrigger(flag = false) {
			this.loading = flag
		}
	}
}
</script>

<style scoped lang="less">
</style>
