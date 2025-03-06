<template>
  <div class="pd-16" v-loading="loading" style="padding-top: 0;">
    <el-tabs v-model="activeName" class="top-tabs">
      <el-tab-pane :label='$t("common.baseSearch")' name="BASE_SEARCH"></el-tab-pane>
      <el-tab-pane :label='$t("common.noSearch")' name="NO_SEARCH"></el-tab-pane>
    </el-tabs>
    <top-search-items-slot :searchFun="list" :resetFun="reset" class="mb-10" :visible="activeName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="formDataRef" :inline="true" :model="nosFormData" label-width="110px" size="mini" class="multipleNoSearch">
            <el-form-item :label="getZH('orderNo')" prop="orderNos" class='multiple-no-item'>
              <el-input v-model="nosFormData.orderNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('trackNo')" prop="shipmentNos" class='multiple-no-item'>
              <el-input v-model="nosFormData.shipmentNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('userOutBoundNo')" prop="outOrderNos" class='multiple-no-item'>
              <el-input v-model="nosFormData.outOrderNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
            <el-form-item :label="getZH('tradeNo')" prop="tradeNos" class='multiple-no-item'>
              <el-input v-model="nosFormData.tradeNos" type="textarea" rows="3" resize="none" clearable />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <top-search-items-slot :filterType="'mutliple'" :searchFun="list" :resetFun="reset" class="mb-10" :visible="activeName === 'BASE_SEARCH'">
      <template slot="multipleSearch">
        <el-form :inline="true" :model="formData" label-width="130px" ref="formData">
          <el-form-item :label="getZH('customerName', 'common')" prop="customerId">
            <MemberList v-model="formData.customerId" @change="list" clearable />
          </el-form-item>
          <el-form-item :label="getZH('orderNo')" prop="orderNo">
            <el-input size="mini" v-model="formData.orderNo" :placeholder="inputZH('orderNo')" @keyup.enter.native="list" maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item :label="getZH('warehouse')" prop="warehouseIds">
            <StorageWarehouseSelect v-model="formData.warehouseIds" clearable :multiple="true" @change="list" class="item-form-select" :show-all-levels="false" />
          </el-form-item>
          <el-form-item :label="getZH('trackNo')" prop="shipmentNo">
            <el-input size="mini" v-model="formData.shipmentNo" :placeholder="inputZH('trackNo')" @keyup.enter.native="list" maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item :label="getZH('status')" prop="status">
            <el-select size="mini" v-model="formData.status" @change="list">
              <el-option :value="null" :label="getZH('all')"></el-option>
              <el-option v-for="item in statusList" :key="item.code" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="getZH('carrier')" prop="carrierId">
            <SelectFilter size="mini" v-model="formData.carrierId" name-key="chineseName" value-key="id" :placeholder="selectZH('carrier')" :options="companyList" :filter-keys="[
								'chineseName',
								'chineseShortname',
								'englishName',
								'englishShortname',
								'scacCode',
							]" class="w-full" :clearable="true" @change="list" />
          </el-form-item>
          <el-form-item :label="getZH('logicProductName')" prop="productId">
            <SelectFilter size="mini" v-model="formData.productId" name-key="name" value-key="id" :placeholder="selectZH('logicProductName')" :options="productList" :filter-keys="['name', 'code']"
                          class="w-full" :clearable="true" @change="list" />
          </el-form-item>
          <el-form-item :label="getZH('outTime')">
            <el-select class="w-100" v-model="queryZone" @change="list" size="mini">
              <el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj','putInStorageManage')[Number(item)]" :value="Number(key)" />
            </el-select>
            <el-date-picker size="mini" v-model="dateTime" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp" :default-time="['00:00:00','23:59:59']"
                            @change="list">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="getZH('pickupType')" prop="pickup">
            <el-select size="mini" v-model="formData.pickup" @change="list">
              <el-option :value="null" :label="getZH('isAll')"></el-option>
              <el-option :value="true" :label="getZH('isTrue')"></el-option>
              <el-option :value="false" :label="getZH('isFalse')"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="getZH('userOutBoundNo')" prop="outOrderNo">
            <el-input size="mini" v-model="formData.outOrderNo" :placeholder="inputZH('userOutBoundNo')" @keyup.enter.native="list" maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item :label="getZH('tradeNo')" prop="tradeNo">
            <el-input size="mini" v-model.trim="formData.tradeNo" :placeholder="inputZH('tradeNo')" @keyup.enter.native="list" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item :label="getZH('submitTime')">
            <el-select class="w-100" v-model="queryZone1" @change="list" size="mini">
              <el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj','putInStorageManage')[Number(item)]" :value="Number(key)" />
            </el-select>
            <el-date-picker size="mini" v-model="submitTime" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp" :default-time="['00:00:00','23:59:59']"
                            @change="list">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
    </top-search-items-slot>
    <div class="mb-10 flex-box top-btn-wrap"  :style="{ visibility: activeName === 'BASE_SEARCH' ? 'visible' : 'hidden'}">
      <el-button type="primary" size='mini' @click="batchExportVisible=true">{{$t('common.bathExport')}}</el-button>
      <el-button type="primary" size='mini' @click="batchExportShipmentVisible=true">{{getZH('batchExportShipment')}}</el-button>
      <el-button type="primary" size='mini' @click="batchImportShipmentVisible=true">{{getZH('batchImportShipmentNo')}}</el-button>
      <el-checkbox class="ml-20" v-model="isCurrentZone">{{getZH('isCurrentZone')}}</el-checkbox>
    </div>
    <div>
      <ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" />
    </div>
    <Pagination :total="total" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
    <ThroughFile :id="activeId" :visible.sync="throughFileVisible" />
    <SupplementaryInfoDialog :id="activeId" :visible.sync="supplementaryInfoVisible" :actualPalletQuantity="actualPalletQuantity" :boxQuantity='boxQuantity' @saved="list" />
    <BatchExportDialog :visible.sync="batchExportVisible" @saved="bathExport" :exportType="2" />
    <BatchExportShipment :visible.sync="batchExportShipmentVisible" @saved="batchExportShipmentSaved($event,formData)" />
    <AbnormalDialog :visible.sync="dialog.visible" @saved="list" :id="activeId" :orderNo="activeOrderNo" />
    <BatchImportShipmentNoDialog :visible.sync="batchImportShipmentVisible" :type="3" />
  </div>
