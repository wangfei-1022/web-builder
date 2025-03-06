<template>
  <div class="pd-16" v-loading="loading" style="padding-top: 0;">
    <el-tabs v-model="activeName" class="top-tabs">
      <el-tab-pane :label='$t("common.baseSearch")' name="BASE_SEARCH"></el-tab-pane>
      <el-tab-pane :label='$t("common.noSearch")' name="NO_SEARCH"></el-tab-pane>
    </el-tabs>
    <top-search-items-slot :searchFun="list" :resetFun="clearSearchForm"  class="mb-10" :visible="activeName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="formDataRef" :inline="true" :model="nosFormData" label-width="110px" size="mini" class="multipleNoSearch">
            <el-form-item :label="getZH('orderNo')" prop="orderNos">
                <el-input v-model="nosFormData.orderNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('customOrderNo', 'putInStorageManage')" prop="outOrderNos">
                <el-input v-model="nosFormData.outOrderNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('tradeNo')" prop="tradeNos">
                <el-input v-model="nosFormData.tradeNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <top-search-items-slot :searchFun="list" :resetFun="clearSearchForm" class="mb-10" :visible="activeName === 'BASE_SEARCH'">
      <el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" size="mini" style="width: 90%" @submit.native.prevent label-width="110px">
        <el-form-item class="el-form-item" :label="getZH('customerName', 'common')" prop="customerId">
          <TypeSelect v-model="formData.customerId" type="customer" @selected="list" />
        </el-form-item>
        <el-form-item :label="getZH('orderClass')" prop="type">
          <el-select v-model="formData.type" @change="list">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="getZH('warehouse')" prop="warehouseId">
          <StorageWarehouseSelect v-model="formData.warehouseId" @change="list" clearable :data="{ dockingWay: 4 }" />
        </el-form-item>
        <el-form-item :label="getZH('orderNo')" prop="orderNo">
          <el-input v-model="formData.orderNo" @keyup.enter.native="list" clearable @clear="list" :placeholder="inputZH('orderNo')"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('customOrderNo', 'putInStorageManage')" prop="outOrderNo">
          <el-input v-model="formData.outOrderNo" @keyup.enter.native="list" clearable @clear="list" :placeholder="inputZH('customOrderNo', 'putInStorageManage')"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('tradeNo')" prop="tradeNo">
          <el-input v-model="formData.tradeNo" size="mini" @keyup.enter.native="list" clearable @clear="list" :placeholder="inputZH('tradeNo')"></el-input>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div>
      <div class="mb-10 flex-box top-btn-wrap"  :style="{ visibility: activeName === 'BASE_SEARCH' ? 'visible' : 'hidden'}">
        <el-button v-permission="['ovl:cloud:warehouse:out:out']" size="mini" type="primary" @click="exportData" :loading="loading">
          {{ getZH("exportBtn", "common") }}
        </el-button>
        <el-button size="mini" type="primary" class="ml-10" :loading="loading" @click="dialog.visible = true">
          {{getZH('batchUpdate')}}
        </el-button>
        <el-button type="primary" size='mini' v-permission="['ovl:cloud:warehouse:out:shipmentNoImport']" @click="batchImportShipmentVisible=true">{{getZH('importLogisticsSingleNumber')}}</el-button>
        <el-button type="primary" size='mini' @click="bulkDelivery()">{{getZH('bulkDelivery')}}</el-button>
      </div>
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptionsRight" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true"
                   :enable-sorting="true" :grid-ready="onReady" :animate-rows="false" :style="gridHeight" class="ag-theme-balham" />
      <ImportDialog :visible.sync="dialog.visible" @saved="list" :batchType='2' />
      <HandlerItemDialog :isOutbound="true" :id='orderId' :visible.sync="dialogVisible" @saved="list" />
      <EnterShipmentNo :isOutbound="true" :id='orderId' :visible.sync="enterShipmentNoVisible" :shipmentNo='shipmentNo' @saved="list" />
      <BatchImportShipmentNoDialog :visible.sync="batchImportShipmentVisible" :type="2" />
      <BatchHandlerItemDialog :ids="activeIds" :visible.sync="batchHandlerItemVisible" @saved="list" />
      <div class="pagination-wrap">
        <Pagination :total="totalData" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
      </div>
    </div>
  </div>
