<template>
  <el-dialog
    :visible.sync="showDialog"
    width="800px"
    top="50px"
    :title="$t('uexpressBL.detailLogInfo.viewLogTitle')"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
    <el-table :data="dataList" height="400">
      <el-table-column
        align="center"
        prop="opByName"
        :label="$t('uexpressBL.detailLogInfo.opByName')"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="opTime"
        :label="$t('uexpressBL.detailLogInfo.opTime')"
        width="200">
        <template slot-scope="{row}">
          {{row.opTime | filterDate(vm)}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="opDesc"
        :label="$t('uexpressBL.detailLogInfo.opDesc')"
        width="200">
      </el-table-column>
      <el-table-column
        align="center"
        prop="remarks"
        :label="$t('uexpressBL.detailLogInfo.remarks')"
        width="200">
      </el-table-column>
    </el-table>
    <!-- <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getLogList" /> -->
    <!-- <span slot="footer" class="dialog-footer">
      <el-button size="mini" :loading="loading" @click="closeDialog">{{$t('common.cancelBtn')}}</el-button>
    </span> -->
  </el-dialog>
</template>
<script>
export default {
  name: 'BLLogListDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      vm: this
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('update:visible', false)
      }
    }
  },
  filters: {
    filterDate(_date, vm) {
      return _date ? vm.$moment(Number(_date)).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  },
  methods: {
    closeDialog() {
      this.showDialog = false
    }
  }
}
</script>
<style scoped lang="scss">
</style>
