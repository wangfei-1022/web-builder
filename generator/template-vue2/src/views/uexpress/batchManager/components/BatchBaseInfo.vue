<template>
  <div class="info-box">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailBaseInfo.outboundNo')}}: </span>
          <span class="info-content">{{detail.outboundNo}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailBaseInfo.blNo')}}: </span>
          <span class="info-content">{{detail.blNo}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailBaseInfo.truckNo')}}: </span>
          <span class="info-content">{{detail.truckNo}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailBaseInfo.destinationAreaNames')}}: </span>
          <el-tooltip :content="countriesStr" placement="top">
            <span class="info-content-tooltip">{{detail.countries | filterCountries}}</span>
          </el-tooltip>

        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailBaseInfo.outboundTime')}}: </span>
          <span class="info-content">{{detail.outboundTime | filterDate(vm)}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailBaseInfo.boxCount')}}: </span>
          <span class="info-content">{{detail.boxCount}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailBaseInfo.parcelCount')}}: </span>
          <span class="info-content">{{detail.parcelCount}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailBaseInfo.volume')}}: </span>
          <span class="info-content">{{detail.volume}}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailBaseInfo.weight')}}: </span>
          <span class="info-content">{{detail.weight}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="info-inner-wrap">
          <span class="info-label">{{$t('uexpressBatch.detailBaseInfo.remarks')}}: </span>
          <span class="info-content remark-span" v-html="handlerRemarks()"></span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-inner-wrap">
          <el-button type="text" @click="showLogList" style="padding: 0;">{{$t('uexpressBatch.detailBaseInfo.viewLog')}}</el-button>
        </div>
      </el-col>
    </el-row>
    <LogListDialog :visible.sync="showLogListDialog" :dataList="logList" />
  </div>
</template>
<script>
import '@/styles/uexpress-base-info.scss'
import { getBatchLogListApi } from '@/api/uexpress/batchManager'
import LogListDialog from './LogListDialog'
export default {
  name: 'BatchBaseInfo',
  components: {
    LogListDialog
  },
  data() {
    return {
      vm: this,
      showLogListDialog: false,
      countriesStr: '',
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
    // handlerRemarks(remarkJson) {
    //   if (remarkJson) {
    //     try {
    //       let _arr = JSON.parse(remarkJson)
    //       let _str = ''
    //       _arr.map(item => {
    //         _str += `${item.remarksMessage} <br/>`
    //       })
    //       return _str
    //     } catch(e) {
    //       return remarkJson
    //     }
    //   }
    //   return ''
    // },
    filterChannelNames(channelNames) {
      return channelNames && channelNames.length > 0 ? channelNames.join(',') : ''
    },
    filterCountries(countries) {
      let map = {}
      let arr = []
      if (countries) {
        countries.forEach(v => {
          map[v.code] = v
        })

        Object.keys(map).forEach(v => {
          arr.push(map[v].localShortName)
        })
      }
      return arr.length > 0 ? arr.join(',') : ''
    }
  },
  watch: {
    watch: {
      'detail.countries': function(newVal, oldVal) {
        this.countriesStr = newVal.join(',')
      }
    }
  },
  methods: {
    async showLogList() {
      const res = await getBatchLogListApi(this.detail.id)
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
  },
  mounted() {
    if (this.detail.countries) {
      this.countriesStr = this.detail.countries.join(',')
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
</style>
