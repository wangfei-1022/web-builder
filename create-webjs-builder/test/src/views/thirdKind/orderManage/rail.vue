<template>
  <div v-loading="loading" class="pd-16">
    <TopSearchItemsSlot :searchFun="list" :resetFun="reset" class="mb-10">
      <template slot="multipleSearch">
        <el-form ref="formData" :inline="true" :model="formData" class="search-form" label-width="100px">
          <el-form-item :label="getZH('orderNo')" prop="orderNo">
            <el-input v-model="formData.orderNo" size="mini" :placeholder="inputZH('orderNo')" clearable @keyup.enter.native="list" />
          </el-form-item>
          <el-form-item :label="getZH('mblNo')" prop="mblNo">
            <el-input v-model="formData.mblNo" size="mini" :placeholder="inputZH('blNo')" clearable @keyup.enter.native="list" />
          </el-form-item>
          <el-form-item :label="getZH('customer')" prop="customerId">
            <type-select v-model="formData.customerId" type="customer" @selected="list" />
          </el-form-item>
          <el-form-item :label="getZH('businessType')" prop="businessType" v-if="false">
            <el-select v-model="formData.businessType" :placeholder="selectZH('businessType')" size="mini" @change="list">
              <el-option :label="getZH('all','common')" :value="null" />
              <el-option v-for="item in businessTypeList" :key="item.code" :label="item.chineseName" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="getZH('etd')" prop="businessDate">
            <search-date-picker v-model="formData.businessDate" clearable size="mini" />
          </el-form-item>
          <el-form-item :label="getZH('polCodeStation')" prop="polCode">
            <type-select v-model="formData.polCode" type="railstation" @selected="list" />
          </el-form-item>
          <el-form-item :label="getZH('podCodeStation')" prop="podCode">
            <type-select v-model="formData.podCode" type="railstation" @selected="list" />
          </el-form-item>
          <el-form-item :label="getZH('supplier')" prop="supplierId">
            <type-select v-model="formData.supplierId" type="supplier" @selected="list" />
          </el-form-item>
          <el-form-item :label="getZH('eta')" prop="eta">
            <search-date-picker v-model="formData.eta" clearable size="mini" />
          </el-form-item>
          <el-form-item :label="getZH('receivableState')" prop="receivableState">
            <el-select size="mini" v-model="formData.receivableState" @change="list">
              <el-option :label="getZH('all','common')" :value="null"></el-option>
              <el-option :label="getZH('beMaintained')" :value="10"></el-option>
              <el-option :label="getZH('maintained')" :value="20"></el-option>
              <el-option :label="getZH('confirmed')" :value="30"></el-option>
              <el-option :label="getZH('beAdjusting')" :value="40"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="getZH('payableState')" prop="payableState">
            <el-select size="mini" v-model="formData.payableState" @change="list">
              <el-option :label="getZH('all','common')" :value="null"></el-option>
              <el-option :label="getZH('beMaintained')" :value="10"></el-option>
              <el-option :label="getZH('maintained')" :value="20"></el-option>
              <el-option :label="getZH('confirmed')" :value="30"></el-option>
              <el-option :label="getZH('beAdjusting')" :value="40"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="getZH('lockOrderState')" prop="lockOrderState">
            <fms-select size="mini" v-model="formData.lockOrderState" type="lockOrderState" addAll @change="list" />
          </el-form-item>
        </el-form>
      </template>
    </TopSearchItemsSlot>
    <div class="mb-10 top-btn-wrap">
      <el-button size="mini" type="primary" @click="addItem" v-permission="['thk:order:add']">{{getZH('addItem')}}</el-button>
      <!-- <el-button size="mini" type="primary" @click="importFn">{{getZH('importOrder')}}</el-button> -->
    </div>
    <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptionsRight" :side-bar="sideBarDefs" :column-defs="columnDefsRight" :row-data="dataList" :enable-col-resize="true"
                 :enable-sorting="true" :grid-ready="onReadyRight" :style="gridHeight" class="ag-theme-balham" />
    <Pagination :total="total" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
    
    <el-dialog :title="getZH('addItem')" :visible.sync="dialog.visible" width="400px">
      <div v-if="dialog.visible">
        <el-form ref="addForm" :model="addForm" label-width="95px" label-position="left">
          <el-form-item :label="getZH('businessType')" prop="businessType" :rules="[{ required: true, message: selectZH('businessType') }]">
            <el-select v-model="addForm.businessType" :placeholder="selectZH('businessType')" size="mini" @change="businessTypeChange" class="w-full">
              <el-option v-for="item in businessTypeList" :key="item.code" :label="item.chineseName" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="getZH('etd')" prop="businessDate" :rules="[{ required: true, message: selectZH('businessDate') }]">
            <CommonPicker v-model="addForm.businessDate" pikcer-type="date" size="mini" :clearable="false" />
          </el-form-item>
        </el-form>
        <div class="fc-red fs-12">{{ getZH('addOrderTip') }}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addItemFn('addForm')" size="mini">{{ getZH('confirm','common') }}</el-button>
        <el-button @click="cancelAddFn" size="mini">{{ getZH('cancel','common') }}</el-button>
      </div>
    </el-dialog>

    <ImportOrderDialog ref="importOrderDialogRef" @success="list" />
  </div>
</template>

<script>
import { ThirdBusinessGroup } from '@/utils/constant';
import mixins from './mixins'
import SearchDatePicker from '@/components/Form/SearchDatePicker.vue';

