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
					<el-form-item :label="getZH('warehouse') + '：'" prop="warehouseId">
						<el-select
							:disabled="isDetail"
							size="mini"
							v-model="formData.warehouseId"
							class="w-full"
							@change="warehouseChange"
							filterable
						>
							<el-option
								v-for="item in warehouseList"
								:key="item.id"
								:value="item.id"
								:label="item.name"
							></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item :label="getZH('countryName') + '：'" prop="countryName">
						<el-input
							size="mini"
							v-model="formData.countryName"
							disabled
							:placeholder="getZH('selectCountryName')"
						></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item
						:label="getZH('supplierName') + '：'"
						prop="supplierName"
					>
						<el-input
							size="mini"
							v-model="formData.supplierName"
							disabled
							:placeholder="getZH('selectSupplierName')"
						></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<peakSeasonTimeWarehouseEdit
				:data="formData"
				:isDetail="isDetail"
				:type="1"
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
import { detailWarehousePeakSeasonApi, submitWarehousePeakSeasonListApi } from '@/api/OverseasWarehouse/warehouseSeason'
import peakSeasonTimeWarehouseEdit from '../components/peakSeasonTimeWarehouseEdit.vue'
import { getWarehouseListApi } from '@/api/common.js'
import getZHMixin from './components/getZHMixin'
export default {
	name: 'WarehouseSeasonDetail',
	mixins: [getZHMixin],
	components: { peakSeasonTimeWarehouseEdit },
	data() {
		const defaultForm = {
			id: null,
			warehouseId: '',
			warehouseName: '',
			countryCode: '',
			countryId: '',
			countryName: '',
			supplierId: '',
			supplierName: '',
			peakSeasonTimeDetailDTOList: []
		}

		return {
			loading: false,
			initEnd: false,
			formData: this.$extends(true, {}, defaultForm),
			warehouseList: [],
			isDetail: false,
			rules: {
				warehouseId: [{ required: true, message: this.selectZH('warehouse') }],
				countryName: [{ required: true, message: this.getZH('selectCountryName') }],
				supplierName: [{ required: true, message: this.getZH('selectSupplierName') }]
			}
		}
	},
	computed: {

	},
	created() {
		this.isDetail = Number(this.$route.query.type) === 2
		if (this.$isNotEmpty(this.$route.query.id)) {
			this.initEnd = false
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
			const res = await getWarehouseListApi()
			if (res.ok) {
				this.warehouseList = res.content || []
			}
		},
		/**
		 * 选中仓库
		 */
		warehouseChange(id) {
			let selectItem = this.warehouseList.find(item => item.id === id)
			if (this.$isNotEmpty(selectItem)) {
				this.formData.warehouseName = selectItem.name
				this.formData.countryCode = selectItem.countryCode
				this.formData.countryId = selectItem.countryId
				this.formData.countryName = selectItem.countryName
				this.formData.supplierId = selectItem.supplierId
				this.formData.supplierName = selectItem.supplierName
			}
		},

		/**
		 * 获取详情数据
		 */
		async getDetail() {
			this.loading = true
			const res = await detailWarehousePeakSeasonApi(this.$route.query.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				let handlerData = res.content.peakSeasonTimeDetailDTOList
				handlerData.forEach(item => {
					item.endTimeFlag = false
					item.rangTime = []
					if (this.$isEmpty(item.endTime)) {
						item.endTimeFlag = true
					} else {
						item.rangTime = [item.startTime, item.endTime]
					}
				})
				this.$copyProps(this.formData, res.content)
				this.initEnd = true
				this.loading = false
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
			if (this.$isNotEmpty(saveForm.peakSeasonTimeDetailDTOList)) {
				saveForm.peakSeasonTimeDetailDTOList.forEach((itemDate, index) => {
					if (!itemDate.endTimeFlag) {
						itemDate.startTime = itemDate.rangTime[0]
						itemDate.endTime = itemDate.rangTime[1]
						delete itemDate.rangTime
						delete itemDate.endTimeFlag
						itemDate.serial = index + 1
					} else {
						itemDate.endTime = null
						delete itemDate.rangTime
						delete itemDate.endTimeFlag
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
				submitWarehousePeakSeasonListApi(saveForm)
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
			this.$router.push({ name: `WarehouseSeasonList`, query: { time: new Date().getTime() } })
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
.uploadFile-box {
	width: 80px;
	height: 80px;
	border: 1px dashed #d9d9d9;
}
.img-box {
	width: 80px;
	height: 80px;
	margin-right: 10px;
	img {
		display: block;
		width: 100%;
		height: 100%;
	}
}
.addIcon {
	color: #666;
}
.editIcon {
	margin-top: 8px;
	margin-left: 8px;
	color: #999;
	font-size: 20px;
	cursor: pointer;
}
.label-text {
	color: #606266;
}
.addItem {
	height: 40px;
	width: 100%;
	margin-top: 10px;
	cursor: pointer;
	border: 1px #d5d5e8 dashed;
	color: #909399;
}
</style>
