<template>
  <el-select
    v-model="modelValue"
    class="cargo-advance-select"
    :style="{position:'relative'}"
    :remote-method="remoteMethod"
    :loading="loading"
    :placeholder="placeholder"
    :clearable="clearable"
    :multiple="multiple"
    :allow-create="allowCreate"
    filterable
    remote
    reserve-keyword
    size="mini"
    :disabled="disabled"
    @change="change"
    value-key="id"
  >
    <div v-if="tips && options.length">
      <div class="tip-count-options w-full view-content">下表仅显示前100条满足检索条件的记录</div>
      <el-option key="header" :disabled="true" value="header" class="w-full view-content">
        <slot>
          <div v-for="(field) in headers" :key="field" class="item">{{ field }}</div>
        </slot>
      </el-option>
    </div>
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :disabled="disabledKey ? item[disabledKey] : false"
      :label="item[labelKey]"
      :value="item[valueKey]"
      :class="tips?'w-full view-content':''"
    >
      <slot name="option" :row="item" />
      <slot>
        <div v-for="(field) in fields" :key="field" class="item">{{ item[field] }}</div>
      </slot>
    </el-option>
  </el-select>

</template>
<script>

// multiple + filterable
// multiple 得配合 filterable 一起使用，不然的话会有回显BUG
export default {
	name: 'AdvanceSelect',
	props: {
		value: {
			type: [String, Array]
		},
		// 远程请求
		method: { type: Function, default: null },
		// 检索
		filterable: { type: Boolean, default: false },
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
		// 回显
		defaultDisplay: { type: [String, Object, Array], default: '' }
	},
	data() {
		return {
			modelValue: '',
			loading: false,
			options: [],
			map: {},
      filterInitOnece: false,
      optionsAll: []
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
      // 构造初始化的options 基本限定编辑回显的时候 只会回显一次
      if (this.options.length === 0 && this.value) {
         // 多选的 数组传入
        if (Array.isArray(this.defaultDisplay) && this.defaultDisplay.length > 0) {
          this.options = this.defaultDisplay
          return
        }
        // 单选的构造
        if (!this.multiple && this.value && typeof this.defaultDisplay === 'string') {
          this.options = [{
            [this.valueKey]: this.value,
            [this.labelKey]: this.defaultDisplay
          }]
        }
      }
    },
    filterDataFn(keyword) {
      if (this.filterInitOnece) {
        // 自动过滤
        let arr = []
        let keywordStr = keyword.trim()
        this.optionsAll.forEach(v => {
          for (let i = 0; i < this.fields.length; i++) {
            let filed = this.fields[i]
            if (!keywordStr || v[filed].indexOf(keywordStr) >= 0) {
              arr.push(v)
              break;
            }
          }
        })
        this.options = arr 
      }
    },
		async remoteMethod(keyword) {
      if (this.filterable) {
        if (this.filterInitOnece) {
          // 直接依赖本地数据进行过滤
          this.filterDataFn(keyword)
        } else {
          this.filterInitOnece = true
          // 如果启用多选，须第一次即刻获取全部数据，然后利用本地检索，不然再次搜索出的数据会导致回显问题
          await this.fetchList('')
          // 接口只提供拉取全部数据 需要本地进行过滤
          this.filterDataFn(keyword)
        }
      } else {
        this.fetchList(keyword)
      }
		},
		async fetchList(keyword) {
			keyword = keyword.trim()
			const fn = this.method
			if (!fn) {
				console.error('请先设置请求数据的接口')
				return
			}
			this.loading = true
			const res = await fn({ keyword: keyword })
      let arr = []
      const optionsMap = {}
      if(res.ok) {
        if (Array.isArray(res.content.list)) {
          arr = res.content.list
        } else if(Array.isArray(res.content)) {
          arr = res.content
        }
        arr.forEach(ex => {
          optionsMap[ex[this.valueKey]] = ex
        })
      }
      this.optionsMap = optionsMap
      this.options = arr
      this.optionsAll = arr
      this.loading = false
		},
		change() {
			if (!this.multiple) {
				const item = this.optionsMap && this.optionsMap[this.modelValue]
				this.$emit('input', this.modelValue)
				// 在查询时候使用selected去触发list，
				// v-model的value还未更新到表单数据上
				// 需等待next tick
				this.$nextTick(() => {
					this.$emit('selected', item || {})
				})
			} else {
				const items = []
        this.modelValue.forEach(ex => {
            items.push(this.optionsMap[ex])
        })
				this.$emit('input', this.modelValue)
				this.$nextTick(() => {
					this.$emit('selected', items)
				})
			}
		},
    clear() {
      // this.value = ''
      this.options = []
    },
		clearOption() {
			this.options = []
		}
	}
}
</script>
<style scoped lang="scss">
.cargo-advance-select {
	width: 100%;
}

.view-content {
	display: flex;
	justify-content: space-between;
	min-width: 400px !important;
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
