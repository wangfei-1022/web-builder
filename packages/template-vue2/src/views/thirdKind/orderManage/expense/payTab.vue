<template>
  <div class="tab-pane-wrap" v-loading="loading">
    <Payable :order="order" :tabPane="tabPane" @triggerPayableLoading="loadingTrigger"></Payable>
  </div>
</template>
<script>
import Payable from './components/payable'
export default {
	name: 'PayTab',
	components: { Payable },
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
		}
	},
	data() {
		return {
			loading: false
		}
	},
	methods: {
		loadingTrigger(flag) {
			this.loading = flag
		}
	}
}
</script>

<style scoped lang="less">
</style>
