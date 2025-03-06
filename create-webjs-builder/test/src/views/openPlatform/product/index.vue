<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="resetFn">
      <el-form slot="multipleSearch" ref="formDataRef" :inline="true" :model="formData" label-width="100px" size="mini">
        <el-form-item :label='$t("openPlatform.productName")' prop="productName">
          <el-input v-model="formData.productName" type="text" size="mini" clearable @keyup.enter.native="list" />
        </el-form-item>
        <el-form-item :label='$t("openPlatform.productCode")' prop="productCode">
          <el-input v-model="formData.productCode" type="text" size="mini" clearable @keyup.enter.native="list" />
        </el-form-item>
        <el-form-item :label='$t("openPlatform.status")' prop="status">
            <el-select v-model="formData.status" size="mini" @change="list">
            <el-option :label="$t('contract.ALL')" value="" />
            <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button size="mini" type="primary" @click="addFn()">{{$t("openPlatform.add")}}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham"
      />

      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list"/>
    </div>

    <el-dialog :title='$t("openPlatform.add")' :visible.sync="addVisible" width="500px">
      <el-form ref="addModelRef" :model="addModel" :rules="addModelRules" label-width="120px" label-position="right">
        <el-form-item :label='$t("openPlatform.productName")' prop="productName">
          <el-input v-model="addModel.productName" type="text"  size="mini" clearable  />
        </el-form-item>
        <el-form-item :label='$t("openPlatform.productCode")' prop="productCode">
          <el-input v-model="addModel.productCode" type="text"  size="mini" clearable :disabled="!!addModel.id" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="mini">{{$t("openPlatform.cancel")}}</el-button>
        <el-button type="primary" @click="submitFn" size="mini" :loading="addLoading">{{$t("openPlatform.confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import oprateBtn from "./oprateBtn"
import { AgGridVue } from "ag-grid-vue"
import { getProductListApi, addProductApi, updateProductApi, getProductStatusApi, publishProductApi, offlineProductApi } from '@/api/middleware/openPlatform'
import { parseTime } from '@/utils/index'

export default {
	name: "OpenPlatformProduct",
	components: {
		AgGridVue,
		oprateBtn
	},
	data() {
		return {
			pageSizeRange: [10, 20, 30, 50],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			statusList: [],
			formData: {
				status: '',
				productName: '',
				productCode: ''
			},

			addModel: {
				id: '',
				productName: '',
				productCode: ''
			},
			addModelRules: {
				productName: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur' }],
				productCode: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur' }]
			},
			addLoading: false,
			addVisible: false,

			columnFields: [{
				headerName: '', width: 40, pinned: 'left',
				suppressSorting: true, checkboxSelection: true,
				suppressMenu: true, suppressSizeToFit: true, suppressResize: true,
				headerCheckboxSelection: true
			}, {
				field: "productName",
				headerName: this.$t("openPlatform.productName"),
				minWidth: 130
			}, {
				field: "productCode",
				headerName: this.$t("openPlatform.productCode"),
				minWidth: 150
			}, {
				field: "statusName",
				headerName: this.$t("openPlatform.status"),
				minWidth: 130
			}, {
				field: "createTime",
				headerName: this.$t("openPlatform.createTime"),
				minWidth: 130
			}, {
				field: "onlineTime",
				headerName: this.$t("openPlatform.onlineTime"),
				minWidth: 130
			}, {
				field: "operation",
				headerName: this.$t("openPlatform.operation"),
				cellRendererFramework: "oprateBtn",
				pinned: 'right',
				minWidth: 150
			}],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "multiple", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
				context: {
					componentParent: this
				}
			},
			gridApi: {},
			loading: false
		}
	},
	created() {
		this.list()
		this.getBaseDataFn()
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getProductStatusApi()]).then(results => {
				const statusRes = results[0]
				if (statusRes.ok) {
					this.statusList = statusRes.content
				}
			})
		},
		onReady(params) {
			this.gridApi = params.api
			params.api.sizeColumnsToFit()
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		// 获取列表数据
		async list() {
			this.loading = true
			let params = {
				pageSize: this.pageSize,
				pageNum: this.pageNum,
				...this.formData
			}
			getProductListApi(params).then(res => {
				if (res.ok) {
					this.total = parseInt(res.content.total, 10)
					res.content.list = res.content.list || []
					res.content.list.forEach(v => {
						v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
						v.onlineTime = parseTime(v.onlineTime, '{y}-{m}-{d} {h}:{i}:{s}')
					})
					this.dataList = res.content.list
				} else {
					this.total = 0
					this.dataList = []
				}
				this.loading = false
			})
		},
		updateFn(item) {
			this.addVisible = true
			this.addModel = {
				id: item.id,
				productName: item.productName,
				productCode: item.productCode
			}
		},
		publishFn(item) {
			this.$confirm(this.$t("openPlatform.publishInfo"), this.$t('common.mention'), {
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel'),
				type: 'warning'
			}).then(() => {
				publishProductApi(item.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t("openPlatform.publishSuccess"))
						this.list()
					}
				})
			}).catch(() => {
			})
		},
		offlineFn(item) {
			this.$confirm(this.$t("openPlatform.offlineInfo"), this.$t('common.mention'), {
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel'),
				type: 'warning'
			}).then(() => {
				offlineProductApi(item.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t("openPlatform.offlineSuccess"))
						this.list()
					}
				})
			}).catch(() => {
			})

		},
		addFn() {
			this.addModel = {
				id: '',
				productName: '',
				productCode: ''
			}
			this.addVisible = true
		},
		submitFn() {
			this.$refs.addModelRef.validate(valid => {
				if (valid) {
					this.addLoading = true
					let fn = this.addModel.id ? updateProductApi : addProductApi
					let msg = this.addModel.id ? this.$t("openPlatform.updateSuccess") : this.$t("openPlatform.addSuccess")
					fn(this.addModel).then(res => {
						if (res.ok) {
							this.addVisible = false
							this.$message.success(msg)
							this.list()
						}
						this.addLoading = false
					})
				}
			})
		},
		resetFn() {
			this.$refs.formDataRef.resetFields()
			this.list()
		}
	}
}
</script>
<style lang="scss" scoped>
.right-main-wrapper {
	padding: 5px 20px;
	height: 100%;
	overflow: hidden;
}

.pagination-container {
	margin-top: 0px;
}
</style>
