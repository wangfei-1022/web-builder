<template>
	<div v-loading="loading" class="page-edit-container bg-white">
    <div class="page-edit-content">
      <el-form
			ref="formData"
			:model="formData"
			label-width="110px"
			:rules="rules"
		>
      <div class="pd-16 content-title">{{getZH('baseInfo')}}</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="getZH('goodsCnName')" prop="goodsCnName" >
            <el-input v-model="formData.goodsCnName" disabled size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('goodsEnName')" prop="goodsEnName" >
            <el-input v-model="formData.goodsEnName" disabled size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="flex">
            <el-form-item :label="getZH('goodsSize')" prop="length">
            <el-input v-model="formData.length" disabled size="mini" :placeholder="getZH('length')" >
              <template slot="append">cm</template>
            </el-input>
          </el-form-item>
            <el-form-item :label="''" prop="width" label-width="0px">
              <el-input disabled v-model="formData.width" size="mini" :placeholder="`${$t('goodsManagement.width')}`">
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
            <el-form-item :label="''" label-width="0px" prop="height" >
              <el-input disabled v-model="formData.height" size="mini" :placeholder="`${$t('goodsManagement.height')}`">
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
         <el-form-item class="inputWidth" :label="getZH('weight')" prop="weight">
            <el-input v-model="formData.weight" disabled size="mini">
              <template slot="append">kg</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('sizePhotos')" class="upload-form-item">
            <div class="flex">
              <div
                v-for="item in formData.sizePhotos"
                :key="item.url"
                class="fl"
              >
                <el-image
                  class="img-box"
                  :src="item.url"
                  :preview-src-list="[item.url]"
                />
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('weightPhotos')" class="upload-form-item">
            <div class="flex">
              <div
                v-for="item in formData.weightPhotos"
                :key="item.url"
                class="fl"
              >
                <el-image
                  class="img-box"
                  :src="item.url"
                  :preview-src-list="[item.url]"
                />
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('goodsType')" prop="goodsTypeId" >
            <el-input v-model="formData.goodsTypeName" placeholder="" disabled size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('shipper')" prop="shipperId">
            <el-input v-model="formData.shipperCnName" placeholder="" disabled size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="pd-16 content-title">{{getZH('goodsSaleCountryList')}}</div>
      <saleCountryInfo :dataList="formData.goodsSaleCountryList || []" :isDetail="!isEdit" />
      <div class="pd-16 content-title">{{getZH('encodingInfo')}}</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="getZH('sysCode')">
            <span>{{ formData.sysCode || "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="getZH('elecSkuCode')" prop="elecSkuCode" >
            <!-- <el-input v-model="formData.elecSkuCode" :disabled="true" size="mini" /> -->
            <span>{{ formData.elecSkuCode || "-" }}</span>
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
            <div v-if="isEdit">
              <div
                v-for="(item, index) in formData.customCodeList"
                :key="index"
                class="flex-box"
              >
                <div class="pointer">
                  <i class="el-icon-remove-outline" v-if="$isEmpty(item.id)" @click="delItem(index)" />
                </div>
                <el-form-item
                  :class="{ 'warning-border': item.status === 2 }"
                  :label="''"
                  label-width="0px"
                  class="w-150 ml-10"
                >
                  <el-cascader
                    :disabled="$isNotEmpty(item.id)"
                    v-model="item.codeType"
                    size="mini"
                    :options="customCodesOptions"
                    :props="{ label: 'chineseName', value: 'id' }"
                    :placeholder="$t('common.selectPlaceholder')"
                    :show-all-levels="false"
                  />
                </el-form-item>
                <el-form-item
                  :class="{ 'warning-border': item.status === 2 }"
                  :label="''"
                  label-width="0px"
                  class="flex-grow ml-10"
                >
                  <el-input
                    :disabled="$isNotEmpty(item.id)"
                    v-model="item.code"
                    size="mini"
                    :placeholder="getZH('placeholderCode')"
                  />
                </el-form-item>
              </div>
              <div class="flex-box pointer addIcon">
                <i class="el-icon-circle-plus-outline" @click="addItem" />
                <span class="ml-10">{{getZH('addCustomCode')}}</span>
              </div>
            </div>
            <div v-else>
              <div
                v-for="(item, index) in formData.customCodeList"
                :key="index"
                class="flex-box"
              >
                <el-form-item :label="''" label-width="0px" class="ml-10">
                  <span
                    :class="{
                      'warning-text':
                        item.status === 2 && formData.goodsStatus === 4,
                    }"
                  >
                  <span v-if="item.codeTypeName" class="mr-10">	{{ item.codeTypeName }}</span>{{ item.subCodeTypeName }}
                  </span>
                </el-form-item>
                <el-form-item
                  :label="''"
                  label-width="0px"
                  class="flex-grow ml-10"
                >
                  <span
                    :class="{
                      'warning-text':
                        item.status === 2 && formData.goodsStatus === 4,
                    }"
                  >
                    {{ item.code }}
                  </span>
                </el-form-item>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
      <RefusedDioalog
        :id="formData.id"
        :visible="refusedVisible"
        :status="formData.goodsStatus"
        @saved="backList"
      />
    </div>
		<div class="page-edit-footer">
      <el-button size="mini" @click="saveForm('formData')" type="primary" v-if="isEdit" :loading="loading" >{{getZH('saveBtn','common')}}</el-button>
      <el-button size="mini" @click="backList" :loading="loading">{{getZH('backList','common')}}</el-button>
       <el-button type="primary" size="mini" class="ml-20" @click="audit()" :loading="loading" v-if="isAudit" >
          {{getZH('refuse','common')}}
        </el-button>
        <el-button type="danger" size="mini" class="ml-20"	@click="refused('formData')" :loading="loading" v-if="isAudit">{{getZH('reject','common')}}</el-button>
		</div>
	</div>
