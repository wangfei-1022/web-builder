<template>
  <div v-loading="loading" class="pd-16">
    <TopSearchItemsSlot
			:searchFun="list"
			:resetFun="clearSearchForm"
      class="mb-10"
		>
			<template slot="multipleSearch">
        <el-form ref="formData" :inline="true" :model="formData" label-width="100px">
          <el-form-item :label="$t('channel.channel_code')" prop="channelCode">
            <el-input v-model="formData.channelCode" type="text" :placeholder="$t('channel.please_enter_channel_code')" size="mini" clearable @keyup.enter.native="list" />
          </el-form-item>
          <el-form-item :label="$t('channel.channel_name')" prop="channelName">
            <el-input v-model="formData.channelName" type="text" :placeholder="$t('channel.please_enter_channel_name')" size="mini" clearable @keyup.enter.native="list" />
          </el-form-item>
          <el-form-item :label="$t('channel.product_code')" prop="productCode">
            <type-select v-model="formData.productCode" type="ovlProduct"  @selected="list" />
          </el-form-item>
          <el-form-item :label="$t('channel.supplier')" prop="supplierId">
            <type-select v-model="formData.supplierId" type="supplier" @selected="list" :requestParams="{businessType: 'OVERSEAS_WAREHOUSE'}"></type-select>
          </el-form-item>
        </el-form>
			</template>
		</TopSearchItemsSlot>
    <div class="mb-10 top-btn-wrap">
      <el-button icon="el-icon-plus" size="mini" type="primary" @click="edit()"> {{$t('channel.add')}}</el-button>
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
      :style="gridHeight"
      class="ag-theme-balham"
    />
    <ChannelDialog :id="id" :type="type" :visible.sync="dialog.visible" @saved="list" />
    <Pagination :total="total" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
  </div>
</template>

<script>
import ChannelBtn from './components/ChannelBtn'
import ChannelDialog from './components/ChannelDialog'
import { getChannelListApi, delChannelApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
export default {
	name: 'Channel',
	components: { ChannelBtn, ChannelDialog },
	data() {
		return {
			formData: {
				channelCode: '',
				channelName: '',
				productCode: '',
				supplierId: '',
				pageSize: 50,
				pageNum: 1
			},
			loading: false,
			total: 0,
			id: null,
			type: 0,
			dataList: [],
			columnDefsRight: [
				{
					headerName: this.$t('channel.channel_code'),
					field: 'channelCode'
				},
				{
					headerName: this.$t('channel.channel_name'),
					field: 'channelName'
				},
				{
					headerName: this.$t('channel.product_name'),
					field: 'productName'
				},
				{
					headerName: this.$t('channel.supplier'),
					field: 'supplierName'
				},
				{
					headerName: this.$t('channel.supplierChannelCode'),
					field: 'supplierChannelCode'
				},
				{
					headerName: this.$t('channel.operation'), pinned: 'right', field: `id`, minWidth: 120, maxWidth: 120,
					cellRendererFramework: 'ChannelBtn'
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
		del(id) {
			this.$confirm(this.$t('common.deleteTips'), this.$t('common.tips'), {
				cancelButtonText: this.$t('common.cancel'),
				confirmButtonText: this.$t('common.confirmBtn'),
				type: 'danger'
			}).then(() => {
				this.loading = true
				delChannelApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						this.list()
					}
					this.loading = false
				}).catch(() => {
					this.loading = false
				})
			})
		},
		/**
		 * 获取列表数据
		 */
		async list() {
			this.loading = true
			const res = await getChannelListApi(this.formData).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				this.dataList = res.content.list || []
				this.total = Number(res.content.total)
				this.loading = false
			} else {
				this.loading = false
			}
		},
		/**
	 * 新增编辑
	 */
		edit(id, type) {
			type = type || 0
			this.id = id || null
			this.dialog.visible = true
			this.type = type
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
