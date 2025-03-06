<template>
  <div v-loading="loading" class="right-main-wrapper">
    <topSearchItems :show-single-input="false">
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px">
            <el-form-item :label="`${$t('spaceRule.ruleName')}: `" prop="policyName">
              <el-input v-model="multipleForm.policyName" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
            </el-form-item>
            <el-form-item :label="`${$t('spaceRule.spaceRuleList.lineCode')}: `" prop="lineCode">
              <el-select v-model="multipleForm.lineCode" :placeholder="$t('common.placeholder')" @change="getData" clearable filterable size="mini" @clear="getData">
                <el-option v-for="item in lineCodeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="成功率：" prop="successRate">
              <el-input v-model="successRate" type="text" placeholder="大于0" size="mini" clearable @keyup.enter.native="getData" oninput="value=value.replace(/[^\d]/g,'')" @clear="getData">
                <i slot="suffix" class="iconfont icon-baifenhao"></i>
              </el-input>
            </el-form-item> -->
            <el-form-item :label="`${$t('spaceRule.spaceRuleList.creator')}: `" prop="createByName">
              <el-input v-model="multipleForm.createByName" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
            </el-form-item>
            <el-form-item :label="`${$t('spaceRule.spaceRuleList.createTime')}: `" prop="createTime">
              <CommonPicker
                v-model="multipleForm.createTime"
                :parent-date="multipleForm.createTime"
                pikcer-type="date"
                clearable
                @clear="getData"
              />
            </el-form-item>
            <el-form-item :label="`${$t('spaceRule.spaceRuleList.policyStatus')}: `" prop="policyStatus">
              <el-select v-model="multipleForm.policyStatus" size="mini" @change="getData">
                <el-option :value="null" :label="`${$t('common.all')}: `" />
                <el-option :value="2" :label="`${$t('spaceRule.spaceRuleList.unStart')}: `" />
                <el-option :value="3" :label="`${$t('spaceRule.spaceRuleList.processing')}: `" />
                <el-option :value="4" :label="`${$t('spaceRule.spaceRuleList.stoped')}: `" />
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
      <!-- <el-button type="primary" icon="el-icon-plus" v-permission="['cas:flash:create']" size="mini" @click="createRules">新建规则</el-button> -->
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="createRules">{{$t('spaceRule.spaceRuleList.createRule')}}</el-button>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="ruleList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animateRows="false"
        style="height:calc(100vh - 380px); margin-top: 10px;"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
  </div>
