<template>
  <div class="option-btn-wrap">
    <el-button
      v-show="params.data.trailerStatus > 2"
      style="margin: 0 2px; font-size: 16px"
      type="text"
      size="mini"
      class="ml-10"
      icon="el-icon-printer"
      :title="$t('charteredBoat.fleetList.printBtn')"
      @click="printItem(params.data.id,'EIR')"
    />

    <!--    params.context.componentParent.download(params.data)-->
    <el-button v-show="params.data.trailerStatus > 2" type="text" size="mini" icon="el-icon-sold-out" :title="$t('charteredBoat.fleetList.printBtn')" style="margin: 0 2px; font-size: 16px" @click="printItem(params.data.id,'CONTAINER_LOAD_PLAN')" />
    <el-button
      v-show="params.data.trailerStatus === 3"
      style="margin: 0 2px;"
      type="text"
      size="mini"
      class="ml-10"
      @click="checkCancel()"
    >
      {{$t('charteredBoat.fleetList.cancelQuery')}}
    </el-button>
    <!--    <span v-show="params.data.trailerStatus <= 2 || params.data.trailerStatus > 3">无</span>-->
  </div>
</template>
<script>
import { cancelTrailersApi, printTrailersApi } from '@/api/trailer'
export default {
  name: 'TrailerListOptBtn',
  data() {
    return { }
  },
  created() {
  },
  beforeMount() {
  },
  mounted() {
  },
  methods: {
    async printItem(id, code) {
      const res = await printTrailersApi(id, code)
      if (res.ok && res.content) {
        window.open(res.content)
      }
    },
    checkCancel() {
      this.$confirm(this.$t('charteredBoat.fleetList.trailersConfirmTips'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        confirmButtonClass: 'el-button--danger',
        cancelButtonText: this.$t('charteredBoat.fleetList.thinkOver'),
        cancelButtonClass: 'el-button--primary',
        type: 'warning'
      }).then(() => {
        this.sendCancelOrder(this.params.data)
      }).catch(() => {})
    },
    // 单条删除条件检查
    // cancelOrder() {
    //   const _row = this.params.data
    //   if (_row.trailerStatus === 2 && _row.containerId > 0) {
    //     // 符合取消条件,发送请求
    //     this.sendCancelOrder(_row)
    //   } else if (!_row.containerId) {
    //     this.$message({
    //       type: 'error',
    //       message: '当前箱子已作业，无法取消预约'
    //     })
    //     return false
    //   } else {
    //     this.$message({
    //       type: 'error',
    //       message: '所选箱子预约状态已变更，请刷新后重试'
    //     })
    //     return false
    //   }
    // },
    // 单条取消
    async sendCancelOrder(_obj) {
      // 请求取消变更
      const _res = await cancelTrailersApi({ ids: [_obj.id] })
      if (_res.ok) {
        this.$message.success(this.$t('charteredBoat.fleetList.cancelQuerySuccess'))
        // 变更后刷新数据
        this.params.context.componentParent.refreshData()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.option-btn-wrap{
  span{
    cursor: pointer
  }
}
</style>

