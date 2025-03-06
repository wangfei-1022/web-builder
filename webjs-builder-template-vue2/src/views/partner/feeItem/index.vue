<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px">
            <el-form-item :label='$t("feeItem.fee_code_name")' prop="code">
              <el-input v-model="formData.code" type="text" size="mini"  clearable @keyup.enter.native="list"/>
            </el-form-item>
            <el-form-item :label="$t('feeItem.business_type')" prop="businessType">
              <el-select v-model="formData.businessType" size="mini"  @change="list">
                <el-option :label="$t('feeItem.ALL')" value="" />
                <el-option v-for="(item, index) in businessTypeList" :key="index" :label="item.chineseName" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('feeItem.chinese_english_name')" prop="name">
              <el-input v-model="formData.name"  type="text" size="mini" clearable @keyup.enter.native="list"/>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addFn" v-if="status == 0" v-permission="['dmn:fee:item:draft:save']">{{ $t("feeItem.add") }}</el-button>
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
  </div>
</template>

<script>
import { getFeeItemListApi, feeDeleteApi } from "@/api/financial/feeItem"
import { getBusinessTypeListApi } from "@/api/partner/customerManage"
import optionBtn from "./optionBtn"
import { AgGridVue } from "ag-grid-vue"
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: "FeeItemListIndex",
	components: {
		AgGridVue,
		optionBtn
	},
	props: {
		status: {
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {
			formData: {
				name: '',
				businessType: '',
				code: ''
			},
			pageSize: 50,
			pageNum: 0,
			total: 0,
			columnFields: [{
				field: "code",
				headerName: this.$t('feeItem.fee_code')
			}, {
				field: "feeShortName",
				headerName: this.$t('feeItem.fee_short_name')
			}, {
				field: "businessTypeName",
				headerName: this.$t('feeItem.business_type')
			}, {
				field: "chineseName",
				headerName: this.$t('feeItem.chinese_name')
			}, {
				field: "englishName",
				headerName: this.$t('feeItem.english_name')
			}, {
				field: "remark",
				headerName: this.$t('feeItem.remark')
			}, {
				field: "createByName",
				headerName: this.$t('feeItem.create_by')
			}, {
				field: "createTime",
				headerName: this.$t('feeItem.create_time')
			}, {
				field: "id",
				headerName: this.$t("customerManage.operation"),
				cellRendererFramework: "optionBtn",
				minWidth: 280
			}
			],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "single", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
				context: {
					componentParent: this
				}
			},
			loading: false,
			dataList: [],
			businessTypeList: []
		}
	},
	activated() {
		this.list()
	},
	created() {
		this.list()
		this.getBaseDataFn()
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getBusinessTypeListApi()]).then(results => {
				const businessTypeRes = results[0]
				if (businessTypeRes.ok) {
					this.businessTypeList = businessTypeRes.content
				}
			})
		},
		onReady(params) {
			params.api.sizeColumnsToFit()
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		async list() {
			this.loading = true
			const _params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}
			_params.status = this.status
			const res = await getFeeItemListApi(_params)
			if (res.ok) {
				res.content.list.forEach(function (v) {
					v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
				})
				this.total = parseInt(res.content.total, 10)
				this.dataList = res.content.list
			} else {
				this.total = 0
				this.dataList = []
			}
			this.loading = false
		},
		handleSizeChange(size) {
			this.pageSize = size
			this.list()
		},
		handleCurrentChange(page) {
			this.pageNum = page
			this.list()
		},
		addFn() {
			this.$router.push({
				name: 'FeeItemAdd'
			})
		},
		detailFn(item) {
			this.$router.push({
				name: "FeeItemDetail",
				query: {
					id: item.feeItemBaseId
				}
			})
		},
		editFn(item) {
			this.$router.push({
				name: "FeeItemAdd",
				query: {
					id: item.feeItemBaseId
				}
			})
		},
		deleteFn(item) {
			this.$confirm(this.$t("feeItem.is_confirm_delete"), this.$t('common.mention'), {
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel'),
				type: 'warning'
			}).then(() => {
				feeDeleteApi(item.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t("feeItem.delete_success"))
						this.list()
					}
				})
			}).catch(() => {
			})
		},
		reset() {
			this.$refs.formData.resetFields()
			this.list()
		}
	}
}
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
.customer-input {
	width: 230px;
}
.multiple-form-wrap {
	::v-deep .el-select > .el-input {
		width: 230px;
	}
}
</style>
