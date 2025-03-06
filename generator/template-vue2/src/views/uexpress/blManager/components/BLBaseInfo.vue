<template>
  <div class="info-box">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.blNo')}}: </span>
          <span class="info-content">{{detail.blNo}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.createTime')}}: </span>
          <span class="info-content">{{detail.createTime | filterDate(vm)}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.bolAirStateName')}}: </span>
          <span class="info-content">{{detail.bolAirStateName}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.importDeclareStateName')}}: </span>
          <span class="info-content">{{detail.importDeclareStateName}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.outboundCount')}}: </span>
          <span class="info-content">{{detail.outboundCount}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.boxCount')}}: </span>
          <span class="info-content">{{detail.boxCount}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.parcelCount')}}: </span>
          <span class="info-content">{{detail.parcelCount}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.chargeableWeight')}}: </span>
          <span class="info-content">{{detail.chargeableWeight}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.netWeight')}}: </span>
          <span class="info-content">{{detail.netWeight}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.netVolume')}}: </span>
          <span class="info-content">{{detail.netVolume}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.weight')}}: </span>
          <span class="info-content">{{detail.weight}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.volume')}}: </span>
          <span class="info-content">{{detail.volume}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.destinationAreaNames')}}: </span>
          <el-tooltip :content="detail.destinationAreaNames" placement="top">
            <span class="info-content-tooltip">{{detail.destinationAreaNames}}</span>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <el-button type="text" @click="showLogList" style="padding: 0;">{{$t('uexpressBL.detailBaseInfo.viewLog')}}</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBL.detailBaseInfo.remarks')}}: </span>
          <span class="info-content remark-span" v-html="handlerRemarks()"></span>
        </div>
      </el-col>
    </el-row>
    <LogListDialog :visible.sync="showLogListDialog" :dataList="logList" />
  </div>
</template>
<script>
import { getBLLogListApi } from '@/api/uexpress/blManager'
import LogListDialog from './LogListDialog'
import '@/styles/uexpress-base-info.scss'
export default {
  name: 'BLBaseInfo',
  components: {
    LogListDialog
  },
  data() {
    return {
      vm: this,
      showLogListDialog: false,
      logList: []
    }
  },
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  filters: {
    filterDate(_date, vm) {
      return _date ? vm.$moment(Number(_date)).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    filterChannelNames(channelNames) {
      return channelNames && channelNames.length > 0 ? channelNames.join(',') : ''
    }
  },
  methods: {
    async showLogList() {
      const res = await getBLLogListApi(this.detail.id)
      if (res && res.ok) {
        this.logList = res.content ? res.content.list : []
        this.showLogListDialog = true
      }
    },
    handlerRemarks() {
      if (this.detail.remarks) {
        let _str = ''
        this.detail.remarks.map(item => {
          _str += `${item} <br/>`
        })
        return _str
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped="">

.info-box{
  padding: 20px;
}
.info-inner-wrap{
  font-size: 14px;
  margin-bottom: 20px;
}
.remark-span{
  display: inline-block;
  vertical-align: top;
}
</style>
