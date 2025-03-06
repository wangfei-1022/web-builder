<template>
	<div v-loading="loading" class="pd-16">
    <div class="mb-10">
      <el-button size='mini' type="primary" @click="edit()" v-permission="['mem:goods:category:add']">
        {{getZH('addCategory')}}
      </el-button>
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
			style="width: 100%; height: calc(100vh - 260px)"
			class="ag-theme-balham"
		/>
		<Pagination
			:total="total"
			:limit.sync="formData.pageSize"
			:page.sync="formData.pageNum"
			@pagination="list"
		/>
    <categoryEditDialog :visible.sync="dialog.visible" :id='id' @saved='list' />
	</div>
</template>

<script>
import operationBtn from './components/operationBtn'
import { getCategoryListApi, delCategoryApi } from '@/api/OverseasWarehouse/goodsManager'
import categoryEditDialog from './components/categoryEditDialog.vue'
export default {
	name: 'CategoryList',
	components: { operationBtn, categoryEditDialog },
	data() {
		return {
			formData: {
				pageSize: 50,
				pageNum: 1
			},
			total: 0,
			loading: false,
			id: null,
			dataList: [],
			columnDefsRight: [
				{
					headerName: this.getZH('categoryName'),
					field: 'name',
					minWidth: 150
				},
				{
					headerName: this.getZH('levelName'),
					field: 'levelName',
					minWidth: 150
				},
				{
					headerName: this.getZH('parentName'),
					field: 'parentName',
					minWidth: 150
				},
				{
					headerName: this.getZH('operation'), pinned: 'right', field: `id`, minWidth: 120,
					cellRendererFramework: 'operationBtn'
				}],
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
	mounted() {

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
			 * 获取列表
			 */
		async list() {
			this.loading = true
			const res = await getCategoryListApi(this.formData).catch(() => {
				this.loading = false
			})
			if (res && res.ok) {
				this.dataList = res.content.list || []
				this.total = res.content.total
				this.loading = false
			} else {
				this.loading = false
			}
		},
		/**
			 * 新增编辑
			 */
		edit(id) {
			this.dialog.visible = true
			this.id = id || null
		},
		del(id, level) {
			this.$confirm(level === 1 ? this.$t('goodsManagement.deleteTips1') : this.$t('common.deleteTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				delCategoryApi(id).then(res => {
					this.$message.success(this.$t('common.deleteSuccess'))
					this.list()
				})
			}).catch(() => { })
		},

		/**
		 * 下拉框
		 */
		selectZH(key, obj) {
			return this.getZH('selectPlaceholder', 'common') + this.getZH(key, obj)
		},
		/**
		 * 输入框
		 */
		inputZH(key, obj) {
			return this.getZH('placeholder', 'common') + this.getZH(key, obj)
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || 'goodsManagement'
			let str = obj + '.' + key
			return this.$t(str)
		}
	}
}
</script>

<style scoped lang="scss">
.container-wrap {
	margin-top: 20px;
	padding: 10px 20px;
	background: #fff;
}
</style>
