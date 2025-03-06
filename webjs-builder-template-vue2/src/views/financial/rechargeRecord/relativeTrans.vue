<template>
	<div class="page-edit-container full-page">
		<div class="custmer-detail page-edit-content">
      <base-info :recordItem="recordItem"></base-info>
      <div class="">
        <relative-transaction
            @selectFn="selectReceiptFn"
            @transactionTypeChange="transactionTypeChangeFn"
            :detail="{
              settlementOfficeId: transData.settlementOfficeId,
              settlementOfficeName: transData.settlementOfficeName,
              settlementCompanyId: transData.settlementCompanyId,
              settlementCompanyName: transData.settlementCompanyName,
              businessTypes: transData.businessTypes
            }"
            :targetCurrency="transData.instructionCurrency"
            :sourceClearAmounts="applyCurrencyInfo"
            :showSelectType="false"
          />
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px" label-position="right">
          <el-form-item :label="$t('rechargeRecord.associatedRemarks')" prop="associateRemark">
            <el-input v-model="form.associateRemark" type="textarea"  />
          </el-form-item>
        </el-form>
      </div>

		</div>
		<div class="page-edit-footer">
      <el-button size="mini" @click="backList" >{{$t('common.cancel')}}</el-button>
      <el-button type="primary" size="mini" @click="relativeTransactionBtn">{{$t('common.confirm')}}</el-button>
		</div>
	</div>

</template>

<script>
// 关联收款
import BaseInfo from './components/BaseInfo'
import mixin from './components/detailMixin'
import { rechargeClaimConfirmApi } from "@/api/financial/rechargeRecord";

export default {
	name: "RechargeRecordRelativeTrans",
	components: {
		BaseInfo
	},
  mixins: [mixin],
	data() {
		return {
			loading: false,
      form: {
        associateRemark: ''
      },
      formRules: {}
		}
	},
	methods: {
    // 选择收款
    selectReceiptFn(val, receiptAmounts, type) {
      if (val.length > 0) {
        this.claimList = val;
      } else {
        this.claimList = [];
      }
    },
    // 关联收款、 无收款
    transactionTypeChangeFn(val) {
      this.totalData.instructionTransactionType = val;
      if (val !== 1) {
        this.totalData.instructionCurrency = "";
      }
    },
    relativeTransactionBtn() {
      let claims = []
      let VALID = true
      this.claimList.forEach(v => {
        claims.push({
          claimId: v.id,
          useAmount: v.useAmount
        })
        if (!v.useAmount) {
          VALID = false
        }
      })
      if (!VALID) {
        // 请先填写使用金额
        this.$message.error(this.$t('rechargeRecord.pleaseEnterAmount'))
        return
      }
      let data = {
        id: this.id,
        associateRemark: this.form.associateRemark,
        claims: claims
      }
      rechargeClaimConfirmApi(data).then(res => {
        if (res.ok) {
          // 关联收款成功
          this.$message.success(this.$t('rechargeRecord.transSuccess'))
          this.backList();
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
