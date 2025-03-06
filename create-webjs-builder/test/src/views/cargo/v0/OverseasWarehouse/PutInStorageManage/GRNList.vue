<template>
  <div class="right-main-wrapper" v-loading="loading" style="padding-top: 0;">
    <el-tabs v-model="activeName" class="top-tabs">
      <el-tab-pane :label='$t("common.baseSearch")' name="BASE_SEARCH"></el-tab-pane>
      <el-tab-pane :label='$t("common.noSearch")' name="NO_SEARCH"></el-tab-pane>
    </el-tabs>
     <top-search-items-slot :searchFun="getList" :resetFun="clearSearchForm"  class="mb-10" :visible="activeName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="formDataRef" :inline="true" :model="nosFormData" label-width="110px" size="mini" class="multipleNoSearch">
            <el-form-item :label="getZH('orderInboundNo')" prop="orderInboundNos">
                <el-input v-model="nosFormData.orderInboundNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('containerNo')" prop="containerNos">
                <el-input v-model="nosFormData.containerNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('warehouseId')" prop="warehouseIds">
                 <StorageWarehouseSelect v-model="nosFormData.warehouseIds" clearable multiple />
            </el-form-item>
            <el-form-item class="el-form-item" :label="getZH('customerName', 'common')" prop="customerIds">
                <ovl-select v-model="nosFormData.customerIds" type="customer" filterable multiple :params="{businessType: 'OVERSEAS_WAREHOUSE'}"></ovl-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <top-search-items-slot :searchFun="getList" :resetFun="clearSearchForm" class="mb-10" :visible="activeName === 'BASE_SEARCH'">
      <el-form slot="multipleSearch" ref="filterForm" :inline="true" :model="filterForm" size="mini" style="width: 90%" @submit.native.prevent label-width="80px">
        <el-form-item :label="getZH('orderInboundNo')" prop="orderInboundNo">
          <el-input class="w-140" v-model="filterForm.orderInboundNo" @keyup.enter.native="getList" clearable @clear="getList" :placeholder="inputZH('orderInboundNo')"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" :label="getZH('containerNo')" prop="containerNo">
          <el-input class="w-140" size="mini" v-model="filterForm.containerNo" :placeholder="inputZH('containerNo')"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('warehouse')" prop="warehouseIds">
          <StorageWarehouseSelect v-model="filterForm.warehouseIds" :show-all-levels="false" @change="getList" :multiple="true" clearable />
        </el-form-item>
        <el-form-item :label="getZH('inWarehouseType')" prop="inWarehouseType">
          <el-select class="w-140" v-model="filterForm.inWarehouseType" clearable @change="getList">
            <el-option v-for="item in inWarehouseTypeList" :key="item.value" :label="getZH(item.label)" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="getZH('deliverType')" prop="deliverType">
          <el-select class="w-120" v-model="filterForm.deliverType" clearable @change="getList">
            <el-option v-for="item in deliveryList" :key="item.value" :label="getZH(item.label)" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item" :label="getZH('customerName', 'common')" prop="customerId">
          <type-select type="customer" v-model="filterForm.customerId" @selected="getList"></type-select>
        </el-form-item>
        <el-form-item :label="getZH('firstPutawayTime')" prop="firstPutawayDate" label-width="100px">
          <el-select class="w-100" v-model="queryZone" @change="getList">
            <el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj')[Number(item)]" :value="Number(key)" />
          </el-select>
          <el-date-picker size="mini" v-model="firstPutawayDate" type="datetimerange" :start-placeholder="getZH('startDate','common')" :end-placeholder="getZH('endDate','common')"
                          value-format="timestamp" :default-time="['00:00:00','23:59:59']" @change="getList">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="getZH('putawayComplete')" prop="putawayComplete" label-width="100px">
          <el-select class="w-100" v-model="queryZone1" @change="getList">
            <el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj')[Number(item)]" :value="Number(key)" />
          </el-select>
          <el-date-picker size="mini" v-model="putawayComplete" type="datetimerange" :start-placeholder="getZH('startDate','common')" :end-placeholder="getZH('endDate','common')"
                          value-format="timestamp" :default-time="['00:00:00','23:59:59']" @change="getList">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="getZH('createTime')" prop="createTime">
          <el-select class="w-100" v-model="queryZone2" @change="getList">
            <el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj')[Number(item)]" :value="Number(key)" />
          </el-select>
          <el-date-picker size="mini" v-model="filterForm.createTime" type="datetimerange" :start-placeholder="getZH('startDate','common')" :end-placeholder="getZH('endDate','common')"
                          value-format="timestamp" :default-time="['00:00:00','23:59:59']" @change="getList">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="getZH('submitTime')" prop="submitTime">
          <el-select class="w-100" v-model="queryZone3" @change="getList">
            <el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj')[Number(item)]" :value="Number(key)" />
          </el-select>
          <el-date-picker size="mini" v-model="filterForm.submitTime" type="datetimerange" :start-placeholder="getZH('startDate','common')" :end-placeholder="getZH('endDate','common')"
                          value-format="timestamp" :default-time="['00:00:00','23:59:59']" @change="getList">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="mb-10 flex-box top-btn-wrap"  :style="{ visibility: activeName === 'BASE_SEARCH' ? 'visible' : 'hidden'}">
      <el-button type="primary" size='mini' @click="batchExportVisible=true">{{$t('common.bathExport')}}</el-button>
      <el-button type="primary" size='mini' @click="dialog.visible=true">{{getZH('photovoltaicBatch')}}</el-button>
      <el-button type="primary" size='mini' @click="batchAudit()">{{getZH('batchAudit')}}</el-button>
      <el-checkbox class="ml-20" v-model="isCurrentZone">{{getZH('isCurrentZone')}}</el-checkbox>
    </div>
    <div>
      <el-tabs type="card" class="top-tabs" size="mini" @tab-click="getList" v-model="filterForm.orderState">
        <el-tab-pane :label="`${getZH('all')}（${countTabMap['allCount'] || 0}）`" name="all"></el-tab-pane>
        <el-tab-pane v-for="item in orderStateList" :key="item.value" :label="`${getZH(item.label)}（${getCount(item.value)}）`" :name="String(item.value)"></el-tab-pane>
        <el-tab-pane :label="`${getZH('abnormal')}（${countTabMap['abnormalCount'] || 0}）`" name="abnormal"></el-tab-pane>
        <el-tab-pane v-for="item in otherStateList" :key="item.value" :label="`${getZH(item.label)}（${getCount(item.value)}）`" :name="String(item.value)"></el-tab-pane>
      </el-tabs>
      <!-- <ag-grid-vue
				:locale-text-func="_i18nGridLocalText"
				:grid-options="gridOptions"
				:side-bar="sideBarDefs"
				:column-defs="columnFields"
				:row-data="filterDataList"
				:enable-col-resize="true"
				:enable-sorting="true"
				:grid-ready="onReady"
				:animate-rows="false"
				:style="gridHeight"
				class="ag-theme-balham"
			/> -->
      <ag-grid-vue-pro :data="filterDataList" :style-grid="{ height: `${(tableHeight - 30)}px`}" :column-fields-default="columnFields" :grid-ready="onReady" />
      <div class="pagination-wrap">
        <Pagination :total="totalData" :limit.sync="pageForm.pageSize" :page.sync="pageForm.pageNum" @pagination="getList" />
      </div>
      <collectionInfo :visible.sync="dialog.visible" :id="activeId" :type="activeType" />
      <BatchExportDialog :visible.sync="batchExportVisible" @saved="bathExport" />
      <PhotovoltaicBatchDialog :visible.sync="dialog.visible" @saved="getList" />
      <BatchAduitDialog :visible.sync="batchVisible" :ids="activeIds" @saved="getList" />
    </div>
  </div>
