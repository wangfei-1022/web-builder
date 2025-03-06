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
            <el-form-item :label="getZH('stockNo')" prop="inboundNos">
                <el-input v-model="nosFormData.inboundNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('groundingNo')" prop="batchNos">
                <el-input v-model="nosFormData.batchNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="$t('inventoryManager.containerNo')" prop="containerNos">
                <el-input v-model="nosFormData.containerNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('warehouseId')" prop="warehouseIds">
                 <StorageWarehouseSelect v-model="nosFormData.warehouseIds" clearable multiple />
            </el-form-item>
            <el-form-item class="el-form-item" :label="getZH('customerName', 'common')" prop="customerIds">
                <ovl-select v-model="nosFormData.customerIds" type="customer" multiple filterable :params="{businessType: 'OVERSEAS_WAREHOUSE'}"></ovl-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <top-search-items-slot :searchFun="getList" :resetFun="clearSearchForm" class="mb-10" :visible="activeName === 'BASE_SEARCH'">
      <el-form slot="multipleSearch" ref="filterForm" :inline="true" :model="filterForm" size="mini" @submit.native.prevent>
        <el-form-item :label="getZH('sysCode')" prop="sysCode" label-width="80px">
          <el-input v-model="filterForm.systemBarCode" @keyup.enter.native="getList" clearable @clear="getList" :placeholder="inputZH('sysCode')"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('SKUCategory')" prop="skuCode" label-width="100px">
          <el-input v-model="filterForm.skuCode" @keyup.enter.native="getList" clearable @clear="getList" :placeholder="inputZH('SKUCategory')"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('stockNo')" prop="orderNo" label-width="100px">
          <el-input v-model="filterForm.orderNo" @keyup.enter.native="getList" clearable :placeholder="inputZH('stockNo')"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('customerName', 'common')" prop="customerId" label-width="80px">
          <MemberList v-model="filterForm.customerId" @change="getList" />
        </el-form-item>
        <el-form-item :label="getZH('warehouseId')" label-width="50px" prop="warehouseId">
          <StorageWarehouseSelect v-model="filterForm.warehouseId" clearable @change="getList" />
        </el-form-item>
        <el-form-item :label="getZH('groundingNo')" prop="groundingNo" label-width="50px">
          <el-input size="mini" v-model="filterForm.groundingNo" clearable @keyup.enter.native="getList" :placeholder="inputZH('groundingNo')"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('saleCountryCodes')" prop="saleCountryCodes" label-width="80px">
          <el-select v-model="filterForm.saleCountryCodes" filterable clearable @change="getList">
            <el-option v-for="item in countryList" :key="item.code2" :label="item.chineseShortname" :value="item.code2" />
          </el-select>
        </el-form-item>
        <el-form-item :label="getZH('stockNameZh')" prop="name" label-width="60px">
          <el-input v-model="filterForm.name" :placeholder="inputZH('stockNameZh')" @keyup.enter.native="getList" clearable @clear="getList"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('stockNameEn')" prop="englishName" label-width="60px">
          <el-input v-model="filterForm.englishName" :placeholder="inputZH('stockNameEn')" @keyup.enter.native="getList" clearable @clear="getList"></el-input>
        </el-form-item>
        <el-form-item :label="$t('inventoryManager.containerNo')" prop="containerNo">
          <el-input size="mini" v-model.trim="filterForm.containerNo" @keyup.enter.native="getList" :placeholder="inputZH('containerNo')"></el-input>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="top-btn-wrap mb-10" :style="{ visibility: activeName === 'BASE_SEARCH' ? 'visible' : 'hidden'}" >
      <el-button type="primary" @click="exportAll" size="mini">
        {{getZH('searchExport')}}
      </el-button>
    </div>
    <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="rowData" :enable-col-resize="true"
                 :enable-sorting="true" :grid-ready="onReady" :animate-rows="false" :style="gridHeight" class="ag-theme-balham" />
    <Pagination :total="totalData" :limit.sync="pageForm.pageSize" :page.sync="pageForm.pageNum" @pagination="getList" />
  </div>
</template>

