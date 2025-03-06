<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" v-permission="['ctn:container:view']" @click="viewDetail">{{$t('common.viewBtn')}}</el-button>
    <el-button type="text" size="mini" v-show="params.data.enableFlag === true" v-permission="['ctn:container:update']" @click="modifyDetail">{{$t('common.modifyBtn')}}</el-button>
    <!-- <el-button type="text" size="mini" v-permission="['ctn:container:update']" @click="modifyDetail">修改</el-button> -->
    <el-button type="text" size="mini" @click="stopLeasing" style="color: #FF4640;" v-show="params.data.enableFlag" v-permission="['ctn:container:enable']">
      <i class="el-icon-loading" v-show="statusChange"></i>
      <span v-show="!statusChange">{{$t('common.disableBtn')}}</span>
    </el-button>
    <el-button type="text" size="mini" @click="startLeasing" style="color: #06E87B;" v-show="!params.data.enableFlag">
      <i class="el-icon-loading" v-show="statusChange"></i>
      <span v-show="!statusChange">{{$t('common.enableBtn')}}</span>
    </el-button>
  </div>

</template>
<script>
import { updateStatusApi } from '@/api/containerManager'
export default {
  name: 'ContainerListBtn',
  data() {
    return {
      statusChange: false
    }
  },
  beforeMount() {
  },
  methods: {
    viewDetail() {
      if (this.params.data.containerCategory === 2) {
        this.$router.push({ name: 'LeaseDetail', params: {
          editType: 'view',
          orderType: this.params.data.containerCategory,
          id: this.params.data.id
        }, query: {from: 'InfoList'}})
      } else {
        this.$router.push({ name: 'InfoDetail', params: {
          editType: 'view',
          id: this.params.data.id
        }})
      }
    },
    modifyDetail() {
      if (this.params.data.containerCategory === 2) {
        this.$router.push({ name: 'LeaseDetail', params: {
          editType: 'edit',
          orderType: this.params.data.containerCategory,
          id: this.params.data.id
        }, query: {from: 'InfoList'}})
      } else {
        this.$router.push({ name: 'InfoDetail', params: {
          editType: 'edit',
          id: this.params.data.id
        }})
      }
    },
    async stopLeasing() {
      this.statusChange = true
      const res = await updateStatusApi({containerId: this.params.data.id, enableFlag: false})
      this.statusChange = false
      this.params.refreshData()
    },
    async startLeasing() {
      this.statusChange = true
      const res = await updateStatusApi({containerId: this.params.data.id, enableFlag: true})
      this.statusChange = false
      this.params.refreshData()
    }
  }
}
</script>
<style>
</style>
