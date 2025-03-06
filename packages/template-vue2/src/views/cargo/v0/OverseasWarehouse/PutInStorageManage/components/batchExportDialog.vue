<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('common.bathExport')"
			width="350px"
			:close-on-click-modal="false"
			:append-to-body="true"
		>
      <el-form v-if="dialogVisible" ref="formData" label-width="80px" :model="formData">
        <el-form-item :label="$t('putInStorageManage.exporField')" :rules="[ { required: true, message: $t('putInStorageManage.please_select_expor_field') }]" prop="exportTemplateCode" >
          <el-select size="mini" v-model="formData.exportTemplateCode" class="w-full">
            <el-option v-for="item in exportTpl" :key="item.exportTemplateCode" :label="item.exportTemplateName" :value="item.exportTemplateCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('putInStorageManage.goodsCode')" :rules="[ { required: true, message: $t('putInStorageManage.please_select_goods_code') }]" prop="codeTypes" >
          <el-cascader
            class="w-full"
            size="mini"
            v-model="formData.codeTypes"
            :options="customCodesOptions"
            :props="{ label: 'chineseName', value: 'id' }"
            :placeholder="$t('common.selectPlaceholder')"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
      </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button  size="mini" @click="dialogVisible = false" :loading='loading'>
					{{$t('common.cancelBtn') }}
				</el-button>
        <el-button type="primary" size="mini" @click="saveForm('formData')" :loading='loading'>
						{{$t('common.saveBtn') }}
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getGoodsTypeIdListApi, getTermAndItemApi } from '@/api/OverseasWarehouse/goodsManager.js'
import { exporFieldSelectionsApi } from '@/api/OverseasWarehouse/GRNManager'
export default {
	name: 'BatchExportDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String,
		exportType: {
			type: Number,
			default: 1
		}
	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			customCodesOptions: [],
			exportTpl: [],
			formData: {
				exportTemplateCode: null,
				goodsCodeType: null,
				subCodeTypeId: null,
				codeTypes: []
			}
		}
	},
	methods: {
		// 初始化接口
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
					let data = [{
						id: 1,
						chineseName: this.$t('putInStorageManage.skuCode')
					},
					{
						id: 2,
						chineseName: this.$t('putInStorageManage.systemCode')
					}]
					res.content = data.concat(res.content)
					this.customCodesOptions = res.content || []
				}
			}
			let rs = await exporFieldSelectionsApi({ exportType: this.exportType })
			if (rs.ok) {
				this.exportTpl = rs.content
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
				let saveData = {
					exportTemplateCode: this.formData.exportTemplateCode,
					goodsCodeType: null,
					subCodeTypeId: null
				}
				if (this.formData.codeTypes.length === 2) {
					saveData.goodsCodeType = 3
					saveData.subCodeTypeId = this.formData.codeTypes[1]
				} else {
					saveData.goodsCodeType = this.formData.codeTypes[0]
					saveData.subCodeTypeId = null
				}
				this.loading = false
				this.$emit('saved', saveData)
				this.dialogVisible = false
			})
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData.codeTypes = []
				this.formData.exportTemplateCode = null
				this.init()
			}
			this.dialogVisible = val
		}
	}
}
</script>

<style>
</style>
