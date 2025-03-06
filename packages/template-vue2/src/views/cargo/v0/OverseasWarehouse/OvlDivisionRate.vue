<template>
  <div v-loading="loading" class="pd-16">
    <div class="mb-10 top-btn-wrap">
      <el-button  size="mini" type="primary" @click="list"> {{$t('ovlDivisionRate.refresh')}}</el-button>
    </div>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptionsRight"
      :side-bar="sideBarDefs"
      :column-defs="columnDefsRight"
      :row-data="dataList"
      :enable-col-resize="true"
      :enable-sorting="true"
      :grid-ready="onReadyRight"
      :style="{height: scrollTableHeight +'px'}"
      class="ag-theme-balham"
    />
    <Pagination :total="total" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
    <AdjustRateDialog :visible.sync="dialog.visible" @saved="list" :id="activeId"></AdjustRateDialog>
  </div>
</template>
<script>
import OvlDivisionRateBtn from './components/OvlDivisionRateBtn'
import AdjustRateDialog from './components/AdjustRateDialog'
import { getDivisionRatePagesApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
export default {
	name: 'OvlDivisionRate',
	components: { OvlDivisionRateBtn, AdjustRateDialog },
	data() {
		return {
			formData: {
				pageSize: 50,
				pageNum: 1
			},
			loading: false,
			total: 0,
			activeId: null,
			dataList: [],
			columnDefsRight: [
				{
					headerName: this.$t('ovlDivisionRate.countryChineseName'),
					field: 'countryChineseName'
				},
				{
					headerName: this.$t('ovlDivisionRate.countryCode2'),
					field: 'countryCode2'
				},
				{
					headerName: this.$t('ovlDivisionRate.divisionChineseName'),
					field: 'divisionChineseName'
				},
				{
					headerName: this.$t('ovlDivisionRate.divisionEnglishName'),
					field: 'divisionEnglishName'
				},
				{
					headerName: this.$t('ovlDivisionRate.rate') + ' %',
					field: 'rate'
				},
				{
					headerName: this.$t('common.operation'), pinned: 'right', field: `id`, width: 100,
					cellRendererFramework: 'OvlDivisionRateBtn'
				}
			],
			gridOptionsRight: {},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false }

		}
	},
	created() {
		this.gridOptionsRight = {
			context: {
				componentParent: this
			}
		}
		this.list()
	},
	computed: {
		scrollTableHeight() {
			return document.documentElement.clientHeight - 260
		},
	},
	methods: {
		onReadyRight(params) {
			// const self = this
			params.api.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
					// self.onFirstDataRendered()
				})
			})
		},
		/**
		 * 获取列表数据
		 */
		async list() {
			this.loading = true
			let res = await getDivisionRatePagesApi(this.formData)
			if (res.ok) {
				this.dataList = res.content.list || []
				this.total = res.content.total
			}
			this.loading = false
		},
		/**
		 * 调整税率
		 */
		edit(data) {
			this.activeId = data.id
			this.dialog.visible = true
		},
		/**
		 * 清空重置条件
		 */
		clearSearchForm() {
			this.$refs.formData.resetFields()
			this.list()
		}
	}
}
</script>

<style scoped lang="less">
</style>
