<template>
	<div>
		<el-dialog
			ref="formData"
			:visible.sync="dialogVisible"
			:title="title"
			width="800px"
			:close-on-click-modal="false"
		>
			<div class="dialogContent">
				<el-form
					v-if="dialogVisible"
					ref="formData"
					v-loading="loading"
					label-width="90px"
					label-position="left"
					:model="formData"
					:rules="rules"
				>
					<div class="content-title">{{ $t("partition.base_info") }}</div>
					<div class="pd-16">
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item
									:label="$t('partition.area_scheme_code')"
									prop="areaSchemeCode"
								>
									<el-input
										v-model="formData.areaSchemeCode"
										:disabled="step !== 0"
										size="mini"
										:placeholder="$t('partition.please_enter_area_scheme_code')"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item
									:label="$t('partition.area_scheme_name')"
									prop="areaSchemeName"
								>
									<el-input
										v-model="formData.areaSchemeName"
										:disabled="step !== 0"
										size="mini"
										:placeholder="$t('partition.please_enter_area_scheme_name')"
									/>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item
									:label="$t('partition.product_code')"
									prop="productName"
								>
                  <type-select v-model="formData.productName" type="ovlProduct"  @selected="productSelect" 	:disabled="step !== 0" />
								</el-form-item>
							</el-col>
              <el-col :span="12">
								<el-form-item
									:label="$t('partition.arrive_area_type')"
									prop="countryConfigId"
								>
									<el-select v-model="formData.countryConfigId" :disabled="step !== 0" size="mini" :placeholder="$t('partition.please_select_arrive_area_type')" class="w-full"	@change="partitionStateChange">
										<el-option	v-for="item in countryConfigList"	:key="item.id" :label="item.countryName" :value="item.id" />
									</el-select>
								</el-form-item>
							</el-col>
              <el-col :span="24">
								<div class="flex">
									<el-form-item
										:label="$t('partition.depart_area')"
										prop="departAreaType"
									>
										<el-select
											v-model="formData.departAreaType"
											disabled
											size="mini"
											:placeholder="$t('partition.depart_area_desc')"
											class="w-110"
										>
											<el-option
												v-for="item in areaTypes"
												:key="item.value"
												:label="item.label"
												:value="item.value"
											/>
										</el-select>
									</el-form-item>
									<el-form-item
										label-width="0px"
										prop="warehouseIds"
										class="ml-10 flex-grow"
									>
										<el-select
											v-model="formData.warehouseIds"
											:disabled="isDetail|| $isEmpty(formData.countryCode)"
											size="mini"
											:placeholder="$t('common.placeholder')"
											class="w-full"
											multiple
											:collapse-tags="formData.warehouseIds.length>4"
										>
											<el-option
												v-for="item in warehouseList"
												:key="item.id"
												:label="item.name"
												:value="item.id"
											/>
										</el-select>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
					</div>
					<div class="pd-16"	v-if="(formData.areaImportType &&	!formData.singleAreaFlag) ||formData.haveRemoteAreaFlag"	>
						<el-form-item :label="$t('partition.arrive_area_file')" required v-if="!isDetail">
							<div>
								<UploadFile
									:accept="'.xlsx'"
									:showFileList="true"
									class="upload"
									:limit="1"
									v-model="fileList"
								>
								</UploadFile>
								<div class="ml-10">
									<div class="uploadTip">
										{{ $t("partition.arrive_area_file_desc") }}
										<span class="fc-blue pointer" @click.prevent="download()">
											{{ $t("partition.download_template") }}</span
										>
									</div>
								</div>
							</div>
						</el-form-item>
					</div>
					<div v-if="$isNotEmpty(id) && $isEmpty(fileList)">
						<el-tabs>
							<el-tab-pane
								:label="$t('partition.arrive_area_info')"
								v-if="!formData.singleAreaFlag"
							>
								<div class="pd-16">
									<el-table
										:data="formData.targetAreaScopeList || []"
										style="width: 100%"
									>
										<el-table-column
											:label="$t('partition.areaScope.area')"
											width="100"
											prop="areaName"
										/>
										<el-table-column
											:label="$t('partition.areaScope.scope')"
											prop="zipValueRange"
										/>
									</el-table>
								</div>
							</el-tab-pane>
							<el-tab-pane
								:label="$t('partition.remote_area_info')"
								v-if="formData.haveRemoteAreaFlag"
							>
								<div class="pd-16">
									<el-table
										:data="formData.remoteAreaScopeList || []"
										style="width: 100%"
									>
										<el-table-column
											:label="$t('partition.remoteAreaScope.type')"
											width="100"
											prop="areaName"
										/>
										<el-table-column
											:label="$t('partition.remoteAreaScope.scope')"
											prop="zipValueRange"
										/>
									</el-table>
								</div>
							</el-tab-pane>
						</el-tabs>
						<el-tabs> </el-tabs>
					</div>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button
					v-if="!isDetail"
					type="primary"
					size="mini"
					:loading="loading"
					@click="saveForm('formData')"
				>
					{{ $t("partition.save") }}
				</el-button>
				<el-button
					v-if="isDetail"
					size="mini"
					:loading="loading"
					@click="dialogVisible = false"
				>
					{{ $t("partition.close") }}
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { validEnglishNumbers } from '@/utils/validate'
import { getWarehouseListApi } from '@/api/OverseasWarehouse/warehouse'
import { detailAreaSchemeApi, saveSchemeApi, downloadTemplateApi, getAreaTypesApi, getCountryConfigApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
export default {
	name: 'PartitionChangeDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: [String, Number],
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	data() {
		const defaultForm = {
			id: null,
			areaSchemeCode: '',
			areaSchemeName: '',
			productName: '',
			productCode: '',
			departAreaType: 24,
			areaImportType: null,
			warehouseIds: [],
			arriveAreaType: '',
			targetAreaScopeList: [],
			remoteAreaScopeList: [],
			countryCode: null,
			countryConfigId: null,
			singleAreaFlag: null, // 产品是否是单一分区
			haveRemoteAreaFlag: null, // 产品是否是有偏远地区
			file: {
				cloudFileName: '',
				originFileName: ''
			}
		}
		return {
			fileList: [],
			warehouseList: [],

			hasUpdate: false,
			step: 0,
			dialogVisible: false,
			title: '',
			loading: false,
			tempList: [],
			saveTempList: [],
			countryConfigList: [],
			areaTypes: [],
			defaultForm: defaultForm,
			formData: this.$extends({}, defaultForm),
			rules: {
				areaSchemeCode: [{ required: true, message: this.$t('partition.please_enter_area_scheme_code'), trigger: 'change' }, { validator: validEnglishNumbers }],
				areaSchemeName: [{ required: true, message: this.$t('partition.please_enter_area_scheme_name'), trigger: 'change' }],
				productName: [{ required: true, message: this.$t('partition.please_select_product_code'), trigger: 'change' }],
				warehouseIds: [{ required: true, message: this.$t('partition.please_select_warehouse'), trigger: 'change' }],
				countryConfigId: [{ required: true, message: this.$t('partition.please_select_countryCode'), trigger: 'change' }]
			}
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		async visible(val) {
			if (val) {
				this.loading = true
				this.fileList = []
				await this.init()
				if (this.$isNotEmpty(this.id)) {
					this.title = this.isDetail ? this.$t('partition.area_scheme_detail') : this.$t('partition.edit_area_scheme')
					await this.$nextTick()
					const res = await detailAreaSchemeApi(this.id)
					if (res.ok) {
						this.$copyProps(this.formData, res.content, 'file')
						const arr = []
						// 处理港口 仓库数据
						if (this.$isNotEmpty(res.content.departAreaScopeList)) {
							res.content.departAreaScopeList.forEach(item => {
								arr.push(item.warehouseId)
							})
						}
						this.formData.warehouseIds = arr
						this.tempList = res.content.targetAreaScopeList || []
						this.getWarehouse(this.formData.countryCode, true)
					}
					if (this.isDetail) {
						this.step = 3
					} else {
						this.step = 1
					}
				} else {
					this.title = this.$t('partition.add_area_scheme')
					this.formData = this.$extends({}, this.defaultForm)
					this.step = 0
				}
			}
			await this.$nextTick()
			this.dialogVisible = val
			this.loading = false
		}
	},
	methods: {
		/**
		 * 获取物流产品列表数据
		 */
		async init() {
			const rs = await getAreaTypesApi()
			if (rs.ok) {
				this.areaTypes = rs.content
			}
			const rs1 = await getCountryConfigApi()
			if (rs1.ok) {
				this.countryConfigList = rs1.content
			}
		},
		// 获取仓库
		async getWarehouse(countryCode, isInit) {
			let query = {
				pageSize: 1000,
				countryCode: countryCode,
				pageNum: 1,
				status: 2
			}
			const rs = await getWarehouseListApi(query)
			if (rs.ok) {
				if (!isInit) {
					this.formData.warehouseIds = []
				}
				this.warehouseList = rs.content.list || []
			}

		},
		// 分区国家
		partitionStateChange(id) {
			let itemData = this.countryConfigList.find(item => item.id === id)
			if (this.$isNotEmpty(itemData)) {
				this.formData.countryCode = itemData.countryCode
				this.formData.areaImportType = itemData.areaImportType
				this.formData.arriveAreaType = itemData.arriveAreaType
				this.formData.departAreaType = itemData.departAreaType
				this.getWarehouse(itemData.countryCode)
			}
		},
		/**
		 * 物流产品选中
		 */
		async productSelect(itemData) {
			if (this.$isNotEmpty(itemData)) {
				if (itemData.singleAreaFlag && !itemData.haveRemoteAreaFlag) {
					this.formData.areaImportType = null
				}
				this.formData.productCode = itemData.productCode
				this.formData.productName = itemData.productName
				this.formData.singleAreaFlag = itemData.singleAreaFlag
				this.formData.haveRemoteAreaFlag = itemData.haveRemoteAreaFlag

			}
		},
		/**
		 * 保存数据
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					const formData = this.$extends({}, this.formData)
					const arr = []
					// 处理港口 仓库数据
					formData.warehouseIds.forEach(item => {
						arr.push({
							warehouseId: item
						})
					})
					formData.departAreaScopeList = arr
					if (this.$isNotEmpty(this.fileList)) {
						let fileData = this.fileList[0]
						formData.file.cloudFileName = fileData.cloudFileName
						formData.file.originFileName = fileData.originFileName
					} else {
						if (this.$isEmpty(this.formData.remoteAreaScopeList) && this.$isEmpty(this.formData.targetAreaScopeList) && (!this.formData.singleAreaFlag || this.formData.haveRemoteAreaFlag)) {
							this.$message.error(this.$t('partition.arrive_area_info_need_upload'))
							return
						} else {
							delete formData.file
						}
					}
					this.loading = true
					saveSchemeApi(formData, formData.id).then(res => {
						if (res.ok) {
							this.loading = false
							this.$message.success(this.$t('TipsMessage.saveMessage'))
							this.$emit('saved')
							this.dialogVisible = false
						} else {
							this.loading = false
						}
					}).catch(() => {
						this.loading = false
					})
				} else {
					this.mixinsFormScrollIntoView()
					return false
				}
			})
		},
		/**
		 * 根据物流产品下载模版
		 */
		async download() {
			if (this.$isEmpty(this.formData.areaImportType)) {
				this.$message.error(this.$t('partition.please_select_areaImportType'))
				return
			}
			let data = {
				areaImportType: this.formData.areaImportType,
				singleAreaFlag: this.formData.singleAreaFlag
			}
			let res = await downloadTemplateApi(data)
			if (res.ok) {
				this.downloadExcel(res.content)
			}
		}
	}

}
</script>

<style lang="less" scoped>
.dialogContent {
	max-height: 600px;
	overflow: auto;
}
</style>
