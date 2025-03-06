<template>
    <div class="page-edit-container full-page bg-white">
      <div class="page-edit-content" v-loading="loading">
        <el-form  ref="formData" label-width="110px" label-position="left" :model="formData">
          <div class="content-title">{{ getZH('base_info') }}</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="getZH('customer_cName')">
                <span>{{ formData.chineseName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('customerNumber')">
                <span>{{ formData.no }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('customer_short_Name')">
                <span>{{ formData.shortName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('customer_eName')">
                <span>{{ formData.englishName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="getZH('sales_names')">
                <span>{{formData.salesNames? formData.salesNames.join(","):'' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="content-title">{{ getZH('warehouse_config') }}</div>
          <div>
            <el-table :data="formData.warehouseConfigList" >
              <el-table-column  minWidth="150">
                <template slot="header" slot-scope="{}">
                  <span>
                    <span class="fc-red">*</span>
                    {{getZH('warehouse_name') }}
                  </span>
                </template>
                <template slot-scope="{row}">
                  <div v-show="!row.isEdit">{{row.warehouseName}}</div>
                  <StorageWarehouseSelect
                    v-if="row.isEdit"
                    v-model="row.warehouseId"
                    @selected="detailWarehouse($event,row)"
                    :filter="filterWarehouse"
                  />
                </template>
              </el-table-column>
              <el-table-column  minWidth="150">
                <template slot="header" slot-scope="{}">
                  <span>
                    <span class="fc-red">*</span>
                    {{getZH('skuPushCode') }}
                  </span>
                </template>
                <template slot-scope="{row}">
                  <div v-if="!row.isEdit">{{customCodesOptionsMap[row.skuPushCode]}}</div>
                  <el-cascader v-else size="mini" v-model="row.codeType" :options="customCodesOptions" :props="{ label: 'chineseName', value: 'id' }" :placeholder="$t('common.selectPlaceholder')" :show-all-levels="false" ></el-cascader>
                </template>
              </el-table-column>
              <el-table-column  minWidth="140">
                <template slot="header" slot-scope="{}">
                  <span>
                    {{getZH('logistics_products') }}
                  </span>
                </template>
                <template slot-scope="{row}">
                  <div v-if="!row.isEdit">{{row.productStr}}</div>
                    <el-select v-else filterable v-model="row.productList" multiple class="w-full"  size="mini">
                      <el-option v-for="item in warehoustInfo.productList" :key="item.id" :label="item.productName" :value="item.id"/>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="getZH('express_Flag')" width="140" >
                <template slot-scope="{row}">
                  <div v-if="!row.isEdit || $isEmpty(warehoustInfo.logisticsCompanyList) ">{{row.expressFlag?'是':'否'}}</div>
                    <el-select v-else filterable v-model="row.expressFlag" size="mini" @change="expressFlagChange($event,row)" >
                      <el-option :label="getZH('yes')" :value="true"/>
                      <el-option :label="getZH('no')" :value="false"/>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="getZH('pick_up_logistics')"  minWidth="150">
                <template slot="header">
                  <span>
                    <span class="fc-red">*</span>
                    {{getZH('pick_up_logistics') }}
                  </span>
                </template>
                <template slot-scope="{row}">
                  <div v-if="!row.isEdit || !row.expressFlag">{{row.supplierStr || '-'}}</div>
                    <el-select v-else filterable v-model="row.supplierList" multiple size="mini" >
                      <el-option v-for=" item in warehoustInfo.logisticsCompanyList" :key="item.companyId" :label="item.chineseName" :value="item.companyId"/>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column width="120">
                <template slot="header">
                  <span>
                    <span class="fc-red">*</span>
                    {{getZH('businessType') }}
                  </span>
                </template>
                <template slot-scope="{row}">
                  <div v-if="!row.isEdit ">{{businessTypeMap[row.businessType]}}</div>
                  <el-select v-else  v-model="row.businessType"  size="mini" >
                    <el-option v-for="(item,key) in businessTypeMap" :key="key" :label="item" :value="key"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column width="120">
                <template slot="header">
                  <span>
                    <span class="fc-red">*</span>
                    {{getZH('pick_up') }}
                  </span>
                </template>
                <template slot-scope="{row}">
                  <div v-if="!row.isEdit">{{row.pickUp ? getZH("yes") : getZH("no")}}</div>
                    <el-select v-else filterable v-model="row.pickUp" size="mini" >
                      <el-option :label="getZH('yes')" :value="true"/>
                      <el-option :label="getZH('no')" :value="false"/>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column width="150">
                <template slot="header">
                  <span>
                    <span class="fc-red">*</span>
                    {{getZH('allowBatchFlag') }}
                  </span>
                </template>
                <template slot-scope="{row}">
                  <div v-if="!row.isEdit">{{row.allowBatchFlag ? getZH("yes") : getZH("no")}}</div>
                    <el-select v-else filterable v-model="row.allowBatchFlag" size="mini" >
                      <el-option :label="getZH('yes')" :value="true"/>
                      <el-option :label="getZH('no')" :value="false"/>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column width="150">
                <template slot="header">
                  <span>
                    <span class="fc-red">*</span>
                    {{getZH('checkFlag') }}
                  </span>
                </template>
                <template slot-scope="{row}">
                  <div v-if="!row.isEdit">{{row.outGoingFlag ? getZH("yes") : getZH("no")}}</div>
                    <el-select v-else filterable v-model="row.outGoingFlag" size="mini" >
                      <el-option :label="getZH('yes')" :value="true"/>
                      <el-option :label="getZH('no')" :value="false"/>
                    </el-select>
                </template>
              </el-table-column>

              <el-table-column :label="getZH('chargeConfig')" width="180" >
                <template slot-scope="{row}">
                  <el-checkbox-group v-model="row.chargeCodeList" :disabled="!row.isEdit">
                    <div v-for="item in chargeList" :key="item.code">
                      <el-checkbox :label="item.code">{{item.name}}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                  <span></span>
                </template>
              </el-table-column>
              <el-table-column :label="getZH('status')" width="80" >
                <template slot-scope="{row}">
                  <div :class="row.activeFlag?'fc-blue':'fc-yellow'">{{row.activeFlag?getZH('active'):getZH('inactive')}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.operation')" width="90" fixed="right">
                <template slot-scope="{ row, $index }">
                  <div class="operating" v-if="row.isEdit">
                    <span @click="saveItem(row, $index)" class="fc-blue pointer">
                      {{ $t("common.saveBtn") }}
                    </span>
                    <span @click="cancel(row, $index)" class="fc-blue pointer ml-10" v-if="row.isEdit">
                      {{ $t("common.cancel") }}
                    </span>
                  </div>
                  <div v-if="!row.isEdit && !isEdit">
                    <span @click="editItem(row, $index)" class="fc-blue pointer"> {{ $t("common.editBtn") }}</span>
                    <span @click="updateStatus(row)" class="fc-blue pointer" v-if="!row.activeFlag" > {{ getZH('active') }}</span>
                    <span @click="updateStatus(row)" class="fc-red pointer" v-if="row.activeFlag" > {{ getZH('inactive')  }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="addItem flex-center" @click="addItem" v-if="!isEdit" >
              <span class="el-icon-plus" />	{{$t('warehouse.increase')}}
            </div>
          </div>
      </el-form>
      </div>
      <div class="page-edit-footer">
        <el-button size="mini" @click="backList()"> {{ $t('common.cancelBtn') }} </el-button>
      </div>
    </div>
</template>

<script>
import StorageWarehouseSelect from '../components/storageWarehouseSelect'
import { detailCustomerApi, saveCustomerWarehouseApi, getWarehouseProductAndLogisticsCompanyApi, updateCustomerWarehouseStatusApi, getBusinessTypeApi, getChargeTypeApi } from '@/api/OverseasWarehouse/overseasManage.js'
import { getGoodsTypeIdListApi, getTermAndItemApi } from '@/api/OverseasWarehouse/goodsManager'
import getZHMixin from './components/getZHMixin'
export default {
	name: 'BaseConfigDialog',
	mixins: [getZHMixin],
	components: { StorageWarehouseSelect },
	data() {
		const defaultForm = {
			id: null,
			chineseName: null,
			englishName: null,
			salesNames: null,
			shortName: null,
			customerType: 1,
			customerTypeName: null,
			no: null,
			status: 1,
			warehouseConfigList: []
		}
		return {
			defaultForm,
			loading: false,
			isEdit: false,
			formData: this.$extends(true, {}, defaultForm),
			tempData: {},
			customCodesOptions: [],
			chargeList: [],
			chargeCodes: [],
			customCodesOptionsMap: {},
			businessTypeMap: {},
			warehoustInfo: {
				productList: [],
				logisticsCompanyList: []
			}
		}
	},
	methods: {
		/**
		 * 获取物流产品列表数据
		 */
		async init() {
			this.isEdit = false
			this.loading = true
			const res = await detailCustomerApi(this.$route.query.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				if (this.$isNotEmpty(res.content.warehouseConfigList)) {
					res.content.warehouseConfigList.forEach(item => {
						let productList = []
						let supplierList = []
						let chargeCodeList = []
						let productStr = ''
						let supplierStr = ''
						item.productJson.forEach(item => {
							if (this.$isNotEmpty(productStr)) {
								productStr += '、'
							}
							productList.push(item.id)
							productStr += item.productName

						})
						if (this.$isNotEmpty(item.supplierJson)) {
							item.supplierJson.forEach(item => {
								if (this.$isNotEmpty(supplierStr)) {
									supplierStr += '、'
								}
								supplierList.push(item.companyId)
								supplierStr += item.chineseName

							})
						}
						item.chargeJson.forEach(item => {
							chargeCodeList.push(Number(item.chargeTypeCode))
						})
						let codeType = []
						let skuPushCode = null
						if (this.$isNotEmpty(item.skuPushCodeJson)) {
							let data = item.skuPushCodeJson[0]
							if (Number(data.id) === 1) {
								codeType = ['1']
								skuPushCode = '1'
							} else {
								codeType = [data.parentId, data.id]
								skuPushCode = data.id
							}
						}
						this.$set(item, 'codeType', codeType)
						this.$set(item, 'skuPushCode', skuPushCode)
						this.$set(item, 'chargeCodeList', chargeCodeList)
						item.productList = productList
						item.supplierList = supplierList
						item.productStr = productStr
						item.supplierStr = supplierStr
					})
				}
				// if(this.$isNotEmpty(res.c))
				this.$copyProps(this.formData, res.content)
				this.loading = false
			} else {
				this.loading = false
			}
			let result = await getGoodsTypeIdListApi()
			if (result.ok) {
				let codeList = []
				let arr = result.content || []
				arr.forEach(item => {
					codeList.push(item.termCode)
				})
				let rs = await getTermAndItemApi(codeList)
				if (rs && rs.ok) {
					let customCodesOptionsMap = {
						"1": '电商sku编码'
					}
					rs.content.forEach(item => {
						if (item.children) {
							item.children.forEach(data => {
								customCodesOptionsMap[data.id] = data.chineseName

							})
						}
					})
					rs.content.unshift({ id: '1', chineseName: '电商sku编码' })
					this.customCodesOptions = rs.content
					this.customCodesOptionsMap = customCodesOptionsMap
				}
			}
			let rs = await getBusinessTypeApi()
			if (rs.ok) {
				let map = {}
				rs.content.forEach(item => {
					map[item.code] = item.name
				})
				this.businessTypeMap = map
			}
			let chargeRs = await getChargeTypeApi()
			if (chargeRs.ok) {
				let chargeCodes = []
				chargeRs.content.forEach(item => {
					chargeCodes.push(item.code)
				})
				this.chargeList = chargeRs.content
				this.chargeCodes = chargeCodes
			}
		},

		/**
		 * 获取仓库配置信息
		 */
		async detailWarehouse(selectItem, row) {
			row.productList = []
			row.supplierList = []
			row.productStr = null
			row.supplierStr = null
			if (this.$isNotEmpty(selectItem)) {
				row.warehouseId = selectItem.id
				row.warehouseName = selectItem.name
				row.countryName = selectItem.countryName
				row.countryCode = selectItem.countryCode
				let res = await getWarehouseProductAndLogisticsCompanyApi(selectItem.id)
				if (res.ok) {
					this.$copyProps(this.warehoustInfo, res.content)
					if (this.$isEmpty(this.warehoustInfo.logisticsCompanyList)) {
						row.expressFlag = false
					}
				}
			} else {
				row.expressFlag = null
				this.warehoustInfo.productList = []
				this.warehoustInfo.logisticsCompanyList = []
			}
		},
		/**
		 * 过滤可选择仓库
		 */
		filterWarehouse(list) {
			let dataList = this.formData.warehouseConfigList.filter(item => !item.isEdit)
			list = list.filter(item => this.$isEmpty(dataList.find(dataItem => dataItem.warehouseId === item.id)))
			return list
		},
		// 是否支持自供面单变更
		expressFlagChange(val, row) {
			if (!val) {
				row.supplierStr = ""
				row.supplierList = []
			}
		},
		// 更新状态
		async updateStatus(row) {
			let saveData = {
				activeFlag: !row.activeFlag,
				id: row.id
			}
			let res = await updateCustomerWarehouseStatusApi(saveData)
			if (res.ok) {
				row.activeFlag = !row.activeFlag
				this.$message.success(this.getZH('uploadSuccess', 'common'))
			}
		},
		/**
		 * 保存数据
		 */
		saveItem(row) {
			if (this.$isEmpty(row.warehouseId)) {
				this.$alert(this.selectZH('warehouse_name'), {
					confirmButtonText: this.$t("common.confirm")
				})
				return
			}
			if (this.$isEmpty(row.supplierList) && row.expressFlag) {
				this.$alert(this.selectZH('pick_up_logistics'), {
					confirmButtonText: this.$t("common.confirm")
				})
				return
			}
			if (this.$isEmpty(row.codeType)) {
				this.$alert(this.selectZH('skuPushCode'), {
					confirmButtonText: this.$t("common.confirm")
				})
				return
			}
			if (this.$isEmpty(row.businessType)) {
				this.$alert(this.selectZH('businessType'), {
					confirmButtonText: this.$t("common.confirm")
				})
				return
			}
			if (this.$isEmpty(row.pickUp)) {
				this.$alert(this.selectZH('pick_up'), {
					confirmButtonText: this.$t("common.confirm")
				})
				return
			}
			if (this.$isEmpty(row.allowBatchFlag)) {
				this.$alert(this.selectZH('allowBatchFlag'), {
					confirmButtonText: this.$t("common.confirm")
				})
				return
			}
			if (this.$isEmpty(row.outGoingFlag)) {
				this.$alert(this.selectZH('outGoingFlag'), {
					confirmButtonText: this.$t("common.confirm")
				})
				return
			}
			let chargeJson = []
			if (this.$isNotEmpty(row.chargeCodeList)) {
				row.chargeCodeList.forEach(item => {
					let chargeItem = this.chargeList.find(chargeItem => item === chargeItem.code)
					if (this.$isNotEmpty(chargeItem)) {
						chargeJson.push({ chargeTypeCode: chargeItem.code, chargeTypeName: chargeItem.name })
					}
				})
			}
			row.skuPushCode = row.codeType.length === 2 ? row.codeType[1] : row.codeType[0]
			let skuPushCodeJson = row.codeType.length === 2 ? [{ parentId: row.codeType[0], id: row.codeType[1] }] : [{ parentId: '', id: row.codeType[0] }]

			let productStr = ""
			let supplierStr = ""
			row.productJson = []
			row.supplierJson = []
			let selectedProduct = this.warehoustInfo.productList.filter(item => row.productList.includes(item.id))
			let selectedSupplier = this.warehoustInfo.logisticsCompanyList.filter(item => row.supplierList.includes(item.companyId))
			selectedProduct.forEach(item => {
				if (this.$isNotEmpty(productStr)) {
					productStr += '、'
				}
				productStr += item.productName
				let data = {
					id: item.id,
					productCode: item.productCode,
					productName: item.productName,
					productType: item.productType
				}
				row.productJson.push(data)
			})
			if (this.$isNotEmpty(selectedSupplier)) {
				selectedSupplier.forEach(item => {
					if (this.$isNotEmpty(supplierStr)) {
						supplierStr += '、'
					}
					supplierStr += item.chineseName
					let data = {
						companyId: item.companyId,
						scacCode: item.scacCode,
						shortname: item.shortname,
						chineseName: item.chineseName,
						englishName: item.englishName,
						transportModeCodeList: item.transportModeCodeList
					}
					row.supplierJson.push(data)
				})
			}
			row.productStr = productStr
			row.supplierStr = supplierStr
			row.skuPushCodeJson = skuPushCodeJson
			row.chargeJson = chargeJson
			row.customerId = this.$route.query.id
			this.loading = true
			saveCustomerWarehouseApi(row).then(res => {
				if (res.ok) {
					this.$message.success(this.getZH('saveSuccess', 'common'))
					this.loading = false
					row.isEdit = false
					if (this.$isEmpty(row.id)) {
						row.id = res.content
					}
					this.isEdit = false
					this.tempData = {}
				} else {
					this.loading = false
				}
			}).catch(() => {
				this.loading = false
			})

		},
		/**
		 * 新增单条数据
		 */
		addItem() {
			let row = {
				warehouseId: '',
				expressFlag: null,
				supplierStr: '',
				productStr: '',
				supplierJson: [],
				supplierList: [],
				productJson: [],
				productList: [],
				chargeCodeList: this.chargeCodes,
				chargeJson: null,
				pickUp: '',
				skuPushCode: '1',
				codeType: ['1'],
				skuPushCodeJson: null,
				customerId: '',
				isEdit: true,
				warehouseName: null,
				countryCode: null,
				countryName: null,
				activeFlag: true,
				businessType: null,
				allowBatchFlag: null,
				outGoingFlag: null
			}
			this.formData.warehouseConfigList.push(row)
			this.isEdit = true
		},
		/**
		 *编辑当条数据
		 */
		editItem(row) {
			this.isEdit = true
			getWarehouseProductAndLogisticsCompanyApi(row.warehouseId).then(res => {
				if (res.ok) {
					this.$copyProps(this.warehoustInfo, res.content)
				}
			})
			this.tempData = this.$extends({}, row)
			this.$set(row, 'isEdit', true)
		},
		/**
		 * 取消当前行操作
		 */
		cancel(row, index) {
			this.isEdit = false
			if (this.$isNotEmpty(this.tempData)) {
				this.tempData.isEdit = false
				this.$copyProps(row, this.tempData)
				this.tempData = {}
			} else {
				this.formData.warehouseConfigList.splice(index, 1)
				this.tempData = {}
			}
		},
		/**
		 * 保存
		 */
		saveForm(refName) {
			this.loading = true
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.loading = false
					return false
				}
				this.loading = false
				saveCustomerWarehouseApi(this.formData).then(res => {
					if (res.ok) {
						this.$message.success(this.getZH('saveSuccess', 'common'))
					}
				})
				this.backList()
			})
		},
		/**
		* 返回列表
		*/
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.loading = false
			this.$router.push({ name: `OvlCustomerList` })
		}
	},
	created() {
		this.formData = this.$extends(true, {}, this.defaultForm)
		this.init()
	}

}
</script>

<style scoped lang="less">
.addItem {
	height: 40px;
	width: 100%;
	margin-top: 10px;
	cursor: pointer;
	border: 1px #d5d5e8 dashed;
	color: #909399;
}
</style>
