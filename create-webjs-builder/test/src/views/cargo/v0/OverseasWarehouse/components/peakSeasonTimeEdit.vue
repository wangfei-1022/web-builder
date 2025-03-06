<template>
	<div>
		<div
			v-for="(item, index) in data.peakSeasonTimeChargeDetailDTOList"
			:key="index"
		>
			<div class="flex-box">
				<el-form-item :label="item.chargeItemName" label-width="150px" />
				<el-form-item :label="''" label-width="0px" >
					<el-checkbox
						:disabled="isDetail"
						v-model="item.isBusySeason"
						class="ml-10"
						@change="changeSeason($event, item)"
					>
						{{ getZH("peakSeasonTimeFlag") }}
					</el-checkbox>
				</el-form-item>
			</div>
			<div v-for="(itemDate, itemIndex) in item.peakSeasonTimeDetailDTOList" :key="itemIndex">
				<div class="flex-box">
					<el-form-item :label="getZH('seasonTime') + (itemIndex + 1) + '：'" :prop="'peakSeasonTimeChargeDetailDTOList.' +index +'.peakSeasonTimeDetailDTOList.' + itemIndex +(itemDate.endTimeFlag ? '.startTime' : '.rangTime')"
					:rules="[{required: true,message: selectZH('seasonTime'),trigger: 'change',}]">
					<div class="flex-box">
						<div>
              <CommonPicker
                size='mini'
                :disabled="isDetail"
                v-show="!itemDate.endTimeFlag"
                :useUTC="true"
                format="yyyy-MM-dd HH:mm:ss"
                v-model="itemDate.rangTime"
                valueFormat="timestamp"
                type="datetimerange"
                :start-placeholder="$t('common.startDate')"
                :end-placeholder="$t('common.endDate')"
                :parentOption="getPickerOptions(itemIndex,item)"
                class="w-full"
                :clearable="false"
                :default-time="['00:00:00', '23:59:59']"
                />
						</div>
						<CommonPicker
              :useUTC="true"
							:disabled="isDetail"
							v-show="itemDate.endTimeFlag"
							type="datetime"
              valueFormat="timestamp"
              format="yyyy-MM-dd HH:mm:ss"
							v-model="itemDate.startTime"
							:clearable="false"
							parentOption="followingDependence"
							:dependenceDate="getDependenceDate(item, itemIndex)"
						/>
					</div>
					</el-form-item>
					<el-form-item label="" label-width="0px"	v-if="item.peakSeasonTimeDetailDTOList.length - 1 === itemIndex">
						<el-checkbox :disabled="isDetail" v-model="itemDate.endTimeFlag" class="ml-10" @change="changeValue($event, itemDate)">
							{{ getZH("endTimeFlag") }}
						</el-checkbox>
					</el-form-item>
					<el-form-item	label="" label-width="0px"	class="ml-10" v-if="item.peakSeasonTimeDetailDTOList.length - 1 === itemIndex && !isDetail">
						<div class="el-icon-circle-plus-outline fs-18" @click="addItem(item, itemDate, itemIndex)"></div>
					</el-form-item>
					<el-form-item	label="" label-width="0px"	class="ml-10"	v-if="item.peakSeasonTimeDetailDTOList.length > 1 && !isDetail"	>
						<div class="el-icon-remove-outline fs-18"	@click="removeItem(item,itemIndex)"></div>
          </el-form-item>

				</div>
        <div v-if="$isNotEmpty(itemDate.channelPriceList)">
						<div class="flex-box" v-for="(dataItem,dataIndex) in itemDate.channelPriceList" :key='dataIndex' >
						<el-form-item
							:label="getZH('channelName') + (itemIndex + 1) +'：'"
							required
						>
							<span class="fc-grey">{{dataItem.channelName}}</span>
						</el-form-item>
						<el-form-item
							:label="getZH('supplierName') + (itemIndex + 1) +'：'"
							required
						>
							<span class="fc-grey">{{dataItem.supplierName}}</span>
						</el-form-item>
						<el-form-item
							label-width="170px"
							:label="getZH('channel') + (itemIndex + 1) + getZH('costPrice') +'：'"
							:prop="
							'peakSeasonTimeChargeDetailDTOList.' +
							index +
							'.peakSeasonTimeDetailDTOList.' +
							itemIndex + '.channelPriceList.' + dataIndex + '.costPrice'
						"
							:rules="[
								{
									required: true,
									message: inputZH('costPrice'),
									trigger: 'change',
								},
							]"
						>
							<InputNumber :disabled="isDetail" :placeholder="inputZH('costPrice')" size="mini" v-model="dataItem.costPrice" />
						</el-form-item>
            <el-form-item	:label="getZH('currency')" class="ml-20" label-width="80px"  :prop="'peakSeasonTimeChargeDetailDTOList.' +index +'.peakSeasonTimeDetailDTOList.'+ itemIndex +'.channelPriceList.'+dataIndex+'.currencyCode'" :rules="[	{required: true,message: selectZH('currency')}]" >
              <CurrencySelect :disabled="isDetail"  v-model="dataItem.currencyCode" :placeholder="selectZH('currency')" @selected="(val)=>dataItem.currencyName=val.name" />
            </el-form-item>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getFeeDropdownApi, getChannelByProductApi } from '@/api/OverseasWarehouse/peakSeasonSurcharge'
