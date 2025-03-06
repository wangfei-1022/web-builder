<template>
  <div class="sea-charge-tab">
    <el-button type="text" @click="invokeEdit(false)">查看</el-button>
    <el-button type="text" @click="invokeEdit(true)">复制</el-button>
    <el-button type="text" @click="invokeEdit(true)">提交订舱</el-button>
    <el-button type="text" class="button-in-grid-danger" @click="invokeDel">作废</el-button>
  </div>
</template>
<script>
  import { deleteConfirm } from '@/utils/utilBaseElement'
  export default {
    name: 'ChargeTabPayOptBtn',
    data() {
      return {
        isLock: false
      }
    },
    beforeMount() {
      this.initData()
    },
    methods: {
      initData() {
        const self = this
        const parent = self.params.context.componentParent
        this.isLock = parent.charge.payable.bChargeLockedStatus
      },
      invokeEdit(isShow) {
        const self = this
        const data = this.params.data
        self.params.context.componentParent.toEditOneCharge('pay', isShow, data.id)
      },
      invokeDel() {
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
  .sea-charge-tab .el-button{
    padding: 0;
  }
</style>
