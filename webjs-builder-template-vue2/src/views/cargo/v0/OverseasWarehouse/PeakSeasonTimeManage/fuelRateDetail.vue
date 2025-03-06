<template>
	<div class="pd-16 pageContent">
		<el-form
			ref="formData"
			v-loading="loading"
			class="min-width"
			:model="formData"
			label-width="130px"
			:rules="rules"
		>
			<el-row>
				<el-col :span="12">
					<el-form-item :label="getZH('productCode') + '：'" prop="productId">
						<productSelect :defaultVal="formData.productCode" tagName="productCode" @selected='productSelect' :disabled="isDetail" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item :label="getZH('productName') + '：'" prop="productName">
						<el-input
							size="mini"
							v-model="formData.productName"
							disabled
							:placeholder="getZH('selectProduct')"
						></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item :label="getZH('companyId') + '：'" prop="companyName">
						<el-input
							size="mini"
							v-model="formData.companyName"
							disabled
							:placeholder="getZH('selectProduct1')"
						></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<fuelRateEdit
				v-if="initEnd"
				:data="formData"
				:type="1"
				:isDetail="isDetail"
			/>
		</el-form>
		<div class="footer flex-right">
			<div>
				<el-button :loading="loading" size="mini" @click="backList">
					{{ getZH("cancel") }}
				</el-button>
				<el-button
					v-if="!isDetail"
					:loading="loading"
					type="primary"
					size="mini"
					class="ml-20"
					@click="saveForm('formData')"
				>
					{{ getZH("save") }}
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import fuelRateEdit from '../components/fuelRateEdit.vue'
import { submitFuelRateApi, detailFuelRateApi } from '@/api/OverseasWarehouse/fuelRate'
import productSelect from '../components/productSelect.vue'
import getZHMixin from './components/getZHMixin'
export default {
	name: 'FuelRateDetail',
	mixins: [getZHMixin],
	components: { fuelRateEdit, productSelect },
	data() {
		const defaultForm = {
			id: null,
			productId: '',
			productName: '',
			productCode: '',
			companyId: '',
			companyCode: '',
			companyName: '',
			fuelRateDetailDTOList: []
		}

		return {
			rangTime: [],
			loading: false,
			initEnd: false,
			formData: this.$extends(true, {}, defaultForm),
			rules: {
				productId: [{ required: true, message: this.selectZH('productCode') }],
				companyName: [{ required: true, message: this.selectZH('selectProduct1') }],
				productName: [{ required: true, message: this.selectZH('selectProduct') }]
			}
		}
	},
	computed: {

	},
	created() {
		this.isDetail = Number(this.$route.query.type) === 2
		if (this.$isNotEmpty(this.$route.query.id)) {
			this.initEnd = false
			this.id = this.$route.query.id
			this.getDetail()
		} else {
			this.initEnd = true
		}
	},
	mounted() { },
	methods: {
		/**
		 * 物流产品选中
		 */
		productSelect(selected) {
			this.formData.productId = selected.id
			this.formData.productName = selected.productName
			this.formData.companyName = selected.logisticsCompanyName
			this.formData.companyId = selected.carrierId
			this.formData.companyCode = selected.scacCode
			this.formData.productCode = selected.productCode
		},
		/**
		 * 获取详情数据
		 */
		async getDetail() {
			this.loading = true
			const res = await detailFuelRateApi(this.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				let handlerData = res.content.fuelRateDetailDTOList
				handlerData.forEach(item => {
					item.endTimeFlag = false
					item.rangTime = []
					item.fuel = Number(item.fuel).toFixed(2)
					if (this.$isEmpty(item.endTime)) {
						item.endTimeFlag = true
					} else {
						item.rangTime = [item.startTime, item.endTime]
					}
				})
				this.$copyProps(this.formData, res.content)
				this.loading = false
				this.initEnd = true
			} else {
				this.loading = false
				this.initEnd = true
			}
		},
		/**
		 * 处理保存的数据
		 */
		handlerFormData() {
			let saveForm = this.$extends(true, {}, this.formData)
			if (this.$isNotEmpty(saveForm.fuelRateDetailDTOList)) {
				saveForm.fuelRateDetailDTOList.forEach((itemDate, index) => {
					if (!itemDate.endTimeFlag) {
						itemDate.startTime = Number(itemDate.rangTime[0])
						itemDate.endTime = Number(itemDate.rangTime[1])
						delete itemDate.rangTime
						itemDate.serial = index + 1
					} else {
						itemDate.endTime = null
						delete itemDate.rangTime
						itemDate.serial = index + 1
					}
				})
			}
			return saveForm
		},
		/**
		 * 保存数据
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				let saveForm = this.handlerFormData()
				this.loading = true
				// 处理接口数据
				submitFuelRateApi(saveForm)
					.then(res => {
						if (res.ok) {
							this.$message.success(this.getZH('saveSuccess'))
							this.backList()
						}
						this.loading = false
					})
					.catch(() => {
						this.loading = false
					})
			})
		},
		/**
		 * 返回列表
		 */
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.loading = false
			this.$router.push({ name: `FuelRateList`, query: { time: new Date().getTime() } })
		}
	}
}
</script>

<style scoped lang="scss">
.footer {
	width: 890px;
	margin-top: 20px;
}
.input-width {
	width: 480px;
}
</style>
