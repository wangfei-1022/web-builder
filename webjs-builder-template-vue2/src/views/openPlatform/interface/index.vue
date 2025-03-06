<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="resetFn">
      <el-form slot="multipleSearch" ref="formDataRef" :inline="true" :model="formData" label-width="100px" size="mini">
        <el-form-item :label='$t("openPlatform.productId")' prop="productId">
          <el-select v-model="formData.productId" size="mini" @change="list">
            <el-option :label="$t('contract.ALL')" value="" />
            <el-option v-for="item in productList" :key="item.id" :label="item.productName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label='$t("openPlatform.apiName")' prop="apiName">
          <el-input v-model="formData.apiName" type="text" size="mini" clearable @keyup.enter.native="list" />
        </el-form-item>
        <el-form-item :label='$t("openPlatform.apiCode")' prop="apiCode">
          <el-input v-model="formData.apiCode" type="text" size="mini" clearable @keyup.enter.native="list" />
        </el-form-item>
        <el-form-item :label='$t("openPlatform.apiStatus")' prop="status">
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
        <el-form-item :label='$t("openPlatform.productId")' prop="productId">
          <el-select v-model="addModel.productId" size="mini" style="width: 100%;">
            <el-option v-for="item in productList" :key="item.id" :label="item.productName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label='$t("openPlatform.apiName")' prop="apiName">
          <el-input v-model="addModel.apiName" type="text"  size="mini" clearable  />
        </el-form-item>
        <el-form-item :label='$t("openPlatform.apiCode")' prop="apiCode">
          <el-input v-model="addModel.apiCode" type="text"  size="mini" clearable :disabled="!!addModel.id" />
        </el-form-item>
        <el-form-item :label='$t("openPlatform.apiUrl")' prop="apiUrl">
          <el-input v-model="addModel.apiUrl" type="text"  size="mini" clearable :disabled="!!addModel.id" />
        </el-form-item>
        <el-form-item :label='$t("openPlatform.rateLimitType")' prop="rateLimitType">
          <el-select v-model="addModel.rateLimitType" size="mini" style="width: 100%;">
            <el-option v-for="item in rateLimitTypes" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="mini">{{$t("openPlatform.cancel")}}</el-button>
        <el-button type="primary" @click="submitFn" size="mini" :loading="addLoading">{{$t("openPlatform.confirm")}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="addVersionTitle" :visible.sync="addVersionVisible" width="500px">
      <el-form ref="addVersionModelRef" :model="addVersionModel" :rules="addVersionModelRules" label-width="120px" label-position="right">
        <el-form-item :label='$t("openPlatform.unavailableTime")' prop="unavailableTime">
          <common-picker pikcerType="datetime" v-model="addVersionModel.unavailableTime" clearable></common-picker>
        </el-form-item>
        <el-form-item :label='$t("openPlatform.remarks")' prop="remarks">
          <el-input v-model="addVersionModel.remarks" type="textarea" size="mini" clearable :disabled="!!addModel.id" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVersionVisible = false" size="mini">{{$t("openPlatform.cancel")}}</el-button>
        <el-button type="primary" @click="submitVersionFn" size="mini" :loading="addVersionLoading">{{$t("openPlatform.confirm")}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title='$t("openPlatform.view")' :visible.sync="detailVisible" width="500px">
      <div class="detail-content">
        <div class="detail-item" v-for="item in detailItemList" :key="item.id">
          <div class="title">{{item.apiVersion}}</div>
          <div class="detail-item-des"><label>{{$t("openPlatform.apiUrl")}}</label><span>{{item.apiUrl}}</span></div>
          <div class="detail-item-des"><label>{{$t("openPlatform.unavailableTime")}}</label><span>{{item.unavailableTime}}</span></div>
          <div class="detail-item-des"><label>{{$t("openPlatform.versionState")}}</label><span>{{item.statusName}}</span></div>
          <div class="detail-item-des"><label>{{$t("openPlatform.remarks")}}</label><span>{{item.remarks}}</span></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false" size="mini">{{$t("openPlatform.close")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import oprateBtn from "./oprateBtn"
import AvailableVsersion from './AvailableVsersion'
import { AgGridVue } from "ag-grid-vue"
import {
	getInterfaceListApi, getInterfaceDetailApi,
	addInterfaceApi, addInterfaceVersionApi,
	updateInterfaceVersionApi, getInterfaceProductApi,
	getInterfaceStatusApi, publishInterfaceApi,
	offlineInterfaceApi, getInterfacelimitTypeApi
} from '@/api/middleware/openPlatform'
import { parseTime } from '@/utils/index'

export default {
	name: "OpenPlatformInterface",
	components: {
		AgGridVue,
		oprateBtn,
		AvailableVsersion
	},
	data() {
		return {
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			rateLimitTypes: [],
			statusList: [],
			productList: [],
			formData: {
				productId: '',
				status: '',
				apiName: '',
				apiCode: ''
			},

			addModel: {
				id: '',
				productId: '',
				apiName: '',
				apiCode: '',
				apiUrl: '',
				rateLimitType: ''
			},
			addModelRules: {
				productId: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur' }],
				apiName: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur' }],
				apiCode: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur' }],
				apiUrl: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur' }],
				rateLimitType: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur' }]
			},
			addLoading: false,
			addVisible: false,

			addVersionTitle: '',
			addVersionVisible: false,
			addVersionLoading: false,
			addVersionModel: {
				apiId: '',
				unavailableTime: '',
				remarks: ''
			},
			addVersionModelRules: {
				remarks: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur' }],
				unavailableTime: [{ required: false, message: this.$t('common.cannot_be_null'), trigger: 'blur' }]
			},

			detailVisible: false,
			detailItemList: [],

			columnFields: [{
				headerName: '', width: 40, pinned: 'left',
				suppressSorting: true, checkboxSelection: true,
				suppressMenu: true, suppressSizeToFit: true, suppressResize: true,
				headerCheckboxSelection: true
			}, {
				field: "apiName",
				headerName: this.$t("openPlatform.apiName"),
				minWidth: 130
			}, {
				field: "apiCode",
				headerName: this.$t("openPlatform.apiCode"),
				minWidth: 150
			}, {
				field: "availableVsersion",
				headerName: this.$t("openPlatform.availableVsersion"),
				minWidth: 130,
				cellRendererFramework: "AvailableVsersion"
			}, {
				field: "statusName",
				headerName: this.$t("openPlatform.apiStatus"),
				minWidth: 130
			}, {
				field: "rateLimitTypeName",
				headerName: this.$t("openPlatform.rateLimitTypeName"),
				minWidth: 130
			}, {
				field: "productName",
				headerName: this.$t("openPlatform.productId"),
				minWidth: 130
			}, {
				field: "createTime",
				headerName: this.$t("openPlatform.createTime"),
				minWidth: 130
			}, {
				field: "apiUrl",
				headerName: this.$t("openPlatform.apiUrl"),
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
			Promise.all([getInterfaceStatusApi(), getInterfaceProductApi({ status: 2 }), getInterfacelimitTypeApi()]).then(results => {
				const statusRes = results[0]
				const productRes = results[1]
				const rateLimitTypesRes = results[2]
				if (statusRes.ok) {
					this.statusList = statusRes.content
				}
				if (productRes.ok) {
					this.productList = productRes.content
				}
				if (rateLimitTypesRes.ok) {
					this.rateLimitTypes = rateLimitTypesRes.content
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
			getInterfaceListApi(params).then(res => {
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
		viewFn(item) {
			getInterfaceDetailApi({ apiId: item.id }).then(res => {
				if (res.ok) {
					this.detailVisible = true
					res.content.forEach(v => {
						v.unavailableTime = parseTime(v.unavailableTime, '{y}-{m}-{d} {h}:{i}:{s}')
					})
					this.detailItemList = res.content
				}
			})
		},
		updateFn(item) {
			this.addVersionTitle = this.$t("openPlatform.updateVersion")
			this.addVersionVisible = true
			this.addVersionModel = {
				apiId: item.id,
				unavailableTime: item.unavailableTime,
				remarks: item.remarks,
				edit: true
			}
		},
		// 新建版本
		newVersionFn(item) {
			this.addVersionTitle = this.$t("openPlatform.addVersion")
			this.addVersionVisible = true
			this.addVersionModel = {
				apiId: item.id,
				unavailableTime: '',
				remarks: ''
			}
		},
		// 新建版本
		submitVersionFn() {
			this.$refs.addVersionModelRef.validate(valid => {
				if (valid) {
					this.addVersionLoading = true
					let fn = this.addVersionModel.edit ? updateInterfaceVersionApi : addInterfaceVersionApi
					let msg = this.addVersionModel.edit ? this.$t("openPlatform.updateVersionSuccess") : this.$t("openPlatform.addVersionSuccess")
					fn(this.addVersionModel).then(res => {
						if (res.ok) {
							this.addVersionVisible = false
							this.$message.success(msg)
							this.list()
						}
						this.addVersionLoading = false
					})
				}
			})
		},
		// 发布
		publishFn(item) {
			this.$confirm(this.$t("openPlatform.publishInfo"), this.$t('common.mention'), {
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel'),
				type: 'warning'
			}).then(() => {
				publishInterfaceApi(item.id).then(res => {
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
				offlineInterfaceApi(item.id).then(res => {
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
				productId: '',
				apiName: '',
				apiCode: '',
				apiUrl: ''
			}
			this.addVisible = true
		},
		submitFn() {
			this.$refs.addModelRef.validate(valid => {
				if (valid) {
					this.addLoading = true
					addInterfaceApi(this.addModel).then(res => {
						if (res.ok) {
							this.addVisible = false
							this.$message.success(this.$t("openPlatform.addSuccess"))
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

.detail-content {
	max-height: 500px;
	overflow-y: auto;
	.title {
		font-size: 24px;
		font-weight: 600;
		margin-bottom: 5px;
	}
	.detail-item {
		margin-bottom: 15px;
		line-height: 22px;
	}
	.detail-item-des {
		label {
			width: 65px;
			text-align: right;
			display: inline-block;
			margin-right: 10px;
		}
	}
}
</style>
