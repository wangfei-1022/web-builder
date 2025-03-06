<template>
  <div class="sys-right-inner-wrap" v-loading="loading">
    <top-search-items-slot :searchFun="topSearch" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px" size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('spaceRule.shippingSpace.approx')}: `" prop="contractNo">
          <el-input v-trim v-model="multipleForm.contractNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('spaceRule.shippingSpace.shippingDepartment')}: `" prop="carrierCode">
          <cargo-limited-select
            placeholder=""
            :select-label="multipleForm.carrierName"
            :select-value="multipleForm.carrierCode"
            type="carrier"
            style="width: 100%;"
            @set="setCustomerInfo"
            clearable
          />
        </el-form-item>
        <el-form-item :label="`${$t('spaceRule.shippingSpace.route')}: `" prop="routeCode">
          <el-select v-model="multipleForm.routeCode"  @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in sealineList" :label="item.code" :value="item.code" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('spaceRule.shippingSpace.contractType')}: `" prop="contractIdentity">
          <el-select v-model="multipleForm.contractIdentity" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option label="NVO" value="1"></el-option>
            <el-option label="BCO" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('spaceRule.shippingSpace.bookingChannel')}: `" prop="bookingChannel">
          <el-select v-model="multipleForm.bookingChannel" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option label="EB" value="2"></el-option>
            <el-option label="SynConHub" value="1"></el-option>
<!--            <el-option label="外配" value="3"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('spaceRule.shippingSpace.termOfValidity')}: `" prop="contractTime">
          <el-date-picker
            v-model="multipleForm.contractTime"
            value-format="timestamp"
            type="daterange"
            range-separator="-"
            start-placeholder=""
            end-placeholder=""
            :default-time="['00:00:00', '23:59:59']"
            style="width: 178px"
            @change="topSearch"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="`${$t('spaceRule.shippingSpace.productPersonnel')}: `" prop="productOwner">
          <cargo-limited-select
            placeholder=""
            :select-label="multipleForm.user"
            :select-value="multipleForm.productOwner"
            type="user"
            style="width: 100%;"
            clearable
            @set="productOwnerSet"
          />
        </el-form-item>
        <!-- 状态-->
        <el-form-item :label="`${$t('spaceRule.spaceRuleList.statusText')}: `" prop="contractState">
          <el-select v-model="multipleForm.contractState" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option :label="$t('spaceRule.shippingSpace.inForce')" value="1"></el-option>
            <el-option :label="$t('spaceRule.shippingSpace.notEffective')" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="container-wrap table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" class="ml-10" @click="newClassContract">{{ $t('spaceRule.shippingSpace.newClassContract') }}</el-button>

      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsRight"
        :side-bar="sideBarDefs"

        :column-defs="columnDefsRight"
        :row-data="tableData.list"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="pageTotal" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getList" />
    </div>
<!--    新增合约-->
    <el-dialog :title="$t('spaceRule.shippingSpace.newContract')" :visible.sync="newContractDialog" :close-on-click-modal="false" :before-close="closeSendNewContract" width="700px">
      <el-form :inline="true" :model="newContractForm" @submit.native.prevent ref="newContractForm" class="newContractDialog">
<!--        约号-->
        <el-form-item :label="$t('spaceRule.shippingSpace.approx')" prop="contractNo" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
          <el-input  v-model="newContractForm.contractNo" v-input-auto="'upperCase'" v-trim :placeholder="$t('sea.pleaseEnter')" size="mini" />
        </el-form-item>
        <el-form-item :label="$t('spaceRule.shippingSpace.shippingDepartment')" prop="carrierCode" :rules="[{ required: true, message: `${$t('sea.pleaseEnter')}`, trigger: 'change' },]">
          <cargo-limited-select
            placeholder=""
            :select-label="newContractForm.englishName"
            :select-value="newContractForm.carrierCode"
            type="carrier"
            style="width: 100%;"
            clearable
            @set="(data)=>{
              $set(newContractForm,'carrierCode',data.englishShortname)
            }"
          />
        </el-form-item>
        <el-form-item :label="$t('spaceRule.shippingSpace.termOfValidity')" prop="contractTime" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },
        { validator: validatecontractTime, trigger: 'change' }]">
