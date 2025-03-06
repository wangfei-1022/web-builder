<template>
  <div class="air-page" v-loading="loading" style="padding: 20px;">
    <topSearchItems :show-single-input="false" class="mb-20">
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="filter" label-width="80px">
            <el-form-item label="询盘流水号:">
              <el-input
v-model.trim="filter.vesselName"
maxlength="50"
                        :placeholder="$t('ETDInfoTable.placeholderInput')+$t('ETDInfoTable.vesselName')"
size="mini"
                        clearable
@keyup.enter.native="list"/>
            </el-form-item>
            <el-form-item label="装货港:">
              <el-input
v-model.trim="filter.voyageNo"
maxlength="50"
                        :placeholder="$t('ETDInfoTable.placeholderInput')+$t('ETDInfoTable.voyageNo')"
size="mini"
                        clearable
@keyup.enter.native="list"/>
            </el-form-item>
            <el-form-item label="卸货港:">
              <el-input
v-model.trim="filter.carrierName"
maxlength="50"
                        :placeholder="$t('ETDInfoTable.placeholderInput')+$t('ETDInfoTable.shipowner')"
size="mini"
                        clearable
@keyup.enter.native="list"/>
            </el-form-item>
            <el-form-item label="委托单位:">
              <el-input
v-model.trim="filter.callSign"
maxlength="30"
                        :placeholder="$t('ETDInfoTable.placeholderInput')+$t('ETDInfoTable.callSign')"
size="mini"
                        clearable
@keyup.enter.native="list"/>
            </el-form-item>
            <el-form-item label="航空公司:">
              <el-input
v-model.trim="filter.callSign"
maxlength="30"
                        :placeholder="$t('ETDInfoTable.placeholderInput')+$t('ETDInfoTable.callSign')"
size="mini"
                        clearable
@keyup.enter.native="list"/>
            </el-form-item>
            <el-form-item label="询盘状态:">
              <el-input
v-model.trim="filter.callSign"
maxlength="30"
                        :placeholder="$t('ETDInfoTable.placeholderInput')+$t('ETDInfoTable.callSign')"
size="mini"
                        clearable
@keyup.enter.native="list"/>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <div slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="list">{{ $t('table.search') }}</el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="reset()">{{ $t('table.resetColumns') }}</el-button>
        <el-button type="primary" size="mini" @click="edit()">新增</el-button>
      </div>
    </topSearchItems>


    <el-tabs v-model="activeName" @tab-click="handleClick"  type="border-card">
      <el-tab-pane label="全部(255)" name="1"></el-tab-pane>
      <el-tab-pane label="待审核(255)" name="2"></el-tab-pane>
      <el-tab-pane label="接受询盘(255)" name="3"></el-tab-pane>
      <el-tab-pane label="拒绝询盘(255)" name="4"></el-tab-pane>
      <el-tab-pane label="提交订舱(255)" name="5"></el-tab-pane>
      <el-tab-pane label="作废(255)" name="6"></el-tab-pane>
    </el-tabs>

    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptionsRight"
      :side-bar="sideBarDefs"
      :column-defs="columnDefsRight"
      :row-data="dataList"
      :enable-col-resize="true"
      :enable-sorting="true"
      :grid-ready="onReadyRight"
      style="width:100%;height:calc(100vh - 430px)"
      class="ag-theme-balham"
    />
    <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list"/>
  </div>
</template>
<script>
  import topSearchItems from '@/components/Cargo/Common/topSearchItems'
  import {
    getScheduleList,
    delScheduleInfo,
    scheduleInfoPublish,
    scheduleInfoUndercarriage,
    freeListApi, freeUpdateApi, updateYunlspVesselApi, containerInfoApi, containerPlanApi
  } from '@/api/schedule'
  import EDTBoxConfiguration from '@/views/cargo/v0/CharteredBoat/components/EDTBoxConfiguration'
  import {getContainerTypeList} from "@/api/seaExport"
  import operationBtn from './operationBtn.vue'
  import {validEmail} from "@/utils/validate"

  export default {
    name: 'ETDList',
    components: {topSearchItems, EDTBoxConfiguration, operationBtn},
    data() {
      const defaultFilter = {
        carrierName: '',
        callSign: '',
        vesselName: '',
        voyageNo: '',
        pageSize: 50,
        pageNum: 1,
        gridApi: null
      }

      return {
        activeName: '1',
        loading: false,
        showDialog: false,
        showDialogseaSteward: false,
        showDialogfreeCabinet: false,
        defaultFilter: defaultFilter,
        filter: this.$extends({}, defaultFilter),
        total: 0,
        dataList: [],

        columnDefsRight: [{
          headerName: '', width: 55, suppressSorting: true, suppressMenu: true,
          headerCheckboxSelection: true,
          suppressSizeToFit: true, suppressResize: true, checkboxSelection: true
        }, {
          headerName: '询盘流水号',
          width: 240,
          field: 'voyageNo',
          suppressSizeToFit: true,
          cellRendererParams: {
            suppressCount: true,
            checkbox: true,
            innerRenderer: params => {
              let str = params.data.voyageNo ? `${params.value} <i class="iconfont icon-star" style="color: #ffa500; font-size: 14px;"></i>` : `${params.value}`
              return str
            }
          }
        }, {
          headerName: '询盘状态',
          field: 'voyageNo',
          cellRenderer(params) {
            let color = ''
            return params.value ? `<span style="background-color:${color};display:block;height:100%;width:100%;">${params.value}</span>` : ''
          }
        },
          {headerName: '货物类型', field: 'voyageNo'},
          {
            headerName: '舱位类型',
            field: 'voyageNo'
          }, {
            headerName: '委托单位',
            field: 'voyageNo'
          },
          {headerName: '装货港', field: 'voyageNo'},
          {headerName: '卸货港', field: 'voyageNo'},
          {headerName: '航空公司', field: 'voyageNo'},
          {headerName: '预计件数', field: 'voyageNo'},
          {headerName: '预计毛重', field: 'voyageNo'},
          {headerName: '预计体积', field: 'voyageNo'},
          {headerName: '指导卖价', field: 'voyageNo'},
          {headerName: '拒绝询盘原因', field: 'voyageNo'},
          {headerName: '作废原因', field: 'voyageNo'},
          {
            field: 'operationBtn',
            headerName: '操作',
            cellRendererFramework: 'operationBtn',
            width: 140
          }
        ],
        gridOptionsRight: {
          context: {
            componentParent: this
          }
        },
        sideBarDefs: {
          toolPanels: ['columns', 'filter'], visible: false
        },
        selectedItems: []
      }
    },
    created() {

    },
    methods: {
      handleClick() {

      },
      onReadyRight(params) {
        this.gridApi = params.api
        params.api.sizeColumnsToFit()
        window.addEventListener('resize', function () {
          setTimeout(function () {
            params.api.sizeColumnsToFit()
          })
        })
      },
      /**
       * 获取配置信息
       */
      async list() {
        this.loading = true
        const res = await getScheduleList(this.filter).catch(() => {
          this.loading = false
        })
        if (res.ok) {
          this.dataList = res.content.list
          this.total = Number(res.content.total)
          this.loading = false
        } else {
          this.dataList = []
          this.total = 0
          this.loading = false
        }
      },
      /**
       * 新增编辑页面
       */
      edit(id) {
        this.$router.push({name: `SalesAskOrderOperate`, query: {id}})
      },
      /**
       * 充值查询条件
       */
      reset() {
        this.filter = this.$extends({}, this.defaultFilter)
        this.list()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../styles/table.scss';

  ::v-deep .el-tabs--border-card{
    border-bottom: none;
  }
</style>

