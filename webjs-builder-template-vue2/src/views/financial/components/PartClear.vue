<template>
    <el-dialog :title="$t('receiveFms.part_clear')" :visible.sync="visible" width="850px" :close-on-click-modal="false">
      <div class="title">{{$t('receiveFms.receive_cleard')}}</div>
      <el-table size="mini" :data="dataList" style="width: 100%;" row-key="id" border>
        <el-table-column  prop="feeItemName" :label="$t('receiveFms.charge_name')" min-width="120"></el-table-column>
        <el-table-column  prop="currency" :label="$t('receiveFms.charge_amount_curreny')" min-width="120">
           <template slot-scope="{ row }">
            <span><span style="margin-right: 5px;">{{row.entryAmount}}</span>{{row.currency}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="hasClearedAmount" :label="$t('receiveFms.has_cleared_amount')" min-width="100" align='right'></el-table-column>
        <el-table-column  prop="unClearedAmount" :label="$t('receiveFms.un_cleared_amount')" min-width="100" align='right'></el-table-column>
        <el-table-column  prop="canClearedAmount" :label="$t('receiveFms.can_cleared_amount')" min-width="120">
          <template slot-scope="{ row }">
            <el-input v-model="row.canClearedAmount" size="mini" oninput="value=value.match(/^-?\d*(\.?\d{0,2})/g,'')[0]"/>
          </template>
        </el-table-column>
        <el-table-column  prop="canClearedAmount" :label="arap === 'AR' ? $t('receiveFms.receipt_pay_date') :  $t('payableFms.payable_pay_date')" min-width="150">
          <template slot-scope="{ row }">
            <common-picker v-model="row.receiptPayDate" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" />
          </template>
        </el-table-column>
      </el-table>
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
        <el-table-column  prop="receiptPayDate" :label="arap === 'AR' ? $t('receiveFms.receipt_pay_date') :  $t('payableFms.payable_pay_date')" min-width="150"></el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="visible = false">{{$t('common.cancel')}}</el-button>
        <el-button size="mini" type="primary" @click="submitFn">{{$t('common.confirm')}}</el-button>
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
			clearList: [],
      itemDetail: {}
		}
	},
	methods: {
		show(itemDetail) {
      this.itemDetail = itemDetail
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
				v.receiptPayDate = parseTime(v.receiptPayDate, '{y}-{m}-{d}')
			})
			this.clearList = detail.clearInfoDTOs
		},
		submitFn() {
			let item = this.dataList[0]
			if (!item.canClearedAmount || isNaN(item.canClearedAmount) || item.canClearedAmount === 0) {
				this.$message.error(this.$t('receiveFms.cleared_amount_text_error'))
				return
			}
			if (!item.receiptPayDate) {
				let tips = this.arap === 'AR' ? this.$t('receiveFms.receipt_pay_date') : this.$t('payableFms.payable_pay_date')
				this.$message.error(this.$t('receiveFms.please_text') + tips)
				return
			}
			if (item.unClearedAmount > 0 && item.canClearedAmount < 0 || item.unClearedAmount < 0 && item.canClearedAmount > 0) {
				this.$message.error(this.$t('receiveFms.cleared_amount_un_match_un_cleard'))
				return
			}
			if (Math.abs(item.unClearedAmount) < Math.abs(item.canClearedAmount)) {
				this.$message.error(this.$t('receiveFms.cleared_amount_can_not_than_un_cleard'))
				return
			}
			let data = {
				chargeId: this.itemDetail.id,
				clearAmount: item.canClearedAmount,
				receiptPayDate: item.receiptPayDate
			}
			clearPartApi(data).then(res => {
				if (res.ok) {
					this.visible = false
					this.$message.success(this.$t('receiveFms.part_cleared_success'))
					this.$emit('success')
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.title {
	padding-bottom: 15px;
}
</style>

