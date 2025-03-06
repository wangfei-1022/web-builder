<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px" size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('containerManager.containerNumber')}: `" prop="containerNo">
          <el-input v-model="multipleForm.containerNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.contractNo')}: `" prop="contractNo">
          <el-input v-model="multipleForm.contractNo" type="text" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
        <el-form-item :label="orderClient" prop="memberId">
          <el-select
            v-model="multipleForm.memberId"
            clearable
            filterable
            :placeholder="$t('common.selectPlaceholder')"
            @change="getData"
          >
            <el-option
              v-for="item in memberList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.ownerName')}: `" prop="ownerId">
          <el-select
            v-model="multipleForm.ownerId"
            clearable
            filterable
            :placeholder="$t('common.selectPlaceholder')"
            @change="getData"
          >
            <el-option
              v-for="item in ownerList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="top-btn-wrap mt-20">
      <el-button type="primary" size="mini" v-permission="['ctn:container:add']" @click="createContainer">{{$t('containerManager.createText')}}</el-button>
      <el-button v-permission="['ctn:container:import']" type="primary" size="mini" @click="showUploadDialog = true">{{$t('containerManager.batchImport')}}</el-button>
      <el-button v-permission="['ctn:container:import']" v-show="showVirtualBtn" type="primary" size="mini" @click="showVirtualDialog = true">{{$t('containerManager.importVirtualNo')}}</el-button>
      <el-dropdown size="small" trigger="click" @command="handleCommand" style="margin-left: 10px;">
        <el-button type="primary" size="mini">
          {{$t('containerManager.leaseList.throwLease')}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="excel">{{$t('containerManager.leaseList.importThrowLease')}}</el-dropdown-item>
          <!-- <el-dropdown-item command="manual">批量退租</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-tabs v-model="multipleForm.orderType" @tab-click="getData" class="top-tabs">
      <el-tab-pane :label="this.$t('containerManager.loan')" name="3" />
      <el-tab-pane :label="this.$t('containerManager.categoryList.lease')" name="2" />
    </el-tabs>
    <div class="table-wrap no-margin">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="orderList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
    <UploadDialog :title="$t('containerManager.importTitle')" :visible.sync="showUploadDialog" :excel-file-name="uploadFileName" @uploadSuccess="getData" :orderType="orderTypeNumber"/>
    <UploadVirtual :title="$t('containerManager.importVirtualNo')" :showImgImport="false" :visible.sync="showVirtualDialog" :excel-file-name="$t('containerManager.leaseList.importVirtualTemplet')" @uploadSuccess="getData" :orderType="orderTypeNumber" />
    <ReturnDialog :visible.sync="showReturnDialog" :excel-file-name="returnFileName" @uploadSuccess="getData" :orderType="orderTypeNumber" />
  </div>
</template>
<script>
import { getLeaseListApi, getOwnerListApi } from '@/api/containerManager'
import { getMemberListApi } from '@/api/orderManager'
import LeaseOpreateBtn from './components/LeaseOpreateBtn'
import UploadDialog from './components/UploadDialog'
import UploadVirtual from './components/UploadVirtual'
import ReturnDialog from './components/ReturnDialog'
export default {
  name: 'LeaseList',
  components: {
    LeaseOpreateBtn,
    UploadDialog,
    ReturnDialog,
    UploadVirtual
  },
  filters: {},
  data() {
    return {
      showUploadDialog: false,
      showReturnDialog: false,
      showVirtualDialog: false,
      loading: false,
      orderClient: `${this.$t('containerManager.Lessee')}: `,
      loanList: [],
      rentList: [],
      totalData: 0,
      multipleForm: {
        containerNo: '',
        contractNo: '',
        ownerId: '',
        memberId: '',
        orderType: '3',
        pageSize: 50,
        pageNum: 1
      },
      ownerList: [],
      memberList: [],
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      id: '',
      edit: false,
      loanFields: [],
      rentFields: []
    }
  },
  computed: {
    columnFields: function() {
      return this.multipleForm.orderType === '3' ? this.loanFields : this.rentFields
    },
    orderList: function() {
      return this.multipleForm.orderType === '3' ? this.loanList : this.rentList
    },
    uploadFileName: function() {
      return this.multipleForm.orderType === '3' ? this.$t('containerManager.leaseList.loanTemplet') : this.$t('containerManager.leaseList.leaseTemplet')
    },
    returnFileName: function() {
      return this.$t('containerManager.leaseList.importThrowLeaseTemplet')
    },
    showVirtualBtn: function() {
      return this.multipleForm.orderType === '2'
    },
    orderTypeNumber: function() {
      return Number(this.multipleForm.orderType)
    }
  },
  watch: {
    'multipleForm.orderType': function(val) {
      this.orderClient = val === '3' ? this.$t('containerManager.Lessee') : this.$t('containerManager.lessor')
    }
  },
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'single', // 设置多行可选
      animateRows: true,
      suppressRowClickSelection: true // 选中单元格后可以复制内容
      // suppressCellSelection: true, //点击不选中单元格
    }
    this.loanFields = [
      {
        field: 'containerNo',
        headerName: this.$t('containerManager.containerNumber'),
        minWidth: 160
      },
      {
        field: 'memberName',
        headerName: this.$t('containerManager.leaseList.lesseePerson'),
        minWidth: 160,
        tooltip: params => params.value
      },
      {
        field: 'orderNo',
        headerName: this.$t('containerManager.orderNo'),
        minWidth: 120
      },
      {
        field: 'startTime',
        headerName: this.$t('containerManager.leaseList.startTime'),
        minWidth: 100,
        cellRenderer: params => params.data.startTime ? this.$moment(Number(params.data.startTime)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'leaseTime',
        headerName: this.$t('containerManager.leaseList.timeRange'),
        minWidth: 100,
        cellRenderer: params => params.data.leaseTime ? `${params.data.leaseTime}D` : ''
      },
      {
        field: 'endTime',
        headerName: this.$t('containerManager.leaseList.expiredTime'),
        minWidth: 100,
        cellRenderer: params => params.data.endTime ? this.$moment(Number(params.data.endTime)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'remainingTime',
        headerName: this.$t('containerManager.leaseList.leftTime'),
        minWidth: 100,
        cellRenderer: params => params.value ? `${params.value}D` : ''
      },
      {
        field: 'deliveryDate',
        headerName: this.$t('containerManager.leaseList.deliveryTime'),
        minWidth: 100,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'deliveryPlace',
        headerName: this.$t('containerManager.deliveryPlace'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'redeliveryDate',
        headerName: this.$t('containerManager.redeliveryDate'),
        minWidth: 100,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'redeliveryPlace',
        headerName: this.$t('containerManager.redeliveryPlace'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'borrowedDays',
        headerName: this.$t('containerManager.leaseList.borrowedDays'),
        minWidth: 100,
        cellRenderer: params => params.value ? params.value > 0 ? `${params.value}D` : '0D' : ''
      },
      {
        field: 'containerSituation',
        headerName: this.$t('containerManager.containerSituation'),
        minWidth: 100,
        cellRenderer: params => params.value === null ? '' : params.value === 1 ? this.$t('containerManager.newContainer') : this.$t('containerManager.oldContainer')
      },
      {
        field: 'contractNo',
        headerName: this.$t('containerManager.contractNo'),
        minWidth: 120
      },
      {
        field: 'remark',
        headerName: this.$t('containerManager.remark'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 100,
        pinned: 'right',
        cellRendererFramework: 'LeaseOpreateBtn',
        cellRendererParams: { refreshData: this.getData, orderType: 3 }
      }
    ]

    this.rentFields = [
      {
        field: 'containerNo',
        headerName: this.$t('containerManager.containerNumber'),
        minWidth: 160
      },
      {
        field: 'ownerName',
        headerName: this.$t('containerManager.ownerName'),
        minWidth: 160,
        tooltip: params => params.value
      },
      {
        field: 'orderNo',
        headerName: this.$t('containerManager.orderNo'),
        minWidth: 120
      },
      {
        field: 'memberName',
        headerName: this.$t('containerManager.lessor'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'startTime',
        headerName: this.$t('containerManager.leaseList.startTime'),
        minWidth: 100,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'leaseTime',
        headerName: this.$t('containerManager.leaseList.timeRange'),
        minWidth: 100,
        cellRenderer: params => params.value ? `${params.value}D` : ''
      },
      {
        field: 'remainingTime',
        headerName: this.$t('containerManager.leaseList.leftTime'),
        minWidth: 100,
        cellRenderer: params => params.value ? `${params.value}D` : ''
      },
      {
        field: 'deliveryDate',
        headerName: this.$t('containerManager.leaseList.deliveryTime'),
        minWidth: 100,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'deliveryPlace',
        headerName: this.$t('containerManager.deliveryPlace'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'redeliveryDate',
        headerName: this.$t('containerManager.redeliveryDate'),
        minWidth: 100,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'redeliveryPlace',
        headerName: this.$t('containerManager.redeliveryPlace'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'containerSituation',
        headerName: this.$t('containerManager.containerSituation'),
        minWidth: 100,
        cellRenderer: params => params.value === null ? '' : params.value === 1 ? this.$t('containerManager.newContainer') : this.$t('containerManager.oldContainer')
      },
      {
        field: 'borrowedDays',
        headerName: this.$t('containerManager.leaseList.loanDays'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value > 0 ? `${params.value}D` : '0D' : ''
      },
      {
        field: 'remark',
        headerName: this.$t('containerManager.remark'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'contractNo',
        headerName: this.$t('containerManager.contractNo'),
        minWidth: 120
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 100,
        pinned: 'right',
        cellRendererFramework: 'LeaseOpreateBtn',
        cellRendererParams: { refreshData: this.getData, orderType: 2 }
      }
    ]

    this.getData()
  },
  mounted() {
    this.getMemberList()
    this.getOwnerList()
  },
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
    },
    async getData() {
      this.loading = true
      const res = await getLeaseListApi(this.multipleForm)
      if (res.ok) {
        if (this.multipleForm.orderType === '3') {
          this.loanList = res.content.list
        } else {
          this.rentList = res.content.list
        }
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.loanList = []
        this.rentList = []
        this.totalData = 0
      }
      this.loading = false
    },
    async getOwnerList() {
      const res = await getOwnerListApi({pageSize: 999, pageNum: 1})
      if (res.ok) {
        this.ownerList = res.content.list.map(item => ({
            label: item.name,
            value: item.id
          }))
      }
    },
    async getMemberList() {
      const res = await getMemberListApi()
      if (res.ok) {
        this.memberList = res.content.map(item => ({
            label: item.name,
            value: item.id
          }))
      }
    },
    clearSearchForm() {
      this.$refs.multipleForm.resetFields()
      this.getData()
    },
    createContainer() {
      const _name = this.multipleForm.orderType === '3' ? 'LoanDetail' : 'LeaseDetail'
      this.$router.push({ name: _name, params: {
        editType: 'create',
        orderType: this.multipleForm.orderType
      }})
    },
    handleCommand(command) {
      if (command === 'excel') {
        this.showReturnDialog = true
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.refresh) {
        vm.getData()
      }
    })
  }
}
</script>
<style lang="scss" scoped>

</style>
