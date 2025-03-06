<template>
  <div class="info-module">
    <div class="title">
      {{$t("rechargeRecord.transInfo")}}
    </div>
    <div class="content">
      <div style="margin-bottom: 25px;">
        <el-table :data="claimList" style="width: 100%" border>
          <el-table-column prop="transactionsNo" :label="$t('fmsReceiveClear.transactionsNo')" width="150"></el-table-column>
          <el-table-column prop="claimNo" :label="$t('fmsReceiveClear.claimNo')" width="150"></el-table-column>
          <el-table-column prop="payerName" :label="$t('fmsReceiveClear.payerName')" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="businessTypeNames" :label="$t('fmsReceiveClear.businessTypeName')" width="120" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span>{{row.businessTypeNames.join('、')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')" width="220" show-overflow-tooltip></el-table-column>
          <el-table-column prop="settlementOfficeName" :label="$t('fmsReceiveClear.settlementOfficeName')" minWidth="220" show-overflow-tooltip></el-table-column>
          <el-table-column prop="transactionsAmount" :label="$t('fmsReceiveClear.transactionsCurrencyAmount')" align="right" width="150">
            <template slot-scope="{row}">
              <div>
                <span>{{row.transactionsCurrency}}</span>
                <span>{{row.transactionsAmount | numberToThousands}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="claimAmount" :label="$t('fmsReceiveClear.claimAmount')" width="150" align="right">
            <template slot-scope="{row}">
              <span>{{row.claimAmount | numberToThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remainAmount" :label="$t('fmsReceiveClear.remainAmount')" width="150" align="right" fixed="right" v-if="false">
            <template slot-scope="{row}">
              <span>{{row.remainAmount | numberToThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="useAmount" :label="$t('fmsReceiveClear.useAmount')" width="150" fixed="right">
            <template slot-scope="{row}">
              <span>{{row.useAmount | numberToThousands}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="item">
        <label>{{$t("rechargeRecord.associatedByName")}}：</label>
        <span>{{recordItem.associatedByName}}</span>
      </div>
      <div class="item">
        <label>{{$t("rechargeRecord.associatedTime")}}：</label>
        <span>{{recordItem.associatedTime | parseTime}}</span>
      </div>
      <div class="item">
        <label>{{$t("rechargeRecord.associatedRemarks")}}：</label>
        <span>{{recordItem.associatedRemarks}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
	name: "RechargeRecordTransInfo",
  props: {
    claimList: {
      type: Array,
      default: function () {
        return []
      }
    },
    recordItem: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
	data() {
		return {

		};
	},
	created() {

	},
	methods: {

	}
};
</script>
<style scoped lang="scss">
::v-deep .el-table th > .cell {
  color: #555;
  font-size: 14px;
}
</style>
