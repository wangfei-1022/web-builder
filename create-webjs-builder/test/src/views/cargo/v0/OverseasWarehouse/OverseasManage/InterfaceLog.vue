<template>
	<div class="right-main-wrapper" v-loading="loading">
    <TopSearchItemsSlot	:searchFun="getData" :resetFun="reset">
      <template slot="multipleSearch">
        <el-form	ref="formData" :inline="true"	:model="formData" label-width="100px">
            <el-form-item	class="el-form-item" :label="$t('InterfaceLog.abnormalMainClass')" prop="expMainCategoryCode">
              <el-select size="mini" v-model="formData.expMainCategoryCode" @change="getData()">
                <el-option :label="$t('InterfaceLog.all')" :value="null"></el-option>
                <el-option :label="$t('InterfaceLog.expMainCategoryCode1')" :value="1"></el-option>
                <el-option :label="$t('InterfaceLog.expMainCategoryCode2')" :value="2"></el-option>
                <el-option :label="$t('InterfaceLog.expMainCategoryCode3')" :value="3"></el-option>
                <el-option :label="$t('InterfaceLog.expMainCategoryCode4')" :value="9"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item	class="el-form-item" :label="$t('InterfaceLog.interfaceAddressKeyword')"  prop="urlKeyword">
              <el-input size="mini" @keyup.enter.native="getData()" v-model="formData.urlKeyword" :placeholder="$t('common.placeholder')+$t('InterfaceLog.interfaceAddressKeyword')"></el-input>
            </el-form-item>
            <el-form-item	class="el-form-item" :label="$t('InterfaceLog.invokePacketKeyword')" prop="requestKeyword">
              <el-input size="mini" @keyup.enter.native="getData()" v-model="formData.requestKeyword" :placeholder="$t('common.placeholder')+$t('InterfaceLog.invokePacketKeyword')"></el-input>
            </el-form-item>
            <el-form-item	class="el-form-item" :label="$t('InterfaceLog.responsePacketKeyword')" prop="responseKeyword">
              <el-input size="mini" @keyup.enter.native="getData()" v-model="formData.responseKeyword" :placeholder="$t('common.placeholder')+$t('InterfaceLog.responsePacketKeyword')"></el-input>
            </el-form-item>
          </el-form>
      </template>
    </TopSearchItemsSlot>
		<div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
			<Pagination
				:total="total"
				:limit.sync="formData.pageSize"
				:page.sync="formData.pageNum"
				@pagination="getData()"
			/>
      <InterfaceLogDetail :id="activeId" :visible.sync="dialog.visible" />
		</div>
	</div>
</template>

<script>
import { getInterfaceLogListApi } from '@/api/OverseasWarehouse/InterfaceLog'
import InterfaceLogDetail from './components/InterfaceLogDetail'
import InterfaceLogBtn from './components/InterfaceLogBtn'
export default {
	name: 'InterfaceLog',
	components: { InterfaceLogDetail, InterfaceLogBtn },
	data() {
		return {
			loading: false,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: null,
			dataList: [],
			activeId: null,
			total: 0,
			formData: {
				expMainCategoryCode: null,
				urlKeyword: null,
				responseKeyword: null,
				requestKeyword: null,
				pageSize: 50,
				pageNum: 1
			}
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
		this.columnFields = [
			{
				field: 'businessMark',
				headerName: this.$t('InterfaceLog.uniqueIdentifier'),
				width: 250,
				tooltip: params => params.value
			},
			{
				field: 'expMainCategoryCodeName',
				headerName: this.$t('InterfaceLog.abnormalMainClass'),
				width: 100,
				cellRenderer: params => params.value || '-'
			},
			{
				field: 'expSpecificCategoryCodeName',
				headerName: this.$t('InterfaceLog.abnormalSubClass'),
				cellRenderer: params => params.value || '-'
			},
			{
				field: 'optMoudleTypeName',
				headerName: this.$t('InterfaceLog.functionModule'),
				width: 150,
				cellRenderer: params => params.value || '-'
			},
			// {
			// 	field: 'caller',
			// 	headerName: this.$t('InterfaceLog.caller'),
			// 	width: 150,
			// 	cellRenderer: params => params.value || '-'
			// },
			{
				field: 'callee',
				headerName: this.$t('InterfaceLog.byCaller'),
				width: 150,
				cellRenderer: params => params.value || '-'
			},
			// {
			// 	field: 'callType',
			// 	headerName: this.$t('InterfaceLog.interfaceType'),
			// 	width: 150,
			// 	cellRenderer: params => params.value || '-'
			// },
			{
				field: 'callUrl',
				headerName: this.$t('InterfaceLog.interfaceAddress'),
				width: 150,
				cellRenderer: params => params.value || '-'
			},
			{
				field: 'requestMessage',
				headerName: this.$t('InterfaceLog.invokePacket'),
				width: 150,
				cellRenderer: params => params.value || '-'
			},
			{
				field: 'responseMessage',
				headerName: this.$t('InterfaceLog.responsePacket'),
				width: 150,
				cellRenderer: params => params.value || '-'
			},
			{
				field: 'createTime',
				headerName: this.$t('InterfaceLog.callTime'),
				width: 150,
				cellRenderer: params => this.formatDate(params.value)
			},
			{
				field: 'remark',
				headerName: this.$t('InterfaceLog.failureReason'),
				width: 150,
				cellRenderer: params => params.value || '-'
			},
			{
				field: 'id',
				headerName: this.$t('common.operation'),
				minWidth: 110,
				pinned: 'right',
				cellRendererFramework: 'InterfaceLogBtn'
			}
		]
		this.getData()
	},
	mounted() {

	},
	methods: {
		onReady(params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
			// this.gridApi.sizeColumnsToFit()
			let width = this.calcRemainingWidth(this.columnFields)
			params.columnApi.setColumnWidth('originFileName', width)
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		async getData(init) {
			if (init) {
				this.formData.pageNum = 1
			}
			this.loading = true
			let res = await getInterfaceLogListApi(this.formData)
			if (res.ok) {
				this.dataList = res.content.list
				this.total = Number(res.content.total)
			} else {
				this.dataList = []
				this.total = 0
			}
			this.loading = false
		},
		detail(id) {
			this.activeId = id
			this.dialog.visible = true
		},
		reset() {
			this.$refs.formData.resetFields()
			this.getData()
		}
	}
}
</script>

<style scoped lang="scss">
</style>