</template>

<script>
import StorageWarehouseSelect from '../components/storageWarehouseSelect.vue';
import OperationBtn from './components/operationBtn.vue';
import ThroughFile from './components/throughFile.vue';
import ShipmentNos from './components/ShipmentNos.vue';
import getZHMixin from './components/getZHMixin';
import commonOutboundFn from './components/commonOutboundFn';
import SupplementaryInfoDialog from './components/supplementaryInfoDialog.vue';
import BatchExportDialog from '../PutInStorageManage/components/batchExportDialog';
// import BatchExportShipment from './components/batchExportShipment.vue'
import BatchExportShipment from './components/batchExportShipment';
import AbnormalDialog from './components/abnormalDialog.vue';
import {
    getMergePackBoundsListApi,
    getMergePackBoundsListBatchApi,
    getProductListApi,
    getOutboundStatusApi,
    getLogisticsCompanyApi,
    exportOutboundsListApi,
    exportOutboundsShipmentApi
} from '@/api/OverseasWarehouse/outInStorageManage.js';
import { getTimeByQueryTimeZone, handlerTimeStr } from '@/utils';
import { zoneObj } from './components/zoneObj';
import BatchImportShipmentNoDialog from './components/batchImportShipmentNoDialog';
import { logServiceName, pointOvl, logOrigin } from '@/utils/constant';
import mergePackListTable from './table/mergePackListTable';

