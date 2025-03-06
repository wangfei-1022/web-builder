<template>
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="dataList" @submit.native.prevent ref="customerInformationForm">
      <div class="box_title" style="color: #00CC00">
        <span >{{$t('sea.totalExpensesReceivable')}}：</span>
        <span v-for="val in dataList.arAmounts" :key="val.currency" style="margin-right: 20px">
          {{val.currency}} {{formatNumberToThousands(val.value)}}
        </span>
      </div>
      <el-table class="case-data-table" :data="dataList.chargeList">
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <el-table-column prop="settlementCompanyName" :label="$t('sea.settlementUnit')" show-overflow-tooltip align="center" width="200" />
        <el-table-column prop="entityTypeName" :label="$t('sea.expenseEntity')" align="center" width="150" />
        <el-table-column prop="entityNo" :label="$t('sea.entityNumber')" align="center" width="150" />

        <el-table-column prop="feeItemName" :label="$t('sea.feeName')" align="center" width="150" />
        <el-table-column prop="unitName1" :label="$t('sea.billingMethod')" align="center" width="150" />
        <el-table-column prop="currency" :label="$t('sea.currency')" align="center" width="150" />
        <el-table-column prop="price" :label="$t('sea.unitPrice')" align="center" width="150" >
          <template slot-scope="{row}">
            {{formatNumberToThousands(row.price)}}
          </template>
        </el-table-column>
        <el-table-column prop="chargeQuantity1" :label="$t('sea.quantity')" align="center" width="150" />
        <el-table-column prop="invoiceTaxRateName" :label="$t('sea.taxRate')" align="center" width="150" />
        <el-table-column prop="taxAmount" :label="$t('sea.taxAmount')" align="center" width="150">
          <template slot-scope="{row}">
            {{formatNumberToThousands(row.taxAmount)}}
          </template>
        </el-table-column>
        <el-table-column prop="excludeTaxAmount" :label="$t('sea.amountExcludingTax')" align="center" width="150">
          <template slot-scope="{row}">
            {{formatNumberToThousands(row.excludeTaxAmount)}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('sea.expenseAmount')" align="center" width="150">
          <template slot-scope="{row}">
            {{formatNumberToThousands(row.amount)}}
          </template>
        </el-table-column>
        <el-table-column prop="confirmationNo" :label="$t('sea.confirmationNo')" align="center" width="150" />
        <el-table-column prop="remark" :label="$t('sea.remark')" align="center" width="200" />

        <el-table-column prop="entryStateName" :label="$t('sea.confirmationState')" fixed="right" align="center" width="150" />
        <el-table-column prop="invoiceStateName" :label="$t('sea.invoiceState')" fixed="right" align="center" width="150" />
        <el-table-column prop="clearStateName" :label="$t('sea.writeOffStatus')" fixed="right" align="center" width="150" />

      </el-table>

      <div class="box_title" style="color: #FF0000; margin-top: 30px">
        <span >{{$t('sea.totalExpensesPayable')}}：</span>
        <span v-for="val in dataList.apAmounts" :key="val.currency" style="margin-right: 20px">
          {{val.currency}} {{formatNumberToThousands(val.value)}}
        </span>
      </div>
      <el-table class="case-data-table" :data="dataList.payList">
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <el-table-column prop="settlementCompanyName" :label="$t('sea.settlementUnit')" show-overflow-tooltip align="center" width="200" />
        <el-table-column prop="entityTypeName" :label="$t('sea.expenseEntity')" align="center" width="150" />
        <el-table-column prop="entityNo" :label="$t('sea.entityNumber')" align="center" width="150" />

        <el-table-column prop="feeItemName" :label="$t('sea.feeName')" align="center" width="150" />
        <el-table-column prop="unitName1" :label="$t('sea.billingMethod')" align="center" width="150" />
        <el-table-column prop="currency" :label="$t('sea.currency')" align="center" width="150" />
        <el-table-column prop="price" :label="$t('sea.unitPrice')" align="center" width="150" >
          <template slot-scope="{row}">
            {{formatNumberToThousands(row.price)}}
          </template>
        </el-table-column>
        <el-table-column prop="chargeQuantity1" :label="$t('sea.quantity')" align="center" width="150" />
        <el-table-column prop="invoiceTaxRateName" :label="$t('sea.taxRate')" align="center" width="150" />
        <el-table-column prop="taxAmount" :label="$t('sea.taxAmount')" align="center" width="150">
          <template slot-scope="{row}">
            {{formatNumberToThousands(row.taxAmount)}}
          </template>
        </el-table-column>
        <el-table-column prop="excludeTaxAmount" :label="$t('sea.amountExcludingTax')" align="center" width="150">
          <template slot-scope="{row}">
            {{formatNumberToThousands(row.excludeTaxAmount)}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('sea.expenseAmount')" align="center" width="150">
          <template slot-scope="{row}">
            {{formatNumberToThousands(row.amount)}}
          </template>
        </el-table-column>
        <el-table-column prop="confirmationNo" :label="$t('sea.confirmationNo')" align="center" width="150" />
        <el-table-column prop="remark" :label="$t('sea.remark')" align="center" width="200" />

        <el-table-column prop="entryStateName" :label="$t('sea.confirmationState')" fixed="right" align="center" width="150" />
        <el-table-column prop="invoiceStateName" :label="$t('sea.invoiceState')" fixed="right" align="center" width="150" />
        <el-table-column prop="clearStateName" :label="$t('sea.writeOffStatus')" fixed="right" align="center" width="150" />
      </el-table>
      <div class="box_title" style="color: #1890FF; margin-top: 30px">
        <span >{{$t('sea.singleBillGrossProfit')}}：</span>
        <span v-for="val in dataList.sourceProfits" :key="val.currency" style="margin-right: 20px">
          {{val.currency}} {{formatNumberToThousands(val.value)}}
        </span>
      </div>
    </el-form>
  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import {
  confirmationChargeOrderDetailApi,
} from "@/api/seaExportOrder"
import {formatNumberToThousands} from "@/utils"
export default {
  name: 'ChargeList',
  props: {
    confirmationSheetId: { type: Number, default: null}
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      dataList: {
        list: []
      }
    }
  },
  computed: {
    url() {
      return URL
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await confirmationChargeOrderDetailApi(this.id)
      this.loading = false
      if (res.ok) {
        this.dataList = res.content
      }
    },
    formatNumberToThousands(value) {
      return formatNumberToThousands(value)
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
::v-deep .el-form--inline .el-form-item{ display: block}
.cost_head{ display: flex;justify-content: space-between; border-bottom: #ccc solid 1px; padding-bottom: 8px}
.cost_mid{ display: flex; justify-content: space-between; flex-wrap: wrap;
  ::v-deep .el-form-item{ width: 30%}
}
.addExpenseConfirmation{ width: 100%; margin: 12px auto}
//**
</style>
