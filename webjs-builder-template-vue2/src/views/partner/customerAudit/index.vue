<template>
  <el-tabs type="border-card" class="top-tabs">
    <!--待审核-->
    <el-tab-pane :label="$t('customerManage.UN_AUDIT') + '(' + unAuditNumber +')'">
      <audit-page :status="1" :businessType="businessType" :origin="origin" @refresh="init"></audit-page>
    </el-tab-pane>
     <!--未签约-->
    <el-tab-pane :label="$t('customerManage.UN_SIGN') + '(' + unSignNumber +')'" lazy>
      <audit-page :status="2" :signStatus="0" :businessType="businessType" :origin="origin" @refresh="init"></audit-page>
    </el-tab-pane>
    <!--已签约-->
    <el-tab-pane :label="$t('customerManage.SIGNED')" lazy>
      <audit-page :status="2" :signStatus="1" :businessType="businessType" :origin="origin" @refresh="init"></audit-page>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AuditPage from './components/AuditCustomerPage'
import { getCustomerAuditCountApi } from "@/api/partner/customerAudit"

export default {
	name: "CRMCustomerAuditList",
	components: {
		AuditPage
	},
  props: {
    businessType: {
      type: [String, Number],
      default: ''
    },
    origin: {
      type: [String],
      default: ''
    }
  },
	data() {
		return {
			loading: false,
			unAuditNumber: 0,
			unSignNumber: 0
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			// 待审核
			getCustomerAuditCountApi({status: 1, businessType: this.businessType }).then(res => {
				if (res.ok) {
					this.unAuditNumber = res.content || 0
				}
			})
			// 未签约
			getCustomerAuditCountApi({status: 2, signStatus: 0, businessType: this.businessType}).then(res => {
				if (res.ok) {
					this.unSignNumber = res.content || 0
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
::v-deep .el-tabs--border-card>.el-tabs__content{
  padding: 0;
}
</style>
