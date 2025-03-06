<template>
  <bill type='AR' @refresh="init"></bill>
</template>

<script>
import bill from './bill'

export default {
	name: "UExpressFmsReceiveBill",
	components: {
		bill
	},
	data() {
		return {
			loading: false
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {

		}
	}
}
</script>
<style lang="scss" scoped>
</style>
