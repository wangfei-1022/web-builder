<template>
	<div class="right-main-wrapper" v-loading="loading">
   <div class="mb-10">
      <el-button type="primary"  @click="getData(true)" size="mini">{{$t('taskList.refresh')}}</el-button>
    </div>
		<div>
			<ag-grid-vue
				:locale-text-func="_i18nGridLocalText"
				:grid-options="gridOptions"
				:side-bar="sideBarDefs"
				:column-defs="columnFields"
				:row-data="taskList"
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
		</div>
	</div>
</template>

<script>
import { getTaskListApi } from '@/api/taskManager/taskList'
export default {
	name: 'TaskList',
	data() {
		return {
			loading: false,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: null,
			taskList: [],
			total: 0,
			formData: {
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
				field: 'taskInstance',
				headerName: this.$t('taskList.taskInstance'),
				width: 250,
				tooltip: params => params.value
			},
			{
				field: 'taskStatusName',
				headerName: this.$t('taskList.taskStatusName'),
				width: 100,
				cellRenderer: params => params.value || '-'
			},
			{
				field: 'originFileName',
				headerName: this.$t('taskList.handlerRes'),
				cellRenderer: params =>
					`<div class='flex'><span>${params.data.execResult}</span> <div> ${params.data.originCloudFileLink ? `<a class='ml-10' href="${params.data.originCloudFileLink}" style="color: #409eff;text-decoration: underline;">
            ${this.$t('taskList.source_file')} </a>` : ''}${params.data.parseCloudFileLink ? `<a class='ml-10' href="${params.data.parseCloudFileLink}" style="color: #409eff;text-decoration: underline;">
            ${this.$t('taskList.processing_result_file')} </a>` : ''}</div></div>`
			},
			{
				field: 'executeBegin',
				headerName: this.$t('taskList.executeBegin'),
				width: 150,
				cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).format('YYYY-MM-DD HH:mm:ss') : ''
			},
			{
				field: 'executeEnd',
				headerName: this.$t('taskList.executeEnd'),
				width: 150,
				cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).format('YYYY-MM-DD HH:mm:ss') : ''
			}

		]
		this.getData()
	},
	mounted() {
		this.resetHeight()
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
			let res = await getTaskListApi(this.formData)
			if (res.ok) {
				this.taskList = res.content.list
				this.total = Number(res.content.total)
			} else {
				this.taskList = []
				this.total = 0
			}
			this.loading = false
		}
	}
}
</script>

<style scoped lang="scss">
</style>
