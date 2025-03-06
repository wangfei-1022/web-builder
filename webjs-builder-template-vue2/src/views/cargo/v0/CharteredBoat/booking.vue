<!--
订舱列表入口单页：
1、通过状态控制了列表和详情的展示
-->
<template>
  <div
    v-loading="loading"
    class="sys-right-inner-wrap booking-main"
    :element-loading-text="$t('charteredBoat.booking.loadingHard')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <topSearchItems v-show="currentPage === 'list'" :show-single-input="false" class="mb-20">
      <div v-show="simpleSearch" slot="mutliple">
        <el-form ref="searchForm" :inline="true" :model="searchForm" class="search-form" label-width="80px">
          <el-form-item class="el-form-item" :label="$t('charteredBoat.booking.soNoText')" prop="soNo">
            <el-input v-model="searchForm.soNo" size="mini" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
          </el-form-item>
          <el-form-item :label="`${$t('charteredBoat.memberName')}: `" prop="memberId">
            <remoteSearchSelector v-model="searchForm.memberId" @selectorChange="topSearch" />
          </el-form-item>
          <el-form-item :label="`${$t('charteredBoat.polCode')}: `" prop="polCode">
            <cargo-advance-select
              ref="polCodeSelect"
              :url="url.qf.seaport"
              :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
              :fields="['englishName','code5','chineseName']"
              tag-value="code5"
              tag-name="enPortName"
              remote
              @parentCallBack="(data)=>{
                searchForm.polCode=data.code5
                list()
              }"
            />
          </el-form-item>
          <el-form-item :label="`${$t('charteredBoat.podCode')}: `" prop="podCode">
            <cargo-advance-select
              ref="podCodeSelect"
              :url="url.qf.seaport"
              :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
              :fields="['englishName','code5','chineseName']"
              tag-value="code5"
              tag-name="enPortName"
              remote
              @parentCallBack="(data)=>{
                searchForm.podCode=data.code5
                list()
              }"
            />
          </el-form-item>
          <el-form-item class="el-form-item" :label="this.$t('charteredBoat.vesselName')" prop="vessel">
            <el-input v-model="searchForm.vessel" size="mini" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
          </el-form-item>
          <el-form-item class="el-form-item" :label="this.$t('charteredBoat.voyageNo')" prop="voyage">
            <el-input v-model="searchForm.voyage" size="mini" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="simpleSearch && currentPage === 'list' " slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">{{$t('common.searchBtn')}}</el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="searchFormReset">{{$t('common.resetBtn')}}</el-button>
        <span class="simple-search-btn" @click="advancedSearch">{{$t('charteredBoat.booking.simpleSearch')}}</span>
      </div>

      <div v-show="!simpleSearch && currentPage === 'list'" slot="mutliple" class="simple-search">
        <el-input v-model="searchForm.keyword" size="mini" :placeholder="$t('common.placeholder')" style="width: 220px;"  clearable @keyup.enter.native="topSearch" @clear="topSearch">
          <i slot="suffix" style="line-height: normal;padding: 7px;" class="el-icon-search" @click="topSearch()"  />
        </el-input>
        <span class="simple-search-btn" @click="advancedSearch">{{$t('charteredBoat.booking.advanceSearch')}}</span>
      </div>
    </topSearchItems>

    <div v-show="pages.list===currentPage" class="booking">
      <div
        class="list-panel"
        style="width: 100%"
      >
        <!--        <div>-->
        <!--          <panel-group :data="panelData" />-->
        <!--        </div>-->
        <div style="display: flex;flex-direction: column;flex-grow: 2">
          <!--          <div style="font-size:16px;font-weight: bold">订舱记录列表</div>-->
          <div style="display: flex;justify-content: space-between;margin: 10px 0px;">
            <div class="list-btn">
              <!--       运营端       -->
              <el-button type="primary" size="mini" @click="confirmBooking">{{$t('charteredBoat.booking.sendBookingEmail')}}</el-button>
