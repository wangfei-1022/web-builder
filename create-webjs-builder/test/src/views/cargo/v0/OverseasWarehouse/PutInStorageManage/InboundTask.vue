<template>
  <div class="right-main-wrapper" v-loading="loading" style="padding-top: 0;">
     <el-tabs v-model="activeName" class="top-tabs">
      <el-tab-pane :label='$t("common.baseSearch")' name="BASE_SEARCH"></el-tab-pane>
      <el-tab-pane :label='$t("common.noSearch")' name="NO_SEARCH"></el-tab-pane>
    </el-tabs>
    <top-search-items-slot :searchFun="list" :resetFun="clearSearchForm"  class="mb-10" :visible="activeName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="formDataRef" :inline="true" :model="nosFormData" label-width="120px" size="mini" class="multipleNoSearch">
            <el-form-item :label="getZH('memberNo')" prop="customerInboundNos" label-width="120px">
                 <el-input v-model="nosFormData.customerInboundNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('orderInboundNo')" prop="inboundNos">
                 <el-input v-model="nosFormData.inboundNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('commercialinvoice')" prop="commercialInvoices">
                <el-input v-model="nosFormData.commercialInvoices" type="textarea" rows="3" resize="none" clearable />
             </el-form-item>
            <el-form-item :label="getZH('blNo')" prop="blNumbers">
                 <el-input v-model="nosFormData.blNumbers" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('containerNo')" prop="containerNumbers">
                 <el-input v-model="nosFormData.containerNumbers" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('warehouseName')" prop="warehouseIds">
                <StorageWarehouseSelect v-model="nosFormData.warehouseIds" multiple clearable collapse-tags />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <top-search-items-slot :searchFun="list" :resetFun="clearSearchForm" class="mb-10" :visible="activeName === 'BASE_SEARCH'">
      <el-form slot="multipleSearch" ref="filterForm" :inline="true" :model="filterForm" label-width="80px">
        <el-form-item :label="getZH('customerName', 'common')" prop="customerId">
          <type-select v-model="filterForm.customerId" type="customer" @selected="list" clearable></type-select>
        </el-form-item>
        <el-form-item :label="getZH('memberNo')" prop="customerInboundNo" label-width="140px">
          <el-input v-model="filterForm.customerInboundNo" size="mini" @keyup.enter.native="list" clearable :placeholder="inputZH('orderInboundNo')"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('orderInboundNo')" prop="inboundNo">
          <el-input v-model="filterForm.inboundNo" size="mini" @keyup.enter.native="list" clearable :placeholder="inputZH('orderInboundNo')"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('warehouseName')" prop="warehouseId">
          <StorageWarehouseSelect v-model="filterForm.warehouseId" @change="list" clearable />
        </el-form-item>
        <el-form-item :label="getZH('commercialinvoice')" prop="commercialInvoice">
          <el-input size="mini" v-model="filterForm.commercialInvoice" :placeholder="inputZH('commercialinvoice')" @keyup.enter.native="list"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('blNo')" prop="blNumber">
          <el-input size="mini" v-model="filterForm.blNumber" :placeholder="inputZH('blNo')" @keyup.enter.native="list"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('orderState')" prop="orderStatus">
          <ConstantSelect :url="'/api/ovl-service/omc/ovl/order/inbound/task/status/selections'" v-model="filterForm.orderStatus" @change="list"></ConstantSelect>
        </el-form-item>
        <el-form-item :label="getZH('containerNo')" prop="containerNumber">
          <el-input size="mini" v-model="filterForm.containerNumber" :placeholder="inputZH('containerNo')" @keyup.enter.native="list"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('ediSendTime')" label-width="100px">
          <CommonPicker format="yyyy-MM-dd" pikcerType="daterange" valueFormat="timestamp" v-model="filterForm.ediSendTime" @change="list" clearable />
        </el-form-item>
        <el-form-item :label="getZH('planReceiveTime')" label-width="100px">
          <CommonPicker format="yyyy-MM-dd" pikcerType="daterange" valueFormat="timestamp" v-model="filterForm.planReceiveTime" @change="list" clearable />
        </el-form-item>
        <el-form-item :label="getZH('recompletionTime')" label-width="100px">
          <CommonPicker format="yyyy-MM-dd" pikcerType="daterange" valueFormat="timestamp" v-model="filterForm.recompletionTime" @change="list" clearable />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="mb-10 flex-box top-btn-wrap"  :style="{ visibility: activeName === 'BASE_SEARCH' ? 'visible' : 'hidden'}">
      <el-button type="primary" size='mini' @click="batchImportVisible = true">{{$t('common.batchImport')}}</el-button>
      <el-button type="primary" size='mini' @click="bathExport()">{{$t('common.bathExport')}}</el-button>
      <el-button type="primary" size='mini' @click="updateDataExport()">{{getZH('updateDataExport')}}</el-button>
      <el-button type="primary" size='mini' @click="dialog.visible=true">{{getZH('batchUpdateData')}}</el-button>
    </div>
    <div>
      <ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" />
      <div class="pagination-wrap">
        <Pagination :total="totalData" :limit.sync="filterForm.pageSize" :page.sync="filterForm.pageNum" @pagination="list" />
      </div>
      <importDialog :visible.sync="dialog.visible" :batchType='3' @saved="list" />
      <CommonImportDialog :visible.sync="batchImportVisible" :fn="importTaskInboundApi" templateName="inboundTaskImportExcelTemplate.xlsx" @saved='batchImportSaved'></CommonImportDialog>
    </div>
  </div>
