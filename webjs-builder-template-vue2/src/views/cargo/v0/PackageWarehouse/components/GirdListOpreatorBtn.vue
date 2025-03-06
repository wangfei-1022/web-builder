<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="bindWarehouse" v-show="!params.data.warehouseId">{{$t('packageWarehouse.girdConfig.bindBtn')}}</el-button>
    <el-button type="text" size="mini" @click="unbindWarehouse" v-show="params.data.warehouseId">{{$t('packageWarehouse.girdConfig.unbindBtn')}}</el-button>
    <el-button type="text" size="mini" @click="modifyGrid">{{$t('common.modifyBtn')}}</el-button>
    <el-button type="text" size="mini" @click="viewGrid">{{$t('common.viewBtn')}}</el-button>
    <el-button type="text" size="mini" @click="exportGrid">{{$t('packageWarehouse.girdConfig.exportBtn')}}</el-button>
    <el-button type="text" size="mini" @click="confirmDelete" v-show="!params.data.warehouseId">{{$t('common.deleteBtn')}}</el-button>
  </div>
</template>
<script>
import {
  unbindGirdWarehouseApi,
  exportGirdInfoApi,
  deleteGridConfigApi
} from '@/api/packageWarehouse'
export default {
  name: 'GirdListOpreatorBtn',
  data() {
    return {}
  },
  computed: {
    showBindBtn() {
      return this.params.data.billOrigin === 0
    },
    warehouseList() {
      return this.params.data.warehouseList
    }
  },
  methods: {
    async bindWarehouse() {
      this.params.showBindDialog(this.params.data)
    },
    async unbindWarehouse() {
      const res = await unbindGirdWarehouseApi(this.params.value)

      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.girdConfig.unbindSuccess'))
        this.params.refreshData()
      }
    },
    modifyGrid() {
      this.$router.push({name: 'GirdDetail', params: {operator: 'edit', id: this.params.value}})
    },
    viewGrid() {
      this.$router.push({name: 'GirdDetail', params: {operator: 'view', id: this.params.value}})
    },
    async exportGrid() {
      const res = await exportGirdInfoApi(this.params.value)
      if (res && res.ok) {
        this.downloadFile({fileName: '', url: res.content})
      }
    },
    confirmDelete() {
      this.$confirm(this.$t('packageWarehouse.girdConfig.deleteText'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.deleteBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.deleteGridConfig()
      }).catch(() => {})
    },
    async deleteGridConfig() {
      const res = await deleteGridConfigApi(this.params.value)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.girdConfig.removeGridSuccess'))
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