export default {
    name: 'MergePackList',
    mixins: [getZHMixin, commonOutboundFn],
    components: {
        StorageWarehouseSelect,
        OperationBtn,
        ThroughFile,
        SupplementaryInfoDialog,
        ShipmentNos,
        BatchExportDialog,
        BatchExportShipment,
        AbnormalDialog,
        BatchImportShipmentNoDialog
    },
    data() {
        return {
            activeName: 'BASE_SEARCH',
            gridOptions: null,
            sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
            loading: false,
            activeId: null,
            activeOrderNo: null,
            actualPalletQuantity: null,
            boxQuantity: null,
            throughFileVisible: false,
            supplementaryInfoVisible: false,
            batchExportShipmentVisible: false,
            dataList: [],
            isCurrentZone: true,
            currentZone: -new Date().getTimezoneOffset() / 60,
            queryZone: -new Date().getTimezoneOffset() / 60,
            queryZone1: -new Date().getTimezoneOffset() / 60,
            zoneObj,
            total: 0,
            dateTime: [],
            submitTime: [],
            productList: [],
            statusList: [],
            companyList: [],
            batchExportVisible: false,
            batchImportShipmentVisible: false,
            columnData: [
                {
                    headerName: '',
                    checkboxSelection: true,
                    headerCheckboxSelection: true,
                    minWidth: 35,
                    maxWidth: 35,
                    pinned: 'left'
                },
                {
                    headerName: this.getZH('customerName', 'common'),
                    field: 'customerName',
                    minWidth: 140
                },
                {
                    headerName: this.getZH('orderNo'),
                    field: 'orderNo',
                    minWidth: 180,
                    cellRenderer: params => {
                        let divElement = document.createElement('div');
                        divElement.className = 'flex-box';
                        let spanElement = document.createElement('span');
                        spanElement.innerText = params.value;
                        divElement.appendChild(spanElement);
                        if (params.data.timeoutFlag) {
                            let imageElement = document.createElement('img');
                            imageElement.src = params.data.timeoutImg;
                            imageElement.title = '超48小时未出库';
                            imageElement.style.width = '16px';
                            imageElement.style.height = '16px';
                            imageElement.style.marginLeft = '10px';
                            divElement.appendChild(imageElement);
                        }
                        return divElement;
                    }
                },
                {
                    headerName: this.getZH('abnormalFlag'),
                    field: 'abnormalFlag',
                    minWidth: 120,
                    cellRenderer: params => (params.data.abnormalFlag ? this.getZH('isTrue') : this.getZH('isFalse'))
                },
                {
                    headerName: this.getZH('userOutBoundNo'),
                    field: 'outOrderNo',
                    minWidth: 180
                },
                {
                    headerName: this.getZH('tradeNo'),
                    field: 'tradeNo',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('warehouse'),
                    field: 'warehouseName',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('carrier'),
                    field: 'carrierName',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('logicProductName'),
                    field: 'productName',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('trackNo'),
                    field: 'shipmentNos',
                    minWidth: 140,
                    cellRendererFramework: 'ShipmentNos'
                },
                {
                    headerName: this.getZH('orderType'),
                    field: 'typeName',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('transportMode'),
                    field: 'transportModeName',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('pickupType'),
                    field: 'pickup',
                    minWidth: 140,
                    cellRenderer: params => (params.data.pickup ? this.getZH('isTrue') : this.getZH('isFalse'))
                },
                {
                    headerName: this.getZH('status'),
                    field: 'statusName',
                    minWidth: 110
                },
                {
                    headerName: this.getZH('skuSpecies'),
                    field: 'skuKindsQuantity',
                    minWidth: 110
                },
                {
                    headerName: this.getZH('theDelivery'),
                    field: 'skuQuantity',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('outTime'),
                    field: 'outTimeStr',
                    minWidth: 220
                },
                {
                    headerName: this.getZH('submitTime'),
                    field: 'submitTimeStr',
                    minWidth: 220
                },
                {
                    headerName: this.getZH('createTime'),
                    field: 'createTimeStr',
                    minWidth: 220
                },
                {
                    headerName: this.getZH('arrivalContact'),
                    field: 'arrivalContact',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('arrivalNormalized'),
                    field: 'cityDetail',
                    minWidth: 160
                },
                {
                    headerName: this.getZH('arrivalZipcode'),
                    field: 'arrivalZipcode',
                    minWidth: 160
                },
                {
                    headerName: this.getZH('email'),
                    field: 'arrivalContactEmail',
                    minWidth: 160
                },
                {
                    headerName: this.getZH('rejectMessage'),
                    field: 'rejectMessage',
                    minWidth: 140
                },

                {
                    headerName: this.getZH('abnormalMessage'),
                    field: 'abnormalMessage',
                    minWidth: 150
                },
                {
                    field: 'sellerName',
                    headerName: this.getZH('sellerName'),
                    minWidth: 150
                },
                {
                    headerName: this.getZH('operation'),
                    pinned: 'right',
                    field: `id`,
                    minWidth: 220,
                    cellRendererFramework: 'OperationBtn'
                }
            ],
            formData: {
                shipmentNo: '',
                orderNo: '',
                productId: '',
                warehouseId: '',
                warehouseIds: '',
                status: '',
                outTimeStart: null,
                outTimeEnd: null,
                submitTimeStart: null,
                submitTimeEnd: null,
                carrierId: '',
                customerId: '',
                pickup: null,
                type: null,
                outOrderNo: null,
                pageNum: 1,
                pageSize: 50
            },
            nosFormData: {
                type: 30,
                orderNos: '',
                outOrderNos: '',
                shipmentNos: '',
                tradeNos: ''
            }
        };
    },
    created() {
        this.formData.type = this.$route.meta.status;
        this.gridOptions = {
            context: {
                componentParent: this
            },
            rowSelection: 'multiple', // 设置多行可选
            animateRows: true,
            suppressRowClickSelection: true // 选中单元格后可以复制内容
            // suppressCellSelection: true, //点击不选中单元格
        };
        this.columnFields = mergePackListTable;
        this.init();
        this.list();
    },
    beforeRouteEnter(to, form, next) {
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
        handlerQuery() {
            if (this.activeName === 'NO_SEARCH') {
                let data = {}
                data = this.nosFormData
                data.pageNum = this.formData.pageNum
                data.pageSize = this.formData.pageSize
                return data
            }
            this.formData.outTimeStart = this.$isNotEmpty(this.dateTime)
                ? getTimeByQueryTimeZone(this.dateTime[0], this.queryZone)
                : null;
            this.formData.outTimeEnd = this.$isNotEmpty(this.dateTime)
                ? getTimeByQueryTimeZone(this.dateTime[1], this.queryZone)
                : null;
            this.formData.submitTimeStart = this.$isNotEmpty(this.submitTime)
                ? getTimeByQueryTimeZone(this.submitTime[0], this.queryZone1)
                : null;
            this.formData.submitTimeEnd = this.$isNotEmpty(this.submitTime)
                ? getTimeByQueryTimeZone(this.submitTime[1], this.queryZone1)
                : null;
            let queryForm = this.$extends(true, {}, this.formData);
            delete queryForm.pageSize;
            delete queryForm.pageNum;
            return queryForm;
        },

        /**
         * 初始化基础数据
         */
        async init() {
            // 物流产品
            let rs = await getProductListApi({ mergePackageFlag: true });
            if (rs.ok) {
                this.productList = rs.content;
            }
            // 物流公司
            let result = await getLogisticsCompanyApi();
            if (result.ok) {
                this.companyList = result.content;
            }
            // 状态
            let res = await getOutboundStatusApi();
            if (res.ok) {
                this.statusList = res.content.filter(item => item.code !== '100');
            }
        },

        /**
         * 获取列表数据
         */
        async list() {
            this.loading = true;
            let data = this.handlerQuery()
            let fn = null
            if (this.activeName === 'NO_SEARCH') {
                fn = getMergePackBoundsListBatchApi
            } else {
                fn = getMergePackBoundsListApi
            }
            let res = await fn(data);
            if (res.ok) {
                res.content.list.forEach(item => {
                    let str =
                        item.arrivalAddress1 +
                        (item.arrivalAddress2 ? item.arrivalAddress2 : '') +
                        '，' +
                        item.arrivalCity +
                        (item.arrivalProvinceName ? '，' + item.arrivalProvinceName : '') +
                        (item.arrivalCountryName ? '，' + item.arrivalCountryName : '');
                    item.cityDetail = str;
                });
                this.dataList = res.content.list;
                this.total = Number(res.content.total);
                this.loading = false;
            } else {
                this.loading = false;
            }
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
                saveData = { ...{ ids, type: this.formData.type }, ...data };
            } else {
                saveData = { ...this.handlerQuery(), ...data };
            }
            this.loading = true;
            let res = await exportOutboundsListApi(saveData);
            if (res.ok) {
                // 添加日志 记录数据
                this.logBtnSend({
                    origin: logOrigin.SYSTEM_OPERATION,
                    logCode: pointOvl.OVL_INBOUND_MERGE_PACK_EXPORT,
                    serviceName: logServiceName.OVL_SERVICE,
                    businessType: pointOvl.OVL_INBOUND_MERGE_PACK_EXPORT,
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
         * 上传bol补录文件
         */
        uploadFile(id) {
            this.activeId = id;
            this.throughFileVisible = true;
        },
        /**
         * 补录信息
         */
        updateBaseInfo(row) {
            this.activeId = row.id;
            this.actualPalletQuantity = row.actualPalletQuantity;
            this.boxQuantity = row.boxQuantity;
            this.supplementaryInfoVisible = true;
        },
        /**
         * 新建编辑
         */
        edit(id) {},
        /**
         * 查看详情
         */
        detail(id, type) {
            type = type || '0';
            this.$router.push({ name: 'OutboundDetail', query: { id: id, time: new Date().getTime(), type } });
        },
        /**
         * 查看详情
         */
        audit(id) {
            this.$router.push({ name: 'OutboundDetail', query: { id: id, time: new Date().getTime(), audit: true } });
        },
        /**
         * 重置搜索条件
         */
        reset() {
            this.dateTime = [];
            this.submitTime = [];
            this.$refs.formData && this.$refs.formData.resetFields();
            this.$refs.formDataRef && this.$refs.formDataRef.resetFields();
            this.list();
        }
    }
};
</script>

<style scoped lang="scss">
.container-wrap {
    margin-top: 20px;
    padding: 10px 20px;
    background: #fff;
}
</style>