</template>
<script>
  import topSearchItems from '@/components/Cargo/Common/topSearchItems'
  import RemoteSearchSelector from '@/components/Cargo/Common/RemoteSearchSelector'
  import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
  import { getrulesListApi } from '@/api/spaceManager.js'
  import SpaceRuleOperationBtn from './components/SpaceRuleOperationBtn'
  import PopupSubtask from './components/PopupSubtask'
  import { getUserInfo } from '@/utils/auth'
  import lineCodeArr from './mixins/lineCodeArr'
  export default {
    name: 'SpaceRuleList',
    mixins: [lineCodeArr],
    data () {
      return {
        loading: false,
        ruleList: [],
        successRate: '',
        totalData: 0,
        rowData: [],
        multipleForm: {
          policyName: '',
          lineCode: '',
          // successRate: '',
          createByName: '',
          createTime: null,
          policyStatus: null,
          pageSize: 50,
          pageNum: 1
        },
        platNameList: [
          '',
          'Syconhub'
        ],
        gridApi: null,
        columnApi: null,
        gridOptions: null,
        sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
        columnFields: []
      }
    },
    components: {
      topSearchItems,
      RemoteSearchSelector,
      cargoAdvanceSelect,
      SpaceRuleOperationBtn,
      PopupSubtask
    },
    filters: {
      processStatus(_policyStatus) {
        const textArr = ['', '', this.$t('spaceRule.spaceRuleList.unStart'), this.$t('spaceRule.spaceRuleList.processing'), this.$t('spaceRule.spaceRuleList.stoped')]
        return `<span class="callSign-text">
            <i class="callSign-pointer"></i>${textArr[_policyStatus]}
          </span>`
      }
    },
    computed: {
      userInfo() {
        return getUserInfo()
      }
    },
    watch: {
      // successRate(val) {
      //   if (val > 100) {
      //     this.successRate = '100'
      //     this.multipleForm.successRate = '100'
      //   } else if (/(^\d{0,3}$)|(^\d{0,2}\.\d{0,2}$)/.test(val)) {
      //     this.successRate = val
      //     this.multipleForm.successRate = val
      //   } else {
      //     this.successRate = val.substring(0, val.length - 1)
      //     this.multipleForm.successRate = val.substring(0, val.length - 1)
      //   }
      // },
    },
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
      // 查询数据
      async getData() {
        this.loading = true
        const res = await getrulesListApi(this.multipleForm)
        if (res.ok) {
          this.ruleList = res.content.list
          this.totalData = parseInt(res.content.total, 10)
        } else {
          this.ruleList = []
          this.totalData = 0
        }
        this.loading = false
      },
      /**
       * 清空重置条件
       */
      clearSearchForm() {
        this.$refs.multipleForm.resetFields()
        this.getData()
      },
      // 新建规则
      createRules() {
        this.$router.push({name: 'SpaceRuleSetter', query: {options: 'create'}})
      },
      // 显示loading
      showLoading() {
        this.loading = true
      },
      // 关闭loading
      closeLoading() {
        this.loading = false
      }
    },
    created () {
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
          field: 'id',
          headerName: '',
          pinned: 'left',
          minWidth: 55,
          cellRendererFramework: 'PopupSubtask',
          cellRendererParams: {showLoading: this.showLoading, closeLoading: this.closeLoading}
        },
        {
          field: 'policyName',
          headerName: this.$t('spaceRule.ruleName'),
          pinned: 'left',
          minWidth: 120
        },
        {
          field: 'ruleTypeName',
          headerName: this.$t('spaceRule.ruleType'),
          pinned: 'left',
          minWidth: 120
        },
        {
          field: 'includeInsurance',
          headerName: this.$t('spaceRule.spaceRuleList.includeInsurance'),
          minWidth: 100,
          cellRenderer: params => params.value ? this.$t('common.trueText') : this.$t('common.falseText')
        },
        {
          field: 'bookingPlatform',
          headerName: this.$t('spaceRule.bookingPlatform'),
          minWidth: 120,
          cellRenderer: params => params.value ? this.platNameList[params.value] : ''
        },
        {
          field: 'lineCode',
          headerName: this.$t('spaceRule.spaceRuleList.lineCode'),
          minWidth: 100,
          suppressSorting: true,
          cellRenderer: params => {
            if (params.value && params.value.length > 0) {
              const _items = this.lineCodeList.filter(item => item.value == params.value)

              return _items[0] ? _items[0].label : 'N/A'
            }
            return 'N/A'
          }
        },
        {
          field: 'beginTime',
          headerName: this.$t('spaceRule.spaceRuleList.beginTime'),
          minWidth: 180,
          cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm') : ''
        },
        {
          field: 'endTime',
          headerName: this.$t('spaceRule.endTime'),
          minWidth: 180,
          cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm') : ''
        },
        {
          field: 'createByName',
          headerName: this.$t('spaceRule.spaceRuleList.creator'),
          minWidth: 120
        },
        {
          field: 'createTime',
          headerName: this.$t('spaceRule.spaceRuleList.createTime'),
          minWidth: 180,
          cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm') : ''
        },
        // {
        //   field: 'performNumber',
        //   headerName: '执行次数',
        //   minWidth: 100
        // },
        // {
        //   field: 'successNumber',
        //   headerName: '成功次数',
        //   minWidth: 100
        // },
        // {
        //   field: 'successRate',
        //   headerName: '成功率',
        //   minWidth: 100,
        //   cellRenderer: params => {
        //     return params.value ? `${params.value}%` : 'N/A'
        //   }
        // },
        {
          field: 'policyStatusName',
          headerName: this.$t('spaceRule.spaceRuleList.policyStatus'),
          minWidth: 100,
          pinned: 'right'
        },
        {
          field: 'policyStatus',
          headerName: this.$t('common.operation'),
          minWidth: 200,
          pinned: 'right',
          cellRendererFramework: 'SpaceRuleOperationBtn',
          cellRendererParams: {refreshData: this.getData}
        }
      ]
    },
    mounted() {
      this.getData()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.name === 'SpaceRuleSetter') {
          vm.getData()
        }
      })
    }
  }

</script>
<style>

</style>