<!--          value-format="timestamp"-->
<!--          <el-date-picker-->
<!--            v-model="newContractForm.ETD2"-->
<!--            type="date"-->
<!--            placeholder="开始日期"-->
<!--            value-format="timestamp"-->
<!--            size="mini"-->
<!--            style="width: 120px"-->
<!--          >-->
<!--          </el-date-picker>-->
<!--          {{newContractForm.ETD3}}-->
<!--          <el-date-picker-->
<!--            v-model="newContractForm.ETD3"-->
<!--            type="date"-->
<!--            placeholder="结束日期"-->
<!--            value-format="timestamp"-->
<!--            size="mini"-->
<!--            style="width: 120px"-->
<!--          >-->
<!--          </el-date-picker>-->
          <el-date-picker
            ref="time"
            v-model="newContractForm.contractTime"
            type="daterange"
            range-separator="-"
            start-placeholder=""
            end-placeholder=""
            value-format="timestamp"
            size="mini"
            :default-time="['00:00:00', '23:59:59']"
            style="width: 178px"
            @change="contractTimeChange"
          >
<!--            @blur="pickerOptionsBlur"-->
<!--            :picker-options="pickerOptions"-->
<!--            :picker-options="{-->
<!--            selectableRange: startTimeRange,-->
<!--            disabledDate(time) {-->
<!--            return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000;-->
<!--            },-->
<!--            }"-->
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('spaceRule.shippingSpace.contractualSpace2')" prop="spaceTotal" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },]">
          <span style="margin-right: 5px">总</span><el-input  v-model="newContractForm.spaceTotal" v-input-limit="[999999,0]" v-trim @change="average" :placeholder="$t('sea.pleaseEnter')" size="mini" style="width: 68px"/>
          <span style="margin:0 5px 0 8px">周</span><el-input  v-model="newContractForm.spaceWeekAvg" v-input-limit="[999999,0]" v-trim :disabled="true" :placeholder="$t('spaceRule.shippingSpace.average')" size="mini" style="width: 68px"/>
        </el-form-item>
        <el-form-item :label="$t('spaceRule.shippingSpace.route')" prop="routeDTOList" class="routeDTOList" :rules="[{ required: true, message: `${$t('sea.pleaseEnter')}`, trigger: 'blur' },]" style="width: 95%">
          <el-checkbox-group v-model="routeDTOList" style="width: 535px;">
            <el-checkbox v-for="item in sealineList" :label="item.code" :key="item.id"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
<!--        *合约类型-->

        <el-form-item :label="$t('spaceRule.shippingSpace.contractType')" prop="contractIdentity" :rules="[{ required: true, message: `${$t('sea.pleaseEnter')}`, trigger: 'change' },]" style="width: 45%">
          <el-radio-group v-model="newContractForm.contractIdentity">
            <el-radio :label="1">NVO</el-radio>
            <el-radio :label="2">BCO</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="Number(newContractForm.contractIdentity) === 2" :label="$t('sea.customer')" prop="contractCustomerId" :rules="[{ required: true, message: `${$t('sea.pleaseEnter')}`, trigger: 'change' },]" style="width: 45%">
          <TypeSelect v-model="newContractForm.contractCustomerId" :defaultDisplay="newContractForm.customerDTO?newContractForm.customerDTO.chineseName : null" type="customer" @selected="customerChange" />
        </el-form-item>

        <el-form-item v-if="newContractForm.carrierCode === 'COSCO' " :label="$t('spaceRule.shippingSpace.bookingChannel')" prop="bookingChannelList" :rules="[{ required: true, message: `${$t('sea.pleaseEnter')}`, trigger: 'change' },]" style="width: 80%">
<!--          订舱渠道-->
          <el-checkbox-group v-model="newContractForm.bookingChannelList">
            <el-checkbox :label="1">SynConHub</el-checkbox>
            <el-checkbox :label="2">EB</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('spaceRule.shippingSpace.productOwner')" prop="productOwner" :rules="[{ required: true, message: `${$t('sea.pleaseEnter')}`, trigger: 'change' },]" style="width: 80%">
          <cargo-limited-select
            placeholder=""
            :select-label="newContractForm.chineseName"
            :select-value="newContractForm.productOwner"
            :remote-default-obj="{
              chineseName:newContractForm.chineseName,
              id:newContractForm.productOwner
            }"
            type="user"
            style="width: 100%;"
            clearable
            @set="productOwnerChange"
          />
        </el-form-item>
        <el-form-item :label="$t('spaceRule.shippingSpace.supplier')" prop="supplierDTOList" :rules="[{ required: true, message: `${$t('sea.pleaseEnter')}`, trigger: 'change' },]" style="width: 80%">
          <TypeSelect v-model="newContractForm.supplierInfo"  type="member" @selected="supplierInfoChange" style="width: 180px" />