<!--              <el-button type="primary" size="mini" @click="allotSuitcase">提箱点分配</el-button>-->
              <el-button type="primary" size="mini" @click="cancelBooking">{{$t('charteredBoat.booking.cancelBooking')}}</el-button>
            </div>
            <!--            <div>-->
            <!--              <el-input-->
            <!--                v-model="searchForm.keyword"-->
            <!--                size="mini"-->
            <!--                :placeholder="$t('common.placeholder')"-->
            <!--                @keyup.enter.native="refreshList(true)"-->
            <!--              >-->
            <!--                <i-->
            <!--                  slot="suffix"-->
            <!--                  style="line-height: normal;padding: 7px;"-->
            <!--                  class="el-icon-search"-->
            <!--                  @click="refreshList(true)"-->
            <!--                />-->
            <!--              </el-input>-->
            <!--            </div>-->
          </div>
          <div style="flex-grow: 2">
            <el-tabs v-model="currentState" type="border-card" size="mini" @tab-click="handleTabsClick">
              <el-tab-pane v-for="(tab,index) in tabs" :key="index" :lazy="tab.lazy" :label="tab.label+`(${tab.total})`" :name="tab.name">
                <booking-list
                  :key="index+'-booking-list'"
                  :ref="'tab-'+tab.name"
                  :panel-data="panelData"
                  :status="tab.status"
                  :search-form="searchForm"
                  @edit="toShowDetail($event,'edit')"
                  @audit="toShowDetail($event,'audit')"
                  @updatePanel="statisticNumList"
                  @success="onGetListSuccess"
                  @fail="onGetListFail"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <!-- step2 订舱详情   -->
    <booking-detail v-if="currentPage===pages.detail" :loading.sync="loading" :order-id="bookingDetail.orderId" :terminal="bookingDetail.terminal" :source="bookingDetail.from" @backList="backList" />

    <!--    提箱点分配弹框-->
    <el-dialog
      v-if="suitcase.showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="$t('charteredBoat.booking.allotYard')"
      :visible.sync="suitcase.showDialog"
      width="1000px"
    >
      <suitcase :data="suitcase.list" :container-size-type-qty="suitcase.containerSizeTypeQty" :visible.sync="suitcase.showDialog" :order-id="suitcase.orderId" :sailing-id="suitcase.sailingId" :pol-code="suitcase.polCode" @success="allotSuitcaseSuccess" />
    </el-dialog>
  </div>
</template>

