<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getList" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" size="mini" label-width="100px" class="contract-search">
            <el-form-item :label='$t("uexpressPriceCard.offerNo")' prop="offerNo">
							<el-input v-model="formData.offerNo" type="text" size="mini"  clearable @keyup.enter.native="getList" />
						</el-form-item>
            <el-form-item :label='$t("uexpressPriceCard.offerName")' prop="offerName">
							<el-input v-model="formData.offerName" type="text" size="mini"  clearable @keyup.enter.native="getList" />
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.offerState")' prop="offerState">
							<el-select v-model="formData.offerState" size="mini" style="width: 100%"  @change="getList">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="item in cardStateList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.destinationCountry")' prop="destinationCountryCode">
							<el-select v-model="formData.destinationCountryCode" size="mini" style="width: 100%" filterable clearable  @change="getList">
                <el-option v-for="item in countryList" :key="item.code2" :label="item.chineseName" :value="item.code2"/>
              </el-select>
            </el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.supplierName")' prop="supplierId">
              <type-select v-model="formData.supplierId" type="supplier" @selected="getList" :request-params="{partnerRole: '17011'}"/>
            </el-form-item>
            <el-form-item :label='$t("uexpressPriceCard.bulkyModulus")' prop="bulkyModulus">
							<el-input v-model="formData.bulkyModulus" type="text" size="mini" />
						</el-form-item>
            <el-form-item :label="$t('uexpressPriceCard.createByName')" prop="createBy">
							<type-select v-model="formData.createBy" type="user" />
						</el-form-item>
            <el-form-item :label='$t("uexpressPriceCard.effectiveDatePeriod")' prop="effectiveDatePeriod">
							<search-date-picker v-model="formData.effectiveDatePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="table-wrap">
      <div style="padding: 0px 0 10px 0;" class="top-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addFn">{{$t("uexpressPriceCard.add")}}</el-button>
        <el-button type="primary" size="mini" @click="uploadFn">{{$t("uexpressPriceCard.uploadPriceCard")}}</el-button>
        <el-button type="primary" size="mini" v-if="false" @click="batchOfflineFn">{{$t("uexpressPriceCard.batchOfflinePrice")}}</el-button>
         <el-button type="primary" size="mini" @click="batchPublishFn">{{$t("uexpressPriceCard.batchPublishPrice")}}</el-button>
        <el-button type="primary" size="mini" @click="batchSubmitFn">{{$t("uexpressPriceCard.batchSubmitPrice")}}</el-button>
        <el-button type="primary" size="mini" @click="exportFn">{{$t("uexpressPriceCard.export")}}</el-button>
      </div>

      <el-table
        class="yht-table yht-aggird-table"
        v-if="!loading"
        :data="tableData"
        :height="tableHeight"
        style="width: 100%;"
        row-key="offerId"
        border
        size="mini"
        lazy
        :load="loadFn"
        @selection-change="handleSelectionChange"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column fixed="left" type="selection" width="40" />
        <el-table-column prop="offerNo" :label='$t("uexpressPriceCard.offerNo")' min-width="150">
          <template slot-scope="{row}">
            <span :class="!row.hasChildren && !row.isChildren ? 'offerNoLeft' : ''">{{row.offerNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="version" :label='$t("uexpressPriceCard.version")' min-width="80" />
        <el-table-column prop="offerName" :label='$t("uexpressPriceCard.offerName")' min-width="130" show-overflow-tooltip />
        <el-table-column prop="supplierName" :label='$t("uexpressPriceCard.supplierName")' min-width="220" show-overflow-tooltip />
        <el-table-column prop="productName" :label='$t("uexpressPriceCard.productName")' min-width="180" show-overflow-tooltip />
        <el-table-column prop="destinationCountryName" :label='$t("uexpressPriceCard.destinationCountry")' show-overflow-tooltip min-width="100" />
        <el-table-column prop="effectiveDateBeginStr" :label='$t("uexpressPriceCard.effectiveDateFrom")' min-width="150" />
        <el-table-column prop="effectiveDateEndStr" :label='$t("uexpressPriceCard.effectiveDateTo")'  min-width="150" />
        <el-table-column prop="offerStateName" :label='$t("uexpressPriceCard.offerStateName")'  min-width="130" />
        <el-table-column prop="bulkyModulus" :label='$t("uexpressPriceCard.bulkyModulus")' show-overflow-tooltip min-width="100" />
        <el-table-column prop="createByName" :label='$t("uexpressPriceCard.createByName")' show-overflow-tooltip min-width="100" />
        <el-table-column prop="createTime" :label='$t("uexpressPriceCard.createTime")' min-width="150" />
        <el-table-column fixed="right" prop="operation" :label='$t("uexpressPriceCard.operation")' min-width="240">
          <template slot-scope="{row}">
            <a class="link" @click="editBaseFn(row)" v-if="row.offerState === 20 || row.offerState === 10">{{$t("uexpressPriceCard.update")}}</a>
            <a class="link" @click="editPriceFn(row)" v-if="row.offerState === 20 || row.offerState === 10">{{$t("uexpressPriceCard.updatePrice")}}</a>
            <a class="link" @click="submitFn(row)" v-if="checkSubmitFn(row)">{{$t("uexpressPriceCard.submit")}}</a>
            <a class="link" @click="publishFn(row)" v-if="checkPublishFn(row)" >{{$t("uexpressPriceCard.publish")}}</a>
            <a class="link" @click="copyFn(row)" v-if="checkCopyFn(row)" >{{$t("uexpressPriceCard.copyPrice")}}</a>
            <a class="link" @click="adjustFn(row)" v-if="checkAdjustFn(row)" >{{$t("uexpressPriceCard.adjustPrice")}}</a>
            <a class="link" @click="offlineFn(row)" v-if="checkOfflineFn(row)" >{{$t("uexpressPriceCard.offlinePrice")}}</a>
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
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn(26)">{{$t("uexpressPriceCard.uploadPriceCardTemplate")}}</el-button>
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

    <batch-oper-price-card-dialog ref="batchOperPriceCardDialogRef" @ok="getList"/>
    <offline-price-card-dialog ref="offlinePriceCardDialogRef" @ok="getList"/>
  </div>
</template>
<script>
import {
  getOfferSupplierProductListApi,
  getOfferSupplierSaleListApi,
  getOfferSupplierHistoryListApi,
  submitOfferSupplierApi,
  publishOfferSupplierApi,
  auditOfferSupplierApi,
  offlineOfferSupplierApi,
  deleteOfferSupplierApi,
  adjustInitOfferSupplierApi,
  importOfferSupplierApiApi,
  exportOfferSupplierApiApi
} from '@/api/uexpress/priceCardSupplier'
import { getDictListApi, getTemplateFileApi } from "@/api/uexpress/base";
import { parseTime } from "@/utils"
import { getCountryListApi } from '@/api/country'
import BatchOperPriceCardDialog from '@/views/uexpress/components/BatchOperPriceCardDialog'
import OfflinePriceCardDialog from '@/views/uexpress/priceCardCustomerLast/components/OfflinePriceCardDialog'

export default {
	name: 'UexpressPriceCardSupplierPayable',
	props: {
		role: {
			type: String,
			default: ''
		},
		origin: {
			type: String,
			default: ''
		}
	},
  components: {
    BatchOperPriceCardDialog,
    OfflinePriceCardDialog
  },
	data() {

		const formData = {
      createBy: '',
      offerNo: '',
      bulkyModulus: "",
      offerName: '',
      offerState: '',
      productCode: '',
      destinationCountryCode: '',
      effectiveDatePeriod: [],
      productType: '',
      version: '',
      supplierId: '',
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
      }
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
    checkAdjustFn(row) {
      return [50, 51, 52, 53, 90].indexOf(row.offerState) >= 0
    },
    checkCopyFn(row) {
      return [20, 30, 50, 51, 52, 90].indexOf(row.offerState) >= 0
    },
    checkPublishFn(row) {
      return row.offerState === 30
    },
    checkSubmitFn(row) {
      return row.offerState === 20
    },
    checkAuditFn(row) {
      return row.offerState === 25 && this.role === 'PRODUCT'
    },
    checkOfflineFn(row) {
      return row.offerState === 50 || row.offerState === 51 || row.offerState === 52
    },
    exportFn() {
      this.loading = true
      let params = this.getParams()
      exportOfferSupplierApiApi(params).then(res => {
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
          importOfferSupplierApiApi(data).then(res => {
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
      // let stateCode = this.role === 'SALE' ? 35 : 33
      let stateCode = this.role === 'SALE' ? 33 : 33
			Promise.all([getDictListApi(stateCode), getCountryListApi()]).then(results => {
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
      if (this.role === 'SALE') {
        fn = getOfferSupplierSaleListApi
      } else {
        fn = getOfferSupplierProductListApi
      }
      this.tableData = []
			const res = await fn(params)
			if (res.ok) {
				res.content.list.forEach(function (v) {
					v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
					v.effectiveDateBeginStr = parseTime(v.effectiveDateBegin, '{y}-{m}-{d} {h}:{i}:{s}')
					v.effectiveDateEndStr = parseTime(v.effectiveDateEnd, '{y}-{m}-{d} {h}:{i}:{s}')
          v.hasChildren = v.historyVersionCount > 1
          v.version = 'V' + v.version
				})
				setTimeout(() => {
          console.log(res.content.list)
          this.$set(this, 'tableData', res.content.list)
        }, 0);
				this.total = Number(res.content.total)
			} else {
				this.tableData = []
				this.total = 0
			}
      this.loading = false
		},
		loadFn(tree, treeNode, resolve) {
			getOfferSupplierHistoryListApi(tree.offerId).then(res => {
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
      this.$router.push({
        name: "UexpressPriceCardSupplierPayableAdd",
        query: {
          origin: this.origin
        }
      });
    },
    copyFn(row) {
      this.$router.push({
        name: "UexpressPriceCardSupplierPayableCopyPrice",
        query: {
          offerVersionId: row.offerVersionId,
          origin: this.origin
        }}
      );
    },
    viewFn(row) {
      this.$router.push({
        name: "UexpressPriceCardSupplierPayableDetail",
        query: {
          offerVersionId: row.offerVersionId,
          origin: this.origin
        }
      });
    },
    editBaseFn(row) {
      this.$router.push({
        name: "UexpressPriceCardSupplierPayableEdit",
        query: {
          offerVersionId: row.offerVersionId,
          origin: this.origin
        }}
      );
    },
    editPriceFn(row) {
      this.$router.push({
        name: "UexpressPriceCardSupplierPayableEditPirce",
        query: {
          offerVersionId: row.offerVersionId,
          origin: this.origin
        }}
      );
    },
    submitFn(row) {
      this.$confirm(this.$t("uexpressPriceCard.submitInfo"), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async() => {
        let data = {
          offerVersionIds: [row.offerVersionId]
        }
        this.loading = true
        const res = await submitOfferSupplierApi(data)
        this.loading = false
        if (res.ok) {
          this.getList()
          this.$message.success(this.$t("uexpressPriceCard.submitSuccess"))
        }
      }).catch(() => {})
    },
    offlineFn(row) {
      this.$refs.offlinePriceCardDialogRef.show('SUPPLIER', row)
      // this.$confirm(this.$t("uexpressPriceCard.offlineInfo"), this.$t('common.mention'), {
      //   confirmButtonText: this.$t('common.confirm'),
      //   cancelButtonText: this.$t('common.cancel'),
      //   type: 'warning'
      // }).then(async() => {
      //   let data = {
      //     offerVersionIds: [row.offerVersionId]
      //   }
      //   this.loading = true
      //   const res = await offlineOfferSupplierApi(data)
      //   this.loading = false
      //   if (res.ok) {
      //     this.getList()
      //     this.$message.success(this.$t("uexpressPriceCard.offlineSuccess"))
      //   }
      // }).catch(() => {})
    },
    adjustFn(row) {
      this.$confirm(this.$t("uexpressPriceCard.adjustInfo"), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async() => {
        let data = {
          sourceOfferVersionId: row.offerVersionId
        }
        this.loading = true
        const res = await adjustInitOfferSupplierApi(data)
        this.loading = false
        if (res.ok) {
          this.$router.push({
            name: "UexpressPriceCardSupplierPayableAdjustPrice",
            query: {
              offerVersionId: res.content.offerVersionId,
              origin: this.origin
            }}
          );
        }
      }).catch(() => {})
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
        const res = await publishOfferSupplierApi(data)
        this.loading = false
        if (res.ok) {
          this.getList()
          this.$message.success(this.$t("uexpressPriceCard.publishSuccess"))
        }
      }).catch(() => {})
    },
    auditFn(row) {
      this.$confirm(this.$t("uexpressPriceCard.auditInfo"), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async() => {
        let data = {
          offerVersionIds: [row.offerVersionId]
        }
        this.loading = true
        const res = await auditOfferSupplierApi(data)
        this.loading = false
        if (res.ok) {
          this.getList()
          this.$message.success(this.$t("uexpressPriceCard.auditSuccess"))
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
        const res = await deleteOfferSupplierApi(data)
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
    // 批量发布
    batchPublishFn() {
      let selectedRows = this.multipleSelection;
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("uexpressPriceCard.pleaseSelectOne"));
        return;
      }
      let ids = []
      let check = true
      selectedRows.forEach(v => {
        ids.push(v.offerVersionId)
        if (!this.checkPublishFn(v)) {
          check = false
        }
      })
      if (!check) {
        this.$message.error(this.$t("uexpressPriceCard.batchPublishError"));
        return;
      }
      this.$refs.batchOperPriceCardDialogRef.show({
        oper: 'uexpressPriceCard.batchPublishPrice',
        ids: ids,
        api: publishOfferSupplierApi
      })
    },
    // 批量提交
    batchSubmitFn() {
      let selectedRows = this.multipleSelection;
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("uexpressPriceCard.pleaseSelectOne"));
        return;
      }
      let ids = []
      let check = true
      selectedRows.forEach(v => {
        ids.push(v.offerVersionId)
        if (!this.checkSubmitFn(v)) {
          check = false
        }
      })
      if (!check) {
        this.$message.error(this.$t("uexpressPriceCard.batchSubmitError"));
        return;
      }
      this.$refs.batchOperPriceCardDialogRef.show({
        oper: 'uexpressPriceCard.batchSubmitPrice',
        ids: ids,
        api: submitOfferSupplierApi
      })
    },
    // 批量下线
    batchOfflineFn() {
      let selectedRows = this.multipleSelection;
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("uexpressPriceCard.pleaseSelectOne"));
        return;
      }
      let ids = []
      let check = true
      selectedRows.forEach(v => {
        ids.push(v.offerVersionId)
        if (!this.checkOfflineFn(v)) {
          check = false
        }
      })
      if (!check) {
        this.$message.error(this.$t("uexpressPriceCard.batchOfflineError"));
        return;
      }
      this.$refs.batchOperPriceCardDialogRef.show({
        oper: 'uexpressPriceCard.batchOfflinePrice',
        ids: ids,
        api: offlineOfferSupplierApi
      })
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