export default {
  components: { SearchDatePicker },
    name: 'ThirdKindOrderListRail',
    mixins: [mixins],
    data() {
        return {
            origin: 'ThirdKindOrderListRail',
            groupCode: ThirdBusinessGroup.RAIL_BUSINESS,
            columnDefsRight: [
                {
                    headerName: this.getZH('orderNo'),
                    field: 'orderNo',
                    minWidth: 120,
                    cellRenderer: params => `<span>${params.value || ''}</span>`,
                    pinned: 'left'
                },
                {
                    headerName: this.getZH('mblNo'),
                    field: 'mblNo',
                    minWidth: 120,
                    pinned: 'left'
                },
                {
                    headerName: this.getZH('customer'),
                    field: 'customerName',
                    minWidth: 120,
                    pinned: 'left'
                },
                // {
                //     headerName: this.getZH('businessType'),
                //     field: 'businessTypeName',
                //     minWidth: 120
                // },
                {
                    headerName: this.getZH('supplier'),
                    field: 'supplierName',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('polCodeStation'),
                    field: 'pol',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('portStation'),
                    field: 'portStation',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('podCodeStation'),
                    field: 'pod',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('trainNo'),
                    field: 'trainNo',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('etd'),
                    field: 'businessDate',
                    minWidth: 140,
                    cellRenderer: params => `<span>${this.formatDate(params.value, 'YYYY-MM-DD HH:mm')}</span > `
                },
                {
                    headerName: this.getZH('eta'),
                    field: 'eta',
                    minWidth: 140,
                    cellRenderer: params => `<span>${this.formatDate(params.value, 'YYYY-MM-DD HH:mm')}</span > `
                },
                {
                    headerName: this.getZH('atd'),
                    field: 'atd',
                    minWidth: 140,
                    cellRenderer: params => `<span>${this.formatDate(params.value, 'YYYY-MM-DD HH:mm')}</span > `
                },
                {
                    headerName: this.getZH('ownedSales'),
                    field: 'sellerName',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('orderState'),
                    field: 'orderStateDesc',
                    minWidth: 120,
                    cellRenderer: params => {
                        if (params.data.orderState === 0) {
                            return `<div class= 'fc-blue'>${params.value}</div > `;
                        } else if (params.data.orderState === 100) {
                            return `<div class= 'fc-red'>${params.value}</div > `;
                        } else {
                            return `<div>${params.value}</div > `;
                        }
                    }
                },
                {
                    headerName: this.getZH('lockOrderState'),
                    field: 'lockOrderStateName',
                    minWidth: 120,
                    cellRenderer: params => {
                        if (params.data.lockOrderState === 0) {
                            return `<div class= 'fc-grey'>${params.value || ''}</div > `;
                        } else if (params.data.lockOrderState === 30) {
                            return `<div class= 'fc-yellow'>${params.value || ''}</div > `;
                        } else if (params.data.lockOrderState === 40) {
                            return `<div class= 'fc-blue'>${params.value || ''}</div > `;
                        } else {
                            return `<div class= 'green'>${params.value || ''}</div > `;
                        }
                    }
                },
                {
                    headerName: this.getZH('receivableState'),
                    field: 'receivableStateDesc',
                    minWidth: 120,
                    cellRenderer: params => {
                        if (params.data.receivableState === 10) {
                            return `<div class= 'fc-blue'>${params.value}</div > `;
                        } else if (params.data.receivableState === 20) {
                            return `<div class= 'fc-yellow'>${params.value}</div > `;
                        } else if (params.data.receivableState === 30) {
                            return `<div class= 'fc-green'>${params.value}</div > `;
                        } else if (params.data.receivableState === 40) {
                            return `<div class= 'fc-red'>${params.value}</div > `;
                        } else {
                            return `<div>${params.value}</div > `;
                        }
                    }
                },
                {
                    headerName: this.getZH('payableState'),
                    field: 'payableStateDesc',
                    minWidth: 120,
                    cellRenderer: params => {
                        if (params.data.payableState === 10) {
                            return `<div class= 'fc-blue'>${params.value}</div > `;
                        } else if (params.data.payableState === 20) {
                            return `<div class= 'fc-yellow'>${params.value}</div > `;
                        } else if (params.data.payableState === 30) {
                            return `<div class= 'fc-green'>${params.value}</div > `;
                        } else if (params.data.payableState === 40) {
                            return `<div class= 'fc-red'>${params.value}</div > `;
                        } else {
                            return `<div>${params.value}</div > `;
                        }
                    }
                },
                {
                    headerName: this.getZH('createByName'),
                    field: 'createByName',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('createTime'),
                    field: 'createTime',
                    minWidth: 140,
                    cellRenderer: params => `<span >${this.formatDate(params.value, 'YYYY-MM-DD HH:mm:ss')}</span > `
                },
                {
                    headerName: this.getZH('updateByName'),
                    field: 'updateByName',
                    minWidth: 120
                },
                {
                    headerName: this.getZH('updateTime'),
                    field: 'updateTime',
                    minWidth: 140,
                    cellRenderer: params => `<span>${this.formatDate(params.value, 'YYYY-MM-DD HH:mm:ss')}</span > `
                },
                {
                    headerName: this.$t('common.operation'),
                    pinned: 'right',
                    field: `id`,
                    minWidth: 100,
                    cellRendererFramework: 'operationBtn'
                }
            ]
        };
    },
    created() {},
    mounted() {},
    methods: {}
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


