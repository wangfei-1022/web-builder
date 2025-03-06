<template>
	<div>
		<div class="flex-box" v-if="Number(type) === 2">
			<el-form-item :label="getZH('peakSeasonConfig')"> </el-form-item>
			<el-form-item :label="''" label-width="0px">
				<el-checkbox
					v-model="data.peakSeasonTimeFlag"
					@change="changeSeason($event)"
				>
					{{ getZH("peakSeasonTimeFlag") }}
				</el-checkbox>
			</el-form-item>
		</div>
		<div v-for="(item, index) in data.peakSeasonTimeDetailDTOList" :key="index">
			<div class="flex-box">
				<el-form-item
					:label="getZH('seasonTime')+(index+1) +'：'"
					:prop="
						'peakSeasonTimeDetailDTOList.' +
						index +
						(item.endTimeFlag ? '.startTime' : '.rangTime')
					"
					:rules="[
						{
							required: true,
							message: selectZH('seasonTime'),
							trigger: 'change',
						},
					]"
				>
					<div class="flex-box">
            <div>
              <CommonPicker
              size='mini'
              :disabled="isDetail"
              v-show="!item.endTimeFlag"
              :useUTC="true"
              format="yyyy-MM-dd HH:mm:ss"
              v-model="item.rangTime"
              valueFormat="timestamp"
              type="datetimerange"
              :start-placeholder="$t('common.startDate')"
              :end-placeholder="$t('common.endDate')"
              :parentOption="getPickerOptions(index)"
              class="w-full"
              :clearable="false"
              :default-time="['00:00:00', '23:59:59']"
              />
            </div>
            <CommonPicker
              :useUTC="true"
              :disabled="isDetail"
              format="yyyy-MM-dd HH:mm:ss"
              v-show="item.endTimeFlag"
              pikcerType="date"
              v-model="item.startTime"
              :clearable="false"
              parentOption="followingDependence"
              :dependenceDate="getDependenceDate(index)"
            />
					</div>
				</el-form-item>
				<el-form-item
					label=""
					label-width="0px"
					v-if="data.peakSeasonTimeDetailDTOList.length - 1 === index"
				>
					<el-checkbox
						:disabled="isDetail"
						v-model="item.endTimeFlag"
						class="ml-10"
						@change="changeValue($event, item)"
					>
						{{ getZH("endTimeFlag") }}
					</el-checkbox>
				</el-form-item>
				<el-form-item
					label=""
					label-width="0px"
					class="ml-10"
					v-if="
						data.peakSeasonTimeDetailDTOList.length - 1 === index && !isDetail
					"
				>
					<div
						class="el-icon-circle-plus-outline fs-18"
						@click="addItem(item, index)"
					></div>
				</el-form-item>
				<el-form-item
					label=""
					label-width="0px"
					class="ml-10"
					v-if="data.peakSeasonTimeDetailDTOList.length > 1 && !isDetail"
				>
					<div
						class="el-icon-remove-outline fs-18"
						@click="removeItem(index)"
					></div
				></el-form-item>
			</div>
		</div>
	</div>
</template>

