<template>
  <el-table
   ref="fleetTable"
   :data="tableData"
   height="500"
   max-height="500"
   tooltip-effect="dark"
   @selection-change="handleRowSelected"
   style="margin-top: 10px;">
    <el-table-column
      fixed
      type="selection"
      width="55"
      prop="id"
      align="center">
    </el-table-column>
    <el-table-column
      fixed
      prop="EIRID"
      label="EIR-ID"
      width="200"
      align="center">
    </el-table-column>
    <el-table-column
      prop="containerSize"
      label="箱型"
      width="60"
      align="center">
    </el-table-column>
    <el-table-column
      prop="fleetName"
      label="车队名称"
      width="200"
      align="center">
    </el-table-column>
    <el-table-column
      prop="plateNo"
      label="拖车头牌"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="chassisNo"
      label="拖架车牌"
      width="120">
    </el-table-column>
    <el-table-column
      prop="driver"
      label="司机姓名"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="identityNo"
      label="司机身份证号"
      width="200"
      align="center">
      <template slot-scope="scope">
        {{scope.row.identityNo | filterIdentity}}
      </template>
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="司机手机"
      width="140"
      align="center">
      <template slot-scope="scope">
        <span>
          {{scope.row.mobile | filterMobile}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="pickUpCY"
      label="提箱点"
      width="300"
      align="center">
    </el-table-column>
    <el-table-column
      prop="returnCY"
      label="还箱点"
      width="200"
      align="center">
    </el-table-column>
    <el-table-column
      prop="workingDate"
      label="预约作业时间"
      width="200"
      align="center">
      <template slot-scope="scope">
        {{$moment(Number(scope.row.workingDate)).format('YYYY-MM-DD HH:mm')}}
      </template>
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      width="100"
      align="center">
      <template slot-scope="scope">
        {{scope.row.status | filterStatus}}
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      class-name="option-cell"
      prop="id"
      label="操作"
      width="120"
      align="center">
      <template slot-scope="scope">
        <!-- <i class="el-icon-date" @click="orderFleet(scope.row)" title="预约" v-show="scope.row.status <= 1"></i> -->
        <i class="el-icon-printer" @click="printItem(scope.row)" title="打印单据" v-show="scope.row.status > 1"></i>
        <i class="el-icon-remove-outline danger" @click="checkCancel([scope.row], false)" title="取消预约" v-show="scope.row.status == 2"></i>
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
      currSelected: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {}
    },
    computed: {},
    filters: {
      filterStatus(_status) {
        let status = ''
        switch (_status) {
          case '0':
            status = '未邀请';
            break;
          case '1':
            status = '已邀请';
            break;
          case '2':
            status = '已预约';
            break;
          case '3':
            status = '已提空';
            break;
          case '4':
            status = '已还重';
            break;
          default:
            status = '未邀请';
            break;
        }
        return status
      },
      filterIdentity(_str) {
        return _str.replace(/^(.{4})(?:\d+)(.{4})$/, "$1******$2")
      },
      filterMobile(_str) {
        return _str.replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2")
      }
    },
    watch: {
    },
    methods: {
      handleRowSelected(val) {
        this.$emit('update:currSelected', val)
      },
      printItem(_obj) {
        console.log('打印', _obj)
      },
      /** ************预约车队*********************************************************/
      // orderFleet() {},
      /** *********************************************************************/

      /** ************取消预约*********************************************************/
      checkCancel(list, multiple) {
        this.$confirm('是否确认取消当前预约车队?', this.$t('common.tips'), {
          confirmButtonText: '确认',
          confirmButtonClass: 'el-button--danger',
          cancelButtonText: '再想想',
          cancelButtonClass: 'el-button--primary',
          type: 'warning'
        }).then(() => {
          if (multiple) {
            this.cancelOrderList(list)
          } else {
            this.cancelOrder(list[0])
          }
        }).catch(() => {})
      },
      // 单条删除条件检查
      cancelOrder(_obj) {
        if (_obj.status === '2' && _obj.fleetNo.trim().length === 0) {
          // 符合取消条件,发送请求
          this.sendCancelOrder(_obj)
        } else if (_obj.fleetNo.trim().length > 0) {
          this.$message({
            type: 'error',
            message: '当前箱子已作业，无法取消预约'
          })
          return false
        } else {
          this.$message({
            type: 'error',
            message: '所选箱子预约状态已变更，请刷新后重试'
          })
          return false
        }
      },
      // 批量删除条件检查
      cancelOrderList(_arr) {
        let _count = 0
        for (let item of _arr) {
          if (item.status !== '2') {
            _count++
            this.$message({
              type: 'error',
              message: '所选箱子预约状态已变更，请刷新后重试'
            })
            break
          }
          if (item.fleetNo.trim().length > 0) {
            _count++
            this.$message({
              type: 'error',
              message: '当前箱子已作业，无法取消预约'
            })
            break
          }
        }

        if (_count === 0) {
          this.sendCancelOrderList()
        }
      },
      // 单条取消
      sendCancelOrder(_obj) {
        // 请求取消变更
        console.log('校验通过, 请求接口')
        // 变更后刷新数据
        this.$emit('refreshData')
      },
      // 批量取消
      sendCancelOrderList(_arr) {
        // 请求取消变更
        console.log('数组校验通过, 请求接口')
        // 变更后刷新数据
        this.$emit('refreshData')
      }
      /** *********************************************************************/
    },
    created() {},
    mounted() {}
  }
</script>
<style scoped lang="scss">
  .option-cell{
    i{
      cursor: pointer;
      font-size: 18px;
      padding: 0 3px;
      &.danger{
        color: #F56C6C;
      }
    }
  }
  ::v-deep.el-button--primary.danger-btn{
    background: #F56C6C;
    border-color: #F56C6C;
  }
</style>
