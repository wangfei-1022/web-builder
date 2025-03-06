<template>
  <el-select v-model="valueStr" size="mini" :default-first-option="true" @change="selected">
    <el-option
      v-for="item in selectorList"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    />
  </el-select>
</template>
<script>
export default {
  name: 'VGMStatusSelector',
  props: {
    value: Number
  },
  data() {
    return {
      valueStr: null,
      selectorList: [
        {
          label: this.$t('common.all'),
          value: null
        },
        {
          label: this.$t('boatContainerList.unDeclare'),
          value: 1
        },
        {
          label: this.$t('boatContainerList.declared'),
          value: 2
        },
        {
          label: this.$t('common.rejected'),
          value: 3
        },
        {
          label: this.$t('common.passed'),
          value: 4
        }
      ]
    }
  },
  watch: {
    value(val) {
      this.valueStr = val
    }
  },
  created() {},
  mounted() {},
  methods: {
    selected() {
      this.$emit('input', this.valueStr)
      this.$emit('selectorChange')
    },
    handleClearChange() {
      this.$emit('input', this.valueStr)
      this.$emit('selectorChange')
    }
  }
}
</script>
