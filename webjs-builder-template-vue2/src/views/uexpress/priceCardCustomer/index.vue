<template>
  <div  class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("uexpressPriceCard.offerNo")' prop="offerNo">
							<el-input v-model="formData.offerNo" type="text" size="mini"  clearable @keyup.enter.native="list" />
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.offerName")' prop="offerName">
							<el-input v-model="formData.offerName" type="text" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label='$t("uexpressPriceCard.offerState")' prop="offerState">
							<el-select v-model="formData.offerState" size="mini" style="width: 100%"  @change="list">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="item in cardStateList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.customerName")' prop="customerId">
              <type-select v-model="formData.customerId" type="customer" @selected="list" :requestParams="{businessType: 'INTERNATIONAL_LINE'}"/>
            </el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.effectiveDatePeriod")' prop="effectiveDatePeriod">
							<search-date-picker v-model="formData.effectiveDatePeriod" @change="list" clearable></search-date-picker>
            </el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addFn">{{$t("uexpressPriceCard.add")}}</el-button>
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
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

        <el-table-column fixed="left" type="selection" width="40" />
        <el-table-column prop="offerNo" :label='$t("uexpressPriceCard.offerNo")' min-width="150">
          <template slot-scope="{row}">
            <span :class="!row.hasChildren && !row.isChildren ? 'offerNoLeft' : ''">{{row.offerNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="version" :label='$t("uexpressPriceCard.version")' min-width="80"></el-table-column>
        <el-table-column prop="offerName" :label='$t("uexpressPriceCard.offerName")' show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="customerName" :label='$t("uexpressPriceCard.customerName")' min-width="220"></el-table-column>
        <el-table-column prop="effectiveDateBegin" :label='$t("uexpressPriceCard.effectiveDateFrom")' min-width="150"> </el-table-column>
        <el-table-column prop="effectiveDateEnd" :label='$t("uexpressPriceCard.effectiveDateTo")'  min-width="150"> </el-table-column>
        <el-table-column prop="offerStateName" :label='$t("uexpressPriceCard.offerState")'  min-width="150"></el-table-column>
        <el-table-column prop="createByName" :label='$t("uexpressPriceCard.createByName")' show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="createTime" :label='$t("uexpressPriceCard.createTime")' min-width="150"></el-table-column>
        <el-table-column fixed="right" prop="operation" :label='$t("uexpressPriceCard.operation")' min-width="260">
          <template slot-scope="{row}">
            <a class="link" @click="editBaseFn(row)" v-if="row.offerState === 10 || row.offerState === 20">{{$t("uexpressPriceCard.update")}}</a>
            <a class="link" @click="editPriceFn(row)" v-if="row.offerState === 10 || row.offerState === 20 || (row.offerState === 25 && role === 'PRODUCT')">{{$t("uexpressPriceCard.updatePrice")}}</a>
            <a class="link" @click="importPriceFn(row)" v-if="row.offerState === 10 || row.offerState === 20 || (row.offerState === 25 && role === 'PRODUCT')">导入报价</a>
            <a class="link" @click="submitFn(row)" v-if="row.offerState === 20">{{$t("uexpressPriceCard.submitAudit")}}</a>
            <a class="link" @click="auditFn(row)" v-if="row.offerState === 25 && role === 'PRODUCT'" >{{$t("uexpressPriceCard.auditPrice")}}</a>
            <a class="link" @click="offlineFn(row)" v-if="row.offerState === 50 || row.offerState === 51 || row.offerState === 52" >{{$t("uexpressPriceCard.offlinePrice")}}</a>
            <a class="link" @click="adjustFn(row)" v-if="row.offerState === 50 || row.offerState === 51 || row.offerState === 52" >{{$t("uexpressPriceCard.adjustPrice")}}</a>
            <a class="link" @click="deleteFn(row)" v-if="row.offerState === 10 || row.offerState === 20 || row.offerState === 25" >{{$t("uexpressPriceCard.delete")}}</a>
            <a class="link" @click="viewFn(row)" >{{$t("uexpressPriceCard.view")}}</a>
          </template>
        </el-table-column>
      </el-table>
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>

    <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressPriceCard.batch_import")'>
      <el-form class="contact-form" ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn">{{$t("uexpressPriceCard.customerPriceImportTemplate")}}</el-button>
        </div>
        <el-form-item label='excel' prop="offerCustomerExcel">
          <upload-file v-model="importForm.offerCustomerExcel" accept=".xls,.xlsx" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchImportVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" :loading="batchImportLoading" @click="batchImportConfirmFn">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="adjustVisible" :close-on-click-modal="false" width="600px" :title='$t("uexpressPriceCard.adjustPrice")'>
      <el-form class="contact-form" ref="adjustRef" :model="adjustForm" :rules="adjustFormRule" label-width="120px" size="mini">
        <el-form-item :label='$t("uexpressPriceCard.effectiveDatePeriodEnd")' prop="effectiveDatePeriod">
          <search-date-picker v-model="adjustForm.effectiveDatePeriod" type="datetime" clearable></search-date-picker>
        </el-form-item>
        <div style="padding: 0 30px 0 30px;line-height: 25px;">{{$t("uexpressPriceCard.adjustInfo")}}</div>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="adjustVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" :loading="adjustLoading" @click="adjustConfirmFn">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import {
  getOfferCustomerProductListApi,
  getOfferCustomerSaleListApi,
  getOfferCustomerHistoryApi,
  submitOfferCustomerApi,
  deleteOfferCustomerApi,
  auditOfferCustomerApi,
  adjustInitOfferCustomerApi,
  offlineOfferCustomerApi,
  importCustomerPriceApi
  } from "@/api/uexpress/priceCardCustomer";
import { getDictListApi, getTemplateFileApi } from "@/api/uexpress/base";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "UexpressPriceCardCustomerReceipt",
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
	data() {
		return {
			formData: {
        offerNo: '',
        offerName: '',
        customerId: '',
        offerState: '',
        version: '',
        effectiveDatePeriod: []
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			tableData: [],
			loading: false,
      cardStateList: [],

      selectedItem: {},

      // 批量导入
      batchImportLoading: false,
      batchImportVisible: false,
      importForm: {
        offerCustomerExcel: []
      },
      importFormRule: {
        offerCustomerExcel: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },

      // 调整价卡
      adjustLoading: false,
      adjustVisible: false,
      adjustForm: {
        effectiveDatePeriod: []
      },
      adjustFormRule: {
        effectiveDatePeriod: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
		};
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictListApi(34)]).then(results => {
				const cardStateRes = results[0]
				if (cardStateRes.ok) {
					this.cardStateList = cardStateRes.content
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
		async list() {
			this.loading = true;
			const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
       if (this.formData.effectiveDatePeriod.length) {
				params.effectiveDateBegin = this.formData.effectiveDatePeriod[0] || "";
				params.effectiveDateEnd = this.formData.effectiveDatePeriod[1] || "";
			}
      let fn = null
      if (this.role === 'SALE') {
        fn = getOfferCustomerSaleListApi
      } else {
        fn = getOfferCustomerProductListApi
      }
			const res = await fn(params)
			if (res.ok) {
				res.content.list.forEach(function (item, index) {
          item.index = index + 1
          item.createTime = parseTime(item.createTime, "{y}-{m}-{d} {h}:{i}:{s}");
          item.effectiveDateBegin = parseTime(item.effectiveDateBegin, "{y}-{m}-{d} {h}:{i}:{s}");
          item.effectiveDateEnd = parseTime(item.effectiveDateEnd, "{y}-{m}-{d} {h}:{i}:{s}");
          item.hasChildren = item.historyVersionCount > 1
          item.version = 'V' + item.version
				});
				this.total = parseInt(res.content.total, 10);
				this.tableData = []
				this.$nextTick(() => {
					this.tableData = res.content.list
				})
			} else {
				this.total = 0;
				this.tableData = [];
			}
			this.loading = false;
		},
		loadFn(tree, treeNode, resolve) {
			getOfferCustomerHistoryApi(tree.offerId).then(res => {
				let arr = []
				if (res.content) {
          // 构造出唯一的offerId 与父级的不同即可
					res.content.forEach(function (v, index) {
            v.offerId = v.offerId + (new Date().getTime() + '' + index)
						v.id = index + new Date().getTime()
						v.isChildren = true
            v.effectiveDateBegin = parseTime(v.effectiveDateBegin, "{y}-{m}-{d} {h}:{i}:{s}");
            v.effectiveDateEnd = parseTime(v.effectiveDateEnd, "{y}-{m}-{d} {h}:{i}:{s}");
						v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
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
        name: "UexpressPriceCardCustomerReceiptAdd",
        query: {
          origin: this.origin,
          role: this.role
        }
      });
    },
    viewFn(row) {
      this.$router.push({
        name: "UexpressPriceCardCustomerReceiptDetail",
        query: {
          offerVersionId: row.offerVersionId,
          origin: this.origin
        }
      });
    },
		reset() {
			this.$refs.formData.resetFields();
			this.list();
		},
    editBaseFn(row) {
      this.$router.push({
        name: "UexpressPriceCardCustomerReceiptEdit",
        query: {
          offerVersionId: row.offerVersionId,
          origin: this.origin,
          role: this.role
        }}
      );
    },
    editPriceFn(row) {
      this.$router.push({
        name: "UexpressPriceCardCustomerReceiptEditPirce",
        query: {
          offerVersionId: row.offerVersionId,
          origin: this.origin,
          role: this.role
        }}
      );
    },
    // 下载导入报价模板
    downloadTemplateFn() {
      getTemplateFileApi(8).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    // 导入报价
    importPriceFn(row) {
      this.selectedItem = row
      this.importForm = {
        offerCustomerExcel: []
      }
      this.batchImportVisible = true
    },
    // 导入报价 确认
    batchImportConfirmFn() {
      this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            offerVersionId: this.selectedItem.offerVersionId,
            ...this.importForm
          }
          data.offerCustomerExcel = data.offerCustomerExcel[0]
          this.batchImportLoading = true
          importCustomerPriceApi(data).then(res => {
            if (res.ok) {
              this.batchImportVisible = false
              this.$message.success(this.$t('uexpressProduct.import_oper_success'))
            }
            this.batchImportLoading = false
          })
        }
      })
    },
    offlineFn(row) {
      this.$confirm(this.$t("uexpressPriceCard.offlineInfo"), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async() => {
        let data = {
          offerVersionIds: [row.offerVersionId]
        }
        this.loading = true
        const res = await offlineOfferCustomerApi(data)
        this.loading = false
        if (res.ok) {
          this.list()
          this.$message.success(this.$t("uexpressPriceCard.offlineSuccess"))
        }
      }).catch(() => {})
    },
    adjustFn(row) {
      this.adjustVisible = true
      this.selectedItem = row
      this.adjustForm = {
        effectiveDatePeriod: []
      }
    },
    adjustConfirmFn() {
      this.$refs.adjustRef.validate(async valid => {
        if (valid) {
          if (!this.adjustForm.effectiveDatePeriod[0] || !this.adjustForm.effectiveDatePeriod[1]) {
            this.$message.error(this.$t("uexpressPriceCard.effectiveDatePeriodEndError"))
            return false
          }
          let data = {
            sourceOfferVersionId: this.selectedItem.offerVersionId,
            effectiveDateFrom: this.adjustForm.effectiveDatePeriod[0],
            effectiveDateTo: this.adjustForm.effectiveDatePeriod[1]
          }
          this.adjustLoading = true
          const res = await adjustInitOfferCustomerApi(data)
          this.adjustLoading = false
          this.adjustVisible = false
          if (res.ok) {
            this.$router.push({
              name: "UexpressPriceCardCustomerReceiptAdjustPirce",
              query: {
                offerVersionId: res.content.offerVersionId,
                origin: this.origin
              }}
            );
          }
        }
      })
    },
    auditFn(row) {
      this.$confirm(this.$t("uexpressPriceCard.auditInfo"), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async() => {
        let data = {
          offerVersionId: row.offerVersionId
        }
        this.loading = true
        const res = await auditOfferCustomerApi(data)
        this.loading = false
        if (res.ok) {
          this.list()
          this.$message.success(this.$t("uexpressPriceCard.auditSuccess"))
        }
      }).catch(() => {})
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
        const res = await submitOfferCustomerApi(data)
        this.loading = false
        if (res.ok) {
          this.list()
          this.$message.success(this.$t("uexpressPriceCard.submitSuccess"))
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
        const res = await deleteOfferCustomerApi(data)
        this.loading = false
        if (res.ok) {
          this.list()
          this.$message.success(this.$t("uexpressPriceCard.deleteSuccess"))
        }
      }).catch(() => {})
    }
	}
};
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
