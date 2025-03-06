<template>
  <div class="main-container-wrapper" v-loading="loading">
    <div class="right-main-wrapper">
      <div class="search-container">
        <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
          <el-form-item :label="$t('rateFms.office_name')" prop="officeId">
              <el-select v-model="formData.officeId" size="mini" @change="list">
                <el-option v-for="office in officeList" :key="office.value" :label="office.label" :value="office.value" />
              </el-select>
            </el-form-item>
          <el-form-item :label="$t('rateFms.year')" prop="year">
            <el-date-picker size="mini" v-model="formData.year" type="year" @change="list"></el-date-picker>
          </el-form-item>
          <el-button type="primary" size="mini" @click="addFn()" style="float: right;margin-top: 5px;">{{$t('rateFms.add')}}</el-button>
        </el-form>
      </div>

      <el-tabs tab-position="left" class="tab-container" v-model="tabsValue">
        <el-tab-pane v-for="item in monthList" :key="item.monthValue" :name="item.monthValue + ''" :label="item.monthValue + '月' + (item.status || '')">
          <div class="title">
            {{$t('rateFms.rate_list')}}
            <el-button type="primary" size="mini" @click="publish(item)" v-if="item.rateState === 1" style="float: right;">发布</el-button>
            <el-button size="mini" type="primary" @click="editFn(item)"  v-if="item.rateState === 1"  style="float: right;margin-right: 10px;">{{$t('common.editBtn')}}</el-button>
          </div>
          <el-table :data="item.exchangeRats" style="width: 100%" border>
            <el-table-column prop="currencySource" :label="$t('rateFms.currency_source')" >
              <template slot-scope="{ row }">
                <div class="currency-show">
                  <img :src="'/static/' + row.currencySource + '.jpg'" style="width: 20px"/>
                  <span>{{row.currencySource}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="currencyTarget" :label="$t('rateFms.currency_target')" >
              <template slot-scope="{ row }">
                <div class="currency-show">
                  <img :src="'/static/' + row.currencyTarget + '.jpg'" style="width: 20px"/>
                  <span>{{row.currencyTarget}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="exchangeRateFin" :label="$t('rateFms.rate')" ></el-table-column>
            <el-table-column prop="validityDateBeginStr" :label="$t('rateFms.validity_date_begin')" ></el-table-column>
            <el-table-column prop="validityDateEndStr" :label="$t('rateFms.validity_date_end')" ></el-table-column>
            <el-table-column prop="officeName" :label="$t('rateFms.office_name')" width="300"></el-table-column>
            <el-table-column prop="date" :label="$t('rateFms.operation')" >
              <template slot-scope="{ row }">
                <el-link @click="deleteFn(item, row)" type="primary" v-if="item.rateState === 1">{{$t('common.deleteBtn')}}</el-link>
                <el-link @click="adjustFn(item, row)" type="primary" v-if="item.rateState === 2">{{$t('rateFms.adjust')}}</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <el-dialog :visible.sync="isShowingCreateExchangeRateDialog" :title="$t('rateFms.rate_operation')" width="700px" @close="initData"  :close-on-click-modal="false">
        <el-form ref="exchangeRateRef" :model="onePeriodExchangeRate" :rules="onePeriodExchangeRateRules" label-width="90px" label-position="left">
          <el-form-item label="" style="margin-left: -90px;" v-if="false">
            <el-checkbox v-model="onePeriodExchangeRate.autoPostpone">{{$t('rateFms.auto_postpone')}}</el-checkbox>
          </el-form-item>
          <div style="overflow: hidden;">
            <el-form-item :label="$t('rateFms.office_name')" prop="officeId" style="width: 50%;float: left;">
              <el-select v-model="onePeriodExchangeRate.officeId" size="mini" :disabled="!!onePeriodExchangeRate.id">
                <el-option v-for="office in officeList" :key="office.value" :label="office.label" :value="office.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('rateFms.month_sp')" prop="month" style="width: 50%;float: left;">
                <CommonPicker
                 :disabled="!!onePeriodExchangeRate.id"
                  ref="month"
                  v-model="onePeriodExchangeRate.month"
                  parent-class="w-180"
                  size="mini"
                  picker-format="yyyy-MM"
                  pikcer-type="month"
                  @change="monthChange"
                  :clearable="false" />
            </el-form-item>
          </div>
          <el-form-item :label="$t('rateFms.effective_period')" prop="effectivePeriod">
            <search-date-picker	v-model="onePeriodExchangeRate.effectivePeriod" size="mini"></search-date-picker>
          </el-form-item>
          <el-form-item label="" style="margin-left: -90px;">
            <div style="max-height: 350px;overflow-y: auto;">
              <div v-for="(e, index) in exchangeRateArray" :key="index" style="display: flex;">
                <div style="padding-top:10px;"><el-button type="primary" size="mini" plain @click="addOneExchangeRate(e.identNum)"><i class="el-icon-plus" /></el-button></div>
                <div style="display: flex;justify-content: space-around;margin-left:45px;border:1px solid #dcdfe6;width:450px;padding: 10px;">
                  <div style="font-size:28px;">
                    <img v-if="e.currencySource" :src="'/static/' + e.currencySource + '.jpg'" style="width: 35px" />
                  </div>
                  <div>1</div>
                  <div>
                    <el-select v-model="e.currencySource" size="mini" style="width:90px;">
                      <el-option v-for="currency in currencyList" :key="currency.code" :label="currency.code" :value="currency.code" />
                    </el-select>
                  </div>
                  <div>=</div>
                  <div>
                    <el-select v-model="e.currencyTarget" size="mini" style="width:90px;">
                      <el-option v-for="currency in currencyList" :key="currency.code" :label="currency.code" :value="currency.code" />
                    </el-select>
                  </div>
                  <div><el-input v-model="e.exchangeRateFin" size="mini" style="width:110px;" /></div>
                  <div style="font-size:28px;">
                    <img v-if="e.currencyTarget" :src="'/static/' + e.currencyTarget + '.jpg'" style="width: 35px"/>
                  </div>
                </div>
                <div style="padding-top:10px;margin-left:50px;"><el-button type="danger" size="mini" plain @click="removeThisExchangeRate(index)"><i class="el-icon-minus" /></el-button></div>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelBtn()"> {{$t('rateFms.cancel')}} </el-button>
          <el-button v-permission="['mdm:rate:update']" type="primary" size="mini" @click="submitExchangeRate()" :loading="saveLoading"> {{$t('rateFms.save')}} </el-button>
        </span>
      </el-dialog>

      <el-dialog v-if="adjustVisible" :title="$t('rateFms.adjust')" :visible.sync="adjustVisible" width="700px"  @close="initData" :close-on-click-modal="false"	>
        <el-form ref="exchangeRateRef" :model="onePeriodExchangeRate" :rules="onePeriodExchangeRateRules" label-width="90px" label-position="left">
          <el-form-item label="" style="margin-left: -90px;" v-if="false">
            <el-checkbox v-model="onePeriodExchangeRate.autoPostpone" disabled >{{$t('rateFms.auto_postpone')}}</el-checkbox>
          </el-form-item>
          <div style="overflow: hidden;">
            <el-form-item :label="$t('rateFms.office_name')" prop="officeId" style="width: 50%;float: left;">
              <el-select v-model="onePeriodExchangeRate.officeId" size="mini" disabled>
                <el-option v-for="office in officeList" :key="office.value" :label="office.label" :value="office.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('rateFms.month_sp')" prop="month" style="width: 50%;float: left;">
                <CommonPicker
                  disabled
                  ref="month"
                  v-model="onePeriodExchangeRate.month"
                  parent-class="w-180"
                  size="mini"
                  picker-format="yyyy-MM"
                  pikcer-type="month"
                  :clearable="false" />
            </el-form-item>
          </div>
          <el-form-item :label="$t('rateFms.effective_period')" prop="effectivePeriod">
            <search-date-picker	v-model="onePeriodExchangeRate.effectivePeriod" size="mini"	disabledEnd :defaltLimit="onePeriodExchangeRate.defaltLimitPeriod" :clearable="false"></search-date-picker>
          </el-form-item>
          <el-form-item label="" style="margin-left: -90px;">
            <div style="max-height: 350px;overflow-y: auto;">
              <div v-for="(e, index) in exchangeRateArray" :key="index" style="display: flex;">
                <div style="display: flex;justify-content: space-around;margin-left:45px;border:1px solid #dcdfe6;width:450px;padding: 10px;">
                  <div style="font-size:28px;">
                    <img v-if="e.currencySource" :src="'/static/' + e.currencySource + '.jpg'" style="width: 35px" />
                  </div>
                  <div>1</div>
                  <div>
                    <el-select v-model="e.currencySource" size="mini" style="width:90px;" disabled>
                      <el-option v-for="currency in currencyList" :key="currency.code" :label="currency.code" :value="currency.code" />
                    </el-select>
                  </div>
                  <div>=</div>
                  <div>
                    <el-select v-model="e.currencyTarget" size="mini" style="width:90px;" disabled>
                      <el-option v-for="currency in currencyList" :key="currency.code" :label="currency.code" :value="currency.code" />
                    </el-select>
                  </div>
                  <div><el-input v-model="e.exchangeRateFin" size="mini" style="width:110px;" /></div>
                  <div style="font-size:28px;">
                    <img v-if="e.currencyTarget" :src="'/static/' + e.currencyTarget + '.jpg'" style="width: 35px"/>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelBtn()" size="mini">{{$t('rateFms.cancel')}}</el-button>
          <el-button type="primary" @click="adjustConfirmFn" size="mini" :loading="adjustLoading">{{$t('rateFms.confirm')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue"
import { getRateByYearApi, addRateApi, updateRateApi, publishRateApi, deleteRateApi, adjustRateApi } from "@/api/financial/fmsRate"
import { parseTime } from "@/utils/index"
import moment from "moment"
import { getYHTListApi } from '@/api/partner/base'
import { getCurrenciesListApi } from '@/api/common.js'

export default {
	name: "Customer",
	components: {
		AgGridVue
	},
	data() {
		const validatePeriod = (rule, value, callback) => {
			if (!value[0]) {
				callback(this.$t('receiveFms.cannot_be_null'))
			} else if (!value[1]) {
				callback(this.$t('receiveFms.cannot_be_null'))
			} else {
				callback()
			}
		}
		return {
			adjustVisible: false,
			tabsValue: '',
			officeList: [],
			currencyList: [],
			isShowingCreateExchangeRateDialog: false,
			onePeriodExchangeRateRules: {
				month: [{ required: true, message: this.$t('receiveFms.cannot_be_null') }],
				effectivePeriod: [{ required: true, message: this.$t('receiveFms.cannot_be_null') }, { validator: validatePeriod }],
				officeId: [{ required: true, message: this.$t('receiveFms.cannot_be_null') }]
			},
			onePeriodExchangeRate: {
				periodCode: '', // 期间、批次id号
				officeId: '',
				month: '',
				datePeriod: '', // 生效期间
				officeName: '',
				autoPostpone: false,
				effectivePeriod: [],
				defaltLimitPeriod: []
			},
			initOnePeriodExchangeRate: {},
			oneExchangeRate: {
				identNum: 0,
				id: -1,
				datePeriod: '',
				currencySource: '',
				currencyTarget: '',
				exchangeRateAp: '',
				exchangeRateAr: '',
				exchangeRateFin: '',
				exchangeRateInv: '',
				month: '',
				periodCode: '',
				startDate: '',
				endDate: '',
				tenantId: '',
				officeId: 0
			},
			exchangeRateArray: [],
			loading: false,
			monthList: [],
			formData: {
				year: new Date().getTime(),
				officeId: '1'
			},
			adjustLoading: false,
			saveLoading: false
		}
	},
	created() {
		this.tabsValue = moment(new Date()).month() + 1 + ''
		this.init()
		this.list()
	},
	methods: {
		init() {
			getYHTListApi().then(res => {
				if (res.ok) {
					this.officeList = res.content
				}
			})
			getCurrenciesListApi().then(res => {
				if (res.ok) {
					this.currencyList = res.content
				}
			})
		},
		list() {
			let data = {
				officeId: this.formData.officeId,
				year: new Date(this.formData.year).getFullYear()
			}
			getRateByYearApi(data).then(res => {
				if (res.ok) {
					let list = res.content || []
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
					list.forEach(v => {
						let index = moment(v.month).month()
						if (v.rateState === 1) {
							v.status = '（' + this.$t('rateFms.un_publish') + '）'
						}
						arr[index] = {
							...arr[index],
							...v
						}
						v.exchangeRats.forEach(rate => {
							rate.validityDateBeginStr = parseTime(rate.validityDateBegin, '{y}-{m}-{d}')
							rate.validityDateEndStr = parseTime(rate.validityDateEnd, '{y}-{m}-{d}')
							rate.officeName = v.officeName
						})
					})
					this.monthList = arr
				}
			})
		},
		deleteFn(item, row) {
			this.$confirm(this.$t('rateFms.is_delete_confirm'), this.$t('receiveFms.mention'), {
				confirmButtonText: this.$t('rateFms.confirm'),
				cancelButtonText: this.$t('rateFms.cancel'),
				type: 'warning'
			}).then(() => {
				let data = {
					...item
				}
				data.exchangeRats.forEach((v, index) => {
					if (v.id === row.id) {
						data.exchangeRats.splice(index, 1)
					}
				})
				updateRateApi(data).then(res => {
					if (res.ok) {
						this.list()
						this.$message.success(this.$t('rateFms.delete_success'))
					}
				})
			}).catch(() => {
			})
		},
		publish(item) {
			this.$confirm(this.$t('rateFms.is_delete_publish'), this.$t('receiveFms.mention'), {
				confirmButtonText: this.$t('rateFms.confirm'),
				cancelButtonText: this.$t('rateFms.cancel'),
				type: 'warning'
			}).then(() => {
				publishRateApi(item.id).then(res => {
					if (res.ok) {
						this.list()
						this.$message.success(this.$t('rateFms.publish_success'))
					}
				})
			}).catch(() => {
			})
		},
		// 月份改变
		monthChange() {
			let startDate = moment(this.onePeriodExchangeRate.month).startOf('month').valueOf()
			let endDate = moment(this.onePeriodExchangeRate.month).endOf('month').valueOf()
			this.onePeriodExchangeRate.effectivePeriod = [startDate, endDate]
		},
		// 调整
		adjustFn(item, row) {
			// this.adjustRow = row
			let beginTO = moment(Number(row.validityDateBegin)).subtract(-1, "days").valueOf()
			let currTO = moment().subtract(-1, "days").startOf('day').valueOf()
			// console.log(beginTO, currTO)
			let xRow = JSON.parse(JSON.stringify(row))
			this.exchangeRateArray = [xRow]
			this.onePeriodExchangeRate = {
				...this.onePeriodExchangeRate,
				...item,
				month: moment(item.month).valueOf(),
				effectivePeriod: ['', row.validityDateEnd],
				defaltLimitPeriod: [currTO > beginTO ? currTO : beginTO, row.validityDateEnd]
			}
			this.adjustVisible = true
		},
		adjustConfirmFn() {
			this.$refs.exchangeRateRef.validate(valid => {
				if (valid) {
					let flag = false
					this.exchangeRateArray.forEach(v => {
						if (!v.currencySource || !v.currencyTarget || !v.exchangeRateFin) {
							flag = true
						}
					})
					if (flag) {
						return this.$message.error(this.$t('rateFms.please_text_full_rate'))
					}
					let data = {
						validityDateBegin: this.onePeriodExchangeRate.effectivePeriod[0],
						rateId: this.exchangeRateArray[0].id,
						exchangeRateFin: this.exchangeRateArray[0].exchangeRateFin
					}
					this.adjustLoading = true
					adjustRateApi(data).then(res => {
						if (res.ok) {
							this.$message.success(this.$t('rateFms.adjust_success'))
							this.adjustVisible = false
							this.list()
							this.initData()
						}
						this.adjustLoading = false
					}).catch(() => {
						this.adjustLoading = false
					})
				}
			})

			// this.$refs.adjustFormRef.validate(valid => {
			// 	if (valid) {

			// 	}
			// })
		},
		// 新建
		addFn() {
			this.exchangeRateArray.push({ ...self.oneExchangeRate })
			this.isShowingCreateExchangeRateDialog = true
		},
		// 编辑
		editFn(item) {
			this.exchangeRateArray = JSON.parse(JSON.stringify(item.exchangeRats))
			if (this.exchangeRateArray === 0) {
				const newExchangeRate = { ...this.oneExchangeRate }
				this.exchangeRateArray.splice(1, 0, newExchangeRate)
			}
			this.onePeriodExchangeRate = {
				...this.onePeriodExchangeRate,
				...item,
				month: moment(item.month).valueOf(),
				effectivePeriod: [item.validityDateBegin, item.validityDateEnd]
			}
			this.isShowingCreateExchangeRateDialog = true
		},
		addOneExchangeRate() {
			const newExchangeRate = { ...this.oneExchangeRate }
			this.exchangeRateArray.push(newExchangeRate)
		},
		removeThisExchangeRate(index) {
			if (this.exchangeRateArray.length === 1) {
				return this.$message.error(this.$t('rateFms.need_one'))
			}
			this.exchangeRateArray.splice(index, 1)
		},
		submitExchangeRate() {
			this.$refs.exchangeRateRef.validate(valid => {
				if (valid) {
					let flag = false
					let isRepeat = false
					let map = []
					this.exchangeRateArray.forEach(v => {
						if (!v.currencySource || !v.currencyTarget || !v.exchangeRateFin) {
							flag = true
						}

						// 源币种和目标币种不能相同重复的数据
						if (map.indexOf(v.currencySource + v.currencyTarget) < 0) {
							map.push(v.currencySource + v.currencyTarget)
						} else {
							isRepeat = true
						}
					})
					if (isRepeat) {
						return this.$message.error(this.$t('rateFms.currency_source_target_repeat'))
					}
					if (flag) {
						return this.$message.error(this.$t('rateFms.please_text_full_rate'))
					}
					let data = {
						...this.onePeriodExchangeRate,
						month: moment(this.onePeriodExchangeRate.month).format('YYYYMM'),
						validityDateBegin: this.onePeriodExchangeRate.effectivePeriod[0],
						validityDateEnd: this.onePeriodExchangeRate.effectivePeriod[1],
						exchangeRats: this.exchangeRateArray
					}
					let fn = data.id ? updateRateApi : addRateApi
					let msg = data.id ? this.$t('rateFms.edit_success') : this.$t('rateFms.add_success')
					this.saveLoading = true
					fn(data).then(res => {
						if (res.ok) {
							this.$message.success(msg)
							this.cancelBtn()
							this.list()
						}
						this.saveLoading = false
					}).catch(() => {
						this.saveLoading = false
					})
				}
			})
		},
		initData() {
			this.onePeriodExchangeRate = { ...this.initOnePeriodExchangeRate }
			this.exchangeRateArray = []
		},
		cancelBtn() {
			this.initData()
			this.adjustVisible = false
			this.isShowingCreateExchangeRateDialog = false
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
	padding: 20px;
	margin-bottom: 20px;
}
.tab-container {
	background: #fff;
	padding: 20px;
}
.title {
	line-height: 60px;
	padding-left: 10px;
	font-size: 18px;
}
.currency-show {
	line-height: 22px;
	height: 22px;
	img {
		width: 20px;
		float: left;
		margin-right: 5px;
	}
	span {
		display: inline-block;
	}
}
::v-deep .el-tabs--left .el-tabs__item.is-left {
	text-align: left;
}
::v-deep .el-table--border th {
	background: #f5f7f7;
}
</style>
