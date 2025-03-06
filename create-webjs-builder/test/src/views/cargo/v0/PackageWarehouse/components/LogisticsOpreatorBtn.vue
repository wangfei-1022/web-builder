<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="viewDetail">{{$t('packageWarehouse.viewDetailBtn')}}</el-button>
    <el-button type="text" size="mini" @click="upgradeStatus">{{$t('packageWarehouse.logisticManager.upgradStatusBtn')}}</el-button>
    <el-button type="text" size="mini" @click="modifyInfo">{{$t('common.editBtn')}}</el-button>
    <el-button type="text" size="mini" @click="confirmDelete">{{$t('common.deleteBtn')}}</el-button>
    <el-button type="text" size="mini" @click="checkUnbind" v-show="showUnbindBtn">{{$t('packageWarehouse.logisticManager.unbindBtn')}}</el-button>
  </div>

</template>
<script>
import { deleteLogisticsApi, unbindParentLogisticsApi } from '@/api/packageWarehouse'
export default {
  name: 'OrderListOpreatorBtn',
  data() {
    return {}
  },
  computed: {
    showDetailBtn() {
      return this.params.data.id && this.params.data.id.length > 0
    },
    showUpgrade() {
      return this.params.data.status < 3
    },
    showUnbindBtn() {
      return this.params.data.parentId !== null
    }
  },
  methods: {
    viewDetail() {
      this.$router.push({name: 'LogisticsDetail', params: {
        id: this.params.value
      }})
    },
    confirmDelete() {
      this.$confirm(this.$t('packageWarehouse.logisticManager.deleteTips'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.deleteBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        this.deleteInfo()
      }).catch(() => {})
    },
    async deleteInfo() {
      this.params.showParentLoading(true)
      const res = await deleteLogisticsApi(this.params.value)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.logisticManager.deleteSuccess'))
        this.params.refreshData()
      } else {
        this.params.showParentLoading(false)
      }
    },
    upgradeStatus() {
      this.params.updateStatus(this.params.data)
    },
    modifyInfo() {
      this.params.modifyInfo(this.params.data)
    },
    checkUnbind() {
      this.$confirm(this.$t('packageWarehouse.logisticManager.checkUnbind'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('planManager.thinkOver'),
        type: 'warning'
      }).then(() => {
        this.unbindParent()
      }).catch(() => {})
    },
    async unbindParent() {
      const res = await unbindParentLogisticsApi(this.params.value)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.logisticManager.unbindSuccess'))
        this.params.refreshData()
      }
    }
  },
  created() {
  }
}
</script>
<style>
</style>
