<template>
  <el-dialog :title='$t("receiveFms.removeBill")' :visible.sync="removeBillVisible" width="500px">
    <div class='remove-bill-title'><i class="m-icon el-icon-warning-outline" />
      {{$t('receiveFms.removeBillInfo')}}
    </div>
    <el-table size="mini" :data="removeBillInfoList" style="width: 100%;" row-key="id" border max-height="400">
      <el-table-column prop="billNo" :label="$t('receiveFms.bill_no')" min-width="150"></el-table-column>
      <el-table-column prop="number" :label="$t('receiveFms.chargeNumber')" min-width="80">
        <template slot-scope="{ row }">
          <span>{{row.number}}{{$t('receiveFms.NUMBER')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="currencyInfo" :label="$t('receiveFms.removeCurrencyInfo')" min-width="200">
        <template slot-scope="{ row }">
          <div style="text-align: right;">
            <span v-for="(value, key) in row.currencyInfo" :key="key">
              <span style="margin-right:5px">{{key}}</span>
              {{(value /100) | numberToThousands}}
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="removeBillVisible = false" size="mini">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" :loading="removeBillLoading" @click="removeBillSubmitFn" size="mini">{{$t('common.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { receiveChargeRemoveFromBillApi } from "@/api/financial/fmsReceive"

export default {
	name: "RemoveChargeFromBill",
	props: {
		arap: {
			type: String,
			default: ''
		}
	},

	data() {
		return {
      // 移出账单
      removeBillVisible: false,
      removeBillLoading: false,
      removeBillInfoList: [],
      chargeIds: []
		}
	},
	created() {

	},
	methods: {
    show(selectedList) {
      let map = {}
      let chargeIds = []
      selectedList.forEach(v => {
        if (map[v.billNo]) {
          map[v.billNo].number += 1
          if (map[v.billNo].currencyInfo[v.currency]) {
            map[v.billNo].currencyInfo[v.currency] += Number(v.entryAmount) * 100
          } else {
            map[v.billNo].currencyInfo[v.currency] = Number(v.entryAmount) * 100
          }
        } else {
          map[v.billNo] = {
            number: 1,
            currencyInfo: {
              [v.currency]: Number(v.entryAmount) * 100
            }
          }
        }

        chargeIds.push(v.id)
      })

      let arr = []
      Object.keys(map).forEach(item => {
        arr.push({
          billNo: item,
          number: map[item].number,
          currencyInfo: map[item].currencyInfo
        })
      })

      this.chargeIds = chargeIds
      this.removeBillInfoList = arr
      this.removeBillVisible = true
    },
    removeBillSubmitFn() {
      this.removeBillLoading = true
      receiveChargeRemoveFromBillApi(this.chargeIds).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('receiveFms.removeBillSuccess'));
          this.removeBillVisible = false
          this.getList()
        }
        this.removeBillLoading = false
      }).catch(() => {
        this.removeBillLoading = false
      })
    }
	}
}
</script>
<style lang="scss" scoped>

</style>
