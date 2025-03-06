<template>
  <el-table
   ref="containerTable"
   :data="tableData"
   height="500"
   max-height="500"
   tooltip-effect="dark"
   @selection-change="handleRowSelected"
   style="margin-top: 10px;">
   <el-table-column
      fixed
      width="160"
      v-if="showPoolBox">
    </el-table-column>
   <el-table-column
      fixed
      type="selection"
      width="55"
      prop="id"
      align="center">
    </el-table-column>
    <el-table-column
      fixed
      prop="soNo"
      label="订舱号"
      width="160"
      align="center">
    </el-table-column>
    <el-table-column
      fixed
      prop="containerNo"
      label="箱号"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      fixed
      prop="blNo"
      label="提单号"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="containerType"
      label="箱型"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="memberName"
      label="客户"
      width="100">
    </el-table-column>
    <el-table-column
      prop="remark"
      label="备注"
      width="200"
      align="center">
    </el-table-column>
    <el-table-column
      prop="blStatus"
      label="提单状态"
      width="100"
      align="center">
      <template slot-scope="scope">
        <span :class="scope.row.blStatus | getStatusClass">
          {{scope.row.blStatus | getStatusText}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="trailerStatusName"
      label="拖车作业状态"
      width="120"
      align="center">
      <template slot-scope="scope">
        <span>
          {{scope.row.trailerStatus | getFleetText}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="socFlag"
      label="箱属"
      align="center">
      <template slot-scope="scope">
        <span>
          {{scope.row.socFlag | filterSoc}}
        </span>
      </template>
    </el-table-column>
    <!-- <el-table-column
      prop="sumQuantity"
      label="总箱量"
      width="100"
      align="center">
    </el-table-column> -->
    <el-table-column
      prop="vessel"
      label="船名"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="voyage"
      label="航次"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="polCode"
      label="装货港"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="pickUpAddr"
      label="提箱点"
      width="200"
      align="center">
      <template slot-scope="scope">
        <div class="center-left-wrap">
          {{scope.row.pickUpCY}}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="returnAddr"
      label="还箱点"
      width="200"
      align="center">
    </el-table-column>
    <el-table-column
      prop="podCode"
      label="卸货港"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="truckName"
      label="预约车队"
      width="240"
      align="center">
    </el-table-column>
    <el-table-column
      prop="eirId"
      label="EIR-ID"
      width="200"
      align="center">
    </el-table-column>
    <el-table-column
      prop="pickUpTime"
      label="提吉时间"
      width="150"
      align="center">
      <template slot-scope="scope">
        {{$moment(scope.row.fullInTime).format('YYYY-MM-DD HH:mm')}}
      </template>
    </el-table-column>
    <el-table-column
      prop="fullInTime"
      label="还重时间"
      width="150"
      align="center">
      <template slot-scope="scope">
        {{$moment(scope.row.returnContainerDate).format('YYYY-MM-DD HH:mm')}}
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    name: 'ContainerTable',
    props: {
      tableData: {
        type: Array,
        default: () => []
      },
      showPoolBox: {
        type: Boolean,
        default: false
      },
      currSelected: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {}
    },
    computed: {

    },
    filters: {
      getStatusClass(status) {
        const className = [
          '',
          'status-text info-text',
          'status-text warning-text',
          'status-text success-text',
          'status-text danger-text',
          'status-text primary-text'
        ]
        return className[status]
      },
      getStatusText(status) {
        const text = [
          '',
          '待补料',
          '待审核',
          '已审核',
          '已驳回',
          '已签发'
        ]
        return text[status]
      },
      getFleetText(status) {
        const text = [
          '',
          '未邀请',
          '已邀请',
          '已预约',
          '已提空',
          '已还重'
        ]
        return text[status]
      },
      filterSoc(flag) {
        return flag ? 'SOC' : 'COC'
      }
    },
    watch: {
      showPoolBox(oldVal, newVal) {
        if (!newVal) {
          this.$refs.containerTable.clearSelection()
        }
      }
    },
    methods: {
      handleRowSelected(val) {
        this.$emit('rowSelected', val)
      },
      setSelectedItem() {
        // 刷新数据后，勾选之前的选中项
        if (this.currSelected.length > 0) {
          this.currSelected.forEach(v => {
            this.$refs.containerTable.toggleRowSelection(this.tableData.find(item => item.id === v.id), true)
          })
        } else {
          this.$refs.containerTable.clearSelection()
        }
      },
      removeSelected(_obj) {
        this.$refs.containerTable.toggleRowSelection(this.tableData.find(item => item.id === _obj.id), false)
      }
    },
    created() {},
    mounted() {}
  }
</script>
<style scoped lang="scss">
  .status-text{
    &.info-text{
      color: #909399;
    }
    &.warning-text{
      color: #E6A23C;
    }
    &.success-text{
      color: #67C23A;
    }
    &.danger-text{
      color: #F56C6C;
    }
    &.primary-text{
      color: #409EFF;
    }
  }
</style>
