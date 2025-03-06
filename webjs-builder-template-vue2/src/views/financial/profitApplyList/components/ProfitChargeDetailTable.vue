<template>
  <div>
    <el-table class="yht-table" size="mini" :data="chargeList" style="width: 100%;" row-key="id" border>
      <el-table-column prop="settlementCompanyName" :label="$t('fmsProfit.settlementCompanyName')" min-width="150" show-overflow-tooltip/>
      <el-table-column prop="settlementOfficeName" :label="$t('fmsProfit.settlementOfficeName')" min-width="150" show-overflow-tooltip/>
      <el-table-column prop="feeName" :label="$t('fmsProfit.feeName')" min-width="100" show-overflow-tooltip/>
      <el-table-column prop="unitName" :label="$t('fmsProfit.unitName')" min-width="80" >
        <template slot-scope="{ row }">
          <span>{{row.unitName1}}</span>
        </template> 
      </el-table-column>
      <el-table-column prop="currency" :label="$t('fmsProfit.currency')" min-width="80" />
      <el-table-column prop="price" :label="$t('fmsProfit.price')" min-width="80" >
        <template slot-scope="{ row }">
          <span>{{row.price | numberToThousands}}</span>
        </template> 
      </el-table-column>
      <el-table-column prop="chargeQuantity1" :label="$t('fmsProfit.chargeQuantity1')" min-width="80" />
      <el-table-column prop="invoiceTaxRateName" :label="$t('fmsProfit.taxRate')" min-width="80" />
      <el-table-column prop="taxAmount" :label="$t('fmsProfit.taxAmount')" min-width="80" >
        <template slot-scope="{ row }">
          <span>{{row.taxAmount | numberToThousands}}</span>
        </template> 
      </el-table-column>
      <el-table-column prop="excludeTaxAmount" :label="$t('fmsProfit.excludeTaxAmount')" min-width="100" >
        <template slot-scope="{ row }">
          <span>{{row.excludeTaxAmount | numberToThousands}}</span>
        </template> 
      </el-table-column>
      <el-table-column prop="amount" :label="$t('fmsProfit.amount')" min-width="100" >
        <template slot-scope="{ row }">
          <span>{{row.amount | numberToThousands}}</span>
        </template> 
      </el-table-column>
      <el-table-column prop="confirmationNo" :label="$t('fmsProfit.confirmationNo')" min-width="150" show-overflow-tooltip />
      <el-table-column prop="chargeConfirmTime" :label="$t('fmsProfit.chargeConfirmTime')" min-width="150" >
        <template slot-scope="{ row }">
          <span>{{row.chargeConfirmTime | parseTime}}</span>
        </template> 
      </el-table-column>
      <el-table-column prop="profitStateName" :label="$t('fmsProfit.profitStateName')" min-width="100" />
    </el-table>
  </div>

</template>
<script>
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: "ProfitChargeDetailTable",
	props: {
		chargeList: {
			type: Array,
			default: function() {
        []
      }
		}
	},
	data() {
		return {
			
		}
	},
	created() {
	
	},
	methods: {
	
	}
}
</script>
<style lang="scss" scoped>

</style>

