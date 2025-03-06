<template>
  <div class="set-search-date">
     <el-date-picker
      size="mini"
      v-model="startValue"
      :type="type"
      :placeholder="$t('common.startDate')"
      @change="startChange"
      :picker-options="startPickerOptions"
      :value-format="valueFormat"
      :disabled="disabledStart"
      :clearable="clearable">
    </el-date-picker>
    <span style="padding: 0 4px;">-</span>
    <el-date-picker
      size="mini"
      v-model="endValue"
      :picker-options="endPickerOptions"
      :value-format="valueFormat"
      :type="type"
      :default-time="defaultEndTime"
      :disabled="disabledEnd"
      :placeholder="$t('common.endDate')"
      @change="endChange"
      :clearable="clearable">
    </el-date-picker>
  </div>
</template>
<script>
import { parse } from 'bowser'

export default {
	name: "SearchDatePicker",
	props: {
    type: {
      type: String,
      default: "date"
    },
		value: {
			type: Array,
			default: function() {
				return []
			}
		},
		valueFormat: {
			type: String,
			default: 'timestamp'
		},
		disabledStart: {
			type: Boolean,
			default: false
		},
		disabledEnd: {
			type: Boolean,
			default: false
		},
		clearable: {
			type: Boolean,
			default: true
		},
		// 限定只能取2个默认值中间的值
		// 且固定某个值不能更改
		defaltLimit: {
			type: Array,
			default: function() {
				return []
			}
		},
    defaultEndTime: {
      type: String,
      default: '00:00:00'
    },
    pickerOptionsStart:{
			type: Object,
			default: function() {
				return {}
			}
		},
    pickerOptionsEnd:{
			type: Object,
			default: function() {
				return {}
			}
		}
	},
	watch: {
		value: {
			handler(val) {
				this.startValue = val[0] ? parseInt(val[0], 10) : ''
				this.endValue = val[1] ? parseInt(val[1], 10) : ''
				if (this.defaltLimit && this.defaltLimit.length > 0) {
					let startValue = this.defaltLimit[0] ? parseInt(this.defaltLimit[0], 10) : ''
					let endValue = this.defaltLimit[1] ? parseInt(this.defaltLimit[1], 10) : ''
					// 根据值去设定选择范围
					this.setStartPickerOptions(endValue)
					this.setEndPickerOptions(startValue)
				} else {
          // 根据值去设定选择范围
					this.setStartPickerOptions(this.endValue)
					this.setEndPickerOptions(this.startValue)
        }
			},
			deep: true,
			immediate: true
		}
	},
	data() {
		return {
			startValue: '',
			endValue: '',
			endPickerOptions: {},
			startPickerOptions: {}
		}
	},
	methods: {
		setEndPickerOptions(startValue) {
      if(this.pickerOptionsEnd.disabledDate) {
        this.endPickerOptions = {
          ...this.pickerOptionsEnd
        }
        console.log(this.endPickerOptions)
        return
      }
			this.endPickerOptions = {
				disabledDate(time) {
					if (startValue) {
						return time.getTime() < new Date(startValue).getTime()
					} else {
						return false
					}
				}
			}
		},
		setStartPickerOptions(endValue) {
      if(this.pickerOptionsStart.disabledDate) {
        this.startPickerOptions = {
          ...this.pickerOptionsStart
        }
        return
      }
			this.startPickerOptions = {
				disabledDate(time) {
					if (endValue) {
						return time.getTime() > new Date(endValue).getTime()
					} else {
						return false
					}
				}
			}
		},
    dateChange() {
      // 如果么有设置 限定某个固定值的范围 则可以根据选的动态来设定
			// 开始时间默认为00:00:00 结束时间拼接23:59:59
			let endValue = this.endValue
			let startValue = this.startValue
			if (this.type === 'date') {
        if (this.startValue) {
          startValue = this.$moment(this.startValue).startOf('day').valueOf()
        }
        if (this.endValue) {
          endValue = this.$moment(this.endValue).endOf('day').valueOf()
        }
      }
      if(startValue || endValue) {
        this.$emit('input', [startValue, endValue])
      } else {
        this.$emit('input', [])
      }
			this.$emit('change')
    },
    startChange() {
      // 如果么有设置 限定某个固定值的范围 则可以根据选的动态来设定
			this.setEndPickerOptions(this.startValue)
			this.dateChange()
		},
		endChange() {
      // 如果么有设置 限定某个固定值的范围 则可以根据选的动态来设定
			this.setStartPickerOptions(this.endValue)
			this.dateChange()
		}
	}
}
</script>

<style lang="scss" scoped>
.set-search-date {
	::v-deep .el-date-editor {
		width: 130px !important;
	}

  ::v-deep .el-date-editor.el-date-editor--datetime{
		width: 180px !important;
	}
}
</style>
