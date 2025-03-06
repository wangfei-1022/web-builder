<template>
    <el-dialog :title="$t('receiveFms.cleard_detail')" :visible.sync="visible" width="950px" :close-on-click-modal="false">
      <div class="title" style="padding-top: 15px;">{{$t('receiveFms.cleard_record')}}</div>
      <el-table size="mini" :data="clearList" style="width: 100%;" row-key="id" border>
        <el-table-column  prop="index" :label="$t('receiveFms.index_no')" min-width="60"></el-table-column>
        <el-table-column  prop="feeItemName" :label="$t('receiveFms.charge_name')" min-width="120"></el-table-column>
        <el-table-column  prop="currency" :label="$t('receiveFms.charge_amount_curreny')" min-width="120">
          <template slot-scope="{ row }">
            <span> <span style="margin-right: 5px;">{{row.entryAmount}}</span>{{row.currency}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="clearAmount" :label="$t('receiveFms.cleared_amount')" min-width="100" align='right'></el-table-column>
        <el-table-column  prop="clearedByName" :label="$t('receiveFms.cleared_by')" min-width="100"></el-table-column>
        <el-table-column  prop="clearDate" :label="$t('receiveFms.cleared_date')" min-width="150"></el-table-column>
        <el-table-column  prop="clearTransactionsInfos" :label="$t('receiveFms.clearTransactionsInfos')" min-width="100">
          <template slot-scope="{ row }">
            <span>{{(row.clearTransactionsInfos && row.clearTransactionsInfos.length || !!row.receiptPayDate) ? $t('receiveFms.YES') : $t('receiveFms.NO')}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="receiptPayDate" :label="arap === 'AR' ? $t('receiveFms.receipt_pay_date') : $t('payableFms.payable_pay_date')" min-width="120">
          <template slot-scope="{ row }">
            <div v-if="row.clearTransactionsInfos && row.clearTransactionsInfos.length">
              <span class="date-line" v-for="(item, index) in row.clearTransactionsInfos" :key="index">{{item.payDate | parseDate}}</span>
            </div>
            <div v-else>{{row.receiptPayDate | parseDate}}</div>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="visible = false">{{$t('common.close')}}</el-button>
      </span>
    </el-dialog>
</template>
<script>
import { clearPartApi } from '@/api/financial/fmsReceive'
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: "PartClear",
	props: {
		arap: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			visible: false,
			dataList: [],
			clearList: []
		}
	},
	methods: {
		show(itemDetail) {
      this.init(itemDetail)
			this.visible = true
		},
		init(detail) {
			if (!detail.id) {
				return
			}
			let hasClearedAmount = 0
			let clearInfoDTOs = detail.clearInfoDTOs || []

			if (clearInfoDTOs.length) {
				clearInfoDTOs.forEach(v => {
					if (v.clearAmounts[0] && v.clearAmounts[0].value) {
						hasClearedAmount += Number(v.clearAmounts[0].value)
					}
				})
			}
			this.dataList = [{
				feeItemName: detail.feeItemName,
				currency: detail.currency,
				entryAmount: formatNumberToThousands(detail.entryAmount),
				hasClearedAmount: formatNumberToThousands(hasClearedAmount),
				unClearedAmount: formatNumberToThousands(Number(detail.entryAmount) - Number(hasClearedAmount)),
				canClearedAmount: (Number(detail.entryAmount) - Number(hasClearedAmount)).toFixed(2),
				receiptPayDate: ''
			}]
			detail.clearInfoDTOs.forEach((v, index) => {
				v.feeItemName = detail.feeItemName
				v.index = index + 1
				v.clearAmount = v.clearAmounts[0] ? formatNumberToThousands(v.clearAmounts[0].value) : '0.00'
				v.currency = detail.currency
				v.entryAmount = formatNumberToThousands(detail.entryAmount)
				v.clearDate = parseTime(v.clearDate, '{y}-{m}-{d} {h}:{i}:{s}')
			})
			this.clearList = detail.clearInfoDTOs
		}
	}
}
</script>
<style lang="scss" scoped>
.title {
	padding-bottom: 15px;
}
.date-line{
  margin-right: 5px;
  display: block;
}
</style>

