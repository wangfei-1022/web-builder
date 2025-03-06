<template>
	<div class="pd-16 pageContent">
		<el-form
			ref="formData"
			v-loading="loading"
			class="min-width"
			:model="formData"
			label-width="120px"
			:rules="rules"
		>
			<el-row>
				<el-col :span="12">
					<el-form-item :label="getZH('productCode') + '：'" prop="productId">
						<productSelect :disabled="isDetail" tagName="productCode" :defaultVal="formData.productCode" @selected="productSelect"  />
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
			<peakSeasonTimeEdit
				v-if="initEnd"
				:data="formData"
				:isDetail="isDetail"
			/>
		</el-form>
		<div class="flex-right footer">
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
import { submitPeakSeasonTimeApi, detailPeakSeasonTimeApi } from '@/api/OverseasWarehouse/peakSeasonSurcharge'
import peakSeasonTimeEdit from "../components/peakSeasonTimeEdit.vue"
import { getProductListApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
import getZHMixin from './components/getZHMixin'
import productSelect from '../components/productSelect'
export default {
	name: 'PeakSeasonSurchargeDetail',
	components: { peakSeasonTimeEdit, productSelect },
	mixins: [getZHMixin],
	data() {
		const defaultForm = {
			id: null,
			productId: '',
			productName: '',
			productCode: '',
			companyId: '',
			companyCode: '',
			companyName: '',
			peakSeasonTimeChargeDetailDTOList: []
		}

		return {
			initEnd: false,
			rangTime: [],
			loading: false,
			productList: [],
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
		this.init()
	},
	mounted() { },
	methods: {
		/**
* 获取物流产品列表数据
*/
		async init() {
			const res = await getProductListApi({
				pageSize: 1000,
				pageNum: 1
			})
			if (res.ok) {
				this.productList = res.content.list || []
			}
		},
		/**
		 * 物流产品选中
		 */
		productSelect(selected) {
			this.formData.productName = selected.productName
			this.formData.productCode = selected.productCode
			this.formData.companyName = selected.logisticsCompanyName
			this.formData.companyId = selected.carrierId
			this.formData.companyCode = selected.scacCode
			this.formData.productId = selected.id
		},
		/**
		 * 获取详情数据
		 */
		async getDetail() {
			this.loading = true
			const res = await detailPeakSeasonTimeApi(this.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				let handlerData = res.content.peakSeasonTimeChargeDetailDTOList
				handlerData.forEach(item => {
					if (this.$isNotEmpty(item.peakSeasonTimeDetailDTOList)) {
						item.peakSeasonTimeDetailDTOList.forEach((itemDate, index) => {
							itemDate.endTimeFlag = false
							itemDate.rangTime = []
							if (this.$isEmpty(itemDate.endTime)) {
								itemDate.endTimeFlag = true
							} else {
								itemDate.rangTime = [itemDate.startTime, itemDate.endTime]
							}
						})
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
			if (this.$isNotEmpty(saveForm.peakSeasonTimeChargeDetailDTOList)) {
				saveForm.peakSeasonTimeChargeDetailDTOList.forEach(item => {
					delete item.isBusySeason
					if (this.$isNotEmpty(item.peakSeasonTimeDetailDTOList)) {
						item.peakSeasonTimeDetailDTOList.forEach((itemDate, index) => {
							if (!itemDate.endTimeFlag) {
								itemDate.startTime = itemDate.rangTime[0]
								itemDate.endTime = itemDate.rangTime[1]
								delete itemDate.rangTime
								itemDate.serial = index + 1
							} else {
								itemDate.endTime = null
								delete itemDate.rangTime
								itemDate.serial = index + 1
							}
						})
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
				submitPeakSeasonTimeApi(saveForm)
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
			this.$router.push({ name: `PeakSeasonSurchargeList`, query: { time: new Date().getTime() } })
		}
	}
}
</script>

<style scoped lang="scss">
.footer {
	width: 600px;
	margin-top: 20px;
}
.input-width {
	width: 480px;
}
</style>
