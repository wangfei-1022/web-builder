<template>
  <div>
    <div class="charge">
      <div class="title">
        <!-- 应收费用 -->
        <span style="margin-right:20px">{{ $t('air.feesReceivable') }}</span>
        <!-- 金额合计： -->
        <span>{{ $t('air.totalAmount') }}</span>
        <div style="display: inline;margin-right:25px" v-for="(item, index) in arTotal" :key="index">
          <span style="margin-right:3px">{{ item.currency }}</span>
          <span>{{ formatNumberToThousands(item.value) }}</span>
        </div>
      </div>
      <el-table size="mini" :data="arCharges" style="width: 100%; " row-key="id" border>
        <el-table-column prop="settlementCompanyName" :label="$t('receiveFms.settlement_company_name')" min-width="200">
        </el-table-column>
        <el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')" min-width="150"></el-table-column>
        <el-table-column prop="unitName1" :label="$t('receiveFms.unit_name')" min-width="100"></el-table-column>
        <el-table-column prop="currency" :label="$t('receiveFms.currency')" min-width="100"></el-table-column>
        <el-table-column prop="price" :label="$t('receiveFms.price')" min-width="100">
          <template slot-scope="scope">
            <div style='text-align: right'>{{ formatNumberToThousands(scope.row.price) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="chargeQuantity1" :label="$t('receiveFms.number')" min-width="100"></el-table-column>
        <el-table-column prop="invoiceTaxRateName" :label="$t('receiveFms.tax_rate')" min-width="100"></el-table-column>
        <el-table-column prop="taxAmount" :label="$t('receiveFms.tax_amount')" min-width="100">
          <template slot-scope="scope">
            <div style='text-align: right'>{{ formatNumberToThousands(scope.row.taxAmount) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="excludeTaxAmount" :label="$t('receiveFms.exclude_tax_amount')" min-width="100">
          <template slot-scope="scope">
            <div style='text-align: right'>{{ formatNumberToThousands(scope.row.excludeTaxAmount) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('receiveFms.charge_amount')" min-width="100">
          <template slot-scope="scope">
            <div style='text-align: right'>{{ formatNumberToThousands(scope.row.amount) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="entryStateName" :label="$t('receiveFms.bill_status')" min-width="100"></el-table-column>
        <el-table-column prop="invoiceStateName" :label="$t('receiveFms.invoice_status')" min-width="100">
        </el-table-column>
        <el-table-column prop="clearStateName" :label="$t('receiveFms.verification_status')" min-width="100">
        </el-table-column>
      </el-table>
    </div>

    <div class="charge" style="margin:30px 0;">
      <div class="title">
        <!-- 应付费用 -->
        <span style="margin-right:20px">{{ $t('air.feesPayable') }} </span>
        <!-- 金额合计： -->
        <span>{{ $t('air.totalAmount') }} </span>
        <div style="display: inline;margin-right:25px" v-for="(item, index) in apTotal" :key="index">
          <span style="margin-right:3px">{{ item.currency }}</span>
          <span>{{ formatNumberToThousands(item.value) }}</span>
        </div>
      </div>
      <el-table size="mini" :data="apCharges" style="width: 100%; " row-key="id" border>
        <el-table-column prop="settlementCompanyName" :label="$t('receiveFms.settlement_company_name')" min-width="200">
        </el-table-column>
        <el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')" min-width="150"></el-table-column>
        <el-table-column prop="unitName1" :label="$t('receiveFms.unit_name')" min-width="100"></el-table-column>
        <el-table-column prop="currency" :label="$t('receiveFms.currency')" min-width="100"></el-table-column>
        <el-table-column prop="price" :label="$t('receiveFms.price')" min-width="100">
          <template slot-scope="scope">
            <div style='text-align: right'>{{ formatNumberToThousands(scope.row.price) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="chargeQuantity1" :label="$t('receiveFms.number')" min-width="100"></el-table-column>
        <el-table-column prop="invoiceTaxRateName" :label="$t('receiveFms.tax_rate')" min-width="100"></el-table-column>
        <el-table-column prop="taxAmount" :label="$t('receiveFms.tax_amount')" min-width="100">
          <template slot-scope="scope">
            <div style='text-align: right'>{{ formatNumberToThousands(scope.row.taxAmount) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="excludeTaxAmount" :label="$t('receiveFms.exclude_tax_amount')" min-width="100">
          <template slot-scope="scope">
            <div style='text-align: right'>{{ formatNumberToThousands(scope.row.excludeTaxAmount) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('receiveFms.amount')" min-width="100">
          <template slot-scope="scope">
            <div style='text-align: right'>{{ formatNumberToThousands(scope.row.amount) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="entryStateName" :label="$t('receiveFms.bill_status')" min-width="100"></el-table-column>
        <el-table-column prop="invoiceStateName" :label="$t('receiveFms.ticket_status')" min-width="100">
        </el-table-column>
        <el-table-column prop="clearStateName" :label="$t('receiveFms.verification_status')" min-width="100">
        </el-table-column>
      </el-table>
    </div>

    <div class="title">
      <!-- 利润合计： -->
      <span>{{ $t('air.combinedProfits') }} </span>
      <div style="display: inline;margin-right:25px" v-for="(item, index) in sourceProfits" :key="index">
        <span style="margin-right:3px">{{ item.currency }}</span>
        <span>{{ formatNumberToThousands(item.value) }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { geOrderChargeDetailApi } from '@/api/fmsReceiveAir'
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
  name: 'Charge',
  components: {
  },
  props: {
    id: String || Number
  },
  data () {
    return {
      charges: [],
      arCharges: [],
      arTotal: [],
      apCharges: [],
      apTotal: [],
      sourceProfits: []
    }
  },
  mounted () {
    this.getAll()
  },
  methods: {
    getAll () {
      geOrderChargeDetailApi(this.id).then(res => {
        if (res.ok && res.content) {
          this.arCharges = res.content.arCharges
          this.arTotal = res.content.arSourceAmounts
          this.apCharges = res.content.apCharges
          this.apTotal = res.content.apSourceAmounts
          this.sourceProfits = res.content.sourceProfits
        }
      })
    },
    formatNumberToThousands (value) {
      return formatNumberToThousands(value)
    }
  }
}
</script>

<style scoped lang="less">
.title {
  margin: 15px 0;
}
</style>
