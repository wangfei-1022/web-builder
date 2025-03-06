<template>
  <el-select
    v-model="valueStr"
    clearable
    filterable
    remote
    size="mini"
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="handleSelectorChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
<script>

export default {
  name: 'RemoteSearchInput',
  props: {
    value: String,
    placeholder: {
      type: String,
      default: ''
    },
    remoteApi: {
      type: Function,
      default: () => false
    },
    defaultDisplay: {
      type: [String, Object, Array],
      default: ''
    }
  },
  data() {
    return {
      valueStr: '',
      results: [],
      options: [],
      loading: false
    }
  },
  computed: {
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.valueStr = newVal
        this.initOptions()
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    initOptions() {
      // 构造初始化的options 基本限定编辑回显的时候 只会回显一次
      if (this.options.length === 0 && this.value) {
        if (this.defaultDisplay instanceof Object) {
          if (Array.isArray(this.defaultDisplay)) {
            this.options = this.defaultDisplay
          } else {
            this.options = [this.defaultDisplay]
          }
        } else {
          // 如果是单个字符串
          if (this.multiple) {
            // 多选的 数组传入
            if (this.defaultDisplay.length > 0 && this.value.length > 0) {
              let arr = []
              this.value.forEach((v, index) => {
                arr.push({
                  value: v,
                  label: this.defaultDisplay[index]
                })
              })
              this.options = arr
            }
          } else {
            // 单选的构造
            if (this.defaultDisplay && this.value) {
              this.options = [{
                value: this.value,
                label: this.defaultDisplay
              }]
            }
          }
        }
      }
    },
    async remoteMethod(_str) {
      if (_str) {
        this.loading = true
        // const _res = await getRemoteMemberApi({ keyword: _str })
        const _res = await this.remoteApi({ keyword: _str })
        if (_res.ok && _res.content) {
          this.options = _res.content.map(item => {
            let _data = {
              value: item.id,
              label: item.name
            }
            return _data
          })
        }
        this.loading = false
      }
    },
    handleSelectorChange(val) {
      this.$emit('input', this.valueStr)
      this.$emit('selectorChange')
    },
    handleClearChange(val) {
      this.$emit('input', this.valueStr)
      this.$emit('selectorChange')
    },
    clearOptions() {
      this.options = []
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
