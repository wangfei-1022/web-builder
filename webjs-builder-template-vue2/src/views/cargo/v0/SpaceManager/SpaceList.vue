<template>
  <div class="right-main-wrapper" v-loading="loading">
    <topSearchItems :show-single-input="false">
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px">
            <el-form-item :label="`${$t('spaceRule.spaceList.soNo')}: `" prop="soNo">
              <el-input v-model="multipleForm.soNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
            </el-form-item>
            <el-form-item :label="`${$t('spaceRule.spaceList.bookingNo')}: `" prop="bookingNo">
              <el-input v-model="multipleForm.bookingNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
            </el-form-item>
            <el-form-item :label="`${$t('spaceRule.podCode')}: `" prop="podCode">
              <el-input v-model="multipleForm.podCode" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
            </el-form-item>
            <el-form-item :label="`${$t('spaceRule.ruleName')}: `" prop="policyName">
              <el-input v-model="multipleForm.policyName" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
            </el-form-item>
            <el-form-item :label="`${$t('spaceRule.spaceList.updateTime')}: `" prop="updateTime">
              <CommonPicker
                v-model="multipleForm.updateTime"
                :parent-date="multipleForm.updateTime"
                pikcer-type="datetime"
                pickerFormat="yyyy-MM-dd HH:mm"
                @clear="getData"
              />
            </el-form-item>
            <el-form-item :label="`${$t('spaceRule.spaceList.allotTarget')}: `" prop="appointName">
              <el-input v-model="multipleForm.appointName" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
            </el-form-item>
            <el-form-item :label="`${$t('spaceRule.spaceList.allotStatus')}: `" prop="appointStatus">
              <el-select v-model="multipleForm.appointStatus" size="mini" @change="getData">
                <el-option :value="null" :label="$t('common.all')" />
                <el-option value="1" :label="$t('spaceRule.spaceList.alloted')" />
                <el-option value="2" :label="$t('spaceRule.spaceList.unalloted')" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('spaceRule.spaceList.bookingStatus')}: `" prop="bookingStatus">
              <el-select v-model="multipleForm.bookingStatus" size="mini" @change="getData">
                <el-option :value="null" :label="$t('common.all')" />
                <el-option :value="1" :label="$t('common.waitForVerify')" />
                <el-option :value="2" :label="$t('common.verified')" />
                <el-option :value="3" :label="$t('common.verifyFailed')" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <div slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="getData">
          {{ $t('common.searchBtn') }}
        </el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="clearSearchForm">{{ $t('common.resetBtn') }}</el-button>
      </div>
    </topSearchItems>
    <div class="table-wrap">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="spaceList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animateRows="false"
        style="height:calc(100vh - 420px); margin-top: 10px;"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
  </div>
</template>
<script>
  import topSearchItems from '@/components/Cargo/Common/topSearchItems'
  import SpaceListOperationBtn from './components/SpaceListOperationBtn'
  import { getBookingOnlineListApi, getEmployeeListApi } from '@/api/spaceManager'
  export default {
    name: 'SpaceList',
    data() {
      return {
        loading: false,
        spaceList: [],
        totalData: 0,
        multipleForm: {
          soNo: '',
          bookingNo: '',
          podCode: '',
          policyName: '',
          updateTime: null,
          appointName: '',
          appointStatus: null,
          bookingStatus: null,
          pageSize: 50,
          pageNum: 1
        },
        gridApi: null,
        columnApi: null,
        gridOptions: null,
        sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
        columnFields: [],
        departmentList: []
      }
    },
    components: {
      topSearchItems,
      SpaceListOperationBtn
    },
    filters: {},
    computed: {},
    methods: {
      // AG GRID
      onReady(params) {
        this.gridApi = params.api
        this.columnApi = params.columnApi
        this.gridApi.sizeColumnsToFit()
        window.addEventListener('resize', function() {
          setTimeout(function() {
            params.api.sizeColumnsToFit()
          })
        })
      },
      async getData() {
        this.loading = true
        const res = await getBookingOnlineListApi(this.multipleForm)
        if (res.ok) {
          this.spaceList = res.content.list
          this.totalData = parseInt(res.content.total, 10)
        }
        this.loading = false
      },
      clearSearchForm() {
        this.$refs.multipleForm.resetFields()
        this.getData()
      },
      async getAlloList() {
        const res = await getEmployeeListApi()
        this.departmentList = []
        res.content.forEach(item => {
          const departmentItems = {
            label: item.departmentName,
            value: item.departmentId,
            children: []
          }
          if (item.userVoList) {
            item.userVoList.forEach(user => {
              departmentItems.children.push({
                label: user.userName,
                value: user.userId
              })
            })
          }
          this.departmentList.push(departmentItems)
        })

        this.$store.dispatch('user/setDepartmentList', this.departmentList)
      }
    },
    created() {
      this.getAlloList()
      this.gridOptions = {
        context: {
          componentParent: this
        },
        rowSelection: 'single', // 设置多行可选
        animateRows: true,
        suppressRowClickSelection: true // 选中单元格后可以复制内容
        // suppressCellSelection: true, //点击不选中单元格
      }
      this.columnFields = [
        {
          field: 'soNo',
          headerName: this.$t('spaceRule.spaceList.soNo'),
          minWidth: 160
        },
        {
          field: 'bookingNo',
          headerName: this.$t('spaceRule.spaceList.bookingNo'),
          minWidth: 160
        },
        {
          field: 'policyName',
          headerName: this.$t('spaceRule.ruleName'),
          minWidth: 120
        },
        {
          field: 'plantName',
          headerName: this.$t('spaceRule.bookingPlatform'),
          minWidth: 120
        },
        {
          field: 'polCode',
          headerName: this.$t('spaceRule.polCode'),
          minWidth: 120
        },
        {
          field: 'podCode',
          headerName: this.$t('spaceRule.podCode'),
          minWidth: 120
        },
        {
          field: 'containerType',
          headerName: this.$t('spaceRule.containerType'),
          minWidth: 100
        },
        {
          field: 'containerQuantity',
          headerName: this.$t('spaceRule.containerQuantity'),
          minWidth: 100
        },
        {
          field: 'bookingStatusName',
          headerName: this.$t('spaceRule.spaceList.bookingStatusName'),
          minWidth: 100
        },
        {
          field: 'updateTime',
          headerName: this.$t('spaceRule.spaceList.updateTime'),
          minWidth: 200,
          cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm') : ''
        },
        {
          field: 'allocatePersonnel',
          headerName: this.$t('spaceRule.spaceList.allocatePersonnel'),
          minWidth: 100,
          cellRenderer: params => params.value ? params.value : 'N/A'
        },
        {
          field: 'appointedName',
          headerName: this.$t('spaceRule.spaceList.allotTarget'),
          minWidth: 100,
          cellRenderer: params => params.value ? params.value : 'N/A'
        },
        {
          field: 'appointStatus',
          headerName: this.$t('common.operation'),
          minWidth: 100,
          pinned: 'right',
          cellRendererFramework: 'SpaceListOperationBtn',
          cellRendererParams: {refreshData: this.getData}
        }
      ]
    },
    mounted() {
      this.getData()
    }
  }
</script>
<style lang="scss" scoped>

</style>
