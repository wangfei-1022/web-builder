<template>
  <customer-audit businessType="OVERSEAS_WAREHOUSE" origin="OvlCustomerAuditList"></customer-audit>
</template>

<script>
import customerAudit from '@/views/partner/customerAudit'

export default {
	name: 'OvlCustomerAuditList',
	data() {
		return {

		}
	},
	components: { customerAudit},
	computed: {},
	methods: {}
}
</script>

<style lang='scss' scoped>
</style>
