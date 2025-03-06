<template>
	<div>
		<el-dialog	:visible.sync="dialogVisible" :title="type === 1 ? $t('outInStorageManage.aduit'):$t('outInStorageManage.reject')"	width="550px"	:close-on-click-modal="false"	>
			<div>
				<el-form v-if="dialogVisible"	ref="formData"	label-width="90px" label-position="left" :model="formData">
          <div v-if="type === 1">
            <div class="info-title mb-10" v-if='detail.businessLine === "PV"'>{{ getZH("arrivalInfo") }}</div>
              <el-row class="label-box" :gutter="20"  v-if='detail.businessLine === "PV"'>
                <el-col :span="12">
                  <el-form-item :label='getZH("arrivalContact")' prop="arrival.arrivalContact" :rules="[{required:detail.type !== 22 && !detail.lastLeg.pickup, message:inputZH('arrivalContact') } ]">
                    <el-input v-model="formData.arrival.arrivalContact" size="mini" :placeholder="inputZH('arrivalContact')" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label='getZH("arrivalContactTel")' prop="arrival.arrivalContactTel" :rules="[{required:detail.type !== 22 && !detail.lastLeg.pickup, message:inputZH('arrivalContactTel') } ]">
                    <el-input v-model="formData.arrival.arrivalContactTel" size="mini" :placeholder="inputZH('arrivalContactTel')" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label='getZH("arrivalContactEmail")' prop="arrival.arrivalContactEmail" :rules="[{required:detail.type !== 22 && !detail.lastLeg.pickup, message:inputZH('arrivalContactEmail') } ]">
                    <el-input v-model="formData.arrival.arrivalContactEmail" size="mini" :placeholder="inputZH('arrivalContactEmail')" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label='getZH("arrivalCountry")' prop="arrival.arrivalCountry" :rules="[{required:!detail.lastLeg.pickup, message:selectZH('arrivalCountry') } ]">
                    <NationalGroupSelect v-model="formData.arrival.arrivalCountry" size="mini" @change="countryChange" @selected="countrySelect" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label='getZH("arrivalProvince")' prop="arrival.arrivalProvince" :rules="[{required:!detail.lastLeg.pickup, message:selectZH('arrivalProvince') } ]">
                    <el-select v-if='$isNotEmpty(provinceList)' v-model="formData.arrival.arrivalProvince" filterable :filter-method="selectFilter" size="mini" @change="arrivalProvinceChange" :placeholder="$t('outInStorageManage.pleaseEnterArrivalProvince')">
                      <el-option v-for="(item,index) in filteredOptions" :key="index" :label="item.label" :value="item.value">
                        <div class="flex-between">
                          <span >{{ item.label }}</span>
                          <span >{{ item.englishName }}</span>
                          <span style=" color: #8492a6; font-size: 13px">{{ item.value }}</span>
                        </div>
                      </el-option>
                    </el-select>
                    <el-input v-else :placeholder="$t('outInStorageManage.pleaseEnterArrivalProvince')" size="mini" v-model="formData.arrival.arrivalProvince" maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label='getZH("arrivalCity")' prop="arrival.arrivalCity" :rules="[{required:!detail.lastLeg.pickup, message:selectZH('arrivalCity') } ]">
                    <el-input v-model="formData.arrival.arrivalCity" size="mini" :placeholder="inputZH('arrivalCity')" maxlength="100" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label='getZH("arrivalAddress1")'>
                    <el-input v-model="formData.arrival.arrivalAddress1" size="mini" :placeholder="inputZH('arrivalAddress1')" maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label='getZH("arrivalAddress2")'>
                    <el-input v-model="formData.arrival.arrivalAddress2" size="mini" :placeholder="inputZH('arrivalAddress2')" maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label='getZH("arrivalZipcode")' prop="arrival.arrivalZipcode" :rules="[{ required: !detail.lastLeg.pickup, message: $t('outInStorageManage.pleaseEnterArrivalZipcode') }, { validator: validateZipCodeFn, trigger: 'blur' }]">
                    <el-input v-model="formData.arrival.arrivalZipcode" size="mini" :placeholder="inputZH('arrivalZipcode')" oninput="value=value.replace(/^\s*/,'')" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label='getZH("houseNumber")'>
                    <el-input v-model="formData.arrival.arrivalExternalInfoJsonMap.houseNumber" size="mini" :placeholder="inputZH('houseNumber')" maxlength="20" />
                  </el-form-item>
                </el-col>
              </el-row>
            <div class="mb-10">{{$t('outInStorageManage.messageTips')}}</div>
            <el-form-item :label="$t('outInStorageManage.actualPalletQuantity')" prop="actualPalletQuantity" :rules="[{ validator: $validators.pInt,message: $t('outInStorageManage.pInt')}]">
              <el-input v-model="formData.actualPalletQuantity" size="mini" :placeholder="inputZH('actualPalletQuantity')" maxlength="10" />
            </el-form-item>
            <el-form-item :label="$t('outInStorageManage.boxQuantity')" prop="boxQuantity" :rules="[{validator: $validators.pInt, message: $t('outInStorageManage.pInt') } ]">
              <el-input v-model="formData.boxQuantity" size="mini" :placeholder="inputZH('boxQuantity')" maxlength="10" />
            </el-form-item>
            <el-form-item :label="$t('outInStorageManage.operateRemark')" prop="operateRemark" >
              <el-input v-model="formData.operateRemark" type="textarea" show-word-limit maxlength="250" size="mini" :placeholder="inputZH('operateRemark')"  />
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item :label="$t('outInStorageManage.inputRejectMessage')" label-width="120px" required>
              <el-input v-model="formData.rejectMessage" type="textarea" maxlength="50" show-word-limit size="mini" />
            </el-form-item>
          </div>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
        <div class="flex-between">
          <div>
            <div class="tips fc-yellow" v-if="$isEmpty(formData.actualPalletQuantity) && $isEmpty(formData.boxQuantity) && type === 1"><i class="el-icon-warning fc-red fs-16"></i>{{getZH('emptyTips')}}</div>
          </div>
          <div>
            <el-button type="primary" size="mini" @click="saveForm('formData')" :disabled="loading || ( $isEmpty(formData.actualPalletQuantity) && $isEmpty(formData.boxQuantity) && type === 1)||(type === 0 && $isEmpty(formData.rejectMessage))" >
              {{ $t("common.confirmBtn") }}
            </el-button>
            <el-button size="mini" @click="dialogVisible = false" :disabled="loading" >
              {{ $t("common.cancelBtn") }}
            </el-button>
          </div>
        </div>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import getZHMixin from './getZHMixin'
