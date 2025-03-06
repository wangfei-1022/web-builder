<template>
  <div
    style="padding: 10px;"
    class="app-main-inner"
  >
    <search-item
      v-show="true"
      ref="searchItem"
      source-page="se"
      :is-sea-export-job-list="true"
      :sim-url="url.si.seJob"
      :adv-url="url.si.seJobAdv"
      search-item-code="海运出口"
      search-item-mode="querydata"
      :searchItemsDefault="true"
      config-module="100"
      @mode-switched="resetHeight"
      @advSearchItemCallBack="foo"
      @simSearchItemCallBack="foo"
      @toggle-is-showing-more-search-condition="handleIsShowingMoreSearchConditionToggle"
      @queryDataCallBack="filterJobListWithSearchResult"
    />
    <div
      v-show="isShowingSummary"
      class="dashboard"
      style="background-color: #fff; display: flex; justify-content: space-between; border-top:2px solid #fff;border-bottom:3px solid #fff"
    >
      <div
        class="dashboard-left"
        style="display:flex"
      >
        <div class="pane color-orange">
          <div class="pane-line">
            <div class="pane-line-left">
              <svg-icon icon-class="yibiao-jieguan" />
            </div>
            <div class="pane-line-center">今日截关</div>
            <div class="pane-line-right">19</div>
          </div>
          <div class="pane-line">
            <div class="pane-line-left">
              <svg-icon icon-class="yibiao-kaichuan" />
            </div>
            <div class="pane-line-center">今日开航</div>
            <div class="pane-line-right">35</div>
          </div>
        </div>
        <div class="pane color-green">
          <div class="pane-line">
            <div class="pane-line-left">
              <svg-icon icon-class="yibiao-tijiao" />
            </div>
            <div class="pane-line-center">提交待审</div>
            <div class="pane-line-right">12</div>
          </div>
          <div class="pane-line">
            <div class="pane-line-left">
              <svg-icon icon-class="yibiao-bohui" />
            </div>
            <div class="pane-line-center">审核驳回</div>
            <div class="pane-line-right">06</div>
          </div>
        </div>
        <div class="pane color-blue">
          <div class="pane-line">
            <div class="pane-line-left">
              <svg-icon icon-class="yibiao-jinjikaipiao" />
            </div>
            <div class="pane-line-center">紧急开票</div>
            <div class="pane-line-right">02</div>
          </div>
          <div class="pane-line">
            <div class="pane-line-left">
              <svg-icon icon-class="yibiao-zhengchangkaipiao" />
            </div>
            <div class="pane-line-center">正常开票</div>
            <div class="pane-line-right">11</div>
          </div>
        </div>
        <div class="pane color-pink">
          <div class="pane-line">
            <div class="pane-line-left">
              <svg-icon icon-class="yibiao-yujing" />
            </div>
            <div class="pane-line-center">提醒预警</div>
            <div class="pane-line-right">17</div>
          </div>
          <div class="pane-line">
            <div class="pane-line-left">
              <svg-icon icon-class="yibiao-yuqidaiban" />
            </div>
            <div class="pane-line-center">逾期待办</div>
            <div class="pane-line-right">01</div>
          </div>
        </div>
        <div class="pane color-cyan">
          <div class="pane-line">
            <div class="pane-line-left">
              <svg-icon icon-class="yibiao-jishilv" />
            </div>
            <div class="pane-line-center">本期及时率</div>
            <div class="pane-line-right">99.36%</div>
          </div>
          <div class="pane-line">
            <div class="pane-line-left">
              <svg-icon icon-class="yibiao-chachuolv" />
            </div>
            <div class="pane-line-center">本期差错率</div>
            <div class="pane-line-right">0.52%</div>
          </div>
        </div>
        <div
          class="pane color-cyan"
          style="text-align: center; border: 2px dashed #b6c9df;"
        >
          <i
            class="el-icon-plus"
            style="font-size: 30px;color:#97a8be;line-height:2"
          />
        </div>
      </div>
      <div class="dashboard-right" />
    </div>
    <div
      class="operate-buttons"
      style="display: flex; justify-content: space-between; background-color: #f5f7f7; padding: 8px;border-bottom:5px solid #fff"
    >
      <div class="operate-buttons-left">
        <!--{{ dynamicHeightFactor }}, {{ isShowingMoreSearchCondition }}, {{ searchItemHeight }}-->
        <el-button
          v-permission="['se:job:add']"
          type="primary"
          size="mini"
          @click="toCreateSeaExportJob"
        >新建</el-button>
        <!-- <el-button
          v-permission="['se:job:addconsol']"
          type="primary"
          size="mini"
          @click="toCreateSeaExportJobOfConsol"
        >新建主票</el-button> -->
        <el-button
          v-permission="['se:job:copy']"
          type="primary"
          size="mini"
          @click="toShowCopyJobDialog"
        >复制</el-button>
        <el-button
          v-permission="['se:job:del']"
          type="danger"
          size="mini"
        >删除</el-button>
        <!-- <el-button
          type="primary"
          size="mini"
          @click="toShowBatchScheme"
        >计费方案</el-button> -->
        <!--<el-button v-permission="['se:job:print']" type="success" size="mini">打印</el-button>-->
        <!-- <el-button
          v-permission="['se:job:focus']"
          type="primary"
          size="mini"
          @click="toFocusOnJob"
        >关注</el-button> -->
        <!--<el-button v-permission="['se:job:focus']" type="primary" size="mini" @click="toUnFocusOnJob">取消关注</el-button>-->
        <drop-down-menu
          v-permission="['se:job:focus']"
          :ops="focusOps"
          :css-style="{'margin-left': '10px'}"
        />
      </div>
      <div class="operate-buttons-right">
        <!-- <div style="display: inline-block;margin-right: 10px;">显示模式：
          <el-radio-group
            v-model="queryShowMode"
            size="mini"
          >
            <el-radio label="">全部</el-radio>
            <el-radio label="MASTER">主票</el-radio>
            <el-radio label="LCL">小票</el-radio>
          </el-radio-group>
        </div> -->
        <!--<el-button v-show="isShowingSummary" v-permission="['se:job:summary']" type="primary" size="mini" @click="isShowingSummary=!isShowingSummary">隐藏仪表</el-button>-->
        <!--<el-button v-show="!isShowingSummary" v-permission="['se:job:summary']" type="primary" size="mini" @click="isShowingSummary=!isShowingSummary">显示仪表</el-button>-->
        <!-- <el-button
          v-permission="['se:job:visuallylcl']"
          size="mini"
          type="primary"
          @click="$router.push({name: 'VisuallyLcl'})"
        >可视化拼箱</el-button> -->
        <!--<el-button v-permission="['se:job:irs']" size="mini" type="primary">托书识别</el-button>-->
        <!--<el-button v-permission="['se:job:edi']" size="mini" type="primary">EDI</el-button>-->
        <!--<el-button v-permission="['se:job:submit']" type="primary" size="mini" @click="toBatchSubmit">提交</el-button>-->
        <drop-down-menu
          :ops="submitOps"
          :css-style="{'margin-left': '10px'}"
        />
        <drop-down-menu
          :ops="reviewOps"
          :css-style="{'margin-left': '10px'}"
        />
        <el-button
          v-permission="['se:job:cancel']"
          size="mini"
          type="danger"
        >退关</el-button>
        <!--<el-button v-permission="['se:job:batchupdate']" type="success" size="mini" @click="toShowBatchUpdateDialog">批量</el-button>-->
      </div>
    </div>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptions"
      :column-defs="columnDefs"
      :row-data="rowData"
      :enable-col-resize="true"
      :enable-sorting="true"
      :animate-rows="true"
      :grid-ready="onReady"
      :first-data-rendered="onFirstDataRendered"
      :row-double-clicked="onRowDoubleClicked"
      :pinned-bottom-row-data="pinnedBottomRowData"
      :style="listGridStyle"
      class="ag-theme-balham"
    />
    <el-dialog
      :visible.sync="isShowingCopyJobDialog"
      title="复制工作号"
    >
      <el-form
        :model="featureOfThisCopyAction"
        label-position="left"
        label-width="180px"
      >
        <el-form-item label="被复制的工作号">
          {{ jobNoToBeCopied }}, {{ clientOfJobNoToBeCopied }}
        </el-form-item>
        <el-form-item label="您需要复制生成的数量">

          <el-input-number v-model="featureOfThisCopyAction.quantity" size="mini" controls-position="right" :min="1" :max="10" />

        </el-form-item>
        <el-form-item label="请选择新工作编号规则">
          <el-select
            v-model="featureOfThisCopyAction.ruleId"
            size="mini"
          >
            <el-option
              v-for="r in ruleListForJobNoCopy"
              :key="r.id"
              :label="r.ruleExpression"
              :value="r.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工作编号规则后缀选择">
          <el-radio-group v-model="featureOfThisCopyAction.ruleSuffixType">
            <el-radio :label="0">不加后缀</el-radio>
            <el-radio :label="1">加A/B/C字母序号</el-radio>
            <el-radio :label="2">加01/02/03字母序号</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请选择需要复制的内容">
          <el-checkbox-group v-model="contentTypeArray">
            <el-checkbox
              v-for="c in CheckBoxesOfContentType"
              :key="c.key"
              :label="c.key"
              @change="takeEffect"
            >{{ c.type }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="mini"
          @click="toCopySeaExportJob"
        >复制</el-button>
        <el-button
          size="mini"
          @click="isShowingCopyJobDialog = false"
        >取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isShowingBatchUpdateDialog">
      <el-form
        :model="batchUpdateBody"
        label-width="100px"
        label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="船名">
              <el-input
                v-model="batchUpdateBody.vessel"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="航次">
              <el-input
                v-model="batchUpdateBody.voyage"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="开航日期">
              <el-date-picker
                v-model="batchUpdateBody.atd"
                style="width:100%"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="到港日期">
              <el-date-picker
                v-model="batchUpdateBody.ata"
                style="width:100%"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="起运港/POL" />
            <el-form-item label="卸货港/POD" />
            <el-form-item label="目的港" />
            <el-form-item label="目的地" />
            <el-form-item label="航线">
              <el-input
                v-model="batchUpdateBody.seaLineCode"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="订舱代理" />
            <el-form-item label="船公司" />
          </el-col>
          <el-col :span="8">
            <el-form-item label="工作号状态">
              <el-select
                v-model="batchUpdateBody.jobState"
                size="mini"
              >
                <el-option
                  :value="0"
                  label="未提交"
                />
                <el-option
                  :value="1"
                  label="待审核"
                />
                <el-option
                  :value="3"
                  label="已审核"
                />
                <el-option
                  :value="2"
                  label="已驳回"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="货物状态" />
            <el-form-item label="HBL状态">
              <el-select
                v-model="batchUpdateBody.hblConfirmState"
                size="mini"
              >
                <el-option
                  :value="0"
                  label="未确认"
                />
                <el-option
                  :value="1"
                  label="已确认"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="MBL状态">
              <el-select
                v-model="batchUpdateBody.mblConfirmState"
                size="mini"
              >
                <el-option
                  :value="0"
                  label="未确认"
                />
                <el-option
                  :value="1"
                  label="已确认"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="仓库" />
            <el-form-item label="港区" />
            <el-form-item label="场站" />
            <el-form-item label="目的港代理" />
            <el-form-item label="指定货代理" />
            <el-form-item label="船代" />
            <el-form-item label="车队" />
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售人员" />
            <el-form-item label="操作人员" />
            <el-form-item label="单证人员" />
            <el-form-item label="客服人员" />
            <el-form-item label="海外客服" />
            <el-form-item label="商务人员" />
            <el-form-item label="截关日期">
              <el-date-picker
                v-model="batchUpdateBody.closeCustomsDate"
                style="width:100%"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="截单日期">
              <el-date-picker
                v-model="batchUpdateBody.closeDocDate"
                style="width:100%"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="截港日期">
              <el-date-picker
                v-model="batchUpdateBody.closePortDate"
                style="width:100%"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="截货日期">
              <el-date-picker
                v-model="batchUpdateBody.closeCargoDate"
                style="width:100%"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="截反恐舱单" />
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          size="mini"
          @click="toBatchUpdate"
        >修改</el-button>
        <el-button
          size="mini"
          @click="isShowingBatchUpdateDialog = false"
        >取消</el-button>
      </div>
    </el-dialog>
    <job-batch-scheme-dialog
      v-if="isShowingBatchSchemeDialog"
      :job-ids="chooseJobIds"
      :is-showing-dialog="isShowingBatchSchemeDialog"
      @close="closeSchemeDialog"
    />
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import URL from '@/api/urlTranslator'
import searchItem from '@/components/Cargo/Dmn/searchItem'
import { getJobNoList, createSeaExportJob, createSeaExportJobOfConsol, copySeaExportJob, getRuleListForJobNoCopyAndSave,
  focusOnJob, unFocusOnJob, batchUpdate } from '@/api/seaExport'
import { batchAcceptJob, batchCancelAcceptJob, batchSubmitJob, batchCancelSubmitJob, batchRejectSubmitJob } from '@/api/chargeTabAtJob'
import DropDownMenu from '@/components/Cargo/DropDownMenu/v0'
import { getGridSelectedIds } from '@/utils/gridChoose'
import jobBatchSchemeDialog from '../SeaExport/components/jobBatchSchemeDialog'
import {parseTime} from '@/utils/index'

export default {
  name: 'SeaExportJobList',
  components: { AgGridVue, searchItem, DropDownMenu, jobBatchSchemeDialog },
  data() {
    return {
      queryShowMode: '', // 查询条件显示模式
      chooseJobIds: [], // 当前选择的jobIds
      isShowingBatchSchemeDialog: false,
      searchItemHeight: 0,
      focusOps: [
        { name: '关注', click: this.toFocusOnJob },
        { name: '取消关注', click: this.toUnFocusOnJob }
      ],
      submitOps: [
        { name: '提交', click: this.toBatchSubmit },
        { name: '取消提交', click: this.toBatchUnSubmit }
      ],
      reviewOps: [
        { name: '审核', click: this.toBatchVerify },
        { name: '驳回', click: this.toBatchVerifyFailed },
        { name: '取消审核', click: this.toBatchUnVerify }
      ],
      columnDefs: null,
      rowData: [],
      gridOptions: null,
      isShowingMoreSearchCondition: false,
      isShowingSummary: false,
      s1: 'month',
      s2: 'platform',
      s3: 'link',
      isShowingCopyJobDialog: false,
      featureOfThisCopyAction: {
        quantity: '',
        seJobId: '',
        jobId: '',
        ruleId: '',
        ruleSuffixType: 0,
        contentType: []
      },
      CheckBoxesOfContentType: [
        { key: 1, type: '委托信息' },
        { key: 2, type: '订舱信息' },
        { key: 3, type: '应收费用' },
        { key: 4, type: '应付费用' }
        // { key: 5, type: '自动修改结算对象' }
      ],
      ruleListForJobNoCopy: [],
      contentTypeArray: [],
      jobNoToBeCopied: '',
      clientOfJobNoToBeCopied: '',
      isShowingBatchUpdateDialog: false,
      batchUpdateBody: {
        vessel: '',
        voyage: '',
        atd: '',
        ata: '',
        seaLineCode: '',
        jobState: '',
        hblConfirmState: '',
        mblConfirmState: '',
        closeCustomsDate: '',
        closeDocDate: '',
        closePortDate: '',
        closeCargoDate: ''
      }
    }
  },
  computed: {
    url() {
      return URL
    },
    dynamicHeightFactor() { // 用于动态计算列表高度
      let least = 195
      if (this.isShowingSummary) {
        least += 115
      }
      if (this.isShowingMoreSearchCondition) {
        least += this.searchItemHeight
      }
      return least
    },
    listGridStyle() {
      const s = {
        width: '100%',
        height: `calc(100vh - ${this.dynamicHeightFactor}px)`
      }
      return s
    },
    pinnedBottomRowData() {
      return [{ jobNo: '总记录数：' + this.rowData.length }]
    }
  },
  watch: {
    queryShowMode(newVal, oldVal) {
      if (this.$refs.searchItem.preQueryMode === 'adv') {
        const queryCond = [...this.$refs.searchItem.getAdvRequestData(), { itemType: 'select', itemName: 'showModel', itemValue: newVal }]
        this.$refs.searchItem.getAdvQueryResult(queryCond)
      } else {
        this.$refs.searchItem.getSimQueryResult({ showModel: newVal })
      }
    }
  },
  beforeMount() {
    this.gridOptions = {
      rowClassRules: {
        'grid-row-zebra-even': function(params) {
          return !(params.rowIndex % 2)
        },
        'grid-row-zebra-odd': function(params) {
          return params.rowIndex % 2
        }
      },
      groupDefaultExpanded: -1,
      sideBar: { toolPanels: ['columns', 'filter'], visible: false },
      suppressRowClickSelection: true,
      rowSelection: 'multiple'
      // rowMultiSelectWithClick: true
    }

    this.columnDefs = [{
      headerName: '', width: 55, suppressSorting: true, suppressMenu: true,
      headerCheckboxSelection: true,
      suppressSizeToFit: true, suppressResize: true, checkboxSelection: true
    }, {
        headerName: '工作号',
        width: 240,
        field: 'jobNo',
        suppressSizeToFit: true,
        cellRendererParams: {
          suppressCount: true,
          checkbox: true,
          innerRenderer: params => {
            let str = params.data.bFocus ? `${params.value} <i class="iconfont icon-star" style="color: #ffa500; font-size: 14px;"></i>` : `${params.value}`
            let icon
            switch (params.data.fclLcl) {
              case 1:
                icon = 'fcllcl-F'
                break
              case 3:
                icon = 'fcllcl-L'
                break
              case 2:
                icon = 'fcllcl-P'
                break
              case 6:
                icon = 'fcllcl-C'
                break
              case 4:
                icon = 'fcllcl-M'
                break
              case 5:
                icon = 'fcllcl-S'
                break
              case 7:
                icon = 'fcllcl-B'
                break
              default:
                break
            }
            str = `<svg class="svg-icon" aria-hidden="true" style="height:1.2em;width:1.2em;">
                <use xlink:href="#icon-${icon}"></use>
              </svg> ${str}`
            return str
          }
        }
      }, {
        headerName: '工作号状态',
        field: 'jobStateDesc',
        cellRenderer(params) {
          let color = ''
          const jobState = params.data.jobState
          // switch (jobState) {
          //   // case 0: // 未提交
          //     // color = '#FAFA71'
          //     // break
          //   case 1:// 待审核
          //     color = 'blue'
          //     break
          //   case 2:// 已驳回
          //     color = 'red'
          //     break
          //   case 3:// 已审核
          //     // color = '#42B983'
          //     color = 'green'
          //     break
          //   case 5:// 已退关
          //     color = 'gray'
          //     break
          // }
          switch (jobState) {
            case 0: // 未提交
              color = '#FFFFCC'
              break
            case 1:// 待审核
              color = '#999933'
              break
            case 2:// 已驳回
              color = '#33FF66'
              break
            case 3:// 已审核
              color = '#6699CC'
              break
            case 5:// 已退关
              color = '#00CCCC'
              break
            default:
              break
          }
          // return `<span style="color:${color}">${params.value}</span>`
          return params.value ? `<span style="background-color:${color};display:block;height:100%;width:100%;">${params.value}</span>` : ''
        }
      },
      { headerName: 'id-海出工作号ID', field: 'id', hide: true },
      { headerName: 'jobId-工作号ID', field: 'jobId', hide: true },
      // { headerName: '工作号', field: 'jobNo' },
      { headerName: '委托单位', field: 'customerName' },
      {
        headerName: '委托单位简称',
        field: 'customerAbbreviation'
      }, {
        headerName: '承运人简称',
        field: 'carrierCode'
      },
      { headerName: '发货单位', field: 'clientName' },
      { headerName: '结算方式', field: 'settlementModeDesc' },
      { headerName: '揽货方式', field: 'saleMode' },
      { headerName: '指定货代理', field: 'nominatedAgentName' },
      { headerName: '收货地', field: 'receipt' },
      { headerName: '起运港/POL', field: 'pol' },
      { headerName: '中转港', field: 'trans' },
      { headerName: '卸货港/POD', field: 'pod' },
      { headerName: '目的港', field: 'destination' },
      { headerName: '最终目的地', field: 'delivery' },
      { headerName: '开航日期', field: 'etd',
        cellRenderer: params => parseTime(params.value, '{y}-{m}-{d}')
      },
      { headerName: '箱型箱量', field: 'ctnrNote' },
      { headerName: 'TEU', field: 'teu' },
      { headerName: '货物类型', field: 'cargoTypeDesc' },
      { headerName: '中文品名', field: 'cnGoodsName' },
      { headerName: '英文品名', field: 'enGoodsName' },
      { headerName: '唛头', field: 'marks' },
      { headerName: '包装类型', field: 'packageTypeDesc' },
      { headerName: '计费重量', field: 'chargeableWeight' },
      { headerName: 'HS CODE', field: 'hscode' },
      { headerName: '项目编号', field: 'projectNo' },
      { headerName: 'P/O编号', field: 'poNo' },
      { headerName: '船公司', field: 'carrierName' },
      { headerName: 'H运输条款', field: 'hTransportTermDesc' },
      { headerName: 'M运输条款', field: 'mTransportTermDesc' },
      { headerName: 'H运费条款', field: 'hFreightTerm' },
      { headerName: 'M运费条款', field: 'mFreightTerm' },
      { headerName: '客户参考号', field: 'customerJobNo' },
      { headerName: '客户协议号', field: 'customerContractNo' },
      { headerName: '贸易成交方式', field: 'tradeTerm' },
      { headerName: '出单类型', field: 'blSignTypeDesc' },
      { headerName: '签发方式', field: 'blIssueTypeDesc' },
      { headerName: '操作人员', field: 'opByName' },
      { headerName: '销售人员', field: 'saleByName' },
      { headerName: '单证人员', field: 'docByName' },
      { headerName: '客服人员', field: 'csByName' },
      { headerName: '海外客服', field: 'osByName' },
      { headerName: '商务人员', field: 'busByName' },
      { headerName: '客户特殊需求', field: 'customerRequire' },
      { headerName: '工作号备注', field: 'jobRemark' },
      { headerName: '船务代理', field: 'shippingAgentName' },
      { headerName: '订舱代理', field: 'bookingAgentName' },
      { headerName: '关单号', field: 'soNo' },
      { headerName: 'MB/L编号', field: 'mblNo' },
      { headerName: '订舱编号', field: 'bookingNo' },
      { headerName: '船东约号', field: 'bookingContractNo' },
      { headerName: 'HB/L编号', field: 'hblNo' },
      { headerName: '进仓编号', field: 'warehouseNo' },
      //      { headerName: '中转港代码', field: 'transCode' },
      { headerName: '发货人属性', field: 'bookingShprProperty' },
      { headerName: '截关日期', field: 'closeCustomsDate',
        cellRenderer: params => parseTime(params.value, '{y}-{m}-{d}')
       },
      { headerName: '车队', field: 'truckName' },
      { headerName: '仓库', field: 'warehouseName' },
      { headerName: '报关行', field: 'customsBrokerName' },
      { headerName: '场站', field: 'cfsName' },
      { headerName: '目的港代理', field: 'destinationAgentName' },
      { headerName: '港区', field: 'yardName' },

      { headerName: '整拼类型', field: 'fclLclTypeDesc', hide: true },
      { headerName: 'jobState', field: 'jobState', hide: true },
      { headerName: '件数(委/实)',
        cellRenderer: params => params.data.orderQuantity + ' / ' + params.data.actualQuantity, hide: true
      },
      { headerName: '毛重(委/实)',
        cellRenderer: params => params.data.orderGrossWeight + ' / ' + params.data.actualGrossWeight, hide: true
      },
      { headerName: '体积(委/实)',
        cellRenderer: params => params.data.orderVolume + ' / ' + params.data.actualVolume, hide: true
      },
      { headerName: '船名', field: 'vessel', hide: true },
      { headerName: '航次', field: 'voyage', hide: true }
    ]

    getJobNoList().then(res => {
      this.rowData = res.content.list
    }).then(() => {
      this.updateStepList()
    })
  },
  methods: {
    onReady(params) {
      const self = this
      window.addEventListener('resize', function() {
        setTimeout(function() {
          self.onFirstDataRendered()
        })
      })
    },
    onFirstDataRendered() {
      const self = this
      const allColumnIds = []
      self.gridOptions.columnApi.getAllColumns().forEach(function(column) {
        allColumnIds.push(column.colId)
      })
      setTimeout(function() {
        self.gridOptions.columnApi.autoSizeColumns(allColumnIds)
      })
    },
    onRowDoubleClicked(event) {
      console.log(event)
      if (!event.node.data.id) {
        return
      }
      let jobNoHistory = []
      if (window.localStorage.getItem('jobNoHistoryArrayInString')) {
        jobNoHistory = window.localStorage.getItem('jobNoHistoryArrayInString').split(',')
        jobNoHistory = jobNoHistory.filter(h => h.split(':')[1] !== event.node.data.id) // 确保当前双击打开的一票加到数组末尾
        if (jobNoHistory.length > 10) {
          jobNoHistory = jobNoHistory.slice(1)
        } // 限制总长度，不需要记录太多
      }
      jobNoHistory.push(event.node.data.jobNo + ':' + event.node.data.id + ':' + event.node.data.jobId + ':' + event.node.data.fclLcl)
      window.localStorage.setItem('jobNoHistoryArrayInString', jobNoHistory.toString())
      this.toEditSeaExportJob(event.node.data.id, event.node.data.jobId, event.node.data.bMaster)
    },
    toEditSeaExportJob(id, jobId, bMaster) {
      if (bMaster) {
        return this.$router.push({ name: 'SeaExportOperateConsol', query: { id, jobId }})
      }
      this.$router.push({ name: 'SeaExportOperate', query: { id, jobId }})
    },
    toCreateSeaExportJob() {
      createSeaExportJob().then(res => {
        const id = res.content.id
        const jobId = res.content.jobId
        this.$router.push({ name: 'SeaExportOperate', query: { id, jobId }})
      })
    },
    toCreateSeaExportJobOfConsol() {
      createSeaExportJobOfConsol().then(res => {
        const id = res.content.id
        const jobId = res.content.jobId
        this.$router.push({ name: 'SeaExportOperateConsol', query: { id, jobId }})
      })
    },
    closeSchemeDialog() {
      this.isShowingBatchSchemeDialog = false
    },
    toShowBatchScheme() {
      getGridSelectedIds(this.gridOptions, 'jobId').then(ids => {
        this.chooseJobIds = ids
        this.isShowingBatchSchemeDialog = true
        console.log('this.isShowingBatchSchemeDialog', this.isShowingBatchSchemeDialog)
      }).catch(() => {
        // todo
      })
    },
    toShowCopyJobDialog() {
      const selectedRows = this.gridOptions.api.getSelectedRows()
      if (selectedRows.length !== 1) {
        return this.$message.warning('请选择一票将要被复制的工作号...')
      }
      const rowOfJobToBeCopied = selectedRows[0]
      this.jobNoToBeCopied = rowOfJobToBeCopied.jobNo
      this.clientOfJobNoToBeCopied = rowOfJobToBeCopied.customerName
      this.featureOfThisCopyAction = {
        quantity: '',
        seJobId: rowOfJobToBeCopied.id,
        jobId: rowOfJobToBeCopied.jobId
      }
      getRuleListForJobNoCopyAndSave({ identifierType: 2 }).then(res => {
        this.ruleListForJobNoCopy = res.content
        this.featureOfThisCopyAction.ruleId = this.ruleListForJobNoCopy[0].id
        this.isShowingCopyJobDialog = true
      })
    },
    toCopySeaExportJob() {
      copySeaExportJob(this.featureOfThisCopyAction).then(res => {
        if (res.ok) {
          this.$message.success('复制成功')
          getJobNoList().then(res => {
            this.rowData = res.content.list
            this.isShowingCopyJobDialog = false
          }).then(() => {
            this.updateStepList()
          })
        }
      })
    },
    takeEffect() {
      this.featureOfThisCopyAction.contentType = this.contentTypeArray
    },
    toFocusOnJob() {
      const selectedRows = this.gridOptions.api.getSelectedRows()
      if (selectedRows.length === 0) {
        return this.$message.warning('请选择要关注的工作号')
      }
      const jobsToFocus = []
      selectedRows.forEach(r => {
        jobsToFocus.push({ businessId: r.id, focusType: 100 }) // 海出就用100
      })
      focusOnJob(jobsToFocus).then(res => {
        if (res.ok) {
          this.$message.success('关注成功')
        }
      }).then(() => getJobNoList()).then(res => {
        this.rowData = res.content.list
      })
.then(() => {
        this.updateStepList()
      })
    },
    toUnFocusOnJob() {
      const selectedRows = this.gridOptions.api.getSelectedRows()
      if (selectedRows.length === 0) {
        return this.$message.warning('请选择要取消关注的工作号')
      }
      let businessIds = ''
      selectedRows.forEach(r => {
        businessIds += `${r.id},`
      })
      businessIds = businessIds.substr(0, businessIds.length - 1)
      unFocusOnJob({ businessIds }).then(res => {
        if (res.ok) {
          this.$message.success('已取消关注')
        }
      }).then(() => getJobNoList()).then(res => {
        this.rowData = res.content.list
      })
.then(() => {
        this.updateStepList()
      })
    },
    toBatchSubmit() { // 提交
      const selectedRows = this.gridOptions.api.getSelectedRows()
      if (selectedRows.length === 0) {
        return this.$message.warning('请选择要提交的工作号')
      }
      const ids = []
      selectedRows.forEach(r => {
        ids.push(r.jobId)
      })
      batchSubmitJob(ids).then(res => {
        if (res.ok) {
          this.$message.success(`提交成功`)
        }
      }).then(() => getJobNoList()).then(res => {
        this.rowData = res.content.list
      })
.then(() => {
        this.updateStepList()
      })
    },
    toBatchUnSubmit() { // 取消提交
      const selectedRows = this.gridOptions.api.getSelectedRows()
      if (selectedRows.length === 0) {
        return this.$message.warning('请选择要取消提交的工作号')
      }
      const ids = []
      selectedRows.forEach(r => {
        ids.push(r.jobId)
      })
      batchCancelSubmitJob(ids).then(res => {
        if (res.ok) {
          this.$message.success(`取消提交成功`)
        }
      }).then(() => getJobNoList()).then(res => {
        this.rowData = res.content.list
      })
.then(() => {
        this.updateStepList()
      })
    },
    toBatchVerify() { // 审核
      const selectedRows = this.gridOptions.api.getSelectedRows()
      if (selectedRows.length === 0) {
        return this.$message.warning('请选择要审核的工作号')
      }
      const ids = []
      selectedRows.forEach(r => {
        ids.push(r.jobId)
      })
      batchAcceptJob(ids).then(res => {
        if (res.ok) {
          this.$message.success(`审核成功`)
        }
      }).then(() => getJobNoList()).then(res => {
        this.rowData = res.content.list
      })
.then(() => {
        this.updateStepList()
      })
    },
    toBatchVerifyFailed() { // 驳回
      const selectedRows = this.gridOptions.api.getSelectedRows()
      if (selectedRows.length === 0) {
        return this.$message.warning('请选择要驳回的工作号')
      }
      const ids = []
      selectedRows.forEach(r => {
        ids.push(r.jobId)
      })
      batchRejectSubmitJob(ids).then(res => {
        if (res.ok) {
          this.$message.success(`驳回成功`)
        }
      }).then(() => getJobNoList()).then(res => {
        this.rowData = res.content.list
      })
.then(() => {
        this.updateStepList()
      })
    },
    toBatchUnVerify() { // 取消审核
      const selectedRows = this.gridOptions.api.getSelectedRows()
      if (selectedRows.length === 0) {
        return this.$message.warning('请选择要取消审核的工作号')
      }
      const ids = []
      selectedRows.forEach(r => {
        ids.push(r.jobId)
      })
      batchCancelAcceptJob(ids).then(res => {
        if (res.ok) {
          this.$message.success(`取消审核成功`)
        }
      }).then(() => getJobNoList()).then(res => {
        this.rowData = res.content.list
      })
.then(() => {
        this.updateStepList()
      })
    },
    toShowBatchUpdateDialog() {
      const selectedRows = this.gridOptions.api.getSelectedRows()
      if (selectedRows.length === 0) {
        return this.$message.warning('请选择要修改的工作号')
      }
      this.batchUpdateBody.jobIdList = []
      selectedRows.forEach(r => {
        this.batchUpdateBody.jobIdList.push({
          seJobId: r.id,
          jobId: r.jobId
        })
      })
      this.isShowingBatchUpdateDialog = true
    },
    toBatchUpdate() {
      batchUpdate(this.batchUpdateBody).then(res => {
        if (res.ok) {
          this.$message.success('批量修改成功')
        }
      }).then(() => getJobNoList()).then(res => {
        this.rowData = res.content.list
        this.isShowingBatchUpdateDialog = false
      })
    },
    updateStepList() {
      // 每次查过之后记录结果，“上一票”或“下一票”应该按照这个查询结果跳
      const stepList = []
      let index = 0
      this.rowData.forEach(r => {
        stepList.push(`${r.jobNo}:${r.id}:${r.jobId}:${r.fclLcl}:${index}`)
        index++
      })
      // console.log(stepList)
      window.localStorage.setItem('stepList', stepList.toString())
    },
    foo(data) {
      console.log(data, 'do nothing here')
    },
    filterJobListWithSearchResult(data) {
      // console.log('filterJobListWithSearchResult', data)
      this.rowData = data.list
    },
    handleIsShowingMoreSearchConditionToggle(isShowingMoreSearchCondition) {
      this.isShowingMoreSearchCondition = isShowingMoreSearchCondition
      const self = this
      setTimeout(() => {
        self.searchItemHeight = document.querySelector('.more-search-condition').offsetHeight
      })
    },
    resetHeight() {
      const self = this
      setTimeout(() => {
        self.searchItemHeight = document.querySelector('.more-search-condition').offsetHeight
      })
    }
  }
}
</script>
<style>
.el-input--mini .el-input__suffix-inner .el-input__icon {
  height: 28px;
}
.search-bar-right {
  /*padding-top: 6px;*/
}
.search-bar-right .el-button--mini {
  height: 28px;
  margin-left: 4px;
  margin-right: 8px;
}
.more-search-condition .el-form-item {
  margin-bottom: 4px;
}
.more-search-condition .el-date-editor {
  width: 208px;
}
.dashboard {
  padding: 10px;
}
.pane {
  font-size: 12px;
  background-color: #fff;
  border: 1px solid #fff;
  width: 240px;
  margin-right: 20px;
  padding: 10px;
  box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.2);
}
.pane svg {
  font-size: 25px;
}
/*.color-orange{border: 1px solid orange}*/
.color-orange .pane-line-right,
.color-orange svg {
  color: #fba437;
}
/*.color-green{border: 1px solid darkseagreen}*/
.color-green .pane-line-right,
.color-green svg {
  color: #7eba0d;
}
/*.color-blue{border: 1px solid deepskyblue}*/
.color-blue .pane-line-right,
.color-blue svg {
  color: #3acdd7;
}
/*.color-pink{border: 1px solid pink}*/
.color-pink .pane-line-right,
.color-pink svg {
  color: #fc620d;
}
/*.color-cyan{border: 1px solid limegreen}*/
.color-cyan .pane-line-right,
.color-cyan svg {
  color: #7db90d;
}

.pane-line {
  display: flex;
  justify-content: space-between;
  padding-left: 9px;
  padding-right: 9px;
}
.pane .pane-line:last-child {
  padding-top: 10px;
}
.pane .pane-line:first-child {
  padding-top: 5px;
}
.pane-line-center,
.pane-line-center {
  height: 24px;
  line-height: 24px;
}
.pane-line-right {
  width: 37%;
  font-size: 22px;
  text-align: right;
}
.mission {
  background-color: #fff;
  border: 1px solid #ccc;
  width: 200px;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  padding-left: 8px;
  margin-bottom: 6px;
}
.el-button-group .el-button--primary:last-child {
  height: 28px;
}
/*.ag-pinned-left-cols-viewport{*/
/*overflow: hidden;*/
/*}*/
</style>
