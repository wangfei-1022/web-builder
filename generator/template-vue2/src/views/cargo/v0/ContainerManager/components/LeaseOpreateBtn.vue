<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" v-permission="['ctn:container:view']" @click="viewDetail">{{$t('common.viewBtn')}}</el-button>
    <el-button type="text" size="mini" v-permission="['ctn:container:update']" @click="modifyDetail">{{$t('common.modifyBtn')}}</el-button>
    <!-- <el-button type="text" size="mini" v-show="!hideEditBtn" v-permission="['ctn:container:update']" @click="modifyDetail">修改</el-button> -->
    <!-- <el-button type="text" size="mini" @click="stopLeasing" style="color: #FF4640;" v-show="params.data.enableFlag">停用</el-button>
    <el-button type="text" size="mini" @click="startLeasing" style="color: #06E87B;" v-show="!params.data.enableFlag">启用</el-button> -->
  </div>

</template>
<script>
export default {
  name: 'LeaseOpreateBtn',
  data() {
    return {}
  },
  computed: {
    detailName: function() {
      return this.params.orderType === 3 ? 'LoanDetail' : 'LeaseDetail'
    },
    hideEditBtn: function() {
      return this.params.data.redeliveryDate && this.params.data.redeliveryDate.length > 0
    }
  },
  methods: {
    viewDetail() {
      this.$router.push({name: this.detailName, params: {
        editType: 'view',
        orderType: this.params.orderType,
        id: this.params.data.containerOrderId
      }})
    },
    modifyDetail() {
      this.$router.push({name: this.detailName, params: {
        editType: 'edit',
        orderType: this.params.orderType,
        id: this.params.data.containerOrderId
      }, query: {from: 'LeaseList'}})
    },
    stopLeasing() {
      this.params.refreshData()
    },
    startLeasing() {
      this.params.refreshData()
    }
  },
  created() {
  }
}
</script>
<style>
</style>
