<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot filterType="single" :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="singleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px" @submit.native.prevent>
        <el-form-item label="" prop="keyword" :label="`${$t('codeManager.searchCode')}: `">
          <el-input v-model="multipleForm.keyword" type="text" :placeholder="$t('codeManager.codeSearchPlaceholder')" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="showCreateDialog">{{$t('codeManager.createBtn')}}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="codeList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
    <editCodeDialog
      ref="editCodeDialog"
      :edit="edit"
      :show-dialog="showDialog"
      @closeDialog="closeDialog"
      @refreshData="getData"
    />
  </div>
</template>
<script>
import { getCustomAttributeListApi } from '@/api/codeManager'
import codeBtn from './components/codeBtn'
import editCodeDialog from './components/editCodeDialog'
export default {
	name: 'CodeManager',
	components: { codeBtn, editCodeDialog },
	filters: {},
	data() {
		return {
			loading: false,
			codeList: [],
			totalData: 0,
			multipleForm: {
				keyword: '',
				pageSize: 50,
				pageNum: 1
			},
			gridApi: null,
			columnApi: null,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: [],
			attributeId: '',
			showDialog: false,
			edit: false
		}
	},
	computed: {},
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
		this.columnFields = [
			{
				field: 'code',
				headerName: this.$t('codeManager.categoryCode'),
				minWidth: 200
			},
			{
				field: 'name',
				headerName: this.$t('codeManager.categoryName'),
				minWidth: 200
			},
			{
				field: 'parentName',
				headerName: this.$t('codeManager.parentCode'),
				minWidth: 200
			},
			{
				field: 'remark',
				headerName: this.$t('codeManager.remark'),
				minWidth: 100,
				tooltip: params => {
					return params.value
				}
			},
			{
				field: 'activeFlag',
				headerName: this.$t('codeManager.status'),
				minWidth: 100,
				cellRenderer: params => {
					return params.value === true ? this.$t(`codeManager.enabledStatus[0]`) : this.$t(`codeManager.enabledStatus[1]`)
				}
			},
			{
				field: 'id',
				headerName: '操作',
				minWidth: 100,
				pinned: 'right',
				cellRendererFramework: 'codeBtn',
				cellRendererParams: { showEditDialog: this.showEditDialog, refreshData: this.getData }
			}
		]
	},
	mounted() {
		this.getData()
	},
	methods: {
		// AG GRID
		onReady(params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
			this.gridApi.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		async getData() {
			this.loading = true
			this.multipleForm.keyword = this.multipleForm.keyword.trim()
			const res = await getCustomAttributeListApi(this.multipleForm)
			if (res.ok) {
				this.codeList = res.content.list
				this.totalData = parseInt(res.content.total)
			} else {
				this.codeList = []
				this.totalData = 0
			}
			this.loading = false
		},
		clearSearchForm() {
			this.$refs.multipleForm.resetFields()
			this.getData()
		},
		showEditDialog(val) {
			this.edit = true
			this.showDialog = true
			this.$refs.editCodeDialog.getInfoDetail(val)
		},
		showCreateDialog() {
			this.edit = false
			this.$refs.editCodeDialog.getDropdownList(false)
			this.showDialog = true
		},
		closeDialog() {
			this.showDialog = false
		}
	}
}
</script>
<style lang="scss" scoped>
</style>
