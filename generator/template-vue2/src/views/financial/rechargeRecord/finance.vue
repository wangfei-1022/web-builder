<template>
  <el-tabs type="border-card" class="top-tabs">
    <el-tab-pane :label="$t('rechargeRecord.UN_AUDITED') + '(' + unAuditNumber + ')'">
      <audited-list origin="RechargeRecordFinanceList" role="FINANCE" status="AUDITED"></audited-list>
    </el-tab-pane>
    <el-tab-pane :label="$t('rechargeRecord.ALL')" lazy>
      <audited-list origin="RechargeRecordFinanceList" role="FINANCE" status="ALL"></audited-list>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AuditedList from './components/AuditedList'
import { getFinanceCountApi } from "@/api/financial/rechargeRecord"

export default {
	name: "RechargeRecordFinanceList",
	components: {
		AuditedList
	},
	data() {
		return {
			loading: false,
			unAuditNumber: 0
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			getFinanceCountApi().then(res => {
				if (res.ok) {
          this.unAuditNumber = res.content
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>
