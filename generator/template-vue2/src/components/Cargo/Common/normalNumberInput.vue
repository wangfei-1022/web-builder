<template>
  <el-input v-model="inputVal" :size="size" :disabled="disabled" :maxlength="maxLength" placeholder="请输入" @input="setInputVal" />
</template>
<script>
export default {
  name: 'NormalNumberInput',
  props: {
    size: {
      type: String,
      default: 'small'
    },
    maxLength: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    inputVal: {
      get: function() {
        return this.value
      },
      set: function(val) {
        return val
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    setInputVal(val) {
      const value = val.replace(/[^\d]/g, '')
      this.$emit('input', value)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-input--mini > .el-input__inner{
  width: 178px;
}
::v-deep .el-input--small > .el-input__inner{
  width: 199px;
}
</style>
