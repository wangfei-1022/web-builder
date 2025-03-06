<template>
  <div v-loading="loading" class="pd-16" style="padding-top: 0;">
    <div class="mb-10">
        <el-tabs v-model="activeName" class="top-tabs">
            <el-tab-pane :label='$t("common.baseSearch")' name="BASE_SEARCH"></el-tab-pane>
            <el-tab-pane :label='$t("common.noSearch")' name="NO_SEARCH"></el-tab-pane>
        </el-tabs>
        <top-search-items-slot :searchFun="list" :resetFun="reset"  class="mb-10" :visible="activeName === 'NO_SEARCH'">
            <template slot="multipleSearch">
                <div class="multiple-no-wrap">
                    <el-form ref="formDataRef" :inline="true" :model="nosFormData" label-width="110px" size="mini" class="multipleNoSearch">
                        <el-form-item :label="getZH('storageReservationNumber')" prop="orderNos">
                            <el-input v-model="nosFormData.orderNos" type="textarea" rows="3" resize="none" clearable />
                        </el-form-item>
                    </el-form>
                </div>
            </template>
        </top-search-items-slot>
      <TopSearchItemsSlot :searchFun="list" :resetFun="reset" :visible="activeName === 'BASE_SEARCH'">
        <template slot="multipleSearch">
          <el-form ref="formData" :inline="true" :model="formData" class="search-form" label-width="100px">
            <el-form-item class="el-form-item" :label="getZH('storageReservationNumber')" prop="no">
              <el-input v-model="formData.no" size="mini" :placeholder="inputZH('storageReservationNumber')" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item class="el-form-item" :label="getZH('warehouse')" prop="warehouseId">
              <StorageWarehouseSelect v-model="formData.warehouseId" @change="list" clearable />
            </el-form-item>
            <el-form-item class="el-form-item" :label="getZH('inWarehouseType')" prop="inWarehouseType">
              <el-select v-model="formData.inWarehouseType" size="mini" @change="list">
                <el-option v-for="item in constant.receiveTypes" :key="item.value" :label="getZH(item.label)" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item class="el-form-item" :label="getZH('customerName', 'common')" prop="customerId">
              <MemberList v-model="formData.customerId" @change="list" clearable />
            </el-form-item>
            <el-form-item class="el-form-item" :label="getZH('orderState')" prop="orderState">
              <el-select v-model="formData.orderState" size="mini" @change="list">
                <el-option v-for="item in constant.status" :key="item.value" :label="getZH(item.label)" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item class="el-form-item" :label="getZH('expectArriveWarehouseTime')" prop="expectArriveWarehouseRange">
              <CommonPicker class="input-date-picker" size="mini" :pikcerType="'daterange'" :pickerFormat="'yyyy-MM-dd'" v-model="formData.expectArriveWarehouseRange" @change="list"
                            :clearable="true" />
            </el-form-item>
          </el-form>
        </template>
      </TopSearchItemsSlot>
    </div>
    <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptionsRight" :side-bar="sideBarDefs" :column-defs="columnDefsRight" :row-data="dataList" :enable-col-resize="true"
                 :enable-sorting="true" :grid-ready="onReadyRight" :style="gridHeight" class="ag-theme-balham" />
    <Pagination :total="total" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
    <el-dialog :visible.sync="showHandleOrderDialog" width="500px" :before-close="onDialogClose" :title="getZH('handleResult')">
      <h4>
        <i class="el-icon-warning-outline" style="font-size: 16px; color: #f7c955"></i>
        {{ selectZH("refuseReason") }}
      </h4>
      <el-form label-width="50px" size="small" :model="dialogForm" ref="dialogForm">
        <el-form-item :label="getZH('reason')" prop="refuseReason" :rules="[
						{
							required: true,
							message: selectZH('refuseReason'),
							trigger: 'change',
						},
					]">
          <el-select v-model="dialogForm.refuseReason" :placeholder="selectZH('refuseReason')" class="w-full">
            <el-option :value="getZH('warehouseInsufficient')" :label="getZH('warehouseInsufficient')"></el-option>
            <el-option :value="getZH('other')" :label="getZH('other')"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="getZH('remark')" prop="remarks">
          <el-input class="w-full" rows="6" type="textarea" :placeholder="inputZH('remark')" resize="none" v-model="dialogForm.remarks" maxlength="250" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-wrap" style="text-align: right">
        <el-button size="mini" @click="showHandleOrderDialog = false">
          {{ getZH("cancelBtn", "common") }}
        </el-button>
        <el-button type="primary" size="mini" @click="submitReason">
          {{ getZH("submitBtn", "common") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers } from '@/api/user';
import {
    getStorageReservationListApi,
    getStorageReservationListBatchApi,
    setRefuseReasonApi,
    followUpInboundApi
} from '@/api/OverseasWarehouse/GRNManager';
import { getWarehouseListApi } from '@/api/OverseasWarehouse/warehouse';
import StorageWarehouseSelect from '../components/storageWarehouseSelect.vue';
import operationBtn from './components/operationBtn';
import constant from './components/constant.js';
import getZHMixin from './components/getZHMixin';
export default {
    name: 'StorageReservationForm',
    mixins: [getZHMixin],
    components: { operationBtn, StorageWarehouseSelect },
    data() {
        return {
            activeName: 'BASE_SEARCH',
            showHandleOrderDialog: false,
            handlerId: '',
            formData: {
                expectArriveWarehouseRange: [],
                expectArriveWarehouseStartTime: null,
                expectArriveWarehouseEndTime: null,
                inWarehouseType: null,
                no: null,
                orderState: null,
                warehouseId: null,
                customerId: '',
                pageSize: 50,
                pageNum: 1
            },
            nosFormData: { 
                orderNos: ''
            },
            dialogForm: {
                refuseReason: '',
                remarks: ''
            },
            constant,
            total: 0,
            offetsetNumber: new Date().getTimezoneOffset() * 60 * 1000,
            dataList: [],
            columnDefsRight: [
                {
                    headerName: this.getZH('customerName', 'common'),
                    field: 'customerName',
                    minWidth: 160
                },
                {
                    headerName: this.getZH('storageReservationNumber'),
                    field: 'no',
                    minWidth: 160
                },
                {
                    headerName: this.getZH('orderInboundNo'),
                    field: 'orderInboundNo',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('inWarehouseType'),
                    field: 'inWarehouseTypeName',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('warehouse'),
                    field: 'warehouseName',
                    minWidth: 160
                },
                {
                    field: 'createTime',
                    headerName: this.getZH('createTime'),
                    minWidth: 160,
                    cellRenderer: params => this.formatDate(params.value, 'YYYY-MM-DD')
                },
                {
                    field: 'expectArriveWarehouseTime',
                    headerName: this.getZH('expectArriveWarehouseTime'),
                    minWidth: 160,
                    cellRenderer: params => this.formatDate(params.value, 'YYYY-MM-DD')
                },
                {
                    headerName: this.getZH('orderState'),
                    field: 'orderStateName',
                    minWidth: 100,
                    cellRenderer: params => {
                        if (params.data.operatorDealStatus === 10) {
                            return this.getZH('confirmFollowUp');
                        } else if (params.data.operatorDealStatus === 11) {
                            return this.getZH('refuseFollowUp');
                        } else {
                            return params.data.orderStateName;
                        }
                    }
                },
                {
                    headerName: this.getZH('forecastSKUTypes'),
                    field: 'cargoKindsCount',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('forecastSKUTotal'),
                    field: 'cargoQuantity',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('expectTrayCount'),
                    field: 'expectTrayCount',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('expectBoxCount'),
                    field: 'expectBoxCount',
                    minWidth: 120
                },

                {
                    headerName: this.getZH('remark'),
                    field: 'remarks',
                    minWidth: 280
                },
                {
                    headerName: this.getZH('refuseReason'),
                    field: 'refuseReason',
                    minWidth: 220
                },
                {
                    headerName: this.getZH('operation', 'common'),
                    pinned: 'right',
                    field: `id`,
                    minWidth: 140,
                    cellRendererFramework: 'operationBtn'
                }
            ],
            gridOptionsRight: {},
            sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
            loading: false
        };
    },
    watch: {},
    created() {
        this.gridOptionsRight = {
            context: {
                componentParent: this
            }
        };
        this.formData.goodsStatus = this.$route.meta.status;
        this.list();
    },
    mounted() {},
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.name === 'StorageReservationFormDetail') {
                vm.list();
            }
        });
    },
    methods: {
        /**
         * 仓库模糊查询
         */
        getWarehouseList({ keyword }) {
            return getWarehouseListApi({ name: keyword, pageSize: 10000, pageNum: 1 });
        },
        /**
         * 客户模糊查询
         */
        getMember({ keyword }) {
            keyword = keyword.trim();
            return getUsers({ userName: keyword, pageSize: 10000, pageNum: 1 });
        },
        /**
         * 初始化数据
         */
        async init() {},
        onReadyRight(params) {
            // const self = this
            params.api.sizeColumnsToFit();
            window.addEventListener('resize', () => {
                setTimeout(() => {
                    params.api.sizeColumnsToFit();
                    // self.onFirstDataRendered()
                });
            });
        },
        /**
         * 获取列表
         */
        async list() {
            this.loading = true;
            
            let data = {}
            let fn = null
            if (this.activeName === 'NO_SEARCH') {
                fn = getStorageReservationListBatchApi
                data = this.nosFormData
                data.pageSize = this.formData.pageSize
                data.pageNum = this.formData.pageNum
            } else {
                fn = getStorageReservationListApi
                data = this.$extends(true, {}, this.formData);
                if (this.$isNotEmpty(data.expectArriveWarehouseRange)) {
                    console.log(data.expectArriveWarehouseRange);
                    data.expectArriveWarehouseStartTime =
                        Number(this.formData.expectArriveWarehouseRange[0]) - this.offetsetNumber;
                    data.expectArriveWarehouseEndTime =
                        Number(this.formData.expectArriveWarehouseRange[1]) - this.offetsetNumber + 24 * 60 * 60 * 1000;
                } else {
                    this.formData.expectArriveWarehouseStartTime = null;
                    this.formData.expectArriveWarehouseEndTime = null;
                }
                delete data.expectArriveWarehouseRange;
            }
            const res = await fn(data).catch(res => {
                this.loading = false;
            });
            if (res.ok) {
                res.content.list.forEach(item => {
                    if (this.$isNotEmpty(item.expectArriveWarehouseTime)) {
                        item.expectArriveWarehouseTime = Number(item.expectArriveWarehouseTime) + this.offetsetNumber;
                    }
                });
                this.dataList = res.content.list || [];
                this.total = Number(res.content.total);
            }
            this.loading = false;
        },
        /**
         * 新增编辑
         */
        edit(id, isDetail) {
            this.$router.push({
                name: `StorageReservationFormDetail`,
                query: { id, type: isDetail, time: new Date().getTime() }
            });
        },
        /**
         * 处理
         */
        handler(id) {
            this.handlerId = id;
            this.showHandleOrderDialog = true;
        },
        /**
         * 重置搜索条件
         */
        reset() {
            this.$refs.formData && this.$refs.formData.resetFields();
            this.$refs.formDataRef && this.$refs.formDataRef.resetFields();
            this.list();
        },
        /**
         * 跟进
         */
        async followUp(id) {
            this.loading = true;
            let res = await followUpInboundApi(id);
            if (res.ok) {
                this.$message.success(this.getZH('followUpSuccess'));
                this.loading = false;
                this.list();
            } else {
                this.loading = false;
            }
        },
        /**
         * 提交拒绝原因
         */
        submitReason() {
            this.$refs.dialogForm.validate(async valid => {
                if (valid) {
                    let saveData = {
                        refuseReason:
                            this.dialogForm.refuseReason +
                            (this.$isNotEmpty(this.dialogForm.remarks) ? '：' + this.dialogForm.remarks : '')
                    };
                    const res = await setRefuseReasonApi(this.handlerId, saveData);
                    if (res.ok) {
                        this.showHandleOrderDialog = false;
                        this.list();
                    }
                }
            });
        },
        onDialogClose(done) {
            this.$refs.dialogForm.resetFields();
            this.$nextTick(() => {
                this.$refs.dialogForm.clearValidate();
            });
            done();
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
::v-deep.status-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    .status-dot {
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 6px;
        background: #ccc;
        margin-right: 4px;
        &.processing {
            background: #e6a23c;
        }
        &.successed {
            background: #67c23a;
        }
        &.rejected {
            background: #f56c6c;
        }
    }
}
</style>
