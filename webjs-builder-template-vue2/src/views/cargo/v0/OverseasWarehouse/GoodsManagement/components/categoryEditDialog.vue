<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="title"
			width="550px"
			:close-on-click-modal="false"
			:append-to-body="true"
		>
      <el-form v-if="dialogVisible" ref="formData" label-width="110px" label-position="left" :model="formData">
        <el-form-item
         :label="getZH('categoryName')"
          :rules="[
            { required: true, message: inputZH('categoryName') }
          ]"
          prop="name"
        >
          <el-input type="text" size='mini'  :placeholder="inputZH('categoryName')" v-model="formData.name" maxlength="50" />
        </el-form-item>
        <el-form-item
         :label="getZH('levelName')"
          :rules="[
            { required: true, message: selectZH('levelName') }
          ]"
          prop="level"
          @change="levelChange"
        >
          <el-select v-if='$isEmpty(formData.id)' size="mini"  v-model="formData.level" :placeholder="selectZH('levelName')" class="w-full" >
            <el-option  :label="getZH('first_category')" :value='1' />
             <el-option  :label="getZH('second_category')" :value='2' />
          </el-select>
          <span v-else> {{formData.levelName}}</span>
        </el-form-item>
        <el-form-item
         :label="getZH('parentName')"
          :rules="[
            { required: true, message: selectZH('parentName') }
          ]"
          prop="parentId"
          v-if='formData.level===2'
        >
          <el-select v-if='$isEmpty(formData.id)' size="mini"    v-model="formData.parentId" :placeholder="selectZH('parentName')" class="w-full" @change='parentCategoryChange' >
            <el-option v-for='item in parentCategoryList' :key='item.id' :label='item.name' :value='item.id' />
          </el-select>
          <span v-else>{{formData.parentName}}</span>
        </el-form-item>
      </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button  size="mini" @click="dialogVisible = false" :loading='loading'>
					{{$t('common.cancelBtn') }}
				</el-button>
        <el-button type="primary"  size="mini" @click="saveForm('formData')" :loading='loading'>
						{{$t('common.saveBtn') }}
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getCategoryDetailApi, saveCategoryApi, getParentCategoryApi } from '@/api/OverseasWarehouse/goodsManager'
export default {
	name: 'AduitRejectDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String
	},
	data() {
		let defaultForm = {
			id: null,
			parentName: '',
			parentId: '',
			level: null,
			levelName: null,
			name: ''
		}
		return {
			dialogVisible: false,
			defaultForm,
			loading: false,
			title: '',
			parentCategoryList: [],
			formData: this.$extends({}, defaultForm)
		}
	},
	methods: {
		/**
		 * 初始化数据
		 */
		async init() {
			let res = await getParentCategoryApi({ level: 1 })
			if (res.ok) {
				this.parentCategoryList = res.content || []
			}
		},
		/**
		 * 查看详情
		 */
		async getDetail() {
			this.loading = true
			if (this.$isNotEmpty(this.id)) {
				this.title = this.getZH('editCategory')
				let res = await getCategoryDetailApi(this.id)
				if (res.ok) {
					this.$copyProps(this.formData, res.content)
					this.loading = false
				} else {
					this.loading = false
				}
			} else {
				this.title = this.getZH('addCategory')
				this.formData = this.$extends({}, this.defaultForm)
				this.loading = false
			}
		},
		/**
		 * 品类变更
		 */
		levelChange(val) {
			if (val === 1) {
				this.formData.parentName = null
				this.formData.parentId = null
			}
		},
		/**
		 * 品级变更
		 */
		parentCategoryChange(id) {
			let selected = this.parentCategoryList.find(item => item.id === id)
			if (this.$isNotEmpty(selected)) {
				this.formData.parentName = selected.name
			}
		},
		/**
		 *下拉框
		 */
		selectZH(key, obj) {
			return this.getZH('selectPlaceholder', 'common') + this.getZH(key, obj)
		},
		/**
		 * 输入框
		 */
		inputZH(key, obj) {
			return this.getZH('placeholder', 'common') + this.getZH(key, obj)
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
		 * 保存接口
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					return false
				}
				this.loading = true
				saveCategoryApi(this.formData).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.saveSuccess'))
						this.loading = false
						this.$emit('saved')
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
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.init()
				this.getDetail()
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
