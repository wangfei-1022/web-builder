<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="singleForm" :inline="true" :model="multipleForm" label-width="80px" size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('containerManager.containerNumber')}: `" prop="containerNo">
          <el-input v-model="multipleForm.containerNo" type="text" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.analyzelog.reportSendType')}: `" prop="sender">
          <el-select v-model="multipleForm.sender" clearable :placeholder="$t('common.selectPlaceholder')" @change="getData">
            <el-option
              v-for="item in senderList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.status')}: `" prop="status">
          <el-select v-model="multipleForm.status" clearable :placeholder="$t('common.selectPlaceholder')" @change="getData">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="containerList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
  </div>
</template>
<script>
import { getUpdateStatusLogApi } from '@/api/containerManager'
export default {
  name: 'AnalyzeLog',
  components: {},
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      multipleForm: {
        containerNo: '',
        sender: null,
        status: null,
        pageSize: 50,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      containerList: [],
      statusList: [
        {
          label: this.$t('common.successText'),
          value: 1
        },
        {
          label: this.$t('common.failedText'),
          value: 2
        }
      ],
      senderList: [
        {
          label: this.$t('containerManager.analyzelog.EDINingbo'),
          value: this.$t('containerManager.analyzelog.EDINingbo')
        },
        {
          label: this.$t('containerManager.analyzelog.EDIHamburg'),
          value: this.$t('containerManager.analyzelog.EDIHamburg')
        }
      ]
    }
  },
  computed: {},
  watch: {},
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
      // window.addEventListener('resize', function() {
      //   setTimeout(function() {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
    },
    async getData() {
      this.loading = true
      const res = await getUpdateStatusLogApi(this.multipleForm)
      if (res.ok && res.content) {
        this.containerList = res.content.list
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.containerList = []
        this.totalData = 0
      }
      this.loading = false
    },
    clearSearchForm() {
      this.$refs.singleForm.resetFields()
      this.getData()
    }
  },
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'multiple', // 设置多行可选
      rowMultiSelectWithClick: true, // 点击及选择复选框
      suppressRowClickSelection: true // 选中单元格后可以复制内容
    }
    this.columnFields = [
      {
        field: 'containerNo',
        headerName: this.$t('containerManager.containerNumber'),
        maxWidth: 260
      },
      {
        field: 'sender',
        headerName: this.$t('containerManager.analyzelog.reportSendType'),
        maxWidth: 240
      },
      {
        field: 'status',
        headerName: this.$t('containerManager.status'),
        maxWidth: 200,
        cellRenderer: params => params.value === 1 ? this.$t('common.successText') : this.$t('common.failedText')
      },
      {
        field: 'createTime',
        headerName: this.$t('containerManager.analyzelog.analysisTime'),
        maxWidth: 300,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'message',
        headerName: this.$t('containerManager.analyzelog.resultDetail'),
        maxWidth: 360,
        tooltip: params => params.value
      },
      {
        field: 'analysisData',
        headerName: this.$t('containerManager.analyzelog.analysisData'),
        maxWidth: 300,
        tooltip: params => params.value
      }
    ]

    this.getData()
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>

</style>