import { auditOutboundsApi, rejectedOutboundsApi } from "@/api/OverseasWarehouse/outInStorageManage.js"
import { getReginInfoApi } from '@/api/partner/member'
import NationalGroupSelect from '../../components/NationalGroupSelect.vue'
import { validateZipCode } from '@/utils/validate'
export default {
	name: 'SupplementaryInfoDialog',
	mixins: [getZHMixin],
	components: { NationalGroupSelect },
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		type: {
			type: Number,
			default: 1
		},
		detail: Object,
		id: String
	},

	data() {
		const _this = this
		const validateZipCodeFn = (rule, value, callback) => {
			if (value && !validateZipCode(_this.formData.arrival.arrivalCountry, value)) {
				callback(new Error(_this.getZH('zipCodeError')))
			} else {
				callback()
			}
		}
		return {
			loading: false,
			dialogVisible: false,
			validateZipCodeFn,
			formData: {
				id: null,
				actualPalletQuantity: null,
				boxQuantity: null,
				rejectMessage: null,
				operateRemark: null,
				arrival: {
					arrivalExternalInfoJson: { houseNumber: null },
					arrivalExternalInfoJsonMap: { houseNumber: null },
					arrivalCountry: null,
					arrivalCountryName: null,
					arrivalCountryEnName: null,
					arrivalProvince: null,
					arrivalProvinceName: null,
					arrivalCity: null,
					arrivalDistrict: null,
					arrivalAddress1: null,
					arrivalAddress2: null,
					arrivalZipcode: null,
					arrivalContact: null,
					arrivalContactTel: null,
					arrivalContactEmail: null,
					arrivalProvinceEnName: null
				}
			},
			provinceList: [],
			filterText: null
		}
	},
	methods: {

		/**
		 * 保存数据
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					let fn = this.type === 1 ? auditOutboundsApi : rejectedOutboundsApi
					let data = {}
					if (this.type === 1) {
						if (this.detail.businessLine !== "PV") {
							data = {
								id: this.id,
								actualPalletQuantity: this.formData.actualPalletQuantity,
								boxQuantity: this.formData.boxQuantity,
								operateRemark: this.formData.operateRemark
							}
						} else {
							data = this.$extends({}, this.formData)
							data.id = this.id
							data.arrival.arrivalExternalInfoJson = JSON.stringify(data.arrival.arrivalExternalInfoJsonMap)
						}
					} else {
						data = {
							id: this.id,
							rejectMessage: this.formData.rejectMessage
						}
					}
					this.loading = true
					fn(data).then(res => {
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
		// 前端过滤
		selectFilter(filterText) {
			this.filterText = filterText

		},
		arrivalProvinceChange(val) {
			let selectItem = this.provinceList.find(item => item.value === val)
			if (this.$isNotEmpty(selectItem)) {
				this.formData.arrival.arrivalProvinceName = selectItem.label
				this.formData.arrival.arrivalProvinceEnName = selectItem.englishName
			}
		},
		// 国家变更
		countryChange(val, isInit) {
			// 当国家改变的时候 清空省
			if (!isInit) {
				this.formData.arrival.arrivalProvince = ''
				this.formData.arrival.arrivalProvinceName = ''
			}
			getReginInfoApi({ areaLevel: 1, countryCode: val }).then(res => {
				this.provinceList = []
				res.content.list.forEach(v => {
					this.provinceList.push({
						label: v.chineseName,
						value: v.code,
						englishName: v.englishName
					})
				})
			})
		},
		//
		countrySelect(data) {
			this.formData.arrival.arrivalCountryName = data.label
			this.formData.arrival.arrivalCountryEnName = data.englishName
		}
	},
	computed: {
		filteredOptions() {
			let arr = this.provinceList || []
			let filterText = this.filterText
			if (this.$isEmpty(filterText)) {
				return arr
			}

			filterText = filterText.toLowerCase()
			arr = arr.filter(item => {
				let label = item.label.toLowerCase()
				let value = item.value.toLowerCase()
				let englishName = item.englishName.toLowerCase()
				return label.indexOf(filterText) > -1 || value.indexOf(filterText) > -1 || englishName.indexOf(filterText) > -1
			})
			return arr
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
			if (!val) {
				this.formData.actualPalletQuantity = null
				this.formData.boxQuantity = null
			}
		},
		visible(val) {
			if (val) {
				if (this.$isNotEmpty(this.detail)) {
					this.formData.actualPalletQuantity = this.detail.actualPalletQuantity
					this.formData.boxQuantity = this.detail.boxQuantity
					let arrivalExternalInfoJson = JSON.parse(this.detail.arrival.arrivalExternalInfoJson)
					if (this.$isEmpty(arrivalExternalInfoJson)) {
						arrivalExternalInfoJson.houseNumber = ''
					}
					this.formData.arrival.arrivalExternalInfoJsonMap = arrivalExternalInfoJson
					this.countryChange(this.detail.arrival.arrivalCountry, true)
					this.$copyProps(this.formData.arrival, this.detail.arrival)
				}
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
.tips {
	font-size: 12px;
	// margin-bottom: 10px;
}
</style>
