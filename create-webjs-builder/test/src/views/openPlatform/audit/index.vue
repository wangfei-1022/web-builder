<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="resetFn" class="mb-10">
      <el-form slot="multipleSearch" ref="formDataRef" :inline="true" :model="formData" label-width="100px" size="mini">
        <el-form-item :label='$t("openPlatform.initiator")' prop="initiatorId">
      <advance-select
        v-model="formData.initiatorId"
        :method="getUserDropDownListFun"
        value-key="id"
        label-key="chineseName"
        @selected="list"
        :fields="['chineseName','mobile','email']"
        :headers="['名称','手机号','邮箱']"
        clearable
      >
      </advance-select>
        </el-form-item>
        <el-form-item :label='$t("openPlatform.authorizer")' prop="authorizerId">
          <advance-select
            v-model="formData.authorizerId"
            :method="getUserDropDownListFun"
            value-key="id"
            label-key="chineseName"
            @selected="list"
            :fields="['chineseName','mobile','email']"
            :headers="['名称','手机号','邮箱']"
            clearable
          >
          </advance-select>
        </el-form-item>
        <el-form-item :label='$t("openPlatform.rateLimitLevel")' prop="rateLimitLevel" v-if="activeName === 2">
          <SelectFilter
            v-model="formData.rateLimitLevel"
            size="mini"
            name-key="name"
            value-key="code"
            :options="limitTypes"
            :filter-keys="['name']"
            clearable
            @change="list" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <el-tabs v-model="activeName" @tab-click="list"  type="border-card" class="top-tabs">
      <el-tab-pane :label='$t("openPlatform.UN_AUDIT") + "(" + showTotal + ")"'  :name="1"></el-tab-pane>
      <el-tab-pane :label='$t("openPlatform.AUDIT")' :name="2"></el-tab-pane>
    </el-tabs>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptions"
      :side-bar="sideBarDefs"
      :column-defs="activeName === 1 ? columnFields : columnFields1"
      :row-data="dataList"
      :enable-col-resize="true"
      :enable-sorting="true"
      :pagination="false"
      :pagination-auto-page-size="false"
      :grid-ready="onReady"
      :style="gridHeight"
      class="ag-theme-balham"
    />
    <showDetailDialog :id="activeId"   :visible.sync="dialog.visible" @saved="list" :limitTypes='limitTypes' />
    <Pagination :total="total" :limit.sync="formData.pageSize" :page.sync="formData.pageNum"  @pagination="list"/>
  </div>
</template>

<script>
import AdvanceSelect from "@/components/Form/AdvanceSelect"
import oprateBtn from "./components/oprateBtn"
import { getProductAuditListApi, getProductAuditedListApi, invalidateSignApi, getLimitTypeSignApi, getUserListByNameApi } from '@/api/middleware/openPlatform'
import showDetailDialog from './components/showDetailDialog'
export default {
	name: "OpenPlatformAudit",
	components: { oprateBtn, showDetailDialog, AdvanceSelect },
	data() {
		return {
			total: 0,
			dataList: [],
			activeName: 1,
			activeId: '',
			limitTypes: [],
			formData: {
				initiatorId: '',
				authorizerId: '',
				rateLimitLevel: null,
				pageSize: 50,
				pageNum: 1
			},

			columnFields: [{
				field: "appName",
				headerName: this.$t("openPlatform.appName"),
				minWidth: 130
			}, {
				field: "initiatorIdName",
				headerName: this.$t("openPlatform.initiator"),
				minWidth: 150
			}, {
				field: "signatoryName",
				headerName: this.$t("openPlatform.authorizer"),
				minWidth: 130
			},
			{
				field: "authTime",
				headerName: this.$t("openPlatform.authTime"),
				minWidth: 130,
				cellRenderer: params => this.formatDate(params.value, "YYYY-MM-DD HH:mm:ss")
			}, {
				field: "signStatusName",
				headerName: this.$t("openPlatform.signStatusName"),
				minWidth: 130
			}, {
				field: "id",
				headerName: this.$t("receiveFms.operation"),
				cellRendererFramework: "oprateBtn",
				pinned: 'right',
				minWidth: 150
			}],
			columnFields1: [{
				field: "appName",
				headerName: this.$t("openPlatform.appName"),
				minWidth: 130
			}, {
				field: "initiatorIdName",
				headerName: this.$t("openPlatform.initiator"),
				minWidth: 150
			}, {
				field: "signatoryName",
				headerName: this.$t("openPlatform.authorizer"),
				minWidth: 130
			},
			{
				field: "rateLimitLevelName",
				headerName: this.$t("openPlatform.rateLimitLevel"),
				minWidth: 130
			}, {
				field: "authTime",
				headerName: this.$t("openPlatform.authTime"),
				minWidth: 130,
				cellRenderer: params => this.formatDate(params.value, "YYYY-MM-DD HH:mm:ss")
			}, {
				field: "signStatusName",
				headerName: this.$t("openPlatform.signStatusName"),
				minWidth: 130
			}, {
				field: "id",
				headerName: this.$t("receiveFms.operation"),
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
			showTotal: 0,
			loading: false
		}
	},
	created() {
		this.list()
		this.init()
	},
	methods: {
		onReady(params) {
			this.gridApi = params.api
			params.api.sizeColumnsToFit()
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		// 获取会员列表
		getUserDropDownListFun(params) {
			const data = {
				param: params.keyword
			}
			return getUserListByNameApi(data)
		},
		async init() {

			let rs = await getLimitTypeSignApi()
			if (rs.ok) {
				this.limitTypes = rs.content || []
			}
		},
		// 获取列表数据
		async list() {
			this.loading = true
			if (this.activeName === 1) {
				this.formData.rateLimitLevel = null
			}
			let fn = this.activeName === 1 ? getProductAuditListApi : getProductAuditedListApi
			fn(this.formData).then(res => {
				if (res.ok) {
					this.total = res.content.total
					res.content.list = res.content.list || []
					this.dataList = res.content.list
					if (this.activeName === 1) {
						this.showTotal = res.content.total
					}
				} else {
					this.dataList = []
				}
				this.loading = false
			})
		},
		// 审核
		viewFn(id) {
			console.log(id);

			this.activeId = id
			// isAudit 是不是审核
			this.dialog.visible = true

		},
		// 失效
		failureData(id) {
			this.$confirm(this.$t("openPlatform.failureInfo"), this.$t('common.mention'), {
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel'),
				type: 'warning'
			}).then(() => {
				this.loading = true
				invalidateSignApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t("openPlatform.failureSuccess"))
						this.list()
						this.loading = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})
			}).catch(() => {
				// do nothing
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