</template>

<script>
import StorageWarehouseSelect from '../components/storageWarehouseSelect.vue';
import {
    getInboundTaskPagesApi,
    getInboundTaskPagesBatchApi,
    exportInboundTaskApi,
    recallInboundTaskApi,
    importTaskInboundApi,
    exportInboundTaskUpdateDataApi
} from '@/api/OverseasWarehouse/GRNManager';
import inboundTaskOperation from './components/inboundTaskOperation';
import getZHMixin from './components/getZHMixin';
import ConstantSelect from '@/components/Form/ConstantSelect';
import importDialog from '../YunCangManage/components/importDialog';
import { logServiceName, pointOvl, logOrigin } from '@/utils/constant';
import CommonImportDialog from '../components/CommonImportDialog.vue';
import InboundTaskTable from './table/InboundTaskTable';

export default {
    name: 'InboundTask',
    mixins: [getZHMixin],
    components: { inboundTaskOperation, StorageWarehouseSelect, ConstantSelect, importDialog, CommonImportDialog },
    data() {
        return {
            activeName: 'BASE_SEARCH',
            importTaskInboundApi,
            loading: false,
            batchImportVisible: false,
            ediSendTime: [], // EDI发送时间
            planReceiveTime: [], // 预计到货时间
            recompletionTime: [], // 要求完成货时间
            filterForm: {
                blNumber: null,
                commercialInvoice: null,
                containerNumber: null,
                customerId: null,
                customerInboundNo: null,
                ediSendTimeEnd: null,
                ediSendTimeStart: null,
                planReceiveTimeStart: null,
                planReceiveTimeEnd: null,
                recompletionTimeStart: null,
                recompletionTimeEnd: null,
                warehouseId: null,
                orderStatus: null,
                pageNum: 1,
                pageSize: 50
            },  
            nosFormData: {
                customerInboundNos: '',
                inboundNos: '',
                blNumbers: '',
                commercialInvoices: '',
                containerNumbers: '',
                warehouseIds: [],
            },
            totalData: 0,
            gridApi: null,
            columnApi: null,
            gridOptions: null,
            sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
            columnFields: [],
            dataList: []
        };
    },
    computed: {},
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.name === 'InboundTaskDetail') {
                vm.list();
            }
        });
    },
    methods: {
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
        // 处理查询条件
        handlerQuery() {
            if (this.activeName === 'NO_SEARCH') {
                let data = {
                    ...this.nosFormData,
                    pageSize: this.filterForm.pageSize,
                    pageNum: this.filterForm.pageNum
                }
                return data
            }
            let data = this.$extends(true, {}, this.filterForm);
            data.ediSendTimeStart = this.$isNotEmpty(this.ediSendTime) ? this.ediSendTime[0] : null;
            data.ediSendTimeEnd = this.$isNotEmpty(this.ediSendTime) ? this.ediSendTime[1] : null;
            data.planReceiveTimeStart = this.$isNotEmpty(this.planReceiveTime) ? this.planReceiveTime[0] : null;
            data.planReceiveTimeEnd = this.$isNotEmpty(this.planReceiveTime) ? this.planReceiveTime[1] : null;
            data.recompletionTimeStart = this.$isNotEmpty(this.recompletionTime) ? this.recompletionTime[0] : null;
            data.recompletionTimeEnd = this.$isNotEmpty(this.recompletionTime) ? this.recompletionTime[1] : null;
            return data;
        },
        // 获取列表
        async list() {
            let query = this.handlerQuery();
            this.loading = true;
            let fn = null
            if (this.activeName === 'NO_SEARCH') {
                fn = getInboundTaskPagesBatchApi
            } else {
                fn = getInboundTaskPagesApi
            }
            const res = await fn({ ...query });
            if (res.ok) {
                this.dataList = res.content.list;
                this.totalData = Number(res.content.total);
            } else {
                this.dataList = [];
                this.totalData = 0;
            }
            this.loading = false;
        },
        /**
         * 处理异常
         */
        async recall(id) {
            this.confirmTips(this.getZH('recallConfirm'))
                .then(() => {
                    this.loading = true;
                    recallInboundTaskApi(id).then(res => {
                        if (res.ok) {
                            this.$message.success(this.getZH('recallSuccess'));
                            this.list();
                        }
                    });
                    this.loading = false;
                })
                .catch(() => {});
        },
        // 更新数据导出
        updateDataExport() {
            const _selectedRows = this.gridApi.getSelectedRows();
            if (_selectedRows.length === 0) {
                this.$message.error(this.getZH('operEmptyError'));
                return;
            }
            let ids = [];
            _selectedRows.forEach(item => {
                ids.push(item.id);
            });
            exportInboundTaskUpdateDataApi({ ids: ids }).then(res => {
                if (res.ok) {
                    this.$message.success(this.getZH('exportSuccessInfo'));
                }
            });
        },
        /**
         * 批量导出
         */
        async bathExport() {
            const _selectedRows = this.gridApi.getSelectedRows();
            let saveData = {};
            let ids = [];
            if (this.$isNotEmpty(_selectedRows)) {
                _selectedRows.forEach(item => {
                    ids.push(item.id);
                });
                saveData = { ...{ ids } };
            } else {
                saveData = { ...this.handlerQuery() };
            }
            this.loading = true;
            let res = await exportInboundTaskApi(saveData);
            if (res.ok) {
                // 添加日志 记录数据
                this.logBtnSend({
                    origin: logOrigin.SYSTEM_OPERATION,
                    logCode: pointOvl.OVL_INBOUND_TASK_EXPORT,
                    serviceName: logServiceName.OVL_SERVICE,
                    businessType: pointOvl.OVL_INBOUND_TASK_EXPORT,
                    content: {
                        ...saveData
                    }
                });
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
        batchImportSaved() {
            this.$alert(
                `<div><span class="fc-red fs-16">${this.getZH('handlerTime')}</span><span class="fs-16">,${this.getZH(
                    'handlerRes'
                )}</span></div>`,
                this.getZH('handlerTips1'),
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: this.getZH('theKnow', 'common'),
                    callback: () => {
                        this.list();
                    }
                }
            );
        },
        clearSearchForm() {
            this.$refs.filterForm && this.$refs.filterForm.resetFields();
            this.$refs.formDataRef && this.$refs.formDataRef.resetFields();
            this.ediSendTime = []; // EDI发送时间
            this.planReceiveTime = []; // 预计到货时间
            this.recompletionTime = []; // 首次上架时间
            this.list();
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
        this.columnFields = InboundTaskTable;
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
        // 		headerName: this.getZH('rowIndex', 'common'),
        // 		minWidth: 70,
        // 		maxWidth: 70,
        // 		cellRenderer: params => params.rowIndex + 1
        // 	},
        // 	{
        // 		field: 'customerName',
        // 		headerName: this.getZH('customerName', 'common'),
        // 		minWidth: 140
        // 	},
        // 	{
        // 		field: 'inboundNo',
        // 		headerName: this.getZH('orderInboundNo'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'customerInboundNo',
        // 		headerName: this.getZH('memberNo'),
        // 		minWidth: 160
        // 	},
        // 	{
        // 		field: 'customerInboundLineNo',
        // 		headerName: this.getZH('customerInboundLineNo'),
        // 		minWidth: 160
        // 	},
        // 	{
        // 		field: 'warehouseName',
        // 		headerName: this.getZH('warehouseName'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'customerWarehouseCode',
        // 		headerName: this.getZH('costomerWarehouseCode'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'commercialInvoice',
        // 		headerName: this.getZH('commercialinvoice'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'unpackFlag',
        // 		headerName: this.getZH('unpackFlag'),
        // 		minWidth: 120,
        // 		cellRenderer: params => params.value ? this.$t('common.YES') : this.$t('common.NO')
        // 	},
        // 	{
        // 		field: 'ediSendTime',
        // 		headerName: this.getZH('ediSendTime'),
        // 		minWidth: 140,
        // 		cellRenderer: params => params.value ? this.formatDate(params.value, 'YYYY-MM-DD') : '-'
        // 	},
        // 	{
        // 		field: 'planReceiveTime',
        // 		headerName: this.getZH('planReceiveTime'),
        // 		minWidth: 140,
        // 		cellRenderer: params => params.value ? this.formatDate(params.value, 'YYYY-MM-DD') : '-'
        // 	},

        // 	{
        // 		field: 'vessel',
        // 		headerName: this.getZH('vesselOrVoyage'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'shippingLine',
        // 		headerName: this.getZH('shippingLine'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'containerNumber',
        // 		headerName: this.getZH('containerNo'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'sealNumber',
        // 		headerName: this.getZH('sealNumber'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'blNumber',
        // 		headerName: this.getZH('blNo'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'terminal',
        // 		headerName: this.getZH('terminal'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'recompletionTime',
        // 		headerName: this.getZH('recompletionTime'),
        // 		minWidth: 140,
        // 		cellRenderer: params => params.value ? this.formatDate(params.value, 'YYYY-MM-DD') : '-'
        // 	},
        // 	{
        // 		field: 'orderStatusName',
        // 		headerName: this.getZH('orderState'),
        // 		minWidth: 120
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
        // 		minWidth: 100
        // 	},
        // 	{
        // 		field: 'id',
        // 		headerName: this.getZH('operation', 'common'),
        // 		minWidth: 120,
        // 		pinned: 'right',
        // 		cellRendererFramework: 'inboundTaskOperation'
        // 	}
        // ]
        this.list();
    }
};
</script>

<style lang='scss' scoped>
.features-btn {
    margin-bottom: 10px;
}
</style>
