<template>
  <div v-loading="loading" class="right-main-wrapper">
    <h3 class="content-title">
      <span>{{$t('packageWarehouse.logisticManager.logisticsNos')}}:</span>
      <span>{{logisticsDetail.logisticsNos}}</span>
    </h3>
    <section class="info-wrapper">
      <div class="item-wrap">
        <el-row :gutter="10">
          <el-col :span="6">
            <div class="item-box">
              <span class="item-label">{{$t('packageWarehouse.logisticManager.memberId')}}:</span>
              <span class="item-value">
                <el-tooltip placement="top">
                  <div slot="content" style="max-width: 320px;">{{logisticsDetail.chineseName}}</div>
                  <span class="tip-content">{{logisticsDetail.chineseName}}</span>
                </el-tooltip>
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item-box">
              <span class="item-label">{{$t('packageWarehouse.logisticManager.receivedTime')}}:</span>
              <span class="item-value">
                <el-tooltip placement="top">
                  <div slot="content" style="max-width: 320px;">{{logisticsDetail.receivedTime | filterDate(vm)}}</div>
                  <span class="tip-content">{{logisticsDetail.receivedTime | filterDate(vm)}}</span>
                </el-tooltip>
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item-box">
              <span class="item-label">{{$t('packageWarehouse.logisticManager.estimateArrivalTime')}}:</span>
              <span class="item-value">
                <el-tooltip placement="top">
                  <div slot="content" style="max-width: 320px;">{{logisticsDetail.estimateArrivalTime | filterDate(vm)}}</div>
                  <span class="tip-content">{{logisticsDetail.estimateArrivalTime | filterDate(vm)}}</span>
                </el-tooltip>
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item-box">
              <span class="item-label">{{$t('packageWarehouse.logisticManager.realArrivalTime')}}:</span>
              <span class="item-value">
                <el-tooltip placement="top">
                  <div slot="content" style="max-width: 320px;">{{logisticsDetail.realArrivalTime | filterDate(vm)}}</div>
                  <span class="tip-content">{{logisticsDetail.realArrivalTime | filterDate(vm)}}</span>
                </el-tooltip>
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <div class="item-box">
              <span class="item-label">{{$t('packageWarehouse.logisticManager.estimateLogisticsAmount')}}:</span>
              <span class="item-value">{{logisticsDetail.estimateLogisticsAmount}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item-box">
              <span class="item-label">{{$t('packageWarehouse.logisticManager.realLogisticsAmount')}}:</span>
              <span class="item-value">{{logisticsDetail.realLogisticsAmount}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item-box">
              <span class="item-label">{{$t('packageWarehouse.logisticManager.estimateParcelAmount')}}:</span>
              <span class="item-value">{{logisticsDetail.estimateParcelAmount}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item-box">
              <span class="item-label">{{$t('packageWarehouse.logisticManager.realParcelAmount')}}:</span>
              <span class="item-value">{{logisticsDetail.realParcelAmount}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <div class="item-box">
              <span class="item-label">{{$t('packageWarehouse.logisticManager.estimateWeight')}}:</span>
              <span class="item-value">{{logisticsDetail.estimateWeight}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item-box">
              <span class="item-label">{{$t('packageWarehouse.logisticManager.logisticsStateName')}}:</span>
              <span class="item-value">{{logisticsDetail.logisticsStateName}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item-box">
              <span class="item-label">{{$t('packageWarehouse.providerName')}}:</span>
              <span class="item-value">{{logisticsDetail.providerName}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item-box">
              <span class="item-label">{{$t('packageWarehouse.logisticManager.remark')}}:</span>
              <span class="item-value">
                <el-tooltip placement="top">
                  <div slot="content" style="max-width: 320px;">{{logisticsDetail.remark}}</div>
                  <span class="tip-content">{{logisticsDetail.remark}}</span>
                </el-tooltip>
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>
    <section class="info-wrapper" style="margin-top: 20px;">
      <SectionTitle :title="$t('packageWarehouse.logisticManager.parcelListTitle')" />
      <LogisticsParcelTable :tableData="logisticsDetail.parcelDTOList" @refreshData="getLogisticsDetail" :height="360" />
    </section>
    <section class="info-wrapper" style="margin-top: 20px;" v-if="showChildList">
      <SectionTitle :title="$t('packageWarehouse.logisticManager.childListTitle')" />
      <LogisticsChildList :tableData="logisticsDetail.childDTOList" @refreshData="getLogisticsDetail" />
    </section>
  </div>
</template>
<script>
import { getLogisticsDetailApi } from '@/api/packageWarehouse'
import SectionTitle from '@/components/Cargo/Common/sectionTitle'
import LogisticsParcelTable from './components/LogisticsParcelTable'
import LogisticsChildList from './components/LogisticsChildList'
export default {
  name: 'LogisticsDetail',
  components: {
    SectionTitle,
    LogisticsParcelTable,
    LogisticsChildList
  },
  data() {
    return {
      vm: this,
      loading: false,
      id: '',
      logisticsDetail: {
        childDTOList: []
      }
    }
  },
  computed: {
    currDate() {
      return this.$moment({ hour: 0, minute: 0 }).valueOf()
    },
    scrollTableHeight() {
      return document.documentElement.clientHeight - 550
    },
    showChildList() {
      return this.logisticsDetail.childDTOList.length > 0
    }
  },
  watch: {},
  filters: {
    filterDate(time, vm) {
      return time ? vm.$moment(Number(time)).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  },
  methods: {
    async getLogisticsDetail() {
      this.loading = true
      const res = await getLogisticsDetailApi(this.id)
      if (res.ok && res.content) {
        this.logisticsDetail = {...this.logisticsDetail, ...res.content}
      }
      this.loading = false
    }
  },
  mounted() {
  },
  created() {
    // this.getMemberList()
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.getLogisticsDetail()
    }
  }
}
</script>
<style lang="scss" scoped>
.right-main-wrapper{
  overflow: hidden;
  overflow-y: auto;
}
.content-title{
  margin-top: 0;
}
.item-wrap{
  width: 80%;
}
.item-box{
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  padding: 6px 0;
  span{
    display: inline-block;
    vertical-align: top;
    &.item-label{
      width: 110px;
      text-align: right;
    }
    &.item-value{
      text-indent: 5px;
    }
  }
}
.tip-content{
  width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
