<template>
  <el-select
    v-model="valueObj"
    :value-key="valueKey"
    :loading="loading"
    remote
    :remote-method="remoteMethod"
    :placeholder="placeholder"
    size="mini"
    filterable
    clearable
    :disabled="disabled" >
    <el-option v-for="item in resultList" :label="item[labelKey]" :value="item" :key="item[valueKey]">
      <span style="float: left" v-if="labelKey != 'plateNo'">{{ item[labelKey] }}</span>
      <span style="float: right; color: #8492a6;" v-if="labelKey != 'plateNo'">{{ item.plateNo }}</span>
    </el-option>
  </el-select>
</template>
<script>

export default {
  name: 'RemoteSearchInput',
  props: {
    value: {
      type: Object,
      default: () => null
    },
    valueKey: {
      type: String,
      default: ''
    },
    labelKey: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    remoteApi: {
      type: Function,
      default: () => false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resultList: [],
      loading: false
    }
  },
  computed: {
    valueObj: {
      get: function() {
        return this.value
      },
      set: function(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        // 修改时 value 有值而 resultList没有对应的
        // 默认给 resultList赋值
        if (newVal && this.resultList.length === 0) {
          this.resultList.push(this.value)
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async remoteMethod(_str) {
      this.loading = true
      // const _res = await getRemoteMemberApi({ keyword: _str })
      const res = await this.remoteApi({ keyword: _str.trim() })
      if (res.ok && res.content) {
        // mergeKey 判断是否需要特殊处理valueKey
        if (this.valueKey === 'mergeKey') {
          this.resultList = []
          res.content.map(item => {
            this.resultList.push({
              mergeKey: `${item.plateNo}_${item.driver}_${item.driverPhone}`,
              plateNo: item.plateNo,
              driver: item.driver,
              driverPhone: item.driverPhone,
              carModel: item.carModel
            })
          })
        } else {
          this.resultList = res.content
        }
      }
      this.loading = false
    },
    clearInfo() {
      this.resultList = []
      this.valueObj = null
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
