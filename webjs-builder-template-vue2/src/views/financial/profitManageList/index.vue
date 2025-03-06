<template>
  <div class="main-container-wrapper" v-loading="loading">
    <div class="right-main-wrapper">
      <div class="search-container">
        <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
          <el-form-item :label="$t('fmsProfit.settlementOfficeName')" prop="settlementOfficeId">
            <el-select v-model="formData.settlementOfficeId" size="mini" @change="getMonth">
              <el-option v-for="office in officeList" :key="office.settlementOfficeId" :label="office.settlementOfficeName" :value="office.settlementOfficeId" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('fmsProfit.year')" prop="year">
            <el-select v-model="formData.year" size="mini" @change="getMonth">
              <el-option v-for="year in yearList" :key="year" :label="year" :value="year" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <el-tabs tab-position="left" class="tab-container" v-model="tabsValue" @tab-click="getList">
        <el-tab-pane v-for="item in monthList" :key="item.monthValue" :name="item.monthValue + ''">
          <span slot="label">
            <div class="month-tabs">
              {{item.monthValue + '月' + (item.status || '')}}
              <i v-if="item.closingState === 30" @click="closingCancelFn(item)" class="iconfont icon-yusuanguanzhangguanli-fill"/>
              <i v-if="item.closingState === 10" @click="closingFn(item)" class="iconfont icon-quxiaoyuemoguanzhang"/>
            </div>
          </span>
        </el-tab-pane>
        <el-table :data="dataList" class="yht-table" style="width: 100%" border size="mini">
            <el-table-column prop="seqNo" :label="$t('fmsProfit.seqNo')" min-width="60">
              <template slot-scope="{ $index }">
                <span>{{$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="businessTypeName" :label="$t('fmsProfit.businessTypeName')"  min-width="110"></el-table-column>
            <el-table-column prop="totalAmountAr" :label="$t('fmsProfit.totalAmountAr')"   min-width="250">
              <template slot-scope="{ row }">
                <span v-if="row.profitAmount">
                  <span v-for="(item, index) in row.profitAmount.arTotalAmounts" :key="index" style="display: inline-block;">
                    {{item.currency}}&nbsp;{{item.value | numberToThousands}} &nbsp;
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmountAp" :label="$t('fmsProfit.totalAmountAp')" min-width="250">
              <template slot-scope="{ row }">
                <span v-if="row.profitAmount">
                  <span v-for="(item, index) in row.profitAmount.apTotalAmounts" :key="index" style="display: inline-block;">
                    {{item.currency}}&nbsp;{{item.value | numberToThousands}} &nbsp;
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="profit" :label="$t('fmsProfit.profit')" min-width="250">
              <template slot-scope="{ row }">
                <span v-if="row.profitAmount">
                  <span v-for="(item, index) in row.profitAmount.totalProfitAmounts" :key="index" style="display: inline-block;">
                    {{item.currency}}&nbsp;{{item.value | numberToThousands}} &nbsp;
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="voucherNumber" :label="$t('fmsProfit.voucherNumber')" min-width="100">
              <template slot-scope="{ row }">
                <span>
                  {{row.voucherNumber.join('')}}
                  <i class="iconfont icon-modeedit" @click="voucherNumberFn(row)"/>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="date" :label="$t('fmsProfit.operation')" min-width="100" >
              <template slot-scope="{ row }">
                <el-link @click="exportFn(row)" type="primary">{{$t('fmsProfit.export')}}</el-link>
              </template>
            </el-table-column>
          </el-table>
      </el-tabs>

      <el-dialog :visible.sync="uploadVoucherNumberVisible" :title="$t('fmsProfit.voucherNumber')" width="450px"  :close-on-click-modal="false">
        <el-form ref="voucherNumberRef" :model="uploadVoucherNumberForm" :rules="uploadVoucherNumberFormRules" label-width="90px"  size="mini">
          <el-form-item :label="$t('fmsProfit.voucherNumber')" prop="voucherNumber">
            <el-input v-model="uploadVoucherNumberForm.voucherNumber" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="uploadVoucherNumberVisible = false"> {{$t('common.cancel')}} </el-button>
          <el-button type="primary" size="mini" @click="uploadVoucherNumberFn" :loading="uploadVoucherNumberLoading"> {{$t('common.confirm')}} </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue"
import { 
  getProfitClosingOfficeApi, 
  getProfitClosingOfficeMonthApi, 
  getProfitClosingDetailApi,
  profitClosingApi, // 关账
  profitClosingCancelApi, // 取消关账
  uploadVoucherNumberApi, // 上传凭证
  profitClosingExportApi
} from "@/api/financial/fmsProfitManage"
import moment from "moment"

export default {
	name: "FmsProfitManageList",
	components: {
		AgGridVue
	},
	data() {
		return {
			uploadVoucherNumberVisible: false,
			uploadVoucherNumberLoading: false,
			uploadVoucherNumberForm: {
        id: '',
        voucherNumber: ''
      },
			uploadVoucherNumberFormRules: {
        voucherNumber: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }]
      },
			tabsValue: '',
      dataList: [],
			officeList: [],
			yearList: [],
			loading: false,
			monthList: [],
			formData: {
				year: new Date().getFullYear(),
				settlementOfficeId: ''
			},
		}
	},
	created() {
		this.tabsValue = moment(new Date()).month() + 1 + ''
		this.init()
	},
	methods: {
		init() {
      getProfitClosingOfficeApi().then(res => {
        if(res.ok) {
          const groupByOfficeId = res.content.reduce((acc, item) => {
            const key = item.settlementOfficeId;
            acc[key] = acc[key] || {};
            acc[key].settlementOfficeId = item.settlementOfficeId
            acc[key].settlementOfficeName = item.settlementOfficeName
            acc[key].list = acc[key].list || [];
            acc[key].list.push(item);
            return acc;
          }, {});
          let officeList = []
          Object.keys(groupByOfficeId).forEach(v => {
            officeList.push(groupByOfficeId[v])
          })
          this.officeList = officeList
          this.formData.settlementOfficeId = officeList[0].settlementOfficeId
          this.initYear()
		      this.getMonth()
        }
      })
		},
    initYear() {
      let yearList = []
      this.officeList.forEach(v => {
        if(v.settlementOfficeId === this.formData.settlementOfficeId) {
          v.list.forEach(item => {
            yearList.push(item.closingYear)
          })
        }
      })
      this.yearList = yearList
    },
		getMonth() {
      let data = {
        settlementOfficeIds: [this.formData.settlementOfficeId],
        closingYear: this.formData.year
      }
			getProfitClosingOfficeMonthApi(data).then(res => {
				if (res.ok) {
					this.allDataList = res.content || []
					this.initMonth()
				}
			})
		},
    initMonth() {
      let arr = [{
          monthValue: 1
        }, {
          monthValue: 2
        }, {
          monthValue: 3
        }, {
          monthValue: 4
        }, {
          monthValue: 5
        }, {
          monthValue: 6
        }, {
          monthValue: 7
        }, {
          monthValue: 8
        }, {
          monthValue: 9
        }, {
          monthValue: 10
        }, {
          monthValue: 11
        }, {
          monthValue: 12
        }]
      this.allDataList.forEach(v => {
        if(v.closingYear === this.formData.year) {
          let index = v.closingMonth - 1
          arr[index] = {
            ...arr[index],
            ...v
          }
        }
      })
      this.monthList = arr
      this.getList()
    },
    getList() {
      let closingId = this.monthList[Number(this.tabsValue) - 1].id
      if(closingId) {
        getProfitClosingDetailApi(closingId).then(res => {
          if(res.ok) {
            res.content.forEach(v => {
              if(v.profitAmount && v.profitAmount.arTotalAmounts) {
                v.profitAmount.arTotalAmounts.sort((a, b) => a.currency.localeCompare(b.currency));
              }
              if(v.profitAmount && v.profitAmount.apTotalAmounts) {
                v.profitAmount.apTotalAmounts.sort((a, b) => a.currency.localeCompare(b.currency));
              }
              if(v.profitAmount && v.profitAmount.totalProfitAmounts) {
                v.profitAmount.totalProfitAmounts.sort((a, b) => a.currency.localeCompare(b.currency));
              }
            })

            this.dataList = res.content
          }
        })
      }
    },
    // 关账
		closingFn(row) {
			this.$confirm(this.$t('fmsProfit.closingInfo', {month: row.closingMonth}), this.$t('common.mention'), {
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel'),
				type: 'warning'
			}).then(() => {
				profitClosingApi(row.id).then(res => {
					if (res.ok) {
						this.getMonth()
						this.$message.success(this.$t('fmsProfit.closingSuccess'))
					}
				})
			}).catch(() => {
			})
		},
    // 取消关账
    closingCancelFn(row) {
      this.$confirm(this.$t('fmsProfit.closingCancelInfo', {month: row.closingMonth}), this.$t('common.mention'), {
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel'),
				type: 'warning'
			}).then(() => {
				profitClosingCancelApi(row.id).then(res => {
					if (res.ok) {
						this.getMonth()
						this.$message.success(this.$t('fmsProfit.closingCancelSuccess'))
					}
				})
			}).catch(() => {
			})
    },
    voucherNumberFn(row) {
      this.uploadVoucherNumberForm.id = row.id
      this.uploadVoucherNumberForm.voucherNumber = row.voucherNumber.join('')
      this.uploadVoucherNumberVisible = true
    },    
    uploadVoucherNumberFn() {
      this.$refs.voucherNumberRef.validate(valid => {
        if(valid) {
          uploadVoucherNumberApi(this.uploadVoucherNumberForm).then(res => {
            if(res.ok){
              this.getList()
              this.uploadVoucherNumberVisible = false
						  this.$message.success(this.$t('fmsProfit.uploadVoucherNumberSuccess'))
            } 
          })
        }
      })
    },
		// 导出
		exportFn(row) {
			this.loading = true
      let data = {
        closingId: row.id
      }
      profitClosingExportApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('fmsProfit.exportSuccess'))
        }
        this.loading = false
      })
		}
	}
}
</script>
<style lang="scss" scoped>
.main-container-wrapper {
	background: #eee;
}
.search-container {
	background: #fff;
	padding-top: 20px;
	margin-bottom: 20px;
}
.tab-container {
	background: #fff;
	padding: 20px;
}

.month-tabs{
  width: 70px;

  .iconfont {
    float: right;
    color: #1590ff;
  }
}
::v-deep .el-tabs--left .el-tabs__item.is-left {
	text-align: left;
}
::v-deep .el-tabs__item.is-active {
  color: #409EFF;
  background: rgba(64,158,255,0.3);
}
</style>