import getZHMixin from '../PeakSeasonTimeManage/components/getZHMixin'
import CurrencySelect from './CurrencySelect'
export default {
	name: 'PeakSeasonTimeEdit',
	components: { CurrencySelect },
	mixins: [getZHMixin],
	props: {
		data: Object,
		type: {
			type: Number,
			default: 2
		},
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			channelPriceList: [],
			offsetTime: new Date().getTimezoneOffset() * 60 * 1000
		}
	},
	created() {
		if (!this.isDetail) {
			this.init()
		}
	},
	watch: {
		'data.productCode': {
			handler(val) {
				if (this.$isEmpty(val) || this.isDetail) {
					return false
				} else {
					if (this.type === 2) {
						this.getChannel(val)
					}
				}

			},
			deep: true
		}
	},
	methods: {
		async init() {
			let res = await getFeeDropdownApi()
			if (res.ok) {
				let cods = ['ERESPSS', 'EAHSPSS', 'EOSPSS']
				let peakSeasonTimeChargeDetailDTOList = res.content.filter(item => cods.indexOf(item.code) > -1)
				let list = []
				peakSeasonTimeChargeDetailDTOList.forEach(item => {
					let dataItem = {
						chargeItemCode: item.code,
						chargeItemId: item.id,
						chargeItemName: item.chineseName,
						isBusySeason: true,
						peakSeasonTimeDetailDTOList: [
							{
								serial: 0,
								startTime: '',
								endTime: '',
								rangTime: [],
								endTimeFlag: false,
								channelPriceList: []
							}
						]

					}
					list.push(dataItem)
				})
				this.$set(this.data, 'peakSeasonTimeChargeDetailDTOList', list)
			}
		},
		/**
		 * 通过物流产品获取渠道
		 */
		async getChannel(productCode) {
			let res = await getChannelByProductApi(productCode)
			if (res.ok) {
				let list = res.content || []
				let handlerList = []
				list.forEach(item => {
					handlerList.push({
						costPrice: null,
						channelId: item.id,
						supplierName: item.supplierName,
						channelName: item.channelName,
						currencyCode: null,
						currencyName: null
					})
					item.costPrice = null
				})
				this.channelPriceList = this.$extends(true, [], handlerList)
				this.data.peakSeasonTimeChargeDetailDTOList.forEach(item => {
					if (item.peakSeasonTimeDetailDTOList) {
						item.peakSeasonTimeDetailDTOList.forEach(data => {
							this.$set(data, 'channelPriceList', this.$extends(true, [], this.channelPriceList))
						})
					}
					//
				})
			}
		},
		/*
	 * 获取时间范围到禁用日期
	 */
		getPickerOptions(index, data) {
			// 判断是第一条数据
			if (data.peakSeasonTimeDetailDTOList.length === 1) {
				return {
					disabledDate: time => false
				}
			} else {
				if (index === 0) {
					return {
						disabledDate: time => time.getTime() > this.getNextData(index, data)
					}
				} else {
					// 判断是最后一条数据
					if (data.peakSeasonTimeDetailDTOList.length - 1 === index) {
						return {
							disabledDate: time => time.getTime() < this.getLastData(index, data)
						}
					} else {
						// 判断下一条数据是否维护值
						return {
							disabledDate: time => time.getTime() < this.getLastData(index, data) ||
								time.getTime() > this.getNextData(index, data)
						}
					}
				}
			}
		},
		/**
		 * 获取上一条数据
		 */
		getLastData(dataIndex, dataItem) {
			// 上一条数据一定有结束日期
			let dataList = dataItem.peakSeasonTimeDetailDTOList.filter((item, index) => index < dataIndex && this.$isNotEmpty(item.rangTime))
			// 获取最后一条数据
			if (this.$isNotEmpty(dataList)) {
				let data = dataList[dataList.length - 1]
				// 加上时区偏移量
				return Number(data.rangTime[1] + this.offsetTime)
			} else {
				return null
			}
		},
		/**
		 * 获取下一条数据
		 */
		getNextData(dataIndex, dataItem) {
			// 上一条数据一定有结束日期
			let dataList = dataItem.peakSeasonTimeDetailDTOList.filter((item, index) => index > dataIndex && (this.$isNotEmpty(item.rangTime) || item.endTimeFlag))
			// 获取最后一条数据
			if (this.$isNotEmpty(dataList)) {
				let data = dataList[0]
				return data.endTimeFlag ? data.startTime + this.offsetTime - 1 : Number(data.rangTime[0] + this.offsetTime)
			} else {
				return Infinity
			}
		},


		/**
		 * 获取时间范围禁用日期
		 */
		getDependenceDate(data, index) {
			if (index === 0) {
				return null
			}
			let lastData = data.peakSeasonTimeDetailDTOList[index - 1]
			return lastData.rangTime ? Number(lastData.rangTime[1] + this.offsetTime) : null
		},
		/**
		 * 是否有结束时间变更
		 */
		changeValue(val, item) {
			if (val) {
				if (this.$isNotEmpty(item.rangTime)) {
					item.startTime = item.rangTime[0]
					item.endTime = null
				}
			} else {
				item.startTime = null
				item.endTime = null
				item.rangTime = []
			}
		},
		/**
		 * 是否有旺季变更
		 */
		changeSeason(val, item) {
			if (!val) {
				this.$confirm(this.getZH('confirm'), this.getZH('tips'), {
					confirmButtonText: this.getZH('confirmBtn'),
					cancelButtonText: this.getZH('cancel'),
					type: 'warning'
				}).then(() => {
					item.peakSeasonTimeDetailDTOList = []
				}).catch(() => {
					item.isBusySeason = true
				})

			} else {
				let peakSeasonTimeDetailDTOList = [{
					serial: 0,
					startTime: '',
					endTime: '',
					rangTime: [],
					endTimeFlag: false
				}]
				if (this.type === 2) {
					this.$set(peakSeasonTimeDetailDTOList[0], 'channelPriceList', this.$extends(true, [], this.channelPriceList))
				}
				this.$set(item, 'peakSeasonTimeDetailDTOList', peakSeasonTimeDetailDTOList)
			}
		},
		/**
		 * 添加时间
		 */
		addItem(item, dataRow, index) {
			// 有结束日期 没填数据或者无结束日期没填开始日期 禁止添加下一条
			let dataList = item.peakSeasonTimeDetailDTOList.filter(itemRow => this.$isEmpty(itemRow.rangTime) && !itemRow.endTimeFlag || itemRow.endTimeFlag && this.$isEmpty(itemRow.startTime))
			if (this.$isNotEmpty(dataList)) {
				this.$message.error(this.getZH('errTips'))
				return false
			}
			// 如果当前没有结束日期 添加到上一行
			let data = {
				startTime: '',
				endTime: '',
				rangTime: [],
				endTimeFlag: false,
				channelPriceList: this.$extends(true, [], this.channelPriceList)
			}
			if (dataRow.endTimeFlag) {
				item.peakSeasonTimeDetailDTOList.splice(index, 0, data)
			} else {
				item.peakSeasonTimeDetailDTOList.push(data)
			}
		},
		/**
		 * 删除单条数据
		 */
		removeItem(item, index) {
			item.peakSeasonTimeDetailDTOList.splice(index, 1)
		}
	}
}
</script>

<style scoped lang="less">
</style>
