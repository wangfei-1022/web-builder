<template>
  <el-select
    v-model="valueStr"
    clearable
    filterable
    remote
    size="mini"
    :placeholder="$t('charteredBoat.memberPlaceholder')"
    :remote-method="remoteMethod"
    :loading="loading"
    :disabled="disabled"
    @change="handleSelectorChange"
    @clear="clearSelect"
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
import { getRemoteMemberApi } from '@/api/user'
export default {
  name: 'RemoteSearchInput',
  props: {
    value: String,
    optionsPorp: { type: Array, default: () => [] },
    defaultOps: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false }
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
    value(val) {
      this.valueStr = val
    },
    optionsPorp() {
      this.init()
    },
    defaultOps() {
      this.init()
    }
  },
  created() {},
  mounted() {
    this.valueStr = this.value
    this.init()
  },
  methods: {
    init() {
      if (this.$isNotEmpty(this.optionsPorp)) {
        this.options = this.optionsPorp

      } else if (this.$isNotEmpty(this.defaultOps)) {
        this.options = this.defaultOps
      }
    },
    async remoteMethod(_str) {
      console.log(_str)
      if (_str) {
        this.loading = true
        const _res = await getRemoteMemberApi({ keyword: _str })
        if (_res.ok && _res.content) {
          this.options = _res.content.map(item => ({
              value: item.id,
              label: item.name
            }))
        }
        this.loading = false
      } else if (this.$isNotEmpty(this.defaultOps)) {
        this.options = this.defaultOps
      }
    },
    clearSelect() {
      if (this.$isNotEmpty(this.defaultOps)) {
        this.options = this.defaultOps
      }
    },
    handleSelectorChange(val) {
      const findData = this.options.find(item => item.value === val) || {}
      this.$emit('input', this.valueStr)
      this.$emit('selectorChange', val, findData.label)
    }
    // handleClearChange(val) {
    //   this.$emit('input', this.valueStr)
    //   this.$emit('selectorChange', val)
    // }
  }
}
</script>
<style lang="scss" scoped>
</style>
