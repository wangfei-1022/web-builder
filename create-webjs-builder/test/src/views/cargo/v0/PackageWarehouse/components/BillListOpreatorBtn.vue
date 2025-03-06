<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="updateBill" v-show="showBtn">{{$t('common.editBtn')}}</el-button>
    <el-button type="text" size="mini" @click="deleteBill" v-show="showBtn">{{$t('common.deleteBtn')}}</el-button>
    <!-- <el-button type="text" size="mini" @click="updateBatch" v-show="showDeleteBtn">{{$t('planManager.updateBatch')}}</el-button> -->
    <BillModifyDialog ref="billModifyDialog" opreator="modify" @refreshData="refreshData" />
    <!-- <BatchListDialog ref="batchListDialog" /> -->
  </div>
</template>
<script>
import { deleteBillListApi } from '@/api/planManager'
import BillModifyDialog from './BillModifyDialog'
// import BatchListDialog from './BatchListDialog'
export default {
  name: 'BillListOpreatorBtn',
  components: {
    BillModifyDialog
    // BatchListDialog
  },
  data() {
    return {}
  },
  computed: {
    showBtn() {
      return this.params.data.billOrigin === 0
    }
  },
  methods: {
    updateBill() {
      this.$refs.billModifyDialog.showModifyDialog(null, this.params.data.id)
    },
    deleteBill() {
      this.$confirm(this.$t('planManager.billList.deleteBillTips'), this.$t('common.warnningText'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async () => {
        const res = await deleteBillListApi(this.params.data.id)
        if (res && res.ok) {
          this.$message({
            type: 'success',
            message: this.$t('planManager.billList.deleteSuccess')
          })
        }
      }).catch(() => {
      })
    },
    refreshData() {
      this.params.refreshData()
    }
    // updateBatch() {
    //   this.$refs.batchListDialog.showBatchList()
    // }
  },
  created() {
  }
}
</script>
<style>
</style>
