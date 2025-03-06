<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="getZH('creatingMatchingRelationship')" width="800px" :close-on-click-modal="false">
      <el-form v-if="dialogVisible" ref="formData" v-loading="loading" label-width="80px" label-position="left" :model="formData">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="getZH('priceCardName')" prop="priceCardId" label-width="90px">
            <el-select size="mini" v-model="formData.priceCardId" @change="priceCardChange" filterable class="w-full">

               <el-option  v-for="item in priceCardList" :key="item.priceCardId" :value="item.priceCardId" :label="item.priceCardName">
                  <div class="flex-between">
                    <span >{{ item.priceCardName }}</span>
                    <span >{{'V'+item.version}}</span>
                  </div>
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="Number(type) === 10">
          <el-form-item  :label="getZH('warehouse_name')"  prop="businessObjectId" label-width="90px" >
            <el-select size="mini" v-model="formData.businessObjectId" @change="businessChange" filterable >
              <el-option v-for="item in businessList" :key="item.businessObjectId" :value="item.businessObjectId" :label="item.businessObjectName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="Number(type) === 11">
          <el-form-item :label="getZH('channel_name')" prop="businessObjectId" label-width="90px">
            <el-select size="mini" v-model="formData.businessObjectId" @change="businessChange" filterable >
              <el-option v-for="item in businessList" :key="item.businessObjectId" :value="item.businessObjectId" :label="item.businessObjectName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="Number(type) === 11">
          <el-form-item	:label="getZH('channel_code')" prop="businessObjectId" label-width="90px">
            <span>{{formData.businessObjectCode || '-'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" :loading="loading" @click="saveForm('formData')">
          {{getZH('confirm','common')}}
          </el-button>
        <el-button size="mini" :loading="loading" @click="dialogVisible = false">
           {{getZH('cancel','common')}}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getPriceCardBusinessSelectionsApi, getChannelRelevancePriceCardsApi, getWarehousRelevancePriceCardsApi, savePriceCardBusinessTempApi, checkBusinessTemplatekApi } from '@/api/OverseasWarehouse/overseasManage.js'
export default {
	name: 'PriceCardTemplateAdd',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String,
		status: Number,
		type: {
			type: String,
			default: '10'
		}
	},
	data() {
		return {
			loading: false,
			dialogVisible: false,
			priceCardList: [],
			businessList: [],
			formData: {
				priceCardSceneType: null,
				businessObjectName: null,
				businessObjectCode: null,
				businessObjectId: null,
				priceCardId: null,
				priceCardName: null
			}
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData.priceCardId = null
				this.formData.priceCardSceneType = null
				this.formData.businessObjectName = null
				this.formData.businessObjectId = null
				this.formData.businessObjectCode = null
				this.priceCardTypeChange()
			}
			this.dialogVisible = val
		}
	},
	methods: {
		/**
		 * 价卡大类变更
		 */
		priceCardTypeChange() {
			// 价卡模板-根据价卡场景查询模板下拉数据
			getPriceCardBusinessSelectionsApi(this.type).then(res => {
				if (res.ok) {
					this.priceCardList = res.content || []
					this.formData.priceCardId = null
					this.formData.businessObjectName = null
					this.formData.businessObjectId = null
					this.formData.businessObjectCode = null
				}
			})
			// 查询未关联价卡模板的数据
			let fn = String(this.type) === '10' ? getWarehousRelevancePriceCardsApi : getChannelRelevancePriceCardsApi
			fn().then(rs => {
				if (rs.ok) {
					this.businessList = rs.content || []
				}
			})
		},
		/**
		 * 保存接口
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				this.formData.priceCardSceneType = this.type
				checkBusinessTemplatekApi(this.formData.businessObjectId).then(rs => {
					if (this.$isEmpty(rs.content)) {
						this.submit()
					} else {
						let msg = `检测到该${String(this.type) === '10' ? '仓库' : '渠道'}已配置V${rs.content.version}版本，名称为${rs.content.priceCardName}的价卡。此操作将会删除该匹配关系，建立新的匹配关系。是否继续？`
						this.$confirm(msg, this.$t("common.tips"), {
							confirmButtonText: this.$t("common.confirm"),
							cancelButtonText: this.$t("common.cancel"),
							type: "warning"
						}).then(() => {
							this.submit()
						}).catch(() => { });
					}

				})
			})
		},

		submit() {
			this.loading = true
			savePriceCardBusinessTempApi(this.formData).then(res => {
				if (res.ok) {
					this.loading = false
					this.$emit('saved')
					this.dialogVisible = false
				} else {
					this.loading = false
				}
			}).catch(() => {
				this.loading = false
			})
		},
		/**
		 * 业务数据变更
		 */
		businessChange(val) {
			let selectItem = this.businessList.find(item => item.businessObjectId === val)
			this.formData.businessObjectName = selectItem.businessObjectName
			this.formData.businessObjectCode = selectItem.businessObjectCode
		},
		/**
		 * 价卡变更
		 */
		priceCardChange(val) {
			let selectItem = this.priceCardList.find(item => item.priceCardId === val)
			this.formData.priceCardName = selectItem.priceCardName
		},
		/**
	* 下拉框
	*/
		selectZH(key, obj) {
			return this.getZH("selectPlaceholder", "common") + this.getZH(key, obj);
		},
		/**
		 * 输入框
		 */
		inputZH(key, obj) {
			return this.getZH("placeholder", "common") + this.getZH(key, obj);
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || "overseasManage";
			let str = obj + "." + key;
			return this.$t(str);
		}
	}

}
</script>

<style>
</style>
