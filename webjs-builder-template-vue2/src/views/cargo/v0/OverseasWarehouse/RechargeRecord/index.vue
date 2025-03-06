<template>
  <recharge-record businessType="OVERSEAS_WAREHOUSE" origin="OvlRechargeRecord"></recharge-record>
</template>

<script>
import RechargeRecord from '@/views/financial/rechargeRecord/operator' // 待关联列表

export default {
	name: "OvlRechargeRecord",
	components: {
    RechargeRecord
	},

	data() {
		return {

		}
	}
}
</script>
<style lang="scss" scoped>
</style>
