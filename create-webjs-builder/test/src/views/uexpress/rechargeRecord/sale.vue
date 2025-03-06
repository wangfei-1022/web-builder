<template>
  <recharge-record businessType="INTERNATIONAL_LINE" origin="UexpressRechargeRecordSale"></recharge-record>
</template>

<script>
import RechargeRecord from '@/views/financial/rechargeRecord/sale' // 待关联列表

export default {
	name: "UexpressRechargeRecordSale",
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
