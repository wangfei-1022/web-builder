<template>
  <div class="sea-charge-tab">
    <!-- 查看 -->
    <el-button type="text" @click="orderDetail">{{ $t('air.view') }}</el-button>
    <!-- 提交 -->
    <el-button type="text" @click="invokeEdit(true)"> {{ $t('air.submit') }}</el-button>
    <!-- 取消订单 -->
    <el-button type="text" @click="invokeEdit(true)">{{ $t('air.cancellationOfOrder') }} </el-button>
    <!-- 查看主票 -->
    <el-button type="text" v-if="params.data.mergeFlag" class="button-in-grid-danger" @click="masterDetail">
      {{ $t('air.checkTicket') }} </el-button>
  </div>
</template>
<script>
import { deleteConfirm } from '@/utils/utilBaseElement'
export default {
  name: 'ChargeTabPayOptBtn',
  data () {
    return {
      isLock: false
    }
  },
  beforeMount () {
    this.initData()
  },
  methods: {
    /**
     * 新增编辑页面
     */
    masterDetail () {
      let id = this.params.data.id
      this.$router.push({ name: `AirOperationManagementMasterDetail`, query: { id } })
    },
    /**
     * 新增编辑页面
     */
    orderDetail () {
      debugger
      let id = this.params.data.orderId
      this.$router.push({ name: `AirOperationManagementOrderDetail`, query: { id } })
    },
    initData () {
      const self = this
      const parent = self.params.context.componentParent
      this.isLock = parent
    },
    invokeEdit (isShow) {
      const self = this
      const data = this.params.data
      self.params.context.componentParent.toEditOneCharge('pay', isShow, data.id)
    },
    invokeDel () {
      const data = this.params.data
      const self = this
      deleteConfirm(self, () => {
        self.params.context.componentParent.toDelOneCharge('pay', data.id)
      })
    }
  }
}
</script>
<style scoped>
.sea-charge-tab .el-button {
  padding: 0;
  font-size: 12px;
}
</style>
