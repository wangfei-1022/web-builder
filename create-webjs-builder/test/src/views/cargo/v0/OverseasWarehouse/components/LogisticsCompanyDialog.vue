<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="title"
			width="550px"
			:close-on-click-modal="false"
		>
			<el-form
				v-if="dialogVisible"
				ref="formData"
				v-loading="loading"
				label-width="110px"
				label-position="left"
				:rules="rules"
				:model="formData"
			>
				<el-form-item :label="$t('logisticsCompany.company_code')" prop="scacCode">
					<el-input
						v-model="formData.scacCode"
						maxlength="50"
						:placeholder="$t('logisticsCompany.company_desc')"
						size="mini"
						:disabled="$isNotEmpty(id) || isDetail"
					/>
				</el-form-item>
				<el-form-item :label="$t('logisticsCompany.company_abbreviation')" prop="shortname">
					<el-input
						v-model="formData.shortname"
						maxlength="100"
						size="mini"
						:placeholder="$t('logisticsCompany.please_enter_company_abbreviation')"
						:disabled="$isNotEmpty(id) || isDetail"
					/>
				</el-form-item>
				<el-form-item :label="$t('logisticsCompany.cn_name')" prop="chineseName">
					<el-input
						v-model="formData.chineseName"
						maxlength="100"
						size="mini"
						:placeholder="$t('logisticsCompany.please_enter_cn_name')"
						:disabled="$isNotEmpty(id) || isDetail"
					/>
				</el-form-item>
				<el-form-item :label="$t('logisticsCompany.en_name')" prop="englishName">
					<el-input
						v-model="formData.englishName"
						maxlength="100"
						size="mini"
						:placeholder="$t('logisticsCompany.please_enter_en_name')"
						:disabled="$isNotEmpty(id) || isDetail"
					/>
				</el-form-item>
        <el-form-item :label="$t('logisticsCompany.country')" prop="countryCode">
          <NationalGroupSelect 	:disabled="$isNotEmpty(id) || isDetail"  v-model="formData.countryCode" @selected="countryChange($event)"/>
        </el-form-item>
				<el-form-item :label="$t('logisticsCompany.transport_mode')" prop="transportModeCodeList">
					<el-checkbox-group
						v-model="formData.transportModeCodeList"
						:disabled="isDetail"
					>
						<el-checkbox :label="1">{{$t('logisticsCompany.transportMode.express_elivery')}}</el-checkbox>
						<el-checkbox :label="2">{{$t('logisticsCompany.transportMode.truck')}}</el-checkbox>
						<el-checkbox :label="3">{{$t('logisticsCompany.transportMode.railway')}}</el-checkbox>
						<el-checkbox :label="4">{{$t('logisticsCompany.transportMode.trailer')}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
        <el-form-item :label="$t('logisticsCompany.track_code')" prop="trackCode">
          <div class="flex-box">
            <el-input v-model="formData.trackCode" maxlength="50" :placeholder="$t('logisticsCompany.please_input_track_code')" size="mini" :disabled="isDetail"	/>
            <el-button type="primary" class="ml-10" size="mini" @click="saechTrackCode">{{$t('logisticsCompany.ctrack_code_search')}}</el-button>
          </div>
				</el-form-item>
        <el-form-item :label="$t('logisticsCompany.track_url')" prop="trackUrl">
					<el-input v-model="formData.trackUrl" maxlength="200" :placeholder="$t('logisticsCompany.please_input_track_url')" size="mini" :disabled="isDetail"	/>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button
					v-if="!isDetail"
					type="primary"
					size="mini"
					:disabled="loading"
					@click="saveForm('formData')"
				>
					{{$t('logisticsCompany.confirm')}}
				</el-button>
				<el-button size="mini" @click="dialogVisible = false"> {{$t('logisticsCompany.cancel')}} </el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { detailCompanyApi, saveCompanyApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
import { validEnglishNumbers } from '@/utils/validate'
import NationalGroupSelect from './NationalGroupSelect.vue'
export default {
	name: 'ReportTypeDialog',
	components: { NationalGroupSelect },
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
			shortname: '',
			scacCode: '',
			chineseName: '',
			englishName: '',
			countryCode: '',
			countryName: '',
			trackCode: '',
			trackUrl: '',
			transportModeCodeList: []
		}
		return {
			tempList: [],
			dialogVisible: false,
			defaultForm: defaultForm,
			loading: false,
			title: '',
			rules: {
				scacCode: [
					{ required: true, message: this.$t('logisticsCompany.please_enter_company_code'), trigger: 'change' },
					{ validator: validEnglishNumbers }
				],
				englishName: [{ required: true, message: this.$t('logisticsCompany.please_enter_cn_name'), trigger: 'change' }],
				chineseName: [{ required: true, message: this.$t('logisticsCompany.please_enter_en_name'), trigger: 'change' }],
				transportModeCodeList: [{ required: true, message: this.$t('logisticsCompany.please_enter_transport_mode'), trigger: 'change' }],
				countryCode: [{ required: true, message: this.$t('logisticsCompany.please_enter_country_code'), trigger: 'change' }],
				shortname: [{ required: true, message: this.$t('logisticsCompany.please_enter_company_abbreviation'), trigger: 'change' }]
			},
			formData: this.$extends({}, defaultForm)
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		async visible(val) {
			if (val) {
				this.loading = true
				if (this.$isNotEmpty(this.id)) {
					this.title = this.isDetail ? this.$t('logisticsCompany.logistics_company_detail') : this.$t('logisticsCompany.edit_logistics_company')
					const res = await detailCompanyApi(this.id)
					if (res.ok) {
						this.$copyProps(this.formData, res.content)
						// 运输方式字符换转数组
						// 运输方式存临时变量
						this.tempList = res.content.transportModeCodeList
					}
				} else {
					this.tempList = []
					this.title = this.$t('logisticsCompany.add_logistics_company')
					this.formData = this.$extends({}, this.defaultForm)
				}
			}
			await this.$nextTick()
			this.loading = false
			this.dialogVisible = val
		},
		'formData.transportModeCodeList'(val, oldVal) {
			if (this.$isNotEmpty(this.id) && this.$isNotEmpty(oldVal)) {
				// 当选项减少时
				if (val.length < oldVal.length) {
					// 获取减少项
					const cancelVal = oldVal.find(item => val.indexOf(item) === -1)
					// 编辑只允许增加运输方式 不允许减少运输方式
					if (this.tempList.indexOf(cancelVal) > -1) {
						this.$message.warning(this.$t('logisticsCompany.just_add_transport_mode'))
						this.formData.transportModeCodeList.push(cancelVal)
					}
				}
			}
		}
	},
	methods: {
		/**
		 * 保存数据
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					this.loading = true
					saveCompanyApi(this.formData, this.formData.id).then(res => {
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
					this.loading = false
					this.mixinsFormScrollIntoView()
					return false
				}
			})
		},
		saechTrackCode() {
			window.open('https://res.17track.net/asset/carrier/info/apicarrier.all.json')
		},
		/**
		 *国家基础数据变更
		*/
		countryChange(data) {
			this.formData.countryName = data.chineseShortname
		}
	}

}
</script>

<style>
</style>
