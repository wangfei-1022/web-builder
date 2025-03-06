<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('warehouse.add_channel')"
			width="550px"
			:close-on-click-modal="false"
		>
			<el-form
				v-if="dialogVisible"
				ref="formData"
				v-loading="loading"
				label-width="110px"
				label-position="left"
				:model="formData"
			>
				<el-form-item
					:label="$t('warehouse.channel_name')"
					prop="channelCode"
					:rules="[{ required: true, message: $t('warehouse.please_select_channel') }]"
				>
					<SelectFilter
						v-model="formData.channelName"
						size="mini"
						:placeholder="$t('warehouse.channel_desc')"
						name-key="channelName"
						value-key="channelCode"
						:options="channelList"
						:filter-keys="['channelCode', 'channelName']"
						@change="selectChange"
					/>
				</el-form-item>
				<el-form-item
          :label="$t('warehouse.channel_code')"
					:rules="[{ required: true, message: $t('warehouse.please_select_channel') }]"
					prop="channelCode"
				>
					<span>{{ formData.channelCode }}</span>
				</el-form-item>
				<el-form-item
          :label="$t('warehouse.product_name')"
					:rules="[{ required: true, message: $t('warehouse.product_name_desc') }]"
					prop="productName"
				>
					<span>{{ formData.productName }}</span>
				</el-form-item>
				<el-form-item
					:label="$t('warehouse.supplier_name')"
					:rules="[{ required: true, message: $t('warehouse.supplier_name_desc') }]"
					prop="supplierName"
				>
					<span>{{ formData.supplierName }}</span>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" size="mini" @click="saveForm('formData')">
					{{$t('warehouse.confirm')}}
				</el-button>
				<el-button size="mini" @click="dialogVisible = false"> {{$t('warehouse.cancel')}} </el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getChannelListApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
export default {
	name: 'AddProductDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		dataList: Array
	},
	data() {
		const defaultForm = {
			id: null,
			channelCode: '',
			channelName: '',
			supplierName: '',
			supplierId: '',
			productName: ''
		}
		return {
			defaultForm,
			dialogVisible: false,
			loading: false,
			channelList: [],
			formData: this.$extends(true, {}, defaultForm)
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData = this.$extends(true, {}, this.defaultForm)
				this.init()
			}
			this.dialogVisible = val
		}
	},
	methods: {
		/**
		 * 获取物流产品列表数据
		 */
		async init() {
			this.loading = true
			const res = await getChannelListApi({
				pageSize: 1000,
				pageNum: 1
			}).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				this.loading = false
				const arr = res.content.list || []
				this.channelList = arr.filter(item => this.$isEmpty(this.dataList.find(data => data.id === item.id)))
			} else {
				this.loading = false
			}
		},
		/**
		 * 保存物流产品
		 */
		saveForm(refName) {
			this.loading = true
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.loading = false
					return false
				}
				this.loading = false
				this.$emit('saved', this.formData)
				this.dialogVisible = false
			})
		},
		/**
		 * 选中
		 */
		selectChange(val) {
			const itemData = this.channelList.find(item => item.channelCode === val)
			this.$copyProps(this.formData, itemData)
		}
	}

}
</script>

<style>
</style>
