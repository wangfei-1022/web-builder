<template>
  <div class="edit-btn-wrap">
    <!-- <el-button type="text" size="mini" v-permission="['ctn:released:view']" @click="viewDetail">查看</el-button>
    <el-button type="text" size="mini" v-show="showModify" v-permission="['ctn:released:released']" @click="modifyDetail">放箱</el-button>
    <el-button type="text" size="mini" v-show="showModify" v-permission="['ctn:released:update']" @click="modifyDetail">编辑</el-button>
    <el-button type="text" size="mini" @click="stopLeasing" v-show="params.data.enableFlag" v-permission="['ctn:released:publish']">
      <i class="el-icon-loading" v-show="statusChange"></i>
      <span v-show="!statusChange">发布</span>
    </el-button> -->
    <el-button type="text" size="mini" @click="viewDetail">{{$t('common.viewBtn')}}</el-button>
    <el-button type="text" size="mini" @click="releaseDetail" v-show="showReleaseBtn">{{$t('containerManager.releaseList.releasedBtn')}}</el-button>
    <el-button type="text" size="mini" @click="modifyDetail" v-show="showModifyBtn">{{$t('common.editBtn')}}</el-button>
    <el-button type="text" size="mini" @click="publishDetail" v-show="showPublishBtn">
      <i class="el-icon-loading" v-show="statusChange"></i>
      <span v-show="!statusChange">{{$t('common.publishBtn')}}</span>
    </el-button>
    <el-button type="text" size="mini" @click="downLoadEIR" v-show="showDownloadBtn">{{$t('containerManager.releaseList.downloadEIRBtn')}}</el-button>
  </div>

</template>
<script>
import { publishReleasedApi } from '@/api/containerReleasedList'
export default {
  name: 'ContainerListBtn',
  data() {
    return {
      statusChange: false
    }
  },
  beforeMount() {
  },
  mounted() {
  },
  computed: {
    hasDraft() {
      return this.params.data.hasDraft
    },
    isPublish() {
      return this.params.data.isPublish
    },
    showReleaseBtn() {
      // return this.params.data.status < 3 && (!this.hasDraft || this.isPublish)
      return (this.params.data.status < 3 || this.params.data.status === 5) && !this.hasDraft
    },
    showModifyBtn() {
      // return this.hasDraft && !this.isPublish
      return this.hasDraft
    },
    showPublishBtn() {
      // return !this.isPublish
      return this.hasDraft
    },
    sailScheduleId() {
      return this.params.data.requireGatheringList ? this.params.data.requireGatheringList.length > 0 ? this.params.data.requireGatheringList[0].sailScheduleId : '' : ''
    },
    showDownloadBtn() {
      return this.params.data.eirUrl && this.params.data.eirUrl.length > 0
    },
    sailType() {
      return this.params.getSailType()
    }
  },
  methods: {
    viewDetail() {
      this.$router.push({name: 'ViewReleasedDetail', params: {sailScheduleId: this.sailScheduleId, sailType: this.sailType}})
    },
    releaseDetail() {
      this.$router.push({name: 'ModifyReleasedInfo', params: {sailScheduleId: this.sailScheduleId}, query: {type: 'create', sailType: this.sailType}})
    },
    modifyDetail() {
      this.$router.push({name: 'ModifyReleasedInfo', params: {sailScheduleId: this.sailScheduleId}, query: {type: 'edit', sailType: this.sailType}})
    },
    async publishDetail() {
      this.statusChange = true
      const res = await publishReleasedApi(this.sailScheduleId)
      if (res.ok) {
        this.statusChange = false
        this.params.refreshData()
      }
    },
    downLoadEIR() {
      this.downloadFile({
        fileName: this.params.data.originFileName,
        url: this.params.data.eirUrl
      })
    }
  }
}
</script>
<style>
</style>