</template>
<script>
import saleCountryInfo from './components/saleCountryInfo'
import RefusedDioalog from './components/refusedDioalog'
import { getDropdownlistApi, getGoodsDetailApi, auditGoodsApi, getCountryListApi, getGoodsOwnerApi, updateGoodsInfoApi, getGoodsTypeIdListApi, getTermAndItemApi } from '@/api/OverseasWarehouse/goodsManager'
export default {
	name: 'GoodsDetial',
	components: { RefusedDioalog, saleCountryInfo },
	data() {
		return {
			loading: true,
			formData: {
				id: null,
				goodsCnName: '',
				goodsEnName: '',
				goodsStatus: null,
				memberId: null,
				length: '',
				height: '',
				width: '',
				weight: '',
				sizePhotos: [],
				weightPhotos: [],
				goodsTypeId: '',
				goodsTypeName: '',
				goodsSaleCountryList: [],
				shipperId: '',
				shipperCnName: '',
				sysCode: '',
				elecSkuCode: '',
				sysBarCode: '',
				customCodeList: [],
				fileEditRequestList: []
			},
			refusedVisible: false,
			customCodesOptions: [],
			rules: {
				goodsCnName: [{ required: true, message: this.inputZH('goodsCnName') }],
				goodsEnName: [{ required: true, message: this.inputZH('goodsEnName') }],
				length: [{ required: true, message: this.inputZH('length') }, { validator: this.$validators.checkDecima2, trigger: 'blur' }],
				width: [{ required: true, message: this.inputZH('width') }, { validator: this.$validators.checkDecima2, trigger: 'blur' }],
				height: [{ required: true, message: this.inputZH('height') }, { validator: this.$validators.checkDecima2, trigger: 'blur' }],
				weight: [{ required: true, message: this.inputZH('weight') }, { validator: this.$validators.checkDecima4, trigger: 'blur' }],
				sizePhotos: [{ required: false, message: this.getZH('uploadSizePhotos') }],
				weightPhotos: [{ required: false, message: this.getZH('uploadWeightPhotos') }],
				goodsTypeId: [{ required: true, message: this.selectZH('goodsType') }],
				shipperId: [{ required: true, message: this.selectZH('shipper') }],
				goodsSaleCountryList: [{ required: true, message: this.selectZH('goodsSaleCountryList') }],
				elecSkuCode: [{ required: true, message: this.selectZH('elecSkuCode') }]
			}
		}
	},
	computed: {
		// 是否为审核页面
		isAudit() {
			return [2, 4].includes(this.formData.goodsStatus)
		},
		isEdit() {
			return Number(this.$route.query.type) === 2
		}
	},
	async created() {
		await this.init()
		await this.$nextTick()
		this.getDetail()
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
		},
		/**
		 * 获取详情
		 */
		async getDetail() {
			this.loading = true
			const res = await getGoodsDetailApi(this.$route.query.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				// 处理尺寸图片和重量图片
				if (this.$isNotEmpty(res.content.fileEditRequestList)) {
					res.content.sizePhotos = res.content.fileEditRequestList.filter(item => item.fieldCode === 'size')
					res.content.weightPhotos = res.content.fileEditRequestList.filter(item => item.fieldCode === 'weight')
				}
				// 处理自定义规则
				if (this.$isNotEmpty(res.content.customCodeList)) {
					res.content.customCodeList.forEach(item => {
						item.codeType = [item.codeTypeId, item.subCodeTypeId]
					})
				}
				// 如果是可用列表 只展示可用的自定义编码
				// if (this.$route.meta.status.includes(6)) {
				//   res.content.customCodeList = res.content.customCodeList.filter(item => item.status === 1)
				// }
				res.content.goodsSaleCountryList.forEach(item => {
					item.disable = true
				})
				this.$copyProps(this.formData, res.content)
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
		 * 保存信息
		 */
		/**
		 * 保存数据
		 */
		saveForm() {
			let saveForm = {}
			// 二次提交审核只提交修改数据
			saveForm = {
				id: this.formData.id,
				memberId: this.formData.memberId,
				customCodeList: this.formData.customCodeList.filter(item => this.$isEmpty(item.id)),
				goodsSaleCountryList: this.formData.goodsSaleCountryList.filter(item => !item.id && !item.disable)
			}
			if (this.$isEmpty(saveForm.goodsSaleCountryList) && this.$isEmpty(saveForm.customCodeList)) {
				this.$alert(this.getZH('noUpdate'), {
					confirmButtonText: this.getZH('confirm', 'common'),
					callback: () => { }
				})
				return
			}
			this.loading = true
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
			updateGoodsInfoApi(saveForm).then(res => {
				if (res && res.ok) {
					this.$message.success(this.getZH('saveSuccess', 'common'))
					this.backList()
				}
				this.loading = false
			}).catch(() => { })
		},
		/**
		 * 审核通过
		 */
		async audit() {
			this.loading = true
			const saveData = {
				id: this.formData.id,
				goodsStatus: 6
			}
			const res = await auditGoodsApi(saveData).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				this.$message.success(this.getZH('auditSuccess', 'common'))
				this.$store.dispatch('tagsView/delView', this.$route)
				this.$router.push({ name: `GoodsToAudit`, query: { time: new Date().getTime() } })
				this.loading = false
			}

			// auditGoodsApi()D
		},
		/**
		 * 审核拒绝
		 */
		refused() {
			this.refusedVisible = true
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
			if (this.isAudit) {
				this.$router.push({ name: `GoodsToAudit` })
			} else {
				this.$router.push({ name: `GoodsList` })
			}

		}
	}
}
</script>

<style scoped lang="scss">
.el-form-item__content .el-input-group {
	vertical-align: inherit !important;
}
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
.inputWidth {
	width: calc(100% - 30px);
}
.tagBox {
	min-height: 36px;
	flex-wrap: wrap;
	width: 100%;
	margin-bottom: 4px;
}
.warning-text {
	color: #ffba00;
}
</style>
