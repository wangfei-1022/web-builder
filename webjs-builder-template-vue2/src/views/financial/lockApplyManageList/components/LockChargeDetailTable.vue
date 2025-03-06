<template>
  <div>
    <el-table class="yht-table" size="mini" :data="chargeList" style="width: 100%;" row-key="id" border>
      <el-table-column prop="" label="" width="45" v-if="lockOrderState === 40">
        <template slot-scope="{ row }">
            <span v-if="row.adjustChargeFlag" class="adjust">调</span>
        </template>
      </el-table-column>
      <el-table-column prop="settlementCompanyName" :label="$t('fmsLock.settlementCompanyName')" min-width="150" show-overflow-tooltip />
      <el-table-column prop="settlementOfficeName" :label="$t('fmsLock.settlementOfficeName')" min-width="150" show-overflow-tooltip />
      <el-table-column prop="feeName" :label="$t('fmsLock.feeName')" min-width="100" show-overflow-tooltip />
      <el-table-column prop="unitName" :label="$t('fmsLock.unitName')" min-width="80">
        <template slot-scope="{ row }">
          <span>{{row.unitName1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="currency" :label="$t('fmsLock.currency')" min-width="80" />
      <el-table-column prop="price" :label="$t('fmsLock.price')" min-width="80">
        <template slot-scope="{ row }">
          <span>{{row.price | numberToThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="chargeQuantity1" :label="$t('fmsLock.chargeQuantity1')" min-width="80" />
      <el-table-column prop="invoiceTaxRateName" :label="$t('fmsLock.taxRate')" min-width="80" />
      <el-table-column prop="taxAmount" :label="$t('fmsLock.taxAmount')" min-width="80">
        <template slot-scope="{ row }">
          <span>{{row.taxAmount | numberToThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="excludeTaxAmount" :label="$t('fmsLock.excludeTaxAmount')" min-width="100">
        <template slot-scope="{ row }">
          <span>{{row.excludeTaxAmount | numberToThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" :label="$t('fmsLock.amount')" min-width="100">
        <template slot-scope="{ row }">
          <span>{{row.amount | numberToThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="entryStateName" :label="$t('fmsLock.entryStateName')" min-width="100" />
      <el-table-column prop="invoiceStateName" :label="$t('fmsLock.invoiceStateName')" min-width="100" />
      <el-table-column prop="clearStateName" :label="$t('fmsLock.clearStateName')" min-width="100" />
    </el-table>
  </div>

</template>
<script>
import { parseTime, formatNumberToThousands } from '@/utils/index';

export default {
    name: 'FmsLockChargeDetailTable',
    props: {
        chargeList: {
            type: Array,
            default: function () {
                [];
            }
        },
        lockOrderState: {
            type: Number
        }
    },
    data() {
        return {};
    },
    created() {},
    methods: {}
};
</script>
<style lang="scss" scoped>
.adjust {
    background: rgb(253, 235, 211);
    border-radius: 50%;
    border: 1px solid orange;
    display: inline-block;
    height: 24px;
    width: 24px;
    line-height: 24px;
    text-align: center;
    color: orange;
}
</style>

