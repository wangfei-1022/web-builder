<template>
  <div v-loading="loading" class="pd-16">
    <TopSearchItemsSlot :searchFun="list" :resetFun="clearSearchForm" class="mb-10" @submit.native.prevent>
			<template slot="multipleSearch">
        <el-form ref="filterForm" :inline="true" :model="filterForm" label-width="100px">
          <el-form-item label="" prop="keyword">
            <el-input v-model="filterForm.keyword" type="text" placeholder="请输入关键字" size="mini" clearable @keyup.enter.native="list" />
          </el-form-item>
          <!-- <el-form-item :label="$t('country.chineseName')" prop="chineseName">
            <el-input v-model="filterForm.chineseName" type="text" :placeholder="$t('common.placeholder')+$t('country.province')" size="mini" clearable @keyup.enter.native="list" />
          </el-form-item> -->
        </el-form>
			</template>
		</TopSearchItemsSlot>
    <div class="mb-10 top-btn-wrap">
      <el-button size="mini" type="primary" @click="addItem">{{$t('country.addItem')}}</el-button>
    </div>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptionsRight"
      :side-bar="sideBarDefs"
      :column-defs="columnDefsRight"
      :row-data="dataList"
      :enable-col-resize="true"
      :enable-sorting="true"
      :grid-ready="onReadyRight"
      :style="gridHeight"
      class="ag-theme-balham"
    />
    <Pagination :total="total" :limit.sync="filterForm.pageSize" :page.sync="filterForm.pageNum" @pagination="list" />
    <el-dialog :visible.sync="dialog.visible" :title="$t('country.addCountry')" width="520px" :close-on-click-modal="false">
      <div class="dialog-content">
        <el-form ref="formData" :model="formData" label-width="100px" v-if="dialog.visible" :rules="rules">
          <el-form-item :label="$t('country.countryCode')" prop="countryCode">
            <NationalGroupSelect v-model="formData.countryCode" labelKey="code2" @selected="countrySelected" />
          </el-form-item>
          <el-form-item :label="$t('country.countryChineseName')">
            <el-input size="mini" disabled :placeholder="$t('country.countryChineseName')" v-model="formData.countryChineseName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('country.countryEnglishName')">
            <el-input size="mini" disabled :placeholder="$t('country.countryEnglishName')" v-model="formData.countryEnglishName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('country.chineseName')" prop="chineseName">
            <el-input size="mini" :placeholder="$t('common.placeholder')+$t('country.chineseName')" v-model="formData.chineseName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('country.englishName')" prop="englishName">
            <el-input size="mini" :placeholder="$t('common.placeholder')+$t('country.englishName')" v-model="formData.englishName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('country.code')" prop="code">
            <el-input size="mini"  :placeholder="$t('common.placeholder')+$t('country.code')" v-model="formData.code"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"	size="mini" :loading="loading" @click="saveForm('formData')">{{ $t("common.saveBtn") }}</el-button>
        <el-button	size="mini"	@click="dialog.visible = false" :loading="loading">{{$t("common.cancelBtn") }}</el-button>
      </span>
  </el-dialog>
  </div>
</template>

<script>
import { getDivisionPageListApi, saveDivisionApi } from '@/api/countryDivision'
import NationalGroupSelect from '../OverseasWarehouse/components/NationalGroupSelect'
export default {
	name: 'CountryDivisionList',
	components: { NationalGroupSelect },
	data() {
		let defaultForm = {
			id: null,
			countryCode: null,
			code: null,
			countryChineseName: null,
			countryEnglishName: null,
			chineseName: null,
			englishName: null,
			englishName: null,
		}
		return {
			filterForm: {
				countryChineseName: null,
				chineseName: null,
				keyword: null,
				pageSize: 50,
				pageNum: 1
			},
			defaultForm,
			formData: this.$extends({}, defaultForm),
			loading: false,
			total: 0,
			dataList: [],
			columnDefsRight: [
				{
					headerName: this.$t('country.countryCode'),
					field: 'countryCode'
				},
				{
					headerName: this.$t('country.countryChineseName'),
					field: 'countryChineseName'
				},
				{
					headerName: this.$t('country.countryEnglishName'),
					field: 'countryEnglishName'
				},
				{
					headerName: this.$t('country.chineseName'),
					field: 'chineseName'
				},
				{
					headerName: this.$t('country.englishName'),
					field: 'englishName'
				},
				{
					headerName: this.$t('country.code'),
					field: 'code'
				},
			],
			rules: {
				countryCode: [{ required: true, message: this.$t('common.selectPlaceholder') + this.$t('country.countryCode'), trigger: 'change' }],
				chineseName: [{ required: true, message: this.$t('common.placeholder') + this.$t('country.chineseName'), trigger: 'change' }],
				englishName: [{ required: true, message: this.$t('common.placeholder') + this.$t('country.englishName'), trigger: 'change' }],
				code: [{ required: true, message: this.$t('common.placeholder') + this.$t('country.code'), trigger: 'change' }],
			},
			gridOptionsRight: {},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false }

		}
	},
	created() {
		this.gridOptionsRight = {
			context: {
				componentParent: this
			}
		}
		this.list()
	},
	mounted() {

	},
	methods: {
		onReadyRight(params) {
			// const self = this
			params.api.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
					// self.onFirstDataRendered()
				})
			})
		},
		countrySelected(data) {
			this.formData.countryEnglishName = data.englishName
			this.formData.countryChineseName = data.chineseName
		},
		//新增
		addItem() {
			this.formData = this.$extends({}, this.defaultForm)
			this.dialog.visible = true
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
				saveDivisionApi(this.formData).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.saveSuccess'))
						this.list()
						this.dialog.visible = false
					}
					this.loading = false
				})
			})
		},
		/**
		 * 获取列表数据
		 */
		async list() {
			let res = await getDivisionPageListApi(this.filterForm)
			if (res.ok) {
				this.dataList = res.content.list || []
				this.total = res.content.total
			}
		},
		/**
		 * 清空重置条件
		 */
		clearSearchForm() {
			this.$refs.filterForm.resetFields()
			this.list()
		}
	}
}
</script>

<style scoped lang="less">
</style>
 