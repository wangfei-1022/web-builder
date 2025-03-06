<template>
  <div>
    <el-dialog
    :visible.sync="showDialog"
    width="800px"
    :title="$t('planManager.chooseBatch')"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
      <el-table
        :data="batchList"
        style="width: 100%"
        height="400"
        @selection-change="setSelectBatch">
        <el-table-column
          type="selection"
          width="55"
          fixed>
        </el-table-column>
        <el-table-column
          prop="batchNo"
          :label="$t('planManager.batchNo')"
          width="200"
          fixed>
        </el-table-column>
        <el-table-column
          prop="boxQuantity"
          :label="$t('planManager.boxQuantity')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="totalWeight"
          :label="$t('planManager.totalWeight')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="totalVolume"
          :label="$t('planManager.totalVolume')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="batchDensity"
          :label="$t('planManager.density')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="plateNo"
          :label="$t('planManager.plateNo')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="planTime"
          :label="$t('planManager.planDate')"
          width="120">
          <template slot-scope="{row}">
            {{row.planTime | filterDate(vm)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="planWarehouseName"
          :label="$t('planManager.warehouseName')"
          width="120">
        </el-table-column>
        <el-table-column
          prop="countryName"
          :label="$t('planManager.countryName')"
          width="120">
        </el-table-column>
        <el-table-column
          prop="lastMailCarrier"
          :label="$t('planManager.lastMailCarrier')"
          width="120">
        </el-table-column>
        <el-table-column
          prop="cargoType"
          :label="$t('planManager.cargoType')"
          width="120">
        </el-table-column>
        <el-table-column
          prop="billNo"
          :label="$t('planManager.billNo')"
          width="120">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveSelectBatch">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeBatchDialog">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPopupBatchListApi
} from '@/api/planManager'
export default {
  name: 'BatchListDialog',
  data() {
    return {
      showDialog: false,
      selectedBatch: [],
      batchList: []
    }
  },
  methods: {
    showBatchList() {
      this.getPopupBatchList()
      this.showDialog = true
    },
    async getPopupBatchList() {
      const res = await getPopupBatchListApi({planId: this.editForm.id})
      if (res && res.ok) {
        this.batchList = res.content.list
      }
    },
    setSelectBatch(val) {
      this.selectedBatch = val
    },
    saveSelectBatch() {},
    closeBatchDialog() {
      this.showBatchListDialog = false
    }
  },
  mounted() {},
  created() {}
}
</script>
<style>
</style>