<!--          :optionsPorp="customerOptionsPorp"-->
<!--          <remoteSearchSelector v-model="newContractForm.supplierInfo" @selectorChange="supplierInfoChange"  />-->

          <el-button :disabled="!this.supplierInfoData.id" type="text" icon="el-icon-circle-plus" class="icon blue" @click="addSupplierInfoJson" style="position: absolute; left: 195px; top: -4px;"></el-button>
          <div v-for="(item,i) in newContractForm.supplierDTOList" :key="item.supplierId">
            {{ item.supplierInfoDTO.chineseName}}
            <el-button type="text" icon="el-icon-error" class="icon red"  @click="delSupplierInfoJson(i)"  style="position: relative;
    top: -2px;"></el-button>
          </div>

        </el-form-item>
        <el-form-item :label="$t('spaceRule.shippingSpace.remarks')" prop="remark" style="width: 80%">
          <el-input class="textareaH"  v-model="newContractForm.remark" maxlength="500" show-word-limit type="textarea" :placeholder="$t('sea.pleaseEnter')" style="width: 400px"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitNewContract">{{$t('common.confirmBtn')}}</el-button>
        <el-button @click="closeSendNewContract">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import SplitOrderSelector from "@/views/cargo/v0/CharteredBoat/components/SplitOrderSelector"
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import PreManifestListOperationBtn from "@/views/cargo/v0/CharteredBoat/components/PreManifestListOperationBtn"
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect"
import { getGridSelected } from "@/utils/gridChoose"
import lodash from 'lodash'
import { getUserInfo } from "@/api/login"
import { formatNumberToThousands, mergeMethod } from "@/utils"
import URL from "@/api/urlTranslator";
import Vue from '@/main'
import {
  addContractApi, contractDelApi,
  contractDetailApi,
  contractDisableApi, contractEnableApi,
  contractPagesApi, contractWeekApi,
  getSEALINEApi, updataContractApi
} from "@/api/spaceManager";
import moment from "moment";
import remoteSearchSelector from "@/views/cargo/v0/CharteredBoat/components/remoteSearchSelector";
export default {
	name: 'ContractManagement',
	components: {
		SplitOrderSelector, cargoAdvanceSelect, PreManifestListOperationBtn, cargoLimitedSelect, remoteSearchSelector,
    'incomeComponent': {
      template: `<div style="font-size: 14px">
        <el-button v-if="params.data.contractState ===0" type="text" size="mini" @click="params.context.componentParent.editRow(params.data)">${Vue.$t('sea.edit')}</el-button>
        <el-button v-if="params.data.contractState ===1"  type="text" size="mini" @click="params.context.componentParent.invalid(params.data)">${Vue.$t('spaceRule.shippingSpace.invalid')}</el-button>
        <el-button v-if="params.data.contractState ===0"  type="text" size="mini" @click="params.context.componentParent.takeEffect(params.data)">${Vue.$t('spaceRule.shippingSpace.takeEffect')}</el-button>
        <el-button v-if="params.data.contractState ===0"  type="text" size="mini" @click="params.context.componentParent.deleteContract(params.data)">${Vue.$t('sea.delete')}</el-button>
        </div>
      `,
      methods: {}
    }
	},
	data() {
		const defaultFilter = {
      pageSize: 50,
      pageNum: 1,
      contractNo: null,
      carrierCode: null,
      routeCode: null,
      contractIdentity: null,
      bookingChannel: null,
      productOwner: null,
      contractState: null,
      contractStart: '',
      contractEnd: ''
		}
		return {
			url: URL,
			loading: false,
			pageSizeList: [10, 20, 30, 40],
			tableData: {
        list: []
      },
			selectedItems: [], // 列表选择
			pagination: {
				pageNum: 1,
				pageSize: 50
			},
			pageTotal: 0,
			defaultFilter: defaultFilter,
			multipleForm: this.$extends({}, defaultFilter),
			vm: this,
			VUE_APP_BASE_API: '',
			soNoList: [],
			gridApi: null,
			columnApi: null,
			columnDefsRight: [
			],
			gridOptionsRight: {
				rowSelection: 'multiple',
        suppressAggFuncInHeader: true,
				rowMultiSelectWithClick: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
				context: {
					componentParent: this
				},
				onRowSelected: selectorObj => {
					if (selectorObj.node.selected) {
						this.selectedItems.push(selectorObj.data)
					} else {
						const _data = selectorObj.data
						const _id = this.selectedItems.findIndex(item => item.id === _data.id)
						this.selectedItems.splice(_id, 1)
					}
				}
			},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      newContractDialog: false,
      newContractForm: {
        routeDTOList: [],
        checkList: [],
        supplierDTOList: [],
        bookingChannelList: [],
        carrierInfoJson: '{}'
      },
      routeDTOList: [],
      supplierInfoData: {}, // 供应商
      startTimeRange: '',
      pickerMinDate: '',
      sealineList: [],
      lastWeek: null,
      thisWeek: null,
      nextWeek: null

		}
	},
  watch: {
  },
	computed: {
		...mapState({
			memberInfo: state => state.user.memberInfo
		}),
		multipleFormValuable() {
			for (let key in this.multipleForm) {
				if (this.multipleForm[key] && key !== 'pageSize' && key !== 'pageNum') {return true;}
			}
			return false
		}

	},
	filters: {
		filterSoc(socFlag, vm) {
			return socFlag ? vm.$t('containerList.socFlagYes') : vm.$t('containerList.socFlagFalse')
		},
		filterBLClass(_status) {
			const classList = [
				'',
				'status-text info-text',
				'status-text warning-text',
				'status-text success-text',
				'status-text danger-text',
				'status-text primary-text'
			]
			return classList[_status]
		},
		filterDeclareClass(_status) {
			const classList = [
				'status-text info-text',
				'status-text warning-text',
				'status-text warning-text',
				'status-text success-text',
				'status-text danger-text',
				'status-text primary-text'
			]
			return classList[_status]
		},
		filterFullInTime(timestamp, vm) {
			if (!timestamp) {
				return ''
			}
			return vm.$moment(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss')
		},
		isHouseBill(_status) {
			if (_status === true) {
				return this.$t('common.trueText')
			} else if (_status === false) {
				return this.$t('common.falseText')
			}
		}
	},
	methods: {
    pickerOptionsBlur() {
      this.pickerMinDate = ''
    },
    validatecontractTime(rule, value, callback) {
      if (value) {
        let nowTime = new Date().getTime()
        if (value[1] < nowTime) {
          callback(new Error(this.$t('spaceRule.shippingSpace.endTimeCanOnlyBeSelectedInTheFuture')))
        } else {
          callback()
        }
      } else {
        callback(new Error(this.$t('spaceRule.shippingSpace.endTimeCanOnlyBeSelectedInTheFuture')))
      }
    },
		async getList() {
			if (this.$isNotEmpty(this.multipleForm.contractTime)) {
				this.multipleForm.contractStart = this.multipleForm.contractTime[0]
				this.multipleForm.contractEnd = Number(this.multipleForm.contractTime[1]) + 999
			} else {
				this.multipleForm.contractStart = ''
				this.multipleForm.contractEnd = ''
			}
			const data = lodash.cloneDeep(this.multipleForm)
			delete data.contractTime
			// if (this.multipleFormValuable) {
      //   contractPagesApi(data).then(res => {
			// 		this.totalPayable = res.content
			// 	})
			// }
			this.selectedItems = []
			this.loading = true
			const res = await contractPagesApi(data)
			this.loading = false
			if (res.ok) {

          res.content.list.map(item => {
            if (this.$isNotEmpty(item.bookingChannelDTOList)) {
              let bookingList = []
              item.bookingChannelDTOList.map(val => {
                bookingList.push(val.bookingChannelName)
              })
              item.bookingChannelListName = bookingList.join('、')
            }

          })
        this.tableData = res.content
				this.pageTotal = Number(res.content.total)
			} else {
				this.pageTotal = 0
				this.tableData = []
			}
		},
		topSearch() {
			this.currPage = 1
			this.getList()
		},
		selBlStatusrChange(data, val) { // 下拉框
			this.multipleForm[val] = data
			this.getList()
		},
		selTrailerStatusChange(data) {
			this.multipleForm.trailerStatus = data
			this.getList()
		},
		clearSearchForm() { // 搜索重置
			this.$refs.multipleForm.resetFields()
			this.multipleForm = this.$extends({}, this.defaultFilter)
			this.topSearch()
		},
		onReady(params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
			this.gridApi.sizeColumnsToFit()
			this.resetHeight()
			// window.addEventListener('resize', function() {
			//   setTimeout(function() {
			//     params.api.sizeColumnsToFit()
			//   })
			// })
		},
		/** 选中装货港 */
		getItemFromChild(val, key) {
			this.multipleForm[key] = val.code5
			if (val.code5) {
				this.getList()
			}
		},
    setCustomerInfo(val) {
      this.multipleForm.carrierCode = val.englishShortname
      this.topSearch()
    },
    productOwnerSet(val) {
      this.multipleForm.productOwner = val.id
      this.topSearch()
    },
    contractTimeChange(val) {
      if (this.$isNotEmpty(val)) {
        this.$set(this.newContractForm, 'contractStart', val[0])
        this.$set(this.newContractForm, 'contractEnd', Number(val[1]) + 999)
      } else {
        this.$set(this.newContractForm, 'contractStart', null)
        this.$set(this.newContractForm, 'contractEnd', null)
      }

      this.average()
    },
    getWeekDayCount(start, end) {
      start = this.$moment(start)
      end = this.$moment(end)
      let isNotBefore = this.$moment(start).isBefore(end) || start._i === end._i
      if (!isNotBefore) {
        return null
      }
      const range = this.$moment(end).diff(this.$moment(start));
      const d = this.$moment.duration(range);
      const days = Math.ceil(d.asDays()) ; // 总天数
      let weekendDays = 0
      let distanceToWeekend = 0
      // 计算当前是周几
      let w = this.$moment(start).day() || 7
      if (w > 5) { // 大于周五
        // if (w === 6 && days <= 9 || w === 7 && days <= 8) {
        //   weekendDays = 2
        // } else {
        //   weekendDays += Math.min(8 - w, Number(days))
        // }
        weekendDays += Math.min(8 - w, Number(days))
        // weekendDays += Math.min(8 - w, Number(days))
        // distanceToWeekend = 7 - w
      } else {
        if (Number(days) > 7 - w) {weekendDays += 2} else if (Number(days) === 7 - w) {weekendDays += 1}
      }
      // 去除前段之后还剩下的天数
      let rest = days - (8 - w)
      if (rest >= 6 && rest <= 7) { // 如果剩下天数是6-7天
        weekendDays += rest - 5
      } else if (rest > 7) {
        // 剩下的整周数
        let restW = Math.floor(rest / 7)
        weekendDays += restW * 2
        // 去除中段之后还剩下的天数
        rest -= restW * 7
        if (rest >= 6 && rest <= 7) { // 如果剩下天数是6-7天
          weekendDays += rest - 5
        }
      }
      console.log({
        weekDays: days - weekendDays,
        weekendDays: weekendDays,
        days: days,
        distanceToWeekend
      })
      let ds = 0
      if (days % 7 + w > 8) {
        ds = 1
      }
      let asWeeks = Math.ceil(weekendDays / 2) + ds
      console.log('asWeeks,', asWeeks)
      return {
        weekendDays,
        distanceToWeekend
      }

    },
    async average() {
      if (this.newContractForm.contractStart && this.newContractForm.contractEnd && this.newContractForm.spaceTotal) {
        let startTime = this.$moment(this.newContractForm.contractStart);
        let endTime = this.$moment(this.newContractForm.contractEnd);
        let w = this.getWeekDayCount(startTime, endTime)
        let asWeeks = 0
        const res = await contractWeekApi({
          start: this.newContractForm.contractStart,
          end: this.newContractForm.contractEnd
        })
        if (res.ok) {
          asWeeks = Number(res.content)
        }
       // let asWeeks = Math.floor(w.weekendDays / 2) + 1
        // let diff = this.$moment.duration(endTime.diff(startTime));
        // let asWeeks = 0
        // if (diff.asWeeks() < 1) { // 天数相差一周内 判断是否属于同一周
        //   let startWeek = startTime.week();
        //   let endWeek = endTime.week();
        //   if (startWeek === endWeek) { // 同一周
        //     asWeeks = 1
        //   } else {
        //     asWeeks = 2
        //   }
        // } else {
        //   asWeeks = Math.ceil(diff.asWeeks())
        //   console.log(asWeeks, diff.asWeeks())
        // }
        // let startWeek = startTime.week();
        // let endWeek = endTime.week();
        console.log('asWeeks,', asWeeks)
        let average = Math.ceil(this.newContractForm.spaceTotal / asWeeks)
        this.$set(this.newContractForm, 'spaceWeekAvg', average)
      }
    },
    // 产品负责人
    productOwnerChange(val) {
      this.$set(this.newContractForm, 'productOwner', val.id)
      console.log(val, this.newContractForm.productOwner)

      this.$set(this.newContractForm, 'chineseName', val.chineseName)
      this.$set(this.newContractForm, 'productOwnerJson', JSON.stringify(val))
    },
    supplierInfoChange(val) {
      this.supplierInfoData = val
    },
    // 合约客户
    customerChange(val) {
      this.$set(this.newContractForm, 'contractCustomerJson', JSON.stringify(val))
    },
    addSupplierInfoJson() {
      let supplierInfoData = lodash.cloneDeep(this.supplierInfoData)
      let isSome = this.newContractForm.supplierDTOList.some(item => item.supplierId === supplierInfoData.id)
      if (!isSome) {
        this.newContractForm.supplierDTOList.push({
          supplierId: supplierInfoData.id,
          supplierInfoDTO: supplierInfoData
        })
      }
      this.supplierInfoData = {}
      this.newContractForm.supplierInfo = null
    },
    delSupplierInfoJson(i) {
      this.newContractForm.supplierDTOList.splice(i, 1)
    },
    // 新建舱位合约
		newClassContract() {
      this.$set(this.newContractForm, 'chineseName', this.userInfo.chineseName)
      this.$set(this.newContractForm, 'productOwner', this.userInfo.id)
      this.newContractDialog = true
		},
    submitNewContract() {
      let routeDTOList = []
      this.routeDTOList.map(item => {
        this.sealineList.map(val => {
          if (item === val.code) {
            routeDTOList.push({
              routeCode: val.code,
              routeName: val.englishName
            })
          }
        })
      })
      this.newContractForm.routeDTOList = routeDTOList
      this.$refs.newContractForm.validate(async valid => {
        if (valid) {
          this.loading = true
          let url
          if (this.newContractForm.id) {
            url = updataContractApi
          } else {
            url = addContractApi
          }
          const res = await url(this.newContractForm)
          this.loading = false
          if (res.ok) {
            this.$message.success(this.$t('sea.submittedSuccessfully'))
            this.getList()
            this.closeSendNewContract()
          }

        }
      })
    },
    closeSendNewContract() {
      this.newContractDialog = false
      this.newContractForm = {
        routeDTOList: [],
          checkList: [],
          supplierDTOList: [],
          bookingChannelList: [],
          carrierInfoJson: '{}',
          chineseName: null
      }
      this.routeDTOList = []
      this.$refs.newContractForm.resetFields()
    },
    async editRow(row) {
      this.loading = true
      const res = await contractDetailApi(row.id)
      this.loading = false
      if (res.ok) {
        res.content.contractTime = [res.content.contractStart, res.content.contractEnd]
        res.content.routeDTOList.map(item => {
          this.routeDTOList.push(item.routeCode)
        })
        res.content.chineseName = res.content.ownerDTO.employeeName
        this.newContractForm = res.content
        this.newContractDialog = true
      }
    },
    // 失效
    async invalid(row) {
      this.loading = true
      const res = await contractDisableApi(row.id)
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.getList()
      }

    },
    // 生效
    async takeEffect(row) {
      this.loading = true
      const res = await contractEnableApi(row.id)
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.getList()
      }
    },
    async deleteContract(row) {
      this.loading = true
      const res = await contractDelApi(row.id)
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.successfullyDeleted'))
        this.getList()
      }
    },
		formatNumberToThousands(value) {
			return formatNumberToThousands(value)
		}
	},
	async created() {
    this.$moment.locale('zh-cn')
    getSEALINEApi().then(res => {
      if (res.ok) {
        this.sealineList = res.content
      }
    });
		this.VUE_APP_BASE_API = process.env.VUE_APP_BASE_API
		this.userInfo = await getUserInfo()
    console.log('this.userInfo,', this.userInfo)
		await this.getList()
    if (this.$isNotEmpty(this.tableData.list)) {
      this.lastWeek = `${this.$t('spaceRule.shippingSpace.lastWeek')}(${this.tableData.list[0].lastWeekCycle.cycleName})`
      this.thisWeek = `${this.$t('spaceRule.shippingSpace.thisWeek')}(${this.tableData.list[0].weekCycle.cycleName})`
      this.nextWeek = `${this.$t('spaceRule.shippingSpace.nextWeek')}(${this.tableData.list[0].nextWeekCycle.cycleName})`

    } else {
      this.lastWeek = this.$t('spaceRule.shippingSpace.lastWeek')
      this.thisWeek = this.$t('spaceRule.shippingSpace.thisWeek')
      this.nextWeek = this.$t('spaceRule.shippingSpace.nextWeek')
    }

    this.columnDefsRight = [{
      colId: 'visibleCol',
      headerName: '',
      pinned: 'left',
      field: '',
      hide: true,
      width: 300
    }, {
      headerName: '',
      width: 55,
      pinned: 'left',
      suppressSorting: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      suppressMenu: true,
      suppressSizeToFit: true,
      suppressResize: true
    }, {
      headerName: this.$t('spaceRule.shippingSpace.approx'),
      field: 'contractNo',
      minWidth: 140
    }, {
      headerName: this.$t('spaceRule.shippingSpace.shippingDepartment'), // 船司
      field: 'carrierCode',
      minWidth: 140
    }, {
      headerName: this.$t('spaceRule.shippingSpace.route'), // 航线 routeList
      field: 'routeList',
      minWidth: 140,
      cellRenderer: params => `${params.value.join(';')}`
    }, {
      headerName: this.$t('spaceRule.shippingSpace.termOfValidity'), // 有效期限
      field: 'contractStart',
      minWidth: 180,
      cellRenderer: params => `${this.formatDate(params.value)}-${this.formatDate(params.data.contractEnd)}`
    }, {
      headerName: this.$t('spaceRule.shippingSpace.effectiveStatus'), // 生效状态
      field: 'contractStateName',
      minWidth: 100
    }, {
      headerName: this.$t('spaceRule.shippingSpace.contractType'), // 合约类型
      field: 'contractIdentityName',
      minWidth: 100
    }, {
      headerName: this.$t('spaceRule.shippingSpace.bookingChannel'), //
      field: 'bookingChannelListName',
      minWidth: 140
    }, {
      headerName: this.$t('spaceRule.shippingSpace.remarks'), // 备注
      field: 'remark',
      minWidth: 140
    }, {
      headerName: this.$t('spaceRule.shippingSpace.contractualSpace'), // 合约舱位（总量/周平均
      field: 'spaceTotal',
      cellRenderer: params => `<span>${params.value} / ${params.data.spaceWeekAvg}</span>`,
      minWidth: 180
    }, {
      headerName: this.$t('spaceRule.shippingSpace.classStatistics'), //
      field: 'spaceUsedQty',
      cellRenderer: params => `<span>${params.data.spaceUsedQty} / ${params.data.spaceQty}</span>`,
      minWidth: 180
    }, {
      headerName: this.lastWeek, // this.$t('spaceRule.shippingSpace.thisWeek'), // this.lastWeek, // , // 上周
      field: 'lastWeekCycle',
      cellRenderer: params => `<span>${params.value.distributionQty || 0} / ${params.value.waitQty || 0} / ${params.value.releaseQty || 0} </span>`,
      minWidth: 140
    }, {
      headerName: this.thisWeek, // 本周 this.tableData.list[0] ? this.tableData.list[0].weekCycle.cycleName : null this.$t('spaceRule.shippingSpace.thisWeek')
      field: 'weekCycle',
      cellRenderer: params => `<span>${params.value.distributionQty || 0} / ${params.value.waitQty || 0} / ${params.value.releaseQty || 0} </span>`,
      minWidth: 140
    }, {
      headerName: this.nextWeek, // this.$t('spaceRule.shippingSpace.nextWeek'), //
      field: 'nextWeekCycle',
      cellRenderer: params => `<span>${params.value.distributionQty || 0} / ${params.value.waitQty || 0} / ${params.value.releaseQty || 0} </span>`,
      minWidth: 140
    }, {
      headerName: this.$t('spaceRule.shippingSpace.productPersonnel'), // 产品人员
      field: 'ownerDTO',
      cellRenderer: params => params.value.employeeName,
      minWidth: 120
    }, {
      headerName: this.$t('spaceRule.shippingSpace.creationTime'), // 创建时间
      field: 'createTime',
      cellRenderer: params => this.formatDate(params.value),
      minWidth: 120
    },
      {
        headerName: this.$t('common.operation'), pinned: 'right', width: 180, suppressSizeToFit: true, suppressResize: true,
        cellRendererFramework: 'incomeComponent'
      }]

		window.addEventListener('resize', this.throttle(this.resetHeight, 200, 300))
	}
}

