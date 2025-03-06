<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="confirmDelete">{{$t('common.deleteBtn')}}</el-button>
  </div>
</template>
<script>
import {
  deleteBubbleApi
} from '@/api/packageWarehouse'
export default {
  name: 'BulkyCustomerOpreationBtn',
  data() {
    return {}
  },
  computed: {},
  methods: {
    confirmDelete() {
      this.$confirm(this.$t('common.deleteWarnningTips'), this.$t('common.warnningText'), {
        confirmButtonText: this.$t('common.deleteBtn'),
        confirmButtonClass: 'el-button--danger',
        cancelButtonText: this.$t('packageWarehouse.cancelDrop'),
        type: 'warning'
      })
      .then(async() => {
        this.batchDelete()
      }).catch(err => {})
    },
    async batchDelete() {
      const res = await deleteBubbleApi({ids: [this.params.value]})
      if (res.ok) {
        this.$message.success(this.$t('packageWarehouse.batchDeleteSuccess'))
        this.params.refreshData()
      }
    }
  },
  mounted() {},
  created() {}
}
</script>
<style>
</style>