<script>
import panelGroup from './components/booking/panelGroup'
import { getStatistics4List, cancelBooking, confirmCancelBooking, sendBookingConfirm, getAddressList } from '@/api/charteredBoat/booking4Manager'
import bookingList from './components/booking/bookingList'
import bookingDetail from './components/booking/bookingDetail'
import suitcase from './components/booking/suitcase'
import topSearchItems from '@/views/cargo/v0/CharteredBoat/components/topSearchItems'
import URL from '@/api/urlTranslator'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import remoteSearchSelector from '@/views/cargo/v0/CharteredBoat/components/remoteSearchSelector'
// 订舱状态定义
const all = 'all' // 全部
const toAudit = 'toAudit' // 待审核
const rejected = 'rejected' // 被驳回拒绝
const throughed = 'throughed' // 已通过
const draft = 'draft' // 草稿
const canceled = 'canceled' // 已取消
const states = {
  all, toAudit, rejected, throughed, draft, canceled
}
const pages = {
  detail: 'detail',
  list: 'list',
  submitSuccess: 'submitSuccess',
  chooseLine: 'chooseLine'
}
// const colors = {
//   success: '#67C23A',
//   warning: '#E6A23C',
//   danger: '#F56C6C',
//   info: '#909399'
// }
export default {
  name: 'Booking',
  components: {
    panelGroup, bookingList, bookingDetail, suitcase, topSearchItems, cargoAdvanceSelect, remoteSearchSelector
  },
  data() {
    return {
      loading: false,
      pages,
      url: URL,
      currentPage: pages.list,
      states,
      bookingDetail: {
        data: {},
        orderId: '', // 订单id
        terminal: 'manager', // user 用户端，manager 运营端
        from: '' // 来源（edit/add/copy/audit/）
      },
      suitcase: {
        showDialog: false,
        containerSizeTypeQty: '',
        orderId: '',
        polCode: '',
        sailingId: '',
        list: []
      },
      tabs: [ // tabs页面的控制数据 订舱状态-1草稿1待审核2已通过3已驳回4已取消

      ],
      currentState: states.all,
      searchedTabs: [], // 存放已经查询过的tab，目的为了切换tabs时，不重新请求
      searchForm: {
        advancedSearch: false,
        keyword: '', // 关单号
        soNo: '',
        polCode: '',
        podCode: '',
        vessel: '',
        voyage: '',
        memberId: ''
      },
      panelData: [],
      grid: {
        total: 0
      },
      simpleSearch: false,
      VUE_APP_BASE_API: ''
    }
  },
  created() {
    // 1、获取面板统计数据
    // 2、刷新列表
    // this.refreshList(true)
    // this.statisticNumList()
  },
  mounted() {
  },
  beforeRouteEnter(to, form, next) {
    next(vm => {
      // 1、获取面板统计数据
      // 2、刷新列表
      vm.statisticNumList()
      vm.refreshList(true)
    })
  },
  methods: {
    topSearch() {
      this.getList()
    },
    searchFormReset() { // 搜索重置
      this.$refs.searchForm.resetFields()
      this.searchForm.keyword = ''
      this.$refs.podCodeSelect.value = null
      this.$refs.polCodeSelect.value = null
      this.topSearch()
    },
    advancedSearch() {
      this.searchForm.keyword = ''
      this.$refs.polCodeSelect.value = null
      this.$refs.podCodeSelect.value = null
      this.simpleSearch = !this.simpleSearch
      this.searchForm.advancedSearch = !this.searchForm.advancedSearch
      this.$nextTick(() => {
        this.$refs.searchForm.resetFields()
      })
    },
    /** 选中装货港 */
    getItemFromChild(val, key) {
      this.searchForm[key] = val.code5
      this.getList()
    },
    statisticNumList() {
      this.tabs = [{ name: states.all, label: this.$t('common.all'), lazy: false, status: '', total: 0 },
        { name: states.toAudit, label: this.$t('common.waitForVerify'), lazy: true, status: 1, total: 0, calc: true },
        { name: states.rejected, label: this.$t('common.rejected'), lazy: true, status: 3, total: 0, calc: true },
        { name: states.throughed, label: this.$t('common.passed'), lazy: true, status: 2, total: 0, calc: true },
        { name: states.canceled, label: this.$t('common.verifyFailed'), lazy: true, status: 4, total: 0, calc: true }]
      getStatistics4List(this.searchForm).then(res => {
        // const initData = [
        //   { statusName: '待审核', count: 0, status: 1, color: colors.warning },
        //   { statusName: '已通过', count: 0, status: 2, color: colors.success },
        //   { statusName: '已驳回', count: 0, status: 3, color: colors.danger }
        // ]
        if (res.ok) {
          let allTotal = 0// 全部的数量
          this.tabs.forEach(item => {
            if (item.name === this.states.all) {
              return
            }
            const r = res.content.find(e => e.status === item.status)
            if (r) {
              item.total = r.count
              if (item.calc) {
                allTotal += Number(r.count)
              }
            }
          })
          this.tabs.find(item => item.name === this.states.all).total = allTotal || 0
        } else {
          this.$message.error(this.$t('charteredBoat.booking.statisticInfo'))
        }
      })
    },
    cancelBooking() {
      const selectedRows = this.$refs[`tab-${this.currentState}`][0].getSelectedRows()
      if (selectedRows.length !== 1) {
        this.$alert(this.$t('charteredBoat.booking.cancelBookingEmptyError'), {
          confirmButtonText: this.$t('common.confirmBtn')
        })
      } else {
        this.$confirm(this.$t('charteredBoat.booking.cancelBookingConfirm'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.confirmBtn'),
          cancelButtonText: this.$t('common.cancelBtn'),
          type: 'warning'
        }).then(async() => {
          // 调后端接口
          await cancelBooking(selectedRows[0].id).then(async res => {
            if (res.ok) {
              // if (res.content !== '710117') {
              //   this.refreshList(true)
              //   this.$message.success('取消订舱成功!')
              // } else {
              // // 通过错误code区分是否二次弹框，对于存在已作业的
              //   this.$confirm('部分箱子可能已经开始作业，取消后当前SO所关联的提单信息将被删除，是否继续？', this.$t('common.tips'), {
              //     confirmButtonText: this.$t('common.confirmBtn'),
              //     confirmButtonText: this.$t('common.cancelBtn'),
              //     type: 'warning'
              //   }).then(() => {
              //     confirmCancelBooking(selectedRows[0].id).then(res => {
              //       if (res.ok) {
              //         this.$message.success('取消订舱成功!')
              //         this.refreshList(true)
              //       } else {
              //         this.$message.error('取消订舱失败!')
              //       }
              //     })
              //   })
              // }
            }
            // else {
            //   this.$message.error('取消订舱失败!')
            // }
          })
        }).catch(() => {
          // this.$message('已取消删除')
        })
      }
    },
    allotSuitcaseSuccess() {
      this.refreshList(true)
    },
    allotSuitcase() {
      // 分配提箱点-仅一条数据
      const selectedRows = this.$refs[`tab-${this.currentState}`][0].getSelectedRows()
      if (selectedRows.length !== 1) {
        this.$alert(this.$t('charteredBoat.booking.allotInfoEmptyError'), {
          confirmButtonText: this.$t('common.confirmBtn')
        })
      } else {
        // 打开弹框,要调接口
        const row = selectedRows[0]
        // 判断订舱记录状态 是否为已通过
        if (row.status === 2) {
          this.suitcase.orderId = selectedRows[0].id
          this.suitcase.polCode = selectedRows[0].polCode
          this.suitcase.sailingId = selectedRows[0].sailingId
          this.suitcase.containerSizeTypeQty = selectedRows[0].containerSizeTypeQty
          // 校验是否有可分配的箱子
          getAddressList(this.suitcase.orderId).then(res => {
            if (res.ok) {
              if (this.$isNotEmpty(res.content && res.content.distributeContainers)) {
                this.suitcase.showDialog = true
              } else {
                this.$alert(this.$t('charteredBoat.booking.noneAllotTips'), {
                  confirmButtonText: this.$t('common.confirmBtn')
                })
                return
              }
            }
          })
        } else {
          this.$message.error(this.$t('charteredBoat.booking.nonePassedInfoTips'))
        }
      }
    },
    async confirmBooking() {
      // 发送订舱确认
      const selectedRows = this.$refs[`tab-${this.currentState}`][0].getSelectedRows()
      if (!selectedRows.length) {
        this.$message.warning(this.$t('charteredBoat.booking.selectInfoEmptyTips'))
        return
      }
      // 判断订舱记录状态 是否为已通过
      const index = selectedRows.findIndex(item => item.status !== 2)
      if (index === -1) {
        const ids = selectedRows.map(item => item.id)
        sendBookingConfirm(ids).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('charteredBoat.booking.sendSuccess'))
          } else {
            this.$message.success(this.$t('charteredBoat.booking.sendFailed'))
          }
        })
      } else {
        this.$alert(this.$t('charteredBoat.booking.selectInfoErrorMessage'), {
          confirmButtonText: this.$t('common.confirmBtn')
        })
      }
    },
    backList() {
      // 返回列表
      this.loading = false
      this.currentPage = this.pages.list
      this.refreshList(true)
      this.statisticNumList()
    },
    toShowDetail(order, source) {
      this.bookingDetail.from = source
      this.bookingDetail.orderId = order.id
      this.currentPage = this.pages.detail
    },
    onGetListSuccess(total) {
      this.searchedTabs.push(this.currentState)
      this.loading = false
    },
    onGetListFail() {
      this.loading = false
    },
    getList() {
      // if (!this.searchForm.keyword) {
      //   this.$message.warning('请输入关键字')
      // } else {
      //   this.refreshList(true)
      // }
      this.refreshList(true)
      this.statisticNumList()
    },
    refreshList(focusRefresh = false) {
      this.$nextTick(() => {
        // 如果强刷或者 初次查询 则发起请求
        if (focusRefresh || !this.searchedTabs.includes(this.currentState)) {
          this.loading = true
          this.$refs[`tab-${this.currentState}`][0].getList()
        }
      })
    },
    handleTabsClick(state) {
      this.refreshList(state)
    }
  }
}
</script>
<style lang="scss">
.booking-main {
  height: 100%;
  .el-grid-header {
    div {
      text-align: center;
    }
  }

  .el-grid-header-required {
    th:not(.not-required){
      div:before {
        content: '*';
        font-size: 20px;
        position: absolute;
        top: 3px;
        width: 20px;
        margin-left: -15px;
        display: inline-block;
        height: 50%;
        color: red
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.booking {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  overflow-x: hidden;
  height: 100%;

  .list-panel {
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    padding: 0 20px;
  }
}
.simple-search-btn{ color: #409EFF; line-height: 28px; cursor: pointer; margin-left: 15px; }
</style>
