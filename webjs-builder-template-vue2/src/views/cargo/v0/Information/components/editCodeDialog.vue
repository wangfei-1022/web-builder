<template>
  <el-dialog
    :visible.sync="showDialog"
    width="600px"
    :title="title"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
  >
    <el-form ref="editForm" :model="editForm" :rules="editFormRules" size="mini" label-width="120px" label-position="right">
      <el-form-item :label="$t('codeManager.categoryCode')" prop="code">
        <el-row>
          <el-col :span="15">
            <el-input v-model="editForm.code" maxlength="50" :disabled="edit" :placeholder="$t('codeManager.codePlaceholder')" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('codeManager.categoryName')" prop="name">
        <el-row>
          <el-col :span="15">
            <el-input v-model="editForm.name" maxlength="50" :placeholder="$t('codeManager.namePlaceholder')" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('codeManager.parentCode')" prop="parentId">
        <el-row>
          <el-col :span="15">
            <el-select
              v-model="editForm.parentId"
              filterable
              :placeholder="$t('codeManager.parentCodePlaceholder')">
              <el-option
                v-for="(item, index) in parentList"
                :key="item.label+index"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('codeManager.remark')" prop="remark">
        <el-row>
          <el-col :span="15">
            <el-input v-model="editForm.remark" rows="4" type="textarea" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div class="btn-wrap">
      <el-button type="primary" size="mini" @click="validateForm">{{$t('common.confirmBtn')}}</el-button>
      <el-button type="default" size="mini" @click="closeDialog">{{$t('common.cancelBtn')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
	getAttributeDetailApi,
	createAttributeDetailApi,
	updateAttributeDetailApi,
	getAttributeDropdownApi
} from '@/api/codeManager'
export default {
	name: 'editCodeDialog',
	props: {
		edit: { type: Boolean, default: false },
		showDialog: { type: Boolean, default: false }
	},
	data() {
		const trimSpaceCode = (rule, value, callback) => {
			const str = value.replace(/^\s+|\s+$/gm, '')
			if (str.length == 0) {
				callback(new Error(this.$t('codeManager.codeEmptyError')))
			}
			callback()
		}
		const trimSpaceName = (rule, value, callback) => {
			const str = value.replace(/^\s+|\s+$/gm, '')
			if (str.length == 0) {
				callback(new Error(this.$t('codeManager.nameEmptyError')))
			}
			callback()
		}
		return {
			title: this.$t('codeManager.createInfo'),
			parentCodeList: [],
			provinceyList: [],
			cityList: [],
			editForm: {
				id: '',
				code: '',
				name: '',
				parentId: '',
				remark: '',
				activeFlag: false
			},
			editFormRules: {
				code: [
					{ required: true, validator: trimSpaceCode, trigger: 'blur' }
				],
				name: [
					{ required: true, validator: trimSpaceName, trigger: 'blur' }
				]
			},
			parentList: []
		}
	},
	watch: {
		edit: function (val) {
			if (val) {
				this.title = this.$t('codeManager.editInfo')
			} else {
				this.title = this.$t('codeManager.createInfo')
			}
		},
		"$route.path": function (val) {
			if (this.showDialog) {
				this.closeDialog()
			}
		}
	},
	mounted() { },
	methods: {
		async getDropdownList(edit = false) {
			const res = await getAttributeDropdownApi({ keyword: '' })
			if (res && res.ok) {
				this.parentList = []
				if (edit) { // 编辑状态不能选择自己作为上级代码
					res.content.forEach(item => {
						if (item.id != this.editForm.id) {
							this.parentList.push({
								label: item.name,
								value: item.id
							})
						}
					})
				} else {
					this.parentList = res.content.map((item) => {
						return {
							label: item.name,
							value: item.id
						}
					})
				}
			}
		},
		async getInfoDetail(id) {
			const res = await getAttributeDetailApi(id)
			if (res.ok) {
				this.editForm = { ...this.editForm, ...res.content }
				this.getDropdownList(true)
			}
		},
		validateForm() {
			this.$refs.editForm.validate(async valid => {
				if (valid) {
					// 格式化输入框
					this.editForm.code = this.editForm.code.replace(/^\s+|\s+$/gm, '')
					this.editForm.name = this.editForm.name.replace(/^\s+|\s+$/gm, '')
					this.editForm.code = this.editForm.code.toUpperCase()

					// 提交表单
					let res = null
					if (this.edit) {
						res = await updateAttributeDetailApi(this.editForm.id, JSON.stringify(this.editForm))
					} else {
						this.editForm.id = ''
						res = await createAttributeDetailApi(JSON.stringify(this.editForm))
					}

					if (res.ok) {
						this.$message({
							type: 'success',
							message: this.$t('codeManager.savedSuccess')
						})

						this.closeDialog()
						this.$emit('refreshData')
					}
				}
			})
		},
		closeDialog() {
			this.editForm = {
				id: '',
				code: '',
				name: '',
				parentId: '',
				remark: '',
				activeFlag: false
			}
			this.$refs.editForm.resetFields()
			this.$refs.editForm.clearValidate()
			this.$emit('closeDialog')
		}
	}
}
</script>
<style lang="scss" scoped>
.btn-wrap {
	margin-top: 10px;
	text-align: right;
}
::v-deep .el-select--mini {
	width: 100%;
}
</style>
