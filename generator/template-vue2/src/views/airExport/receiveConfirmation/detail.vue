<template>
  <div class="page-edit-container" v-loading="loading">
    <div class="page-edit-content">
      <div class="">
        <div>
          <el-table size="mini" :data="tableData" style="width: 100%;" row-key="id" border>
            <el-table-column prop="entityNo" :label="$t('receiveFms.entity_no')" width="120"></el-table-column>
            <el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')" width="100"></el-table-column>
            <el-table-column prop="businessTypeName" :label="$t('receiveFms.business_type')"
              width="100"></el-table-column>
            <el-table-column prop="settlementCompanyName" :label="$t('receiveFms.settlement_company_name')"
              width="200"></el-table-column>
            <el-table-column prop="settlementOfficeName" :label="$t('receiveFms.settlement_office_name')"
              width="200"></el-table-column>
            <el-table-column prop="responsiblePersonName" :label="$t('receiveFms.sales_names')"
              width="100"></el-table-column>
            <el-table-column prop="currency" :label="$t('receiveFms.currency')" width="80"></el-table-column>
            <el-table-column prop="price" :label="$t('receiveFms.price')" width="100">
              <template slot-scope="scope">
                <div style='text-align: right'>{{ scope.row.price }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="chargeQuantity1" :label="$t('receiveFms.number')" width="80"></el-table-column>
            <el-table-column prop="invoiceTaxRateName" :label="$t('receiveFms.tax_rate')" width="80"></el-table-column>
            <el-table-column prop="taxAmount" :label="$t('receiveFms.tax_amount')" width="80">
              <template slot-scope="scope">
                <div style='text-align: right'>{{ scope.row.taxAmount }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="excludeTaxAmount" :label="$t('receiveFms.exclude_tax_amount')" width="120">
              <template slot-scope="scope">
                <div style='text-align: right'>{{ scope.row.excludeTaxAmount }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="entryStateName" :label="$t('receiveFms.bill_status')" width="120"></el-table-column>
          </el-table>
        </div>
        <div class="total">
          <span>{{ $t('receiveFms.receive_sum') }}：</span>
          <span>
            <span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
              <span class='value'>{{ item.currency }}</span>
              <span>{{ item.value }}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
    <div class="page-edit-footer">
      <el-button size="mini" @click="backList()">{{ $t('common.close') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getReceiveConfirmationDetailByIdApi } from "@/api/fmsReceiveAir"
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
  name: "FmsReceiveConfirmationDetail",
  data () {
    return {
      id: '',
      loading: false,
      bill: {},
      tableData: [],
      amountTotal: []
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getDetail()
  },
  methods: {
    getDetail () {
      this.loading = true
      getReceiveConfirmationDetailByIdApi(this.id).then(res => {
        if (res.ok) {
          this.loading = false
          let confirmationCharges = res.content.confirmationCharges || []
          let index = confirmationCharges.findIndex(item => item.id === this.id)
          if (index >= 0) {
            let target = confirmationCharges[index]
            let tableData = target.charges
            tableData.forEach(v => {
              v.entityNo = res.content.entityNo
              v.responsiblePersonName = res.content.responsiblePersonName
              v.businessTypeName = res.content.businessTypeName
              v.settlementCompanyName = target.settlementCompanyName
              v.settlementOfficeName = target.settlementCompanyName

              v.taxRate = v.taxRate + '%'
              v.price = formatNumberToThousands(v.price)
              v.taxAmount = formatNumberToThousands(v.taxAmount)
              v.excludeTaxAmount = formatNumberToThousands(v.excludeTaxAmount)
            })
            this.tableData = tableData
            let sourceAmounts = target.sourceAmounts || []
            sourceAmounts.forEach(v => {
              v.value = formatNumberToThousands(v.value)
            })
            this.amountTotal = sourceAmounts
          }
        }
      })
    },
    backList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'FmsReceiveConfirmation' })
    }
  }
}
</script>
<style lang="scss" scoped>
.page-edit-container {
  background: #fff;
}

.total {
  background: rgba(16, 142, 233, 0.1);
  color: #108ee9;
  font-family: "PingFangSC-Regular", "PingFang SC";
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  padding: 0px 10px;

  .value-item {
    display: inline-block;
    margin-right: 50px;

    .value {
      display: inline-block;
      margin-right: 5px;
    }
  }
}

.module {
  overflow: hidden;
  padding: 20px 0;
  background: #fff;
  margin-bottom: 20px;
  border-radius: 5px;

  .title {
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid #f0f2f5;
    margin-bottom: 15px;
    padding: 0 20px 15px 20px;
  }

  .content {
    padding: 0 25px;
    overflow: hidden;
  }

  .img {
    display: block !important;
    border: 1px dashed #ccc;
    border-radius: 6px;
    width: 300px;
    height: 180px;
    line-height: 180px;
    text-align: center;
    cursor: pointer;
    padding: 0;
    float: left;

    img {
      width: 100%;
      height: 100%;
      -o-object-fit: conver;
      object-fit: conver;
    }
  }

  .item {
    width: 50%;
    float: left;
    margin-bottom: 15px;
    display: flex;

    label {
      width: 130px;
      display: block;
      text-align: right;
      margin-bottom: 15px;
      font-weight: 500;
      font-size: 14px;
      float: left;
      margin-right: 6px;
    }

    span {
      font-weight: 500;
      font-size: 14px;
      display: inline;
      flex: 1;
    }
  }
}
</style>

