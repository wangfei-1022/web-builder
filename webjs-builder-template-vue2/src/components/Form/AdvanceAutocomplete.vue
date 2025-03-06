<template>
  <el-autocomplete
    :popper-append-to-body="false"
    class="cargo-advance-autocomplete"
    clearable
    :loading="loading"
    size="mini"
    :disabled="disabled"
    @change="change"
    v-model="modelValue"
    :fetch-suggestions="remoteMethod"
    placeholder="请输入内容"
    @select="handleSelect"
  >
    <template slot-scope="{ item }">
      <div class="view-content">
        <div class="item" v-for="(field) in fields" :key="field">{{ item[field] }}</div>
      </div>
    </template>
  </el-autocomplete>
</template>
<script>
export default {
	name: 'AdvanceAutocomplete',
	props: {
		value: {
			type: [String, Array]
		},
		// 远程请求
		method: { type: Function, default: null },
		// 不可编辑
		disabled: { type: Boolean, default: false },
		// 是否有清空按钮操作
		clearable: { type: Boolean, default: true },
		// 是否允许创建新条目进行选择
		allowCreate: { type: Boolean, default: false },
		// 是否多选
		multiple: { type: Boolean, default: false },
		placeholder: { type: String, default: '请输入关键词' },
		// 远程搜索间隔时间
		wait: { type: Number, default: 200 },
		// 要取来显示到select框内的字段名
		valueKey: { type: String, default: 'code5' },
		labelKey: { type: String, default: 'id' },
		disabledKey: { type: String, default: null },
		// 固定的select的option
		fixedOptions: { type: Array, default: null },
		// 构造option的头部
		headers: { type: Array, default: () => [] },
		fields: { type: Array, default: () => [] },
		// 是否显示options 头部提示文字
		tips: { type: Boolean, default: true },
		// 是否显示options 头部提示文字
		defaultDisplay: { type: String, default: '' }
	},
	data() {
		return {
			modelValue: '',
			loading: false,
			options: [],
			map: {}
		}
	},
	watch: {
		value: {
			handler(newV, oldV) {
				this.modelValue = newV
        this.initOptions()
			},
			immediate: true
		}
	},
	created() {
		this.modelValue = this.value
	},
	methods: {
    initOptions() {
      // 构造初始化的options
      if (this.options.length === 0 && this.value) {
        // 多选的 数组传入
        if (Array.isArray(this.defaultDisplay) && this.defaultDisplay.length > 0) {
          this.options = this.defaultDisplay
          return
        }
        // 单选的构造
        if (this.value && typeof this.defaultDisplay === 'string') {
          this.options = [{
            [this.valueKey]: this.value,
            [this.labelKey]: this.defaultDisplay
          }]
        }
      }
    },
		remoteMethod(keyword, cb) {
			if (keyword) {
        this.fetchList(keyword, cb)
      } else {
        cb([])
      }
		},
		fetchList(keyword, cb) {
			keyword = keyword.trim()
			const fn = this.method
			if (!fn) {
				console.error('请先设置请求数据的接口')
				return
			}
			this.loading = true
			fn({ keyword: keyword }).then(res => {
				let arr = []
				if (res.content.list === undefined) {
					arr = res.content || []
				} else {
					arr = res.content.list || []
				}
				const optionsMap = {}
				arr.forEach(ex => {
					optionsMap[ex[this.valueKey]] = ex
				})
				this.optionsMap = optionsMap
        cb(arr)
				this.options = arr
				this.loading = false
			})
		},
    handleSelect(item) {
      console.log('selected')
      this.modelValue = item[this.labelKey]
      this.$emit('selected', item || {})
      this.$emit('input', this.modelValue)
    },
		change() {
      console.log('change')
      this.$emit('input', this.modelValue)
      this.$emit('selected', {})
		}
	}
}
</script>
<style scoped lang="scss">
::v-deep .el-popper{
  width: 400px!important;
}

.cargo-advance-select {
	width: 100%;
}

.view-content {
	display: flex;
	justify-content: space-between;
	min-width: 380px !important;
	max-width: 700px !important;
}

.tip-count-options {
	padding-top: 10px;
	padding-left: 18px;
	font-size: 14px;
	color: rgb(192, 196, 204);
	height: 36px;
	top: 0px;
	background: rgb(252, 252, 252);
	z-index: 1000;
}

.item {
	float: left;
	flex: 1;
	padding: 0 5px;
}
</style>