<script>
import getZHMixin from '../PeakSeasonTimeManage/components/getZHMixin'
export default {
	name: 'PeakSeasonTimeWarehouseEdit',
	mixins: [getZHMixin],
	props: {
		data: Object,
		isDetail: {
			type: Boolean,
			default: false
		},
		type: {
			type: Number,
			default: 2
		}
	},
	data() {
		return {
			offsetTime: new Date().getTimezoneOffset() * 60 * 1000,
			peakSeasonTimeDetailDTOList: [{
				startTime: '',
				endTime: '',
				rangTime: [],
				endTimeFlag: false
			}]
		}
	},
	created() {
		if (this.$isEmpty(this.data.id)) {
			this.init()
		}
	},
	mounted() {

	},
	methods: {
		init() {
			this.$set(this.data, 'peakSeasonTimeDetailDTOList', this.peakSeasonTimeDetailDTOList)
			this.$set(this.data, 'peakSeasonTimeFlag', true)
		},

		/**
		 * 获取时间范围到禁用日期
		 */
		getPickerOptions(index) {
			// 判断是第一条数据
			if (this.data.peakSeasonTimeDetailDTOList.length === 1) {
				return {
					disabledDate: time => false
				}
			} else {
				if (index === 0) {
					return {
						disabledDate: time => time.getTime() > this.getNextData(index)
					}
				} else {
					// 判断是最后一条数据
					if (this.data.peakSeasonTimeDetailDTOList.length - 1 === index) {
						return {
							disabledDate: time => time.getTime() < this.getLastData(index)
						}
					} else {
						// 判断下一条数据是否维护值
						return {
							disabledDate: time => time.getTime() < this.getLastData(index) ||
								time.getTime() > this.getNextData(index)
						}
					}
				}
			}
		},
		/**
		 * 获取上一条数据
		 */
		getLastData(dataIndex) {
			// 上一条数据一定有结束日期
			let dataList = this.data.peakSeasonTimeDetailDTOList.filter((item, index) => index < dataIndex && this.$isNotEmpty(item.rangTime))
			// 获取最后一条数据
			if (this.$isNotEmpty(dataList)) {
				let data = dataList[dataList.length - 1]
				return Number(data.rangTime[1]) + this.offsetTime
			} else {
				return null
			}
		},
		/**
		 * 获取下一条数据
		 */
		getNextData(dataIndex) {
			// 上一条数据一定有结束日期
			let dataList = this.data.peakSeasonTimeDetailDTOList.filter((item, index) => index > dataIndex && (this.$isNotEmpty(item.rangTime) || item.endTimeFlag))
			// 获取最后一条数据
			if (this.$isNotEmpty(dataList)) {
				let data = dataList[0]
				return data.endTimeFlag ? data.startTime + this.offsetTime : Number(data.rangTime[0] + this.offsetTime)
			} else {
				return Infinity
			}
		},
		/**
		 * 获取时间范围禁用日期
		 */
		getDependenceDate(index) {
			if (index === 0) {
				return null
			}
			let lastData = this.data.peakSeasonTimeDetailDTOList[index - 1]
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
		 * 添加时间
		 */
		addItem(dataRow, index) {
			// 有结束日期 没填数据或者无结束日期没填开始日期 禁止添加下一条
			let dataList = this.data.peakSeasonTimeDetailDTOList.filter(itemRow => this.$isEmpty(itemRow.rangTime) && !itemRow.endTimeFlag || itemRow.endTimeFlag && this.$isEmpty(itemRow.startTime))
			if (this.$isNotEmpty(dataList)) {
				this.$message.error(this.getZH('errTips'))
				return false
			}
			// 如果当前没有结束日期 添加到上一行
			let data = {
				startTime: '',
				endTime: '',
				rangTime: [],
				endTimeFlag: false
			}
			if (dataRow.endTimeFlag) {
				this.data.peakSeasonTimeDetailDTOList.splice(index, 0, data)
			} else {
				this.data.peakSeasonTimeDetailDTOList.push(data)
			}
		},
		/**
		 * 删除单条数据
		 */
		removeItem(index) {
			this.data.peakSeasonTimeDetailDTOList.splice(index, 1)
		},
		/**
	 * 是否有旺季变更
	 */
		changeSeason(val) {
			if (!val) {
				this.$confirm(this.getZH('confirm'), this.getZH('tips'), {
					confirmButtonText: this.getZH('confirmBtn'),
					cancelButtonText: this.getZH('cancel'),
					type: 'warning'
				}).then(() => {
					this.data.peakSeasonTimeDetailDTOList = []
				}).catch(() => {
					this.data.peakSeasonTimeFlag = true
				})

			} else {
				let peakSeasonTimeDetailDTOList = [{
					serial: 0,
					startTime: '',
					endTime: '',
					rangTime: [],
					endTimeFlag: false
				}]
				this.$set(this.data, 'peakSeasonTimeDetailDTOList', peakSeasonTimeDetailDTOList)
			}
		}
	}
}
</script>

<style scoped lang="less">
</style>
