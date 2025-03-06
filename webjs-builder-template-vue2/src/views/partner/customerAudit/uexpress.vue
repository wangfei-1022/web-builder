<template>
  <customer-audit businessType="INTERNATIONAL_LINE" origin="UexpressCustomerAuditList"></customer-audit>
</template>

<script>
import customerAudit from '@/views/partner/customerAudit'

export default {
	name: 'UexpressCustomerAuditList',
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
