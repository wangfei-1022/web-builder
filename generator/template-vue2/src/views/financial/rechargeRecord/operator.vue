<template>
  <el-tabs type="border-card" class="top-tabs">
    <el-tab-pane :label="$t('rechargeRecord.UN_RELATIVE') + '(' + unRelateNumber + ')'">
      <apply-list :origin="origin" :businessType="businessType" role="OPERATOR" :rechargeState="10"></apply-list>
    </el-tab-pane>
    <el-tab-pane :label="$t('rechargeRecord.UN_AUDITED') + '(' + unAuditNumber + ')'" lazy>
      <apply-list :origin="origin" :businessType="businessType" role="OPERATOR" :rechargeState="20"></apply-list>
    </el-tab-pane>
    <el-tab-pane :label="$t('rechargeRecord.FIN_REJECT') + '(' + financeRejectNumber + ')'" lazy>
      <apply-list :origin="origin" :businessType="businessType" role="OPERATOR" :rechargeState="30"></apply-list>
    </el-tab-pane>
    <el-tab-pane :label="$t('rechargeRecord.ALL')" lazy>
      <apply-list :origin="origin" :businessType="businessType" role="OPERATOR" :rechargeState="null"></apply-list>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ApplyList from './components/ApplyList'
import { getOperatorCountApi } from "@/api/financial/rechargeRecord"

export default {
	name: "FmsRechargeRecordOperator",
	components: {
    ApplyList
	},
  props: {
    businessType: {
      type: String,
      default: ''
    },
    origin: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
			loading: false,
			unRelateNumber: 0,
			unAuditNumber: 0,
      financeRejectNumber: 0
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
      let data = {
        accountCode: this.businessType
      }
			getOperatorCountApi(data).then(res => {
				if (res.ok) {
          res.content.forEach(v => {
            if (v.rechargeState === 10) {
              this.unRelateNumber = v.totalCount
            } else if (v.rechargeState === 20) {
              this.unAuditNumber = v.totalCount
            } else if (v.rechargeState === 30) {
              this.financeRejectNumber = v.totalCount
            }
          })
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>