</template>

<script>
import StorageWarehouseSelect from '../components/storageWarehouseSelect.vue';
import { getGRNListApi, exporInboundApi, getStatusCountApi, getStatusCountBatchApi, getGRNListBatchApi } from '@/api/OverseasWarehouse/GRNManager';
import grnViewDetailBtn from './components/grnViewDetailBtn';
import collectionInfo from './components/collectionInfo';
import constant from './components/constant';
import PhotovoltaicBatchDialog from './components/photovoltaicBatchDialog';
import getZHMixin from './components/getZHMixin';
import BatchExportDialog from './components/batchExportDialog';
import BatchAduitDialog from './components/batchAduitDialog';
import { getTimeByQueryTimeZone, handlerTimeStr } from '@/utils';
import { zoneObj } from '../OutInStorageManage/components/zoneObj';
import GRNListTable from './table/GRNListTable';

export default {
    name: 'GRNList',
    mixins: [getZHMixin],
    data() {
        return {
            activeName: 'BASE_SEARCH',
            loading: false,
            loading1: false,
            isCurrentZone: true,
            currentZone: -new Date().getTimezoneOffset() / 60,
            queryZone: -new Date().getTimezoneOffset() / 60,
            queryZone1: -new Date().getTimezoneOffset() / 60,
            queryZone2: -new Date().getTimezoneOffset() / 60,
            queryZone3: -new Date().getTimezoneOffset() / 60,
            userList: [],
            stockList: [],
            activeId: '',
            activeIds: [],
            zoneObj,
            activeType: null,
            batchExportVisible: false,
            batchVisible: false,
            deliveryList: constant.deliverTypeStatus,
            inWarehouseTypeList: constant.receiveTypes,
            orderStateList: constant.orderStatus,
            deliverCargoBeginDate: [], // 收货开始时间
            deliverCargoCompleteDate: [], // 收货完成时间
            firstPutawayDate: [], // 首次上架时间
            putawayComplete: [], // 全部上架时间
            filterForm: {
                orderInboundNo: '',
                inWarehouseType: null,
                warehouseId: '',
                warehouseIds: [],
                deliverType: null,
                customerId: '',
                orderState: 'all',
                // 收货开始时间
                deliverCargoBeginStartTime: null,
                deliverCargoBeginEndTime: null,
                // 收货完成时间
                deliverCargoCompleteStartTime: null,
                deliverCargoCompleteEndTime: null,
                // 首次上架时间
                firstPutawayStartTime: null,
                firstPutawayEndTime: null,
                // 全部上架时间
                putawayCompleteStartTime: null,
                putawayCompleteEndTime: null,
                createTimeStart: null,
                createTimeEnd: null,
                createTime: [],
                submitTime: [],
                containerNo: null,
                submitTimeStart: null,
                submitTimeEnd: null,
                abnormalFlag: null
            },
             nosFormData: {
                containerNos: '',
                orderInboundNos: '',
                warehouseIds: [],
                customerIds: []
            },
            pageForm: {
                pageNum: 1,
                pageSize: 50
            },
            totalData: 0,
            gridApi: null,
            // columnApi: null,
            // gridOptions: null,
            // sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
            columnFields: [],
            rowData: [],
            otherStateList: [
                {
                    label: 'cancel',
                    value: 14
                },
                {
                    label: 'warehouseReceiving',
                    value: 15
                },
                {
                    label: 'startReceiving',
                    value: 9
                },
                {
                    label: 'goodsFinish',
                    value: 10
                },
                {
                    label: 'startOn',
                    value: 11
                }
            ],
            countTabMap: {},
            countTabKeyMap: {
                2: 'waitingCount',
                3: 'rejectCount',
                4: 'receivingCount',
                5: 'submitWarehouseCount',
                6: 'warehouseConfirmCount',
                7: 'warehouseRejectCount',
                8: 'headOnPassageCount',
                12: 'partGroundingCount',
                13: 'allGroundingCount',
                14: 'cancelCount',
                15: 'warehouseReceiveCount',
                9: 'startReceivingGoodsCount',
                10: 'completeReceivingGoodsCount',
                11: 'startGroundingCount'
            }
        };
    },
    components: {
        grnViewDetailBtn,
        StorageWarehouseSelect,
        collectionInfo,
        BatchExportDialog,
        PhotovoltaicBatchDialog,
        BatchAduitDialog
    },
    computed: {
        filterDataList() {
            let arr = this.rowData;
            arr.forEach(item => {
                let zone = this.isCurrentZone ? this.currentZone : item.warehouseZone;
                let createTimeStr = handlerTimeStr(item.createTime, zone);
                this.$set(item, 'createTimeStr', createTimeStr);
                let pushTimeStr = handlerTimeStr(item.pushTime, zone);
                this.$set(item, 'pushTimeStr', pushTimeStr);
                let deliverCargoStartTimeStr = handlerTimeStr(item.deliverCargoStartTime, zone);
                this.$set(item, 'deliverCargoStartTimeStr', deliverCargoStartTimeStr);
                let deliverCargoEndTimeStr = handlerTimeStr(item.deliverCargoEndTime, zone);
                this.$set(item, 'deliverCargoEndTimeStr', deliverCargoEndTimeStr);
                let firstPutawayTimeStr = handlerTimeStr(item.firstPutawayTime, zone);
                this.$set(item, 'firstPutawayTimeStr', firstPutawayTimeStr);
                let putawayCompleteTimeStr = handlerTimeStr(item.putawayCompleteTime, zone);
                this.$set(item, 'putawayCompleteTimeStr', putawayCompleteTimeStr);
                let etaStr = handlerTimeStr(item.eta, zone);
                this.$set(item, 'etaStr', etaStr);
                let submitTimeStr = handlerTimeStr(item.submitTime, zone);
                this.$set(item, 'submitTimeStr', submitTimeStr);
            });
            return this.$extends(true, [], arr);
        }
    },
    watch: {},
    methods: {
        // 统计数量
        async initCount() {
            let query = this.handlerQuery();
            let fn = null
            if (this.activeName === 'NO_SEARCH') {
                fn = getStatusCountBatchApi
            } else {
                fn = getStatusCountApi
            }
            let res = await fn(query);
            if (res.ok) {
                this.countTabMap = res.content;
            }
        },
        // 获取数量显示
        getCount(val) {
            return this.countTabMap[this.countTabKeyMap[val]] || 0;
        },
        onReady(params) {
            this.gridApi = params.api;
            // this.columnApi = params.columnApi
            // this.gridApi.sizeColumnsToFit()
            // window.addEventListener('resize', function () {
            // 	setTimeout(function () {
            // 		params.api.sizeColumnsToFit()
            // 	})
            // })
        },
        addInfo(id, inWarehouseType, boxUpType) {
            this.activeType =
                inWarehouseType === 1 || inWarehouseType === 3 || (inWarehouseType === 2 && !boxUpType) ? '1' : '2';
            this.activeId = id;
            this.dialog.visible = true;
        },
        // 处理查询条件
        handlerQuery() {
            let data = {}
             if (this.activeName === 'NO_SEARCH') {
                data = {
                    ...this.nosFormData,
                    orderState: this.filterForm.orderState
                }
            } else {
                data = this.$extends(true, {}, this.filterForm);
            data.firstPutawayStartTime = this.$isNotEmpty(this.firstPutawayDate)
                ? getTimeByQueryTimeZone(this.firstPutawayDate[0], this.queryZone)
                : null;
            data.firstPutawayEndTime = this.$isNotEmpty(this.firstPutawayDate)
                ? getTimeByQueryTimeZone(this.firstPutawayDate[1], this.queryZone)
                : null;
            data.putawayCompleteStartTime = this.$isNotEmpty(this.putawayComplete)
                ? getTimeByQueryTimeZone(this.putawayComplete[0], this.queryZone1)
                : null;
            data.putawayCompleteEndTime = this.$isNotEmpty(this.putawayComplete)
                ? getTimeByQueryTimeZone(this.putawayComplete[1], this.queryZone1)
                : null;
            data.createTimeStart = this.$isNotEmpty(data.createTime)
                ? getTimeByQueryTimeZone(data.createTime[0], this.queryZone2)
                : null;
            data.createTimeEnd = this.$isNotEmpty(data.createTime)
                ? getTimeByQueryTimeZone(data.createTime[1], this.queryZone2)
                : null;
            data.submitTimeStart = this.$isNotEmpty(data.submitTime)
                ? getTimeByQueryTimeZone(data.submitTime[0], this.queryZone3)
                : null;
            data.submitTimeEnd = this.$isNotEmpty(data.submitTime)
                ? getTimeByQueryTimeZone(data.submitTime[1], this.queryZone3)
                : null;
            }
            data.abnormalFlag = data.orderState === 'abnormal' ? true : null;
            data.orderState = ['abnormal', 'all'].includes(data.orderState) ? null : Number(data.orderState);
            return data;
        },
        // 获取列表
        async getList() {
            this.initCount();
            let query = this.handlerQuery();
            this.loading = true;
            let fn = null
            if (this.activeName === 'NO_SEARCH') {
                fn = getGRNListBatchApi
            } else {
                fn = getGRNListApi
            }
            const res = await fn({ ...query, ...this.pageForm });
            if (res.ok) {
                this.rowData = res.content.list;
                this.totalData = Number(res.content.total);
            } else {
                this.rowData = [];
                this.totalData = 0;
            }
            this.loading = false;
        },
        /**
         * 批量导出
         */
        async bathExport(data) {
            const _selectedRows = this.gridApi.getSelectedRows();
            let saveData = {};
            let ids = [];
            if (this.$isNotEmpty(_selectedRows)) {
                _selectedRows.forEach(item => {
                    ids.push(item.id);
                });
                saveData = { ...{ ids }, ...data };
            } else {
                saveData = { ...this.handlerQuery(), ...data };
            }
            this.loading = true;
            let res = await exporInboundApi(saveData);
            if (res.ok) {
                this.$alert(
                    `<div><span class="fc-red fs-16">${this.getZH(
                        'handlerTime'
                    )}</span><span class="fs-16">,${this.getZH('handlerRes')}</span></div>`,
                    this.getZH('handlerTips'),
                    {
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: this.getZH('theKnow', 'common'),
                        callback: () => {
                            // this.$router.push({ name: `TaskList`, query: { time: new Date().getTime() } })
                            this.loading = false;
                        }
                    }
                );
                this.loading = false;
            } else {
                this.loading = false;
            }
        },
        /**
         * 批量审核
         */
        batchAudit() {
            const _selectedRows = this.gridApi.getSelectedRows();
            if (this.$isNotEmpty(_selectedRows)) {
                let list = _selectedRows.filter(item => item.orderState === 2);
                if (this.$isNotEmpty(list)) {
                    let ids = [];
                    list.forEach(item => {
                        ids.push(item.id);
                    });
                    this.activeIds = ids;
                    this.batchVisible = true;
                } else {
                    this.$message.error(this.getZH('batchAuditEmpty'));
                    return;
                }
            } else {
                this.$message.error(this.getZH('batchAuditEmpty'));
            }
        },
        clearSearchForm() {
            this.$refs.filterForm && this.$refs.filterForm.resetFields();
            this.$refs.formDataRef && this.$refs.formDataRef.resetFields();
            this.deliverCargoBeginDate = []; // 收货开始时间
            this.deliverCargoCompleteDate = []; // 收货完成时间
            this.firstPutawayDate = []; // 首次上架时间
            this.putawayComplete = []; // 全部上架时间
            this.filterForm.orderState = 'all';
            this.getList();
        }
    },
    mounted() {},
    created() {
        this.gridOptions = {
            context: {
                componentParent: this
            },
            rowSelection: 'multiple', // 设置多行可选
            animateRows: true,
            suppressRowClickSelection: true // 选中单元格后可以复制内容
            // suppressCellSelection: true, //点击不选中单元格
        };
        this.columnFields = GRNListTable;
        // this.columnFields = [
        // 	{
        // 		headerName: '',
        // 		checkboxSelection: true,
        // 		headerCheckboxSelection: true,
        // 		minWidth: 35,
        // 		maxWidth: 35,
        // 		pinned: 'left'
        // 	},
        // 	{
        // 		field: 'customerName',
        // 		headerName: this.getZH('customerName', 'common'),
        // 		minWidth: 100
        // 	},
        // 	{
        // 		field: 'orderInboundNo',
        // 		headerName: this.getZH('orderInboundNo'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'appointInboundNo',
        // 		headerName: this.getZH('storageReservationNumber'),
        // 		minWidth: 160
        // 	},
        // 	{
        // 		field: 'warehouseName',
        // 		headerName: this.getZH('warehouse'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'createTimeStr',
        // 		headerName: this.getZH('createTime'),
        // 		minWidth: 160
        // 	},
        // 	{
        // 		field: 'pushTimeStr',
        // 		headerName: this.getZH('pushTime'),
        // 		minWidth: 160
        // 	},
        // 	{
        // 		field: 'orderStateName',
        // 		headerName: this.getZH('orderState'),
        // 		minWidth: 100

        // 		// orderState.operatorDealStatus==10
        // 	},
        // 	{
        // 		field: 'skuKindQuantity',
        // 		headerName: this.getZH('forecastSKUTypes'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'skuQuantity',
        // 		headerName: this.getZH('forecastSKUTotal'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'deliverCargoStartTimeStr',
        // 		headerName: this.getZH('deliverCargoBeginTime'),
        // 		minWidth: 160
        // 	},
        // 	{
        // 		field: 'deliverCargoEndTimeStr',
        // 		headerName: this.getZH('deliverCargoCompleteTime'),
        // 		minWidth: 160
        // 	},
        // 	{
        // 		field: 'putawaySkuKindsQuantity',
        // 		headerName: this.getZH('groupingSkuKindQuantity'),
        // 		minWidth: 100
        // 	},
        // 	{
        // 		field: 'putawaySkuQuantity',
        // 		headerName: this.getZH('groupingSkuQuantity'),
        // 		minWidth: 100
        // 	},
        // 	{
        // 		field: 'firstPutawayTimeStr',
        // 		headerName: this.getZH('firstPutawayTime'),
        // 		minWidth: 160
        // 	},
        // 	{
        // 		field: 'putawayCompleteTimeStr',
        // 		headerName: this.getZH('putawayCompleteTime'),
        // 		minWidth: 160
        // 	},
        // 	{
        // 		field: 'etaStr',
        // 		headerName: this.getZH('ETA'),
        // 		minWidth: 160
        // 	},
        // 	{
        // 		field: 'submitTimeStr',
        // 		headerName: this.getZH('submitTime'),
        // 		minWidth: 160
        // 	},
        // 	{
        // 		field: 'inWarehouseTypeName',
        // 		headerName: this.getZH('inWarehouseType'),
        // 		minWidth: 100
        // 	},
        // 	{
        // 		field: 'deliverTypeName',
        // 		headerName: this.getZH('deliverType'),
        // 		minWidth: 100
        // 	},
        // 	{
        // 		field: 'pushStateName',
        // 		headerName: this.getZH('push_status'),
        // 		minWidth: 100
        // 	},
        // 	{
        // 		field: 'containerNo',
        // 		headerName: this.getZH('containerNo'),
        // 		minWidth: 100
        // 	},
        // 	{
        // 		field: 'reason',
        // 		headerName: this.getZH('rejectReason'),
        // 		minWidth: 100,
        // 		cellRenderer: params => {
        // 			if (params.data.orderState === 3 || params.data.pushState === 4 || params.data.orderState === 7) {
        // 				return params.data.reason
        // 			}
        // 			return ''
        // 		}
        // 	},
        // 	{
        // 		field: 'abnormalFlag',
        // 		headerName: this.getZH('abnormalFlag'),
        // 		minWidth: 100,
        // 		cellRenderer: params => params.value ? this.getZH('trueText', 'common') : this.getZH('falseText', 'common')
        // 	},
        // 	{
        // 		field: 'abnormalMessage',
        // 		headerName: this.getZH('abnormalMessage'),
        // 		minWidth: 300
        // 	},
        // 	{
        // 		field: 'sellerName',
        // 		headerName: this.getZH('sellerName', 'outInStorageManage'),
        // 		minWidth: 150
        // 	},
        // 	{
        // 		field: 'id',
        // 		headerName: this.getZH('operation', 'common'),
        // 		minWidth: 200,
        // 		pinned: 'right',
        // 		cellRendererFramework: 'grnViewDetailBtn'
        // 	}
        // ]
        this.getList();
    },
    beforeRouteEnter(to, from, next) {
        next();
    }
};
</script>

<style lang='scss' scoped>
.features-btn {
    margin-bottom: 10px;
}
::v-deep .table-setting {
    top: -90px !important;
}
</style>
