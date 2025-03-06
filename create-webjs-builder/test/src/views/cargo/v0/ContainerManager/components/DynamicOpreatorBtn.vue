<template>
  <div class="edit-btn-wrap">
    <!-- <el-button type="text" size="mini" v-permission="['ctn:container:view']" @click="upgradeDetail">更新</el-button>
    <el-button type="text" size="mini" v-show="!hideEditBtn" v-permission="['ctn:container:update']" @click="modifyDetail">修改</el-button> -->
    <el-button type="text" size="mini" @click="modifyDetail" v-loading.fullscreen.lock="fullscreenLoading" v-permission="['ctn:status:log:add']">{{$t('common.modifyBtn')}}</el-button>
    <el-button type="text" size="mini" @click="upgradeDetail" v-show="params.data.activeFlag" v-permission="['ctn:status:log:update']">{{$t('common.updateBtn')}}</el-button>
    <Dialog
      :showEditDialog="showEditDialog"
      :data="detailObj"
      @closeDialog="refreshData" />
  </div>
</template>
<script>
import Dialog from './DynamicModifyDialog'
import { getDynamicModifyDetailApi } from '@/api/containerDynamic'
export default {
  name: 'DynamicOpreatorBtn',
  data() {
    return {
      showEditDialog: false,
      fullscreenLoading: false,
      detailObj: null
    }
  },
  components: {
    Dialog
  },
  computed: {
    timeLimit: function() {
      return {
        previousDate: this.previousDate,
        nextDate: this.nextDate,
        id: this.params.value
      }
    }
  },
  methods: {
    upgradeDetail() {
      this.$router.push({name: 'UpgradeDynamic', params: {id: this.params.value}})
    },
    async modifyDetail() {
      this.fullscreenLoading = true
      const res = await getDynamicModifyDetailApi(this.params.value, this.params.data.containerId)
      if (res.ok && res.content) {
        this.detailObj = Object.assign({}, res.content, {containerNo: this.params.data.containerNo})
      }
      this.fullscreenLoading = false
      this.showEditDialog = true
    },
    refreshData() {
      this.showEditDialog = false
      this.params.refreshData()
    }
  },
  created() {}
}
</script>
<style>
</style>
