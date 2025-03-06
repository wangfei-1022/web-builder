<template>
	<span>
		<el-date-picker
			v-if="!rangePicker"
			v-model="currDate"
			:class="['sigle-date-picker', parentClass]"
			:type="typeStr"
			:size="size"
			:clearable="clearable"
			:format="formatStr"
			:value-format="valueFormat"
			:placeholder="placeholder"
			:picker-options="pickerOptionsCurrent"
			:style="{ width: customWidth }"
			:disabled="disabled"
			:default-value="defaultValue"
			:default-time="defaultTimeStr"
		/>
		<el-date-picker
			v-if="rangePicker"
			v-model="currRangeDate"
			:class="['range-date-picker', parentClass]"
			:type="typeStr"
			:size="size"
			:clearable="clearable"
			:format="formatStr"
			:value-format="valueFormat"
			:unlink-panels="unlinkPanels"
			range-separator="-"
			:start-placeholder="$t('common.startDate')"
			:end-placeholder="$t('common.endDate')"
			:picker-options="pickerOptionsCurrent"
			:disabled="disabled"
			:default-value="defaultValue"
			:default-time="defaultTime"
		/>
	</span>
</template>

<script>
import moment from 'moment'
export default {
	name: 'CommonPicker',
	props: {
		/*
		 * pickerFormat 选择器显示的日期格式; 参阅: elementui datepicker
		 * parentDate 单一日期选择时的父组件日期值;
		 * parentRangeDate 范围选择时的父组件日期值 Array [12123132121, 12313121321]
		 * zone 不同时区的偏移值 中国 +8:00
		 * unlinkPanels 范围选择时，是否联动前后面板
		 * colSpace 一行多列时，每列宽度是否自适应
		 * parentClass 自定义样式
		 * size 控件尺寸 同官方size
		 * clearable 是否带清楚按钮 同官方clearable
		 * UTC 设置控件的取值和回显都是以零时区为基准
		 */
		pickerFormat: {
			type: String,
			default: ''
		},
		format: {
			type: String,
			default: ''
		},
		valueFormat: {
			type: String,
			default: 'timestamp'
		},
		value: [Number, String, Array],
		parentDate: {
			type: [Number, String],
			default: null
		},
		dependenceDate: {
			type: Number,
			default: null
		},
		startDependence: {
			type: Number,
			default: null
		},
		endDependence: {
			type: Number,
			default: null
		},
		pickerOptions: {
			type: [Object],
			default: function() {
        return {}
      }
		},
		parentOption: {
			type: [String, Object],
			default: 'default'
		},
		// 默认是当前时区
		// 当前是北京东八区
		zone: {
			type: Number,
			default: 0 - new Date().getTimezoneOffset() / 60
		},
		pikcerType: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: ''
		},
		unlinkPanels: {
			type: Boolean,
			default: true
		},
		colSpace: {
			type: Boolean,
			default: false
		},
		parentClass: {
			type: String,
			default: ''
		},
		size: {
			type: String,
			default: 'mini'
		},
		clearable: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: '请选择日期'
		},
		defaultValue: {
			type: Date,
			default: () => new Date()
		},
		defaultTime: {
			type: [Array],
			default: () => ['00:00:00', '00:00:00']
		},
		defaultTimeStr: {
			type: [String],
			default: '00:00:00'
		},
		useUTC: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			offsetZone: null,
			offsetZoneTime: null
		}
	},
	computed: {
		formatStr() {
			return this.pickerFormat || this.format || 'yyyy-MM-dd'
		},
		typeStr() {
			return this.pikcerType || this.type || 'date'
		},
		currDate: {
			get() {
				if (this.valueFormat === 'timestamp' && this.value) {
					return parseInt(this.value, 10) + this.offsetZoneTime
				}
				return this.value
			},
			set(val) {
				if (this.valueFormat === 'timestamp' && val) {
					val = parseInt(val, 10) - this.offsetZoneTime
				}
				this.$emit('input', val)
				this.$emit('handleDateChange', val)
				this.$emit('change', val)
				return val
			}
		},
		currRangeDate: {
			get() {
				if (this.valueFormat === 'timestamp') {
					let arr = []
					if (this.$isEmpty(this.value)) {
						return arr
					}
					if (this.value[0] || this.value[1]) {
						arr[0] = this.value[0] ? parseInt(this.value[0], 10) + this.offsetZoneTime : null
						arr[1] = this.value[1] ? parseInt(this.value[1], 10) + this.offsetZoneTime : null
					}
					return arr
				}
				return this.value
			},
			set(val) {
				val = val || []
				if (this.valueFormat === 'timestamp' && this.$isNotEmpty(val)) {
					val[0] = val[0] ? parseInt(val[0], 10) - this.offsetZoneTime : null
					val[1] = val[1] ? parseInt(val[1], 10) - this.offsetZoneTime : null
				}
				this.$emit('input', val)
				this.$emit('handleDateRangeChange', val)
				this.$emit('change', val)
				return val
			}
		},

		rangePicker() {
			return this.pikcerType.indexOf('range') > 0 || this.type.indexOf('range') > 0
		},
		customWidth() {
			return this.colSpace ? '100%' : 'auto'
		},
		pickerOptionsCurrent() {
			/*
			* parentOption picker-option 规则;
			* parentOption: previousDate 禁用大于当前Date的日期;
			* parentOption: followingDate 禁用小于档期 Date 的日期;
			* parentOption: previousDependence 禁用大于 dependenceDate 的日期;
			* parentOption: followingDependence 禁用小于 dependenceDate 的日期;
			* parentOption: betweenDependence 只能使用 betweenDependence 之内的日期;
			*/
      if(Object.keys(this.pickerOptions).length > 0) {
        return this.pickerOptions
      }
			if (typeof this.parentOption === 'object') {
				return this.parentOption
			} else if (this.parentOption === 'default') {
				return true
			} else if (this.parentOption === 'previousDate') {
				return {
					disabledDate: time => time.getTime() > new Date().getTime()
				}
			} else if (this.parentOption === 'followingDate') {
				return {
					disabledDate: time => time.getTime() < new Date().getTime()
				}
			} else if (this.parentOption === 'NOT_FORWARD_DATE') {
				return {
					disabledDate: time => time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
				}
			} else if (this.parentOption === 'previousDependence') {
				if (this.dependenceDate || this.startDependence || this.endDependence) {
					return {
						disabledDate: time => time.getTime() > (this.dependenceDate || this.startDependence || this.endDependence)
					}
				}
				return true
			} else if (this.parentOption === 'followingDependence') {
				if (this.dependenceDate || this.startDependence || this.endDependence) {
					return {
						disabledDate: time => time.getTime() < (this.dependenceDate || this.startDependence || this.endDependence)
					}
				}
				return true
			} else if (this.parentOption === 'betweenDependence') {
				if (this.startDependence && this.endDependence) {
					return {
						disabledDate: time => time.getTime() < this.startDependence || time.getTime() > this.endDependence
					}
				}
				return true
			} else {
				return true
			}
		}
	},
	created() {
		let zone = this.zone
		if (this.useUTC) {
			zone = 0
		}
		// 相对偏移时区
		this.offsetZone = zone + new Date().getTimezoneOffset() / 60
		this.offsetZoneTime = this.offsetZone * 60 * 60 * 1000
	},
	mounted() {
	},
	methods: {
		handleDateChange() { },
		handleDateRangeChange() { }
	}
}
</script>

<style lang='scss' scoped>
::v-deep.sigle-date-picker,
.range-date-picker {
	width: 100% !important;
	input {
		padding-right: 15px !important;
	}
}
.input-date-picker .range-date-picker {
	width: 220px !important;
}
</style>
