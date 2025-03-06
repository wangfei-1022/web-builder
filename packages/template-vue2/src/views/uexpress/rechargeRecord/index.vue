<template>
  <recharge-record businessType="INTERNATIONAL_LINE" origin="UexpressRechargeRecordList"></recharge-record>
</template>

<script>
import RechargeRecord from '@/views/financial/rechargeRecord/operator' // 待关联列表

export default {
	name: "UexpressRechargeRecordList",
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
