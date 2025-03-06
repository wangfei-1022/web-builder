<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getList" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" size="mini" label-width="100px" class="contract-search">
            <el-form-item :label='$t("uexpressPriceCard.supplierName")' prop="supplierId">
							<type-select v-model="formData.supplierId" type="supplier" :requestParams="{partnerRole: 17011}" @selected="getSupplierProduct"></type-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressPriceCard.supplierProduct")' prop="productCode">
              <el-select v-model="formData.productCode" size="mini" style="width: 100%" filterable>
                <el-option v-for="item in supplierProductList" :key="item.productCode" :label="item.productName" :value="item.productCode"/>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressPriceCard.destinationCountry")' prop="destinationCountryCode">
							<base-select type="country" v-model="formData.destinationCountryCode" clearable filterable @selected="getList" />
            </el-form-item>
            <el-form-item :label='$t("uexpressPriceCard.offerState")' prop="offerState">
							<el-select v-model="formData.offerState" size="mini" style="width: 100%"  @change="getList">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="item in cardStateList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="table-wrap">
      <div style="padding: 0px 0 10px 0;" class="top-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addFn">{{$t("uexpressPriceCard.add")}}</el-button>
        <el-button type="primary" size="mini" @click="uploadFn">{{$t("uexpressPriceCard.uploadPriceCard")}}</el-button>
        <el-button type="primary" size="mini" @click="exportFn" v-if="false">{{$t("uexpressPriceCard.export")}}</el-button>
      </div>

      <el-table
        class="yht-table yht-aggird-table"
        :data="tableData"
        :height="tableHeight"
        style="width: 100%;"
        row-key="offerId"
        border
        size="mini"
        lazy
        :load="loadFn"
        @selection-change="handleSelectionChange"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column fixed="left" type="selection" width="40" />
        <el-table-column prop="supplierName" :label='$t("uexpressPriceCard.supplierName")' min-width="180" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span :class="!row.hasChildren && !row.isChildren ? 'offerNoLeft' : ''">{{row.supplierName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productName" :label='$t("uexpressPriceCard.supplierProduct")' min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="destinationCountryName" :label='$t("uexpressPriceCard.destinationCountry")' min-width="100"></el-table-column>
        <el-table-column prop="fuelRateFeeItem" :label='$t("uexpressPriceCard.fuelRateFeeItem")' min-width="100">
          <template slot-scope="{row}">
            <span>{{row.feeItemNames ? row.feeItemNames.join('、') : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fuelRate" :label='$t("uexpressPriceCard.fuelRate")' min-width="100"></el-table-column>
        <el-table-column prop="effectiveDateBeginStr" :label='$t("uexpressPriceCard.effectiveDateFrom")' min-width="150"> </el-table-column>
        <el-table-column prop="effectiveDateEndStr" :label='$t("uexpressPriceCard.effectiveDateTo")'  min-width="150"> </el-table-column>
        <el-table-column prop="offerStateName" :label='$t("uexpressPriceCard.offerStateName")'  min-width="130"></el-table-column>
        <el-table-column prop="createByName" :label='$t("uexpressPriceCard.createByName")' show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="createTime" :label='$t("uexpressPriceCard.createTime")' min-width="150"></el-table-column>
        <el-table-column fixed="right" prop="operation" :label='$t("uexpressPriceCard.operation")' min-width="140" >
          <template slot-scope="{row}">
            <a class="link" @click="editFn(row)" v-if="row.offerState === 30">{{$t("uexpressPriceCard.update")}}</a>
            <a class="link" @click="publishFn(row)" v-if="checkPublishFn(row)" >{{$t("uexpressPriceCard.publish")}}</a>
            <a class="link" @click="adjustFn(row)" v-if="row.offerState === 50 || row.offerState === 51 || row.offerState === 52 || row.offerState === 53" >{{$t("uexpressPriceCard.adjust")}}</a>
            <a class="link" @click="offlineFn(row)" v-if="checkOfflineFn(row)" >{{$t("uexpressPriceCard.offline")}}</a>
            <a class="link" @click="deleteFn(row)" v-if="row.offerState === 10 || row.offerState === 20 || row.offerState === 30" >{{$t("uexpressPriceCard.delete")}}</a>
            <a class="link" @click="viewFn(row)">{{$t("uexpressPriceCard.view")}}</a>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="total" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="getList"/>
    </div>

    <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressPriceCard.uploadPriceCard")'>
      <el-form class="contact-form" ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn(29)">{{$t("uexpressPriceCard.uploadPriceCardTemplate")}}</el-button>
        </div>
        <el-form-item label='excel' prop="offerExcel">
          <upload-file v-model="importForm.offerExcel" accept=".xls,.xlsx" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchImportVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="batchImportConfirmFn" :loading="batchImportLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <fuel-rate-dialog ref="fuelRateDialogRef" @success="getList"/>
  </div>
</template>
<script>
import {
  getPayableFuelRateListApi,
  getPayableFuelRateHistoryListApi,
  publishPayableFuelRateApi,
  deletePayableFuelRateApi,
  importPayableFuelRateApi,
  exportPayableFuelRateApi,
  offlineExpireTimePayableFuelRateApi // 下线价卡
} from '@/api/uexpress/payableFuelRate'
import { getDictListApi, getTemplateFileApi, getSupplierProductByApi } from "@/api/uexpress/base";
import { parseTime } from "@/utils"
import { getCountryListApi } from '@/api/country'
import FuelRateDialog from './FuelRateDialog'

export default {
	name: 'UexpressPriceCardPublishPayable',
	props: {
		origin: {
			type: String,
			default: ''
		}
	},
  components: {
    FuelRateDialog
  },
	data() {

		const formData = {
      offerNo: '',
      offerName: '',
      offerState: '',
      productCode: '',
      destinationCountryCode: '',
      effectiveDatePeriod: [],
      productType: '',
			pageSize: 50,
			pageNum: 1
		}

		return {
			loading: false,
			defaultFilter: formData,
			formData: this.$extends({}, formData),
			total: 0,
			tableData: [],
			selectedIds: [],
			multipleSelection: [],
      stateList: [],
      cardStateList: [],
      countryList: [],

      // 导入价卡
      batchImportVisible: false,
      batchImportLoading: false,
      importForm: {
        offerExcel: []
      },
      importFormRule: {
        offerExcel: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },

      supplierProductList: []
		}
	},
	created() {
		this.getBaseDataFn()
		this.getList()
	},
  activated() {
    this.getList()
  },
	methods: {
    getSupplierProduct() {
      getSupplierProductByApi({ supplierId: this.formData.supplierId }).then(res => {
        if (res.ok) {
          this.supplierProductList = res.content
        }
      })
    },
    checkOfflineFn(row) {
      return row.offerState === 50 || row.offerState === 51 || row.offerState === 52
    },
    checkPublishFn(row) {
      return row.offerState === 10 || row.offerState === 20 || row.offerState === 30
    },
    exportFn() {
      this.loading = true
      let params = this.getParams()
      exportPayableFuelRateApi(params).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('uexpressPriceCard.exportSuccess'))
        }
        this.loading = false
      })
    },
    downloadTemplateFn(type) {
      // 21-公布价
      getTemplateFileApi(type).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    uploadFn() {
      this.importForm.offerExcel = []
      this.batchImportVisible = true
    },
    batchImportConfirmFn() {
      this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.importForm
          }
          data.offerExcel = data.offerExcel[0]
          this.batchImportLoading = true
          importPayableFuelRateApi(data).then(res => {
            if (res.ok) {
              this.batchImportVisible = false
              this.$message.success(this.$t('uexpressPriceCard.import_oper_success'))
            }
            this.batchImportLoading = false
          })
        }
      })
    },
		getBaseDataFn() {
			Promise.all([getDictListApi(48), getCountryListApi()]).then(results => {
				const cardStateRes = results[0]
        const countryRes = results[1]
				if (cardStateRes.ok) {
					this.cardStateList = cardStateRes.content
				}
        if (countryRes.ok) {
          this.countryList = countryRes.content
        }
			})
		},
		handleSelectionChange(val) {
			let arr = []
			val.forEach(function (v) {
				arr.push(v.id)
			})
			this.selectedIds = arr
			this.multipleSelection = val
		},
    getParams() {
      let data = {
        ...this.formData
      }
      if (data.effectiveDatePeriod) {
				data.effectiveDateQueryBegin = this.formData.effectiveDatePeriod[0]
				data.effectiveDateQueryEnd = this.formData.effectiveDatePeriod[1]
			}
      delete data.effectiveDatePeriod
      return data
    },
		async getList() {
			this.loading = true
			let params = this.getParams()
      let fn = null
			const res = await getPayableFuelRateListApi(params)
			if (res.ok) {
				res.content.list.forEach(function (v) {
					v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
					v.effectiveDateBeginStr = parseTime(v.effectiveDateBegin, '{y}-{m}-{d} {h}:{i}:{s}')
					v.effectiveDateEndStr = parseTime(v.effectiveDateEnd, '{y}-{m}-{d} {h}:{i}:{s}')
          v.hasChildren = v.historyVersionCount > 1 || v.historyVersionPublishCount > 1
          v.version = 'V' + v.version
				})
				this.tableData = []
				this.$nextTick(() => {
					this.tableData = res.content.list
				})
				this.total = Number(res.content.total)
			} else {
				this.tableData = []
				this.total = 0
			}
      this.loading = false
		},
		loadFn(tree, treeNode, resolve) {
			getPayableFuelRateHistoryListApi(tree.offerId).then(res => {
				let arr = []
				if (res.content) {
					res.content.forEach(function (v, index) {
            // 构造出唯一的offerId 与父级的不同即可
            v.offerId = v.offerId + (new Date().getTime() + '' + index)
						v.id = index + new Date().getTime()
						v.isChildren = true
						v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
            v.effectiveDateBeginStr = parseTime(v.effectiveDateBegin, '{y}-{m}-{d} {h}:{i}:{s}')
            v.effectiveDateEndStr = parseTime(v.effectiveDateEnd, '{y}-{m}-{d} {h}:{i}:{s}')
            v.version = 'V' + v.version
            // 过滤出当前这条父级数据
            if (v.offerVersionId !== tree.offerVersionId) {
              arr.push(v)
            }
					})
				}
				resolve(arr)
			})
		},
    addFn() {
      this.addVisible = true
      this.$refs.fuelRateDialogRef.show('ADD', {})
    },
    viewFn(row) {
      this.addVisible = true
      this.$refs.fuelRateDialogRef.show('VIEW', row)
    },
    editFn(row) {
      this.addVisible = true
      this.$refs.fuelRateDialogRef.show('EDIT', row)
    },
    adjustFn(row) {
      this.addVisible = true
      this.$refs.fuelRateDialogRef.show('ADJUST', row)
    },
    publishFn(row) {
      this.$confirm(this.$t("uexpressPriceCard.publishInfo"), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async() => {
        let data = {
          offerVersionIds: [row.offerVersionId]
        }
        this.loading = true
        const res = await publishPayableFuelRateApi(data)
        this.loading = false
        if (res.ok) {
          this.getList()
          this.$message.success(this.$t("uexpressPriceCard.publishSuccess"))
        }
      }).catch(() => {})
    },
    deleteFn(row) {
      this.$confirm(this.$t("uexpressPriceCard.deleteInfo"), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async() => {
        let data = {
          offerVersionIds: [row.offerVersionId]
        }
        this.loading = true
        const res = await deletePayableFuelRateApi(data)
        this.loading = false
        if (res.ok) {
          this.getList()
          this.$message.success(this.$t("uexpressPriceCard.deleteSuccess"))
        }
      }).catch(() => {})
    },
		reset() {
			this.formData = this.$extends({}, this.defaultFilter)
			this.getList()
		},
    offlineFn(row) {
      this.$confirm(this.$t("uexpressPriceCard.offlineInfo"), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async() => {
        let data = {
          offerVersionId: row.offerVersionId,
          effectiveDate: row.effectiveDateBegin,
          expireTime: row.effectiveDateBegin > new Date().getTime() ? (Number(row.effectiveDateBegin) + 1000) : new Date().getTime()
        }
        this.loading = true
        offlineExpireTimePayableFuelRateApi(data).then(res => {
          if (res.ok) {
            this.$message.success(this.$t("uexpressPriceCard.offlineSuccess"))
            this.visible = false
            this.getList()
          }
          this.loading = false
        })
      }).catch(() => {})
    }
	}
}
</script>
<style lang="scss" scoped>
.contract-search {
	::v-deep .el-select {
		width: 180px;
	}
	::v-deep .el-input {
		width: 180px;
	}
}
.link {
	color: #1890ff;
}
.offerNoLeft{
  margin-left: 22px;
}
</style>

