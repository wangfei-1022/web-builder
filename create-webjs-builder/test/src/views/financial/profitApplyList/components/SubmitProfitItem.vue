<template>
  <div style="margin-bottom: 12px;">
    <div style="margin-bottom: 12px;padding-left: 34px;color: red;">
      {{item.settlementOfficeName}}，
      <span v-if="item.latestClosedMonth">最近关账月份{{item.latestClosedMonth.closingYear}}年{{item.latestClosedMonth.closingMonth}}月,</span>
      <span v-if="batchable">本次共确认{{item.count}}单盈亏</span>
      </div>
    <el-form ref="formDataFormRef" :model="formData" :rules="formDataRules" size="mini" label-width="100px">
      <el-form-item :label="$t('fmsProfit.profitPeriod')" prop="profitPeriod">
        <el-select v-model="formData.profitPeriod" size="mini" style="width: 100%;">
          <el-option v-for="item in item.unclosedMonths" :key="item.id" :label="item.closingYear+'年' + item.closingMonth + '月'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getProfitAuditSettlementOfficeIdApi, getProfitAuditProfitPeroidApi } from "@/api/financial/fmsProfitAudit";
import {  profitApplyAuditApi, profitApplyRejectApi } from "@/api/financial/fmsProfitAudit";
export default {
	name: "ProfitApplyAuditItem",
  props: {
    item: {
      type: Object,
      default: function() {
        return {
          unclosedMonths: []
        }
      }
    },
    batchable: {
      type: Boolean,
      default: false
    }
  },
	data() {
		return {
      formData: {
        profitPeriod: ''
      },
      formDataRules: {
        profitPeriod: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }]
      },
		};
	},
  created() {
    this.formData.profitPeriod = this.item.unclosedMonths && this.item.unclosedMonths.length ? this.item.unclosedMonths[0].id : ''
  },
	methods: {
    validate() {
      let VALID = true
      this.$refs.formDataFormRef.validate(valid => {
        VALID = valid
      })
      return VALID
    },
    getValue() {
      return {
        id: this.formData.profitPeriod
      }
    }
	}
};
</script>
<style lang="scss" scoped>

</style>

