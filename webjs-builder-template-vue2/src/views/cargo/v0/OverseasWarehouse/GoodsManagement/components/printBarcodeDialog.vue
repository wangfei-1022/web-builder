<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('goodsManagement.printBarcode')"
			width="550px"
			:close-on-click-modal="false"
		>
			<div>
				<el-form
					v-if="dialogVisible"
					ref="formData"
					v-loading="loading"
					:model="formData"
					label-width="130px"
					:rules="rules"
				>
					<el-form-item :label="$t('goodsManagement.codeType')" prop="codeType">
						<el-select	size="mini"	v-model="formData.codeType" @change="() => {formData.code = null}" class="w-full">
							<el-option :label="$t('goodsManagement.elecSkuCode')" value="1" />
							<el-option :label="$t('goodsManagement.sysCode')" value="2" />
							<el-option :label="$t('goodsManagement.customCode')" value="3" />
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('goodsManagement.customCode')"	v-if="formData.codeType == 3" prop="code">
						<el-select size="mini" v-model="formData.code" class="w-full">
							<el-option
								v-for="item in customCodeList"
								:key="item.id"
								:label="item.code"
								:value="item.code"
							/>
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('goodsManagement.labelSize')" prop="size">
						<el-select size="mini" v-model="formData.size" class="w-full">
							<el-option :label="$t('goodsManagement.labelSize1')" value="1" />
							<el-option :label="$t('goodsManagement.labelSize2')" value="2" />
							<el-option :label="$t('goodsManagement.labelSize3')" value="3" />
							<el-option :label="$t('goodsManagement.labelSize4')" value="4" />
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('goodsManagement.originCountry')" prop="originCountry">
            <NationalGroupSelect v-model="formData.originCountry" valueKey='englishShortname' />
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					size="mini"
					@click="saveForm('formData')"
					:disabled="loading"
				>
					{{ $t("common.confirm") }}
				</el-button>
				<el-button
					size="mini"
					@click="dialogVisible = false"
					:disabled="loading"
				>
					{{ $t("common.cancel") }}
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getGoodsCustomCodeApi, goodsPrintCodeApi, goodsSeaPrintCodeApi, getSeaGoodsCustomCodeApi } from '@/api/OverseasWarehouse/goodsManager'

import NationalGroupSelect from '../../components/NationalGroupSelect.vue'
export default {
	name: 'PrintBarcodeDialog',
	components: { NationalGroupSelect },
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String,
		// type 1 海外仓 2 进口
		type: {
			type: Number,
			default: 1
		}
	},
	data() {
		return {
			loading: false,
			dialogVisible: false,
			customCodeList: [],
			rules: {
				codeType: [
					{ required: true, message: this.$t('goodsManagement.please_select_codeType') }
				],
				code: [
					{ required: true, message: this.$t('goodsManagement.please_select_customCode') }
				],
				size: [
					{ required: true, message: this.$t('goodsManagement.please_select_size') }
				],
				originCountry: [
					{ required: true, message: this.$t('goodsManagement.please_select_originCountry') }
				]
			},
			formData: {
				id: '',
				codeType: "",
				code: '',
				size: '',
				originCountry: 'CHINA'
			}
		}
	},
	methods: {

		async init() {
			let fn = this.type === 1 ? getGoodsCustomCodeApi : getSeaGoodsCustomCodeApi
			let res = await fn(this.id)
			if (res.ok) {
				this.customCodeList = res.content || []
			}
		},
		/**
	 * 保存接口
	 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					return false
				}
				this.loading = true
				this.formData.id = this.id
				let fn = this.type === 1 ? goodsPrintCodeApi : goodsSeaPrintCodeApi
				fn(this.formData).then(res => {
					if (res.ok) {
						window.open(res.content.url)
						this.loading = false
						this.dialogVisible = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})
			})
		}
	},
	watch: {
		dialogVisible(val) {
			if (!val) {
				this.formData = {
					id: '',
					codeType: "",
					code: '',
					size: '',
					originCountry: 'CHINA'
				}
				this.$emit('update:visible', val)
			}
		},
		visible(val) {
			if (val) {
				if (this.id) {
					this.init()
				}
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
.upload {
	text-align: left !important;
}
.tips {
	padding: 10px;
	font-size: 12px;
	color: #edc28c;
	background-color: #fef5ec;
	margin-bottom: 10px;
}
.label-name {
	width: 80px;
}
</style>