</template>

<script>
import ImportDialog from './components/importDialog';
import { getGridSelected } from '@/utils/gridChoose';
import { getCloudOutboundApi, exportCloudOutboundApi, getCloudOutboundBatchApi } from '@/api/OverseasWarehouse/YunCangManage';
import StorageWarehouseSelect from '../components/storageWarehouseSelect.vue';
import getZHMixin from './components/getZHMixin';
import operationBtn from './components/operationBtn.vue';
import HandlerItemDialog from './components/handlerItemDialog';
import BatchHandlerItemDialog from './components/batchHandlerItemDialog';
import EnterShipmentNo from './components/enterShipmentNo.vue';
import BatchImportShipmentNoDialog from '../OutInStorageManage/components/batchImportShipmentNoDialog';
export default {
    name: 'WarehouseOutbound',
    mixins: [getZHMixin],
    components: {
        StorageWarehouseSelect,
        ImportDialog,
        operationBtn,
        HandlerItemDialog,
        EnterShipmentNo,
        BatchImportShipmentNoDialog,
        BatchHandlerItemDialog
    },
    data() {
        return {
            activeName: 'BASE_SEARCH',
            loading: false,
            fileList: [],
            formData: {
                orderNo: '',
                warehouseId: '',
                customerId: '',
                outOrderNo: '',
                type: null,
                tradeNo: null,
                pageNum: 1,
                pageSize: 50,
            },
            nosFormData: {
                orderNos: '',
                outOrderNos: '',
                tradeNos: ''
            },
            orderId: null,
            dialogVisible: false,
            enterShipmentNoVisible: false,
            batchImportShipmentVisible: false,
            batchHandlerItemVisible: false,
            activeIds: [],
            shipmentNo: null,
            gridOptionsRight: {
                rowSelection: 'multiple',
                rowMultiSelectWithClick: true,
                suppressRowClickSelection: true, // 选中单元格后可以复制内容
                context: {
                    componentParent: this
                }
            },
            typeList: [
                {
                    name: this.getZH('isAll'),
                    value: null
                },
                {
                    name: this.getZH('aUndertakesTo'),
                    value: 10
                },
                {
                    name: this.getZH('transshipment'),
                    value: 20
                },
                {
                    name: this.getZH('transshipmentFBA'),
                    value: 22
                }
            ],
            totalData: 0,
            gridApi: null,
            columnApi: null,

            sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
            columnFields: [],
            dataList: []
        };
    },
    computed: {},
    watch: {},
    methods: {
        onReady(params) {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
            this.gridApi.sizeColumnsToFit();
            window.addEventListener('resize', function () {
                setTimeout(function () {
                    params.api.sizeColumnsToFit();
                });
            });
        },
        /**
         * 获取表格选中的数据集合
         */
        getSelectData() {
            const rows = getGridSelected(this.gridOptionsRight);
            return rows;
        },
        /**
         * 更新单条数据
         */
        update(id) {
            this.orderId = id;
            this.dialogVisible = true;
        },
        /**
         * 文件导出
         */
        async exportData() {
            this.loading = true;
            let filterForm = this.$extends({}, this.formData);
            let selected = this.getSelectData();
            if (this.$isNotEmpty(selected)) {
                let ids = [];
                selected.forEach(item => {
                    ids.push(item.id);
                });
                filterForm.ids = ids.join(',');
            }
            delete filterForm.pageNum;
            delete filterForm.pageSize;
            let res = await exportCloudOutboundApi(filterForm);
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
                            this.$router.push({ name: `TaskList`, query: { time: new Date().getTime() } });
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
        bulkDelivery() {
            let selected = this.getSelectData();
            let operateArr = selected.filter(item => item.type === 10);
            if (this.$isNotEmpty(operateArr)) {
                // 没有物流单号的不给出库
                // let noOutArr = operateArr.filter(item => this.$isEmpty())
                let noOutArr = [];
                let ids = [];
                operateArr.forEach(item => {
                    if (this.$isEmpty(item.shipmentNos)) {
                        noOutArr.push(item.orderNo);
                    } else {
                        ids.push(item.id);
                    }
                });
                this.activeIds = ids;

                // 正常单号存在
                if (this.$isNotEmpty(ids)) {
                    // 没有物流单号的存在
                    if (this.$isNotEmpty(noOutArr)) {
                        let msg = '';
                        noOutArr.forEach(item => {
                            msg += `【${item}】`;
                        });
                        msg = `${this.getZH('tips')}${msg}${this.getZH('tips1')}`;
                        this.confirmTips(msg)
                            .then(() => {
                                this.batchHandlerItemVisible = true;
                            })
                            .catch(() => {});
                    } else {
                        this.batchHandlerItemVisible = true;
                    }
                } else {
                    let msg = '';
                    msg += this.getZH('tips2');
                    this.$message.error(msg);
                }
            } else {
                this.$message.error(this.getZH('bulkDeliveryEmpty'));
            }
        },
        logisticsSingleNumberEnter(id, shipmentNo) {
            this.orderId = id || null;
            this.shipmentNo = shipmentNo || null;
            this.enterShipmentNoVisible = true;
        },
        /**
         * 上传时
         */
        handletProgress() {
            this.loading = true;
        },
        async list() {
            this.loading = true;
            let data = {}
            let fn = {}
            if (this.activeName === 'NO_SEARCH') {
                fn = getCloudOutboundBatchApi
                data = this.nosFormData
                data.pageSize = this.formData.pageSize
                data.pageNum = this.formData.pageNum
            } else {
                fn = getCloudOutboundApi
                data = this.formData
            }
            let res = await fn(data);
            if (res.ok) {
                this.dataList = res.content.list || [];
                this.totalData = res.content.total;
            }
            this.loading = false;
        },
        clearSearchForm() {
            this.$refs.formData && this.$refs.formData.resetFields();
            this.$refs.formDataRef && this.$refs.formDataRef.resetFields();
            this.list();
        }
    },
    mounted() {},
    created() {
        this.columnFields = [
            {
                headerName: '',
                width: 55,
                pinned: 'left',
                suppressSorting: true,
                checkboxSelection: true,
                headerCheckboxSelection: true,
                suppressMenu: true,
                suppressSizeToFit: true,
                suppressResize: true
            },
            {
                field: 'customerName',
                headerName: this.getZH('customerName', 'common'),
                minWidth: 100
            },
            {
                field: 'orderNo',
                headerName: this.getZH('orderNo'),
                minWidth: 160
            },
            {
                field: 'outOrderNo',
                headerName: this.getZH('customOrderNo', 'putInStorageManage'),
                minWidth: 160
            },
            {
                field: 'tradeNo',
                headerName: this.getZH('tradeNo'),
                minWidth: 120
            },
            {
                field: 'warehouseName',
                headerName: this.getZH('warehouse'),
                minWidth: 120
            },
            {
                field: 'createTime',
                headerName: this.getZH('createTime'),
                minWidth: 160,
                cellRenderer: params => this.formatDate(params.data.createTime, 'YYYY-MM-DD HH:mm:ss')
            },
            {
                field: 'pickupName',
                headerName: this.getZH('pickupType'),
                minWidth: 160
            },
            {
                field: 'productName',
                headerName: this.getZH('logicProductName'),
                minWidth: 160
            },
            {
                field: 'shipmentNo',
                headerName: this.getZH('shipmentNo'),
                minWidth: 160
            },
            {
                field: 'carrierName',
                headerName: this.getZH('carrier'),
                minWidth: 160
            },
            {
                field: 'typeName',
                headerName: this.getZH('orderClass'),
                minWidth: 160
            },
            {
                field: 'statusName',
                headerName: this.getZH('status'),
                minWidth: 130
            },
            {
                headerName: '操作',
                pinned: 'right',
                field: `id`,
                minWidth: 160,
                cellRendererFramework: 'operationBtn'
            }
        ];
        this.list();
    },
    beforeRouteEnter(to, from, next) {
        next();
    }
};
</script>

<style lang='scss' scoped>
</style>
