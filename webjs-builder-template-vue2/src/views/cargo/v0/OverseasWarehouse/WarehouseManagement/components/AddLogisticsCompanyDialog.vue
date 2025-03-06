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
					:label="$t('logisticsCompany.logistics_company_code')"
					prop="scacCode"
					:rules="[{ required: true, message: $t('warehouse.please_logistics_company') }]"
				>
					<SelectFilter
						v-model="formData.scacCode"
						size="mini"
						:placeholder="$t('warehouse.channel_desc')"
						name-key="scacCode"
						value-key="scacCode"
						:options="companyList"
						:filter-keys="['shortname', 'chineseName','scacCode','englishName']"
						@change="selectChange"
					/>
				</el-form-item>
				<el-form-item
          :label="$t('logisticsCompany.logistics_company_abbreviation')"
          required
				>
					<span>{{ formData.shortname }}</span>
				</el-form-item>
				<el-form-item
          :label="$t('logisticsCompany.cn_name')"
					required
				>
					<span>{{ formData.chineseName }}</span>
				</el-form-item>
				<el-form-item
          :label="$t('logisticsCompany.en_name')"
					required
				>
					<span>{{ formData.englishName }}</span>
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
import { getCompanyListApi, getLogisticsCompanyApi } from "@/api/OverseasWarehouse/outInStorageManage.js"
export default {
	name: 'AddLogisticsCompanyDialog',
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
			companyId: null,
			scacCode: '',
			shortname: '',
			chineseName: '',
			englishName: '',
			transportMode: ''
		}
		return {
			defaultForm,
			dialogVisible: false,
			loading: false,
			companyList: [],
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
			const res = await getLogisticsCompanyApi().catch(() => {
				this.loading = false
			})
			if (res.ok) {
				this.loading = false
				const arr = res.content || []
				this.companyList = arr.filter(item => this.$isEmpty(this.dataList.find(data => data.companyId === item.id)))
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
				this.formData.companyId = this.formData.id
				this.formData.id = null
				this.$emit('saved', this.formData)
				this.dialogVisible = false
			})
		},
		/**
		 * 选中
		 */
		selectChange(val) {
			const itemData = this.companyList.find(item => item.scacCode === val)
			this.$copyProps(this.formData, itemData)
		}
	}

}
</script>

<style>
</style>