<script>
import { getCountryListApi } from '@/api/OverseasWarehouse/goodsManager';
import { getInventoryAgeListApi, exportInventoryAgeApi, getInventoryAgeListBatchApi } from '@/api/inventory';
import StorageWarehouseSelect from '../components/storageWarehouseSelect';
import batchListBtn from './components/batchListBtn';
import getZHMixin from './components/getZHMixin';
export default {
    name: 'BatchList',
    mixins: [getZHMixin],
    data() {
        return {
            activeName: 'BASE_SEARCH',
            loading: false,
            tempList: [],
            countryList: [],
            filterForm: {
                systemBarCode: '',
                skuCode: '',
                warehouseId: '',
                customerId: '',
                groundingNo: '',
                optStartTime: '',
                optEndTime: '',
                name: '',
                englishName: '',
                orderNo: null
            },
            nosFormData: {
                containerNos: '',
                batchNos: '',
                warehouseIds: [],
                inboundNos: '',
                customerIds: []
            },
            pageForm: {
                pageNum: 1,
                pageSize: 50
            },
            totalData: 0,
            gridApi: null,
            columnApi: null,
            gridOptions: null,
            sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
            columnFields: [],
            rowData: []
        };
    },
    components: { StorageWarehouseSelect, batchListBtn },
    computed: {},
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
        async getCountryList() {
            const res = await getCountryListApi();
            if (res.ok) {
                this.countryList = res.content;
            }
        },

        async getList() {
            this.loading = true;
            let data = {}
            let fn = null
            if (this.activeName === 'NO_SEARCH') {
                fn = getInventoryAgeListBatchApi
                data = {...this.nosFormData, ...this.pageForm }
            } else {
                fn = getInventoryAgeListApi
                data = {...this.filterForm, ...this.pageForm }
            }
            let res = await fn(data);
            if (res.ok) {
                this.rowData = res.content.list;
                this.totalData = Number(res.content.total);
            } else {
                this.rowData = [];
                this.totalData = 0;
            }
            this.loading = false;
        },
        clearSearchForm() {
            this.$refs.filterForm && this.$refs.filterForm.resetFields();
            this.$refs.formDataRef && this.$refs.formDataRef.resetFields();
            this.filterForm.orderNo = null;
            this.getList();
        },
        async exportAll() {
            const _selectedRows = this.gridApi.getSelectedRows();
            let saveData = {};
            let ids = [];
            if (this.$isNotEmpty(_selectedRows)) {
                _selectedRows.forEach(item => {
                    ids.push(item.id);
                });
                saveData = { ids };
            } else {
                saveData = { ...this.filterForm };
            }
            this.loading = true;
            const res = await exportInventoryAgeApi(saveData);
            if (res.ok) {
                this.$alert(
                    `<div><span class="fc-red fs-16">${this.getZH(
                        'handlerTime',
                        'common'
                    )}</span><span class="fs-16">,${this.getZH('handlerRes', 'common')}</span></div>`,
                    this.getZH('handlerExportTips', 'common'),
                    {
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: this.getZH('theKnow', 'common'),
                        callback: () => {}
                    }
                );
            }
            this.loading = false;
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
        this.columnFields = [
            {
                headerName: '',
                checkboxSelection: true,
                headerCheckboxSelection: true,
                minWidth: 35,
                maxWidth: 35,
                pinned: 'left'
            },
            {
                field: 'customerName',
                headerName: this.getZH('customerName', 'common'),
                minWidth: 80
            },
            {
                field: 'systemBarCode',
                headerName: this.getZH('systemCategory'),
                minWidth: 120
            },
            {
                field: 'skuCode',
                headerName: this.getZH('SKUCategory'),
                minWidth: 120
            },
            {
                field: 'warehouseName',
                headerName: this.getZH('warehouseId'),
                minWidth: 120
            },
            {
                field: 'groundingNo',
                headerName: this.getZH('groundingNo'),
                minWidth: 50
            },
            {
                field: 'quantityGrounding',
                headerName: this.getZH('batchStockAmount'),
                minWidth: 50
            },
            {
                field: 'stock',
                headerName: this.getZH('batchCurrInventory'),
                minWidth: 50
            },
            {
                field: 'groundingAge',
                headerName: this.getZH('groundingAge'),
                minWidth: 80
            },
            {
                field: 'orderNo',
                headerName: this.getZH('stockNo'),
                minWidth: 120
            },
            {
                field: 'containerNo',
                headerName: this.getZH('containerNo'),
                minWidth: 120
            },
            {
                field: 'name',
                headerName: this.getZH('stockNameZh'),
                minWidth: 120
            },
            {
                field: 'englishName',
                headerName: this.getZH('stockNameEn'),
                minWidth: 120
            },
            {
                field: 'mrnNo',
                headerName: this.getZH('mrnNo', 'putInStorageManage'),
                minWidth: 120
            },
            {
                field: 'mrnCreateTime',
                headerName: this.getZH('mrnCreateTime', 'putInStorageManage'),
                minWidth: 100,
                cellRenderer: params => this.formatDate(params.value, 'YYYY-MM-DD')
            },
            {
                field: 'id',
                headerName: this.getZH('operation', 'common'),
                minWidth: 110,
                pinned: 'right',
                cellRendererFramework: 'batchListBtn'
            }
        ];
        let route = this.$route.query;
        if (this.$isNotEmpty(route)) {
            this.$copyProps(this.filterForm, route);
        }
        this.getCountryList();
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
</style>
