<template>
  <el-dialog :visible.sync="expenseEntryDialog" v-if="expenseEntryDialog" :title="$t('sea.expenseEntry')" width="1000px" :before-close="closeexpenseEntryDialog" v-loading="loading">
    <div>{{ $t('sea.pleaseCheckTheNeedTo') }}<span style="font-weight: 700;color: rgba(255,0,0,0.65); font-size: 16px">{{ dataForm.confirmationNo }}</span>{{ $t('sea.transferInTheSelectedConfirmation') }}</div>
    <el-form ref="dataForm" :model="dataForm" :inline="true" class="dataForm" style="margin-top: 10px;">
      <el-form-item :label="$t('sea.entryMethod')+':'" prop="entryMethod" size="mini"  :rules="[ { required: true,message:$t('sea.placeholder'),trigger: 'change'} ]">
        <el-radio-group v-model="dataForm.entryMethod">
          <el-radio :label="1">{{ $t('sea.newBill') }}</el-radio>
          <el-radio :label="2">{{ $t('sea.consolidatedStatement') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="!detailedType && initialData.memberName" :label="$t('sea.customerName')+':'" prop="blSignType" size="mini" class="shipping_method">
          {{initialData.memberName}}
      </el-form-item>
      <el-form-item v-else :label="detailedType ? $t('sea.payableSettlementUnit')+':' :$t('sea.aRSettlementUnit')+':'" prop="blSignType" size="mini" class="shipping_method">
        {{initialData.settlementCompanyName}}
      </el-form-item>

      <!--        账单周期-->
      <el-form-item v-if="dataForm.entryMethod === 1" :label="$t('sea.billingCycle')+':'" prop="periodCode" size="mini"  :rules="[ { required: true,message:$t('sea.placeholder'),trigger: 'change'} ]" class="shipping_method">
        <el-select v-model="dataForm.periodCode" size="mini" filterable clearable>
          <el-option v-for="item in billPeriodOps" :key="item.periodCode" :label="item.periodName" :value="item.periodCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else-if="dataForm.entryMethod === 2" :label="$t('sea.billNumber')+':'" prop="billNo" size="mini"  :rules="[ { required: true,message:$t('sea.placeholder'),trigger: 'change'} ]" class="shipping_method">
        <el-select v-model="dataForm.billNo" size="mini" filterable clearable>
          <el-option v-for="item in billNoOps" :key="item.id" :label="item.billNo" :value="item.billNo"></el-option>
        </el-select>
      </el-form-item>
      <!--    客户结算单位-->
      <el-form-item v-if="!detailedType && initialData.memberName" :label="detailedType ? $t('sea.payableSettlementUnit')+':' :$t('sea.aRSettlementUnit')+':'" prop="blSignType" size="mini" class="shipping_method">
        {{initialData.settlementCompanyName}}
      </el-form-item>
      <el-form-item :label="$t('sea.settlementMethod')+':'" prop="blSignType" size="mini" class="shipping_method">
        {{initialData.settlementModeName}}
      </el-form-item>
    </el-form>

    <div class="total-payable" style="display: flex; padding-left: 24px">
      <template v-if="detailedType">
<!--        应付-->
        {{ $t('sea.totalPayable') }}:
      </template>
      <template v-else>
        {{ $t('sea.totalReceivable') }}:
      </template>

      <div v-for="(val,index) in initialData.totalPayable" :key="index" style="margin-right: 20px">
        <span>{{val.currency}}</span>
        <span>{{formatNumberToThousands(val.value)}}</span>
      </div>
    </div>
    <div class="footer-btn">
      <el-button type="primary" size="small" @click="submit">{{ $t('sea.submit') }}</el-button>
      <el-button size="small" @click="closeexpenseEntryDialog">{{ $t('common.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import URL from '@/api/urlTranslator'
import ExpensesCostList from "./order/expensesCostList"
import ExpensesCostDetails from "./order/expensesCostDetails"
import {
  detailAllEntryApi, detailAllEntryChargeApi, detailListEntryApi, detailListEntryChargeApi,
  paySpecialRemoveApi, periodSettlementModeApi, supplierHistoryApi, supplierHistoryChargeApi
} from "@/api/seaExportOrder"
import {formatNumberToThousands} from "@/utils";
export default {
  name: 'ExpenseEntry',
  components: {ExpensesCostList, ExpensesCostDetails},
  props: {
    expenseEntryDialog: { type: Boolean, default: null },
    initialData: { type: Object, default: () => {}},
    multipleForm: { type: Object, default: () => {}},
    entryType: { type: Boolean, default: true }, // 默认全部入账
    detailedType: { type: Boolean, default: null } // 明细类型 true 应付 false应收
  },
  data() {
    return {
      loading: false,
      dataForm: {
        entryMethod: 1
      },
      billPeriodOps: [],
      billNo: []
    }
  },
  computed: {
    url() {
      return URL
    }
  },
  created() {
    periodSettlementModeApi(Number(this.initialData.settlementMode) === 1 ? 3 : this.initialData.settlementMode).then(res => {
      this.billPeriodOps = res.content
    })
    if (this.detailedType) {
      supplierHistoryApi(this.initialData).then(res => {
        this.billNoOps = res.content
      })
    } else {
      supplierHistoryChargeApi(this.initialData).then(res => {
        this.billNoOps = res.content
      })
    }

  },
  methods: {
    formatNumberToThousands(value) {
      return formatNumberToThousands(value)
    },
    async submit() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.loading = true
          let data
          let url
          if (this.entryType) { // 全部入账
            if (this.detailedType) {
              url = detailAllEntryApi
            } else {
              url = detailAllEntryChargeApi
            }

            data = {
              ...this.dataForm,
              ...this.multipleForm

            }
          } else { // 选择入账
            if (this.detailedType) {
              url = detailListEntryApi
            } else {
              url = detailListEntryChargeApi
            }
            data = {
              ...this.dataForm,
              ...this.initialData
            }
          }
          const res = await url(data)
          this.loading = false
          if (res.ok) {
            this.$message.success(this.$t('sea.submittedSuccessfully'))
            this.$emit('submit')
            this.closeexpenseEntryDialog()
          }
        }
      })

    },
    closeexpenseEntryDialog() {
      this.$emit('update:expenseEntryDialog', false)
      this.$refs.dataForm.resetFields()
      this.dataForm = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-bet{ display: flex; align-items:flex-start ; justify-content: space-between;flex-wrap:wrap;}
.box_title{ border-left: solid 3px rgb(24,144,255);font-size: 18px; color: #199ED8; padding-left: 8px; height: 28px; line-height: 28px; margin:5px 0 8px 0; display: flex;
  .operate-buttons-left{ margin-left: 20px}
}
.box{ background-color: #f5f7f7; padding: 8px;
  ::v-deep .el-form-item--medium{
    .el-form-item__content{ line-height: 28px}
    .el-form-item__label{ line-height: 28px}
  }
}
.box_child{border: solid 1px rgba(121, 121, 121, 1); padding: 20px 30px; background: #fff; margin-bottom: 15px;
  .box25{ width: 20%}
}
//::v-deep .el-form--inline .el-form-item{ display: block}
.cost_head{ display: flex;justify-content: space-between; border-bottom: #ccc solid 1px; padding-bottom: 8px}
.cost_mid{ display: flex; justify-content: space-between; flex-wrap: wrap;
  ::v-deep .el-form-item{ width: 30%}
}
.addExpenseConfirmation{ width: 100%; margin: 12px auto}
.footer-btn{
  margin-top: 30px;
  text-align: right;
}
::v-deep .el-table__body td{ padding: 10px 0 !important;}
::v-deep .el-form-item__label{ width: 95px; text-align: right}
.dataForm{
  ::v-deep .el-form-item{ width: 49%; margin-right: 0;}
}
</style>
