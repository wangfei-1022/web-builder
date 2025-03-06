<template>
	<div v-loading="loading" class="page-edit-container full-page bg-white">
    <div class="page-edit-content">
      <el-form ref="formData"	:model="formData" label-width="110px" :rules="rules">
      <div class="pd-16 content-title">{{getZH('baseInfo')}}</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="getZH('ownerName')" prop="ownerId" >
            <TypeSelect v-model="formData.ownerId" :defaultDisplay="formData.ownerName" type="customer" @selected="customerSelected" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('goodsCnName')" prop="goodsCnName" >
           <el-input v-model="formData.goodsCnName" :placeholder="inputZH('goodsCnName')" :disabled="isDisabled" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('goodsEnName')" prop="goodsEnName">
            <el-input  v-model="formData.goodsEnName" :placeholder="inputZH('goodsEnName')" :disabled="isDisabled" size="mini"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="flex-box ">
            <el-form-item class="inline-item" :label="getZH('goodsSize')" prop="length">
              <el-input v-model="formData.length" :disabled="isDisabled" size="mini" :placeholder="getZH('length')">
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
            <el-form-item  class="inline-item" :label="''" prop="width" label-width="0px" >
              <el-input v-model="formData.width" :disabled="isDisabled" size="mini" :placeholder="getZH('width')">
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
            <el-form-item class="inline-item" :label="''" label-width="0px" prop="height" >
              <el-input v-model="formData.height" :disabled="isDisabled" size="mini" :placeholder="getZH('height')" >
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
         <el-col :span="12">
          <el-form-item  :label="getZH('weight')" prop="weight">
            <el-input v-model="formData.weight" :disabled="isDisabled" size="mini" :placeholder="inputZH('weight')">
              <template slot="append">kg</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="getZH('sizePhotos')" class="upload-form-item">
            <div class="flex">
              <div  v-for="item in formData.sizePhotos" :key="item.url" class="relative" >
                <el-image  class="img-box" :src="item.url" :preview-src-list="[item.url]" />
                <i class="el-icon-circle-close delete" @click="deleteItem(index, 'sizePhotos')" ></i>
              </div>
              <UploadFile  :accept="'.png,.jpeg,.jpg'" :showFileList="false" v-if='formData.sizePhotos.length<3 && !isDisabled'  @success="successUpload($event,'sizePhotos','size')" :on-progress="()=>{loading=true}">
                <div slot="upload" class="upload-box">
                  <i class="el-icon-upload"></i>
                </div>
              </UploadFile>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('weightPhotos')" class="upload-form-item" >
            <div class="flex">
              <div v-for="item in formData.weightPhotos" :key="item.url" class="relative" >
                <el-image class="img-box" :src="item.url" :preview-src-list="[item.url]" />
                <i class="el-icon-circle-close delete" @click="deleteItem(index, 'weightPhotos')" ></i>
              </div>
            </div>
            <UploadFile  :accept="'.png,.jpeg,.jpg'" :showFileList="false" v-if='formData.weightPhotos.length<1 && !isDisabled'  @success="successUpload($event,'weightPhotos','weight')" :on-progress="()=>{loading=true}">
              <div slot="upload" class="upload-box">
                <i class="el-icon-upload"></i>
              </div>
            </UploadFile>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="getZH('goodsType')"  prop="type" >
            <el-select v-model="formData.type" :disabled="isDisabled" size="mini" class="w-full" >
              <el-option v-for="item in goodsTypes" :key="item.id" :value="item.id" :label="item.chineseName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('skuName')"  prop="skuName" >
            <el-input size="mini" v-model="formData.skuName" :placeholder="inputZH('skuName')" :disabled="isDisabled" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('power')" :prop="`extendedAttributeData.watt`" >
            <el-input size="mini" v-model="formData.extendedAttributeData.watt" :placeholder="inputZH('power')" :disabled="isDisabled" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="pd-16 content-title">{{getZH('goodsSaleCountryList')}}</div>
        <saleCountryInfo :dataList="formData.goodsSaleCountryList || []" :isDetail="isDisabled" />
      <div class="pd-16 content-title">{{getZH('encodingInfo')}}</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="getZH('sysCode')">
            <span>{{ formData.sysCode || "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('elecSkuCode')" prop="skuCode" >
            <el-input v-model="formData.skuCode " :disabled="isDisabled" size="mini" :placeholder="inputZH('elecSkuCode')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('sysBarCode')">
            <span>{{ formData.sysBarCode || "-" }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item :label="getZH('customCode')">
            <div v-if="!isDisabled">
              <div v-for="(item, index) in formData.customCodeList" :key="index" class="flex-box">
                <div class="pointer">
                  <i class="el-icon-remove-outline" @click="delItem" />
                </div>
                <el-form-item :label="''" label-width="0px" class="w-150 ml-10">
                  <el-cascader v-model="item.codeType"  size="mini" :options="customCodesOptions" :props="{ label: 'chineseName', value: 'id' }" :placeholder="$t('common.selectPlaceholder')" :show-all-levels="false"/>
                </el-form-item>
                <el-form-item  :label="''" label-width="0px" class="flex-grow ml-10" >
                  <el-input  v-model="item.code" size="mini" :placeholder="getZH('placeholderCode')" />
                </el-form-item>
              </div>
              <div class="flex-box pointer addIcon">
                <i class="el-icon-circle-plus-outline" @click="addItem" />
                <span class="ml-10">{{getZH('addCustomCode')}}</span>
              </div>
            </div>
            <div v-else>
              <div v-for="(item, index) in formData.customCodeList" :key="index" class="flex-box" >
                <el-form-item :label="''" label-width="0px" class="ml-10">
                  <span>
                    <span v-if="item.codeTypeName" class="mr-10">	{{ item.codeTypeName }}</span>{{ item.subCodeTypeName }}
                  </span>
                </el-form-item>
                <el-form-item :label="''" label-width="0px" class="flex-grow ml-10">
                  <span>{{ item.code }}</span>
                </el-form-item>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    </div>
		<div class="page-edit-footer">
      <el-button type="primary" size="mini" class="ml-10" :loading="loading" v-if='!isDisabled' @click="saveForm('formData')"> {{getZH('saveBtn','common')}} </el-button>
      <el-button size="mini" @click="backList" :loading="loading">{{getZH('backList','common')}}</el-button>
		</div>
	</div>
</template>

<script>
import saleCountryInfo from '../../OverseasWarehouse/GoodsManagement/components/saleCountryInfo'
import { saveSeaGoodsApi, detailSeaGoodsApi } from '@/api/OvlSeaSitManage/seaGoodsManage'
import { getDropdownlistApi, getCountryListApi, getGoodsTypeIdListApi, getTermAndItemApi } from '@/api/OverseasWarehouse/goodsManager'
export default {
	name: 'SeaGoodsDetail',
	components: { saleCountryInfo },
	data() {
		return {
			loading: false,
			operate: null,
			formData: {
				id: null,
				goodsCnName: '',
				goodsEnName: '',
				ownerName: '',
				ownerId: '',
				goodsStatus: null,
				length: '',
				height: '',
				width: '',
				weight: '',
				sizePhotos: [],
				weightPhotos: [],
				type: '',
				typeName: '',
				goodsSaleCountryList: [],
				sysCode: '',
				skuName: '',
				skuCode: '',
				sysBarCode: '',
				customCodeList: [],
				fileEditRequestList: [],
				goodsSaleCountryNameList: [],
				disabledGoodsSaleCountryNameList: [],
				extendedAttribute: null,
				extendedAttributeData: {
					watt: null
				}
			},
			id: null,
			goodsTypes: [],
			skuCodeTemp: '',
			typeMap: {},
			shipperList: [],
			countryOptions: [],
			customCodesOptions: [],
			rules: {
				goodsCnName: [{ required: true, message: this.inputZH('goodsCnName') }],
				ownerId: [{ required: true, message: this.inputZH('ownerName') }],
				goodsEnName: [{ required: true, message: this.inputZH('goodsEnName') }],
				length: [{ required: true, message: this.inputZH('length') }, { validator: this.$validators.checkDecima2, trigger: 'blur' }],
				width: [{ required: true, message: this.inputZH('width') }, { validator: this.$validators.checkDecima2, trigger: 'blur' }],
				height: [{ required: true, message: this.inputZH('height') }, { validator: this.$validators.checkDecima2, trigger: 'blur' }],
				weight: [{ required: true, message: this.inputZH('weight') }, { validator: this.$validators.checkDecima4, trigger: 'blur' }],
				sizePhotos: [{ required: false, message: this.getZH('uploadSizePhotos') }],
				weightPhotos: [{ required: false, message: this.getZH('uploadWeightPhotos') }],
				type: [{ required: true, message: this.selectZH('goodsType') }],
				ownerName: [{ required: true, message: this.selectZH('ownerName') }],
				skuCode: [{ required: true, message: this.selectZH('elecSkuCode') }]
			}
		}
	},
	computed: {
		isDisabled() {
			return this.operate === 'view'
		},
		/**
		 * 过滤国家数据
		 */
		filterData() {
			let arr = this.countryOptions
			arr = arr.filter(item => this.formData.goodsSaleCountryList.indexOf(item.id) === -1)
			return arr
		}
	},
	async created() {
		this.operate = this.$route.params.operate
		this.id = this.$route.params.id
		await this.init()
		await this.$nextTick()
		if (this.operate !== 'add') {
			this.getDetail()
		}
	},
	mounted() {

	},
	methods: {
		/**
		 * 获取基础下拉数据
		 */
		async init() {
			let result = await getGoodsTypeIdListApi()
			if (result.ok) {
				let codeList = []
				let arr = result.content || []
				arr.forEach(item => {
					codeList.push(item.termCode)
				})
				let res = await getTermAndItemApi(codeList)
				if (res && res.ok) {
					this.customCodesOptions = res.content || []
				}
			}
			const res1 = await getDropdownlistApi({ termCode: 'GOODSKINDS' })
			if (res1 && res1.ok) {
				this.goodsTypes = res1.content || []
				let typeMap = {}
				this.goodsTypes.forEach(item => {
					typeMap[item.id] = item.chineseName
				})
				this.typeMap = typeMap
			}
			// 获取国家基础数据
			const res3 = await getCountryListApi()
			if (res3 && res3.ok) {
				this.countryOptions = res3.content
			}
		},
		/**
		 * 客户选择
		 */
		customerSelected(data) {
			this.formData.ownerName = data.chineseName
		},
		/**
		 * 获取详情
		 */
		async getDetail() {
			this.loading = true
			const res = await detailSeaGoodsApi(this.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				// 处理尺寸图片和重量图片
				if (this.$isNotEmpty(res.content.fileEditRequestList)) {
					res.content.sizePhotos = res.content.fileEditRequestList.filter(item => item.fieldCode === 'size')
					res.content.weightPhotos = res.content.fileEditRequestList.filter(item => item.fieldCode === 'weight')
				}
				res.content.goodsSaleCountryNameList = this.$isNotEmpty(res.content.goodsSaleCountryNames) ? res.content.goodsSaleCountryNames.split(',') : []
				res.content.disabledGoodsSaleCountryNameList = this.$isNotEmpty(res.content.disabledGoodsSaleCountryNames) ? res.content.disabledGoodsSaleCountryNames.split(',') : []
				// 处理JSON数据
				let extendedAttribute = this.$isNotEmpty(res.content.extendedAttribute) ? JSON.parse(res.content.extendedAttribute) : {}
				// 处理自定义规则
				if (this.$isNotEmpty(extendedAttribute.customCodeList)) {
					extendedAttribute.customCodeList.forEach(item => {
						item.codeType = [item.codeTypeId, item.subCodeTypeId]
					})
					res.content.customCodeList = extendedAttribute.customCodeList
				} else {
					res.content.customCodeList = []
				}
				// 处理额外属性
				this.$copyProps(this.formData, res.content)
				this.$copyProps(this.formData.extendedAttributeData, extendedAttribute)
				this.skuCodeTemp = this.formData.skuCode
				this.loading = false
			} else {
				this.loading = false
			}
		},
		/**
		 * 文件上传成功
		 */
		successUpload(res, key, type) {
			res.fieldCode = type
			this.formData[key].push(res)
			this.loading = false
		},
		/**
		 * 处理静态文件数据
		 */
		handlerOptions(data) {
			data.forEach(item => {
				if (item.name) {
					this.$set(item, 'label', this.item.label)
				}
				if (item.children && item.children.length > 0) {
					this.handlerOptions(item.children)
				}
			})
		},
		/**
		 * 增加自定义规则
		 */
		addItem() {
			const data = {
				codeType: '',
				codeTypeId: null,
				subCodeTypeId: null,
				code: '',
				status: 2
			}
			this.formData.customCodeList.push(data)
		},
		/**
		 * 删除自定义规则
		 */
		delItem(index) {
			this.formData.customCodeList.splice(index, 1)
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
				const saveForm = this.$extends(true, {}, this.formData)
				saveForm.fileEditRequestList = saveForm.sizePhotos.concat(saveForm.weightPhotos)

				if (this.$isNotEmpty(saveForm.customCodeList)) {
					saveForm.customCodeList.forEach(item => {
						item.codeTypeId = item.codeType[0]
						item.subCodeTypeId = item.codeType[1]
						let pItem = this.customCodesOptions.find(data => data.id === item.codeTypeId)
						let cItem = pItem.children.find(data => data.id === item.subCodeTypeId)
						item.codeTypeName = pItem.chineseName
						item.subCodeTypeName = cItem.chineseName
						delete item.codeType
					})
				}
				saveForm.extendedAttributeData.customCodeList = saveForm.customCodeList
				saveForm.extendedAttribute = JSON.stringify(saveForm.extendedAttributeData)
				delete saveForm.extendedAttributeData
				delete saveForm.customCodeList
				// 判断是否已经有维护的国家却没保存
				let noSaveData = saveForm.goodsSaleCountryList.filter(item => item.isEdit)
				if (this.$isNotEmpty(noSaveData)) {
					this.$message.warning(this.getZH('please_save_goodsSaleCountryList'))
					return
				}
				saveForm.typeName = this.typeMap[this.formData.type]
				// 编辑时
				if (this.$isNotEmpty(saveForm.id) && this.$isNotEmpty(this.skuCodeTemp) && this.skuCodeTemp !== saveForm.skuCode) {
					this.confirmTips(this.getZH('tips2')).then(() => {
						this.submit(saveForm)
					}).catch(() => { })
				} else {
					this.submit(saveForm)
				}
			})
		},
		submit(saveForm) {
			this.loading = true
			saveSeaGoodsApi(saveForm).then(res => {
				if (res && res.ok) {
					this.$message.success(this.getZH('saveSuccess', 'common'))
					this.backList()
					this.loading = false
				} else {
					this.loading = false
				}
			}).catch(() => {
				this.loading = false
			})
		},
		/**
		 * 删除照片
		 */
		deleteItem(index, key) {
			this.formData[key].splice(index, 1)
		},
		/**
	 * 下拉框
	 */
		selectZH(key) {
			return this.getZH('selectPlaceholder', 'common') + this.getZH(key)
		},
		/**
		 * 输入框
		 */
		inputZH(key) {
			return this.getZH('placeholder', 'common') + this.getZH(key)
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || 'goodsManagement'
			let str = obj + '.' + key
			return this.$t(str)
		},
		/**
		 * 返回列表
		 */
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `SeaGoodsList` })
		}
	}
}
</script>

<style scoped lang="scss">
.uploadFile-box {
	width: 80px;
	height: 80px;
	border: 1px dashed #d9d9d9;
}
.upload-box {
	width: 80px;
	height: 80px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px dashed #d9d9d9;
	font-size: 24px;
	color: #c0c4cc;
	margin-right: 10px;
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
.img-tips {
	width: 148px;
	height: 80px;
	margin-left: 10px;
	line-height: 22px;
	background-color: #fcf5ec;
	color: #edbc84;
	padding: 10px;
	font-size: 12px;
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

.warning-text {
	color: #ffba00;
}
.relative {
	position: relative;
	&:hover .delete {
		display: block;
	}
}
.delete {
	position: absolute;
	right: 12px;
	top: 4px;
	color: #bf1111;
	display: none;
}
</style>