</script>
<style lang='scss' scoped>
// .sys-right-inner-wrap {
//   height: 100%;
//   overflow: hidden;
//   overflow-y: auto;
// }

.container-wrap {
	margin-top: 20px;
	padding: 10px 20px;
	background: #fff;
}

.pagination-wrap {
	margin-top: 20px;
	text-align: right;
}

.features-btn {
	margin-top: 15px;
}

.dataTable {
	margin-top: 15px;
}
.operating {
	display: flex;
	i {
		font-size: 16px;
		margin: 0 5px;
		cursor: pointer;

		&:hover {
			transform: scale(1.1);
			transition: all 0.2s ease 0s;
		}
	}
}

.status-text {
	&.info-text {
		color: #909399;
	}

	&.warning-text {
		color: #e6a23c;
	}

	&.success-text {
		color: #67c23a;
	}

	&.danger-text {
		color: #f56c6c;
	}

	&.primary-text {
		color: #409eff;
	}
}
.primary-text {
	color: #409eff;
}
.billForm {
	display: flex;
	flex-wrap: wrap;
	.title {
		font-family: "Arial Negreta", "Arial";
		font-weight: 700;
		font-size: 18px;
		color: #333333;
		margin-bottom: 20px;
		span {
			color: red;
		}
	}
	.phoneCon {
		display: flex;
		justify-content: space-between;
	}
	.phone {
		width: 30%;
	}
}
.go-ams {
	margin-right: 8px;
}
.el-icon-click,
.el-icon-edit,
.el-icon-download {
	cursor: pointer;
	transition: all 0.2s ease 0s;
	&:hover {
		transform: scale(1.1);
	}
}
.change-label-calss ::v-deep .el-form-item__label {
	width: 200px !important;
}

::v-deep .el-table__expand-column {
	pointer-events: none;
}
::v-deep .el-table__expand-column .el-icon {
	visibility: hidden;
}
.list-operating {
	display: flex;
	justify-content: space-between;
	::v-deep .el-button {
		margin-left: 0;
	}
}
.receivingMailbox ::v-deep {
	.el-table th > .cell:before {
		content: "*";
		color: red;
	}
}
.red {
	color: red;
}
.footer-btn {
	margin-top: 30px;
	text-align: right;
}
.newContractDialog ::v-deep {
  .el-form-item{ width: 44%; margin-bottom: 18px}
   .el-form-item__label{ width: 90px; text-align: right}
 }
.icon{ font-size: 20px; transition: all 0.2s ease 0s; cursor: pointer;user-select: none;position: relative;top: -10px;
  &:hover{ transform: scale(1.1)}
}
.blue{ color: #1890ff}
::v-deep .icon{ width: auto; height: auto}
.routeDTOList{
  ::v-deep .el-form-item__content{line-height: 24px; margin-top: 5px}
}
</style>

