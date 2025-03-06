<template>
  <div class="right-main-wrapper" v-loading="loading" style="padding-top: 0;">
    <el-tabs v-model="activeName" class="top-tabs">
      <el-tab-pane :label='$t("common.baseSearch")' name="BASE_SEARCH"></el-tab-pane>
      <el-tab-pane :label='$t("common.noSearch")' name="NO_SEARCH"></el-tab-pane>
    </el-tabs>
    <top-search-items-slot :searchFun="list" :resetFun="clearSearchForm"  class="mb-10" :visible="activeName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="formDataRef" :inline="true" :model="nosFormData" label-width="110px" size="mini" class="multipleNoSearch">
            <el-form-item :label="getZH('blNo')" prop="blNos">
                 <el-input v-model="nosFormData.blNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('containerNo')" prop="containerNos">
                 <el-input v-model="nosFormData.containerNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <top-search-items-slot :searchFun="list" :resetFun="clearSearchForm" class="mb-10" :visible="activeName === 'BASE_SEARCH'">
      <el-form slot="multipleSearch" ref="filterForm" :inline="true" :model="filterForm" label-width="80px">
        <el-form-item :label="getZH('blNo')" prop="blNo">
          <el-input size="mini" v-model="filterForm.blNo" :placeholder="inputZH('blNo')" @keyup.enter.native="list"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('containerNo')" prop="containerNo">
          <el-input size="mini" v-model="filterForm.containerNo" :placeholder="inputZH('containerNo')" @keyup.enter.native="list"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('exportUser')" prop="createByName">
          <type-select type="user" @selected="list" v-model="filterForm.createByName"></type-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="mb-10 flex-box top-btn-wrap"  :style="{ visibility: activeName === 'BASE_SEARCH' ? 'visible' : 'hidden'}">
      <el-button type="primary" size='mini' @click="batchImportBlContainerVisible=true">{{getZH('exportBtn')}}</el-button>
      <el-button type="primary" size='mini' @click="pushBl">{{getZH('pushBl')}}</el-button>
    </div>
    <div>
      <ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" />
      <div class="pagination-wrap">
        <Pagination :total="totalData" :limit.sync="filterForm.pageSize" :page.sync="filterForm.pageNum" @pagination="list" />
      </div>
    </div>
    <BatchImportBlContainerDialog :visible.sync="batchImportBlContainerVisible" @saved="list"></BatchImportBlContainerDialog>
  </div>
</template>

<script>
import { getInboundbBlListApi, getInboundbBlListBatchApi } from '@/api/OverseasWarehouse/GRNManager';
import getZHMixin from './components/getZHMixin';
import BatchImportBlContainerDialog from './components/batchImportBlContainerDialog';
import InboundBlListTable from './table/InboundBlListTable';

export default {
    name: 'InboundBlList',
    mixins: [getZHMixin],
    components: { BatchImportBlContainerDialog },
    data() {
        return {
            activeName: 'BASE_SEARCH',
            loading: false,
            filterForm: {
                blNo: null,
                containerNo: null,
                createByName: null,
                pageNum: 1,
                pageSize: 50
            },
            nosFormData: {
                blNos: '',
                containerNos: ''
            },
            totalData: 0,
            gridApi: null,
            columnApi: null,
            gridOptions: null,
            batchImportBlContainerVisible: false,
            sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
            columnFields: [],
            dataList: []
        };
    },
    computed: {},
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.list();
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
        // 获取列表
        async list() {
            this.loading = true;
            let data = {}
            let fn = null
            if (this.activeName === 'NO_SEARCH') {
                fn = getInboundbBlListBatchApi
                data = this.nosFormData
                data.pageSize = this.filterForm.pageSize
                data.pageNum = this.filterForm.pageNum
            } else {
                fn = getInboundbBlListApi
                data = this.filterForm
            }
            const res = await fn(data);
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
         * 推送提单
         */
        pushBl() {
            this.$router.push({ name: 'InboundBlDetail' });
        },
        clearSearchForm() {
            this.$refs.filterForm && this.$refs.filterForm.resetFields();
            this.$refs.formDataRef && this.$refs.formDataRef.resetFields();
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
        this.columnFields = InboundBlListTable;
        // this.columnFields = [
        // 	// {
        // 	// 	headerName: '',
        // 	// 	checkboxSelection: true,
        // 	// 	headerCheckboxSelection: true,
        // 	// 	minWidth: 35,
        // 	// 	maxWidth: 35,
        // 	// 	pinned: 'left'
        // 	// },
        // 	{
        // 		headerName: this.getZH('rowIndex', 'common'),
        // 		minWidth: 70,
        // 		maxWidth: 70,
        // 		cellRenderer: params => params.rowIndex + 1
        // 	},
        // 	{
        // 		field: 'blNo',
        // 		headerName: this.getZH('blNo'),
        // 		minWidth: 140
        // 	},
        // 	{
        // 		field: 'containerNo',
        // 		headerName: this.getZH('containerNo'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'createTime',
        // 		headerName: this.getZH('exporTime'),
        // 		minWidth: 120,
        // 		cellRenderer: params => params.value ? this.formatDate(params.value, 'YYYY-MM-DD') : '-'
        // 	},
        // 	{
        // 		field: 'createByName',
        // 		headerName: this.getZH('exportUser'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'inboundTaskNo',
        // 		headerName: this.getZH('taskInboundNo'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'inboundTaskStatusName',
        // 		headerName: this.getZH('taskState'),
        // 		minWidth: 120
        // 	},
        // 	{
        // 		field: 'statusName',
        // 		headerName: this.getZH('pushState'),
        // 		minWidth: 120
        // 	}
        // ]
    }
};
</script>

<style lang='scss' scoped>
.features-btn {
    margin-bottom: 10px;
}
</style>
