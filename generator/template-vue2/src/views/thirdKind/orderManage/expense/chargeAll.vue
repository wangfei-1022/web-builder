<template>
  <div class="loading-wrap" v-loading="loading">
    <div style="height: calc(100vh - 326px); overflow: hidden; overflow-y: auto;">
      <div class="charge">
        <div class="title">
          <!-- 应收费用 -->
          <span style="margin-right:20px">{{ $t('thirdKindOrder.feedTab.receivableDetail') }}</span>
          <!-- 金额合计： -->
          <span>{{ $t('thirdKindOrder.feedTab.totalAmount') }}</span>
          <div style="display: inline;margin-right:25px" v-for="(item, index) in arTotal" :key="index">
            <span style="margin-right:3px">{{ item.currency }}</span>
            <span>{{ formatNumberToThousands(item.value) }}</span>
          </div>
        </div>
        <el-table size="mini" :data="arCharges" style="width: 100%; " row-key="id" border>
          <el-table-column prop="settlementCompanyName" :label="$t('thirdKindOrder.settlementCompanyName')" min-width="200">
          </el-table-column>
          <el-table-column prop="feeItemName" :label="$t('thirdKindOrder.chargeName')" min-width="150"></el-table-column>
          <el-table-column prop="unitName1" :label="$t('thirdKindOrder.chargeUnit')" min-width="100"></el-table-column>
          <el-table-column prop="currency" :label="$t('thirdKindOrder.currency')" min-width="100"></el-table-column>
          <el-table-column prop="price" :label="$t('thirdKindOrder.price')" min-width="100">
            <template slot-scope="scope">
              <div style='text-align: right'>{{ formatNumberToThousands(scope.row.price) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="chargeQuantity1" :label="$t('thirdKindOrder.quantity')" min-width="100"></el-table-column>
          <el-table-column prop="invoiceTaxRateName" :label="$t('thirdKindOrder.taxRate')" min-width="100"></el-table-column>
          <el-table-column prop="taxAmount" :label="$t('thirdKindOrder.taxFee')" min-width="100">
            <template slot-scope="scope">
              <div style='text-align: right'>{{ formatNumberToThousands(scope.row.taxAmount) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="excludeTaxAmount" :label="$t('thirdKindOrder.amountExcludingTax')" min-width="100">
            <template slot-scope="scope">
              <div style='text-align: right'>{{ formatNumberToThousands(scope.row.excludeTaxAmount) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="amount" :label="$t('thirdKindOrder.expenseAmount')" min-width="100">
            <template slot-scope="scope">
              <div style='text-align: right'>{{ formatNumberToThousands(scope.row.amount) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="entryStateName" :label="$t('thirdKindOrder.billStatus')" min-width="100"></el-table-column>
          <el-table-column prop="invoiceStateName" :label="$t('thirdKindOrder.invoiceStatus')" min-width="100">
          </el-table-column>
          <el-table-column prop="clearStateName" :label="$t('thirdKindOrder.verificationStatus')" min-width="100">
          </el-table-column>
        </el-table>
      </div>

      <div class="charge" style="margin:30px 0;">
        <div class="title">
          <!-- 应付费用 -->
          <span style="margin-right:20px">{{ $t('thirdKindOrder.feedTab.payablebleDetail') }} </span>
          <!-- 金额合计： -->
          <span>{{ $t('thirdKindOrder.feedTab.totalAmount') }} </span>
          <div style="display: inline;margin-right:25px" v-for="(item, index) in apTotal" :key="index">
            <span style="margin-right:3px">{{ item.currency }}</span>
            <span>{{ formatNumberToThousands(item.value) }}</span>
          </div>
        </div>
        <el-table size="mini" :data="apCharges" style="width: 100%; " row-key="id" border>
          <el-table-column prop="settlementCompanyName" :label="$t('thirdKindOrder.settlementCompanyName')" min-width="200">
          </el-table-column>
          <el-table-column prop="feeItemName" :label="$t('thirdKindOrder.chargeName')" min-width="150"></el-table-column>
          <el-table-column prop="unitName1" :label="$t('thirdKindOrder.chargeUnit')" min-width="100"></el-table-column>
          <el-table-column prop="currency" :label="$t('thirdKindOrder.currency')" min-width="100"></el-table-column>
          <el-table-column prop="price" :label="$t('thirdKindOrder.price')" min-width="100">
            <template slot-scope="scope">
              <div style='text-align: right'>{{ formatNumberToThousands(scope.row.price) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="chargeQuantity1" :label="$t('thirdKindOrder.quantity')" min-width="100"></el-table-column>
          <el-table-column prop="invoiceTaxRateName" :label="$t('thirdKindOrder.taxRate')" min-width="100"></el-table-column>
          <el-table-column prop="taxAmount" :label="$t('thirdKindOrder.taxFee')" min-width="100">
            <template slot-scope="scope">
              <div style='text-align: right'>{{ formatNumberToThousands(scope.row.taxAmount) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="excludeTaxAmount" :label="$t('thirdKindOrder.amountExcludingTax')" min-width="100">
            <template slot-scope="scope">
              <div style='text-align: right'>{{ formatNumberToThousands(scope.row.excludeTaxAmount) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="amount" :label="$t('thirdKindOrder.expenseAmount')" min-width="100">
            <template slot-scope="scope">
              <div style='text-align: right'>{{ formatNumberToThousands(scope.row.amount) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="entryStateName" :label="$t('thirdKindOrder.billStatus')" min-width="100"></el-table-column>
          <el-table-column prop="invoiceStateName" :label="$t('thirdKindOrder.ticketStatus')" min-width="100">
          </el-table-column>
          <el-table-column prop="clearStateName" :label="$t('thirdKindOrder.verificationStatus')" min-width="100">
          </el-table-column>
        </el-table>
      </div>

      <div class="title">
        <!-- 利润合计： -->
        <span>{{ $t('thirdKindOrder.feedTab.profitAmount') }} </span>
        <div style="display: inline;margin-right:25px" v-for="(item, index) in sourceProfits" :key="index">
          <span style="margin-right:3px">{{ item.currency }}</span>
          <span>{{ formatNumberToThousands(item.value) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getThiChargeListApi } from '@/api/thirdKind'
import { formatNumberToThousands } from '@/utils/index'

export default {
	name: 'Charge',
	components: {},
	props: {
		id: String || Number
	},
	data() {
		return {
			loading: false,
			charges: [],
			arCharges: [],
			arTotal: [],
			apCharges: [],
			apTotal: [],
			sourceProfits: []
		}
	},
	mounted() {
		this.getAll()
	},
	methods: {
		async getAll() {
			this.loading = true
			const res = await getThiChargeListApi({ orderId: this.id })
			if (res.ok && res.content) {
				this.arCharges = res.content.arCharges
				this.arTotal = res.content.arSourceAmounts
				this.apCharges = res.content.apCharges
				this.apTotal = res.content.apSourceAmounts
				this.sourceProfits = res.content.sourceProfits
			}
			this.loading = false
		},
		formatNumberToThousands(value) {
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
