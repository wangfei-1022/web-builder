<template>
  <el-select v-model="selVal" :placeholder="$t('sea.placeholder')" filterable @change="selChange" size="mini">
    <el-option v-for="(item, index) in cargoTypeList" :label="item" :value="item" :key="index"></el-option>
  </el-select>
</template>
<script>
export default {
  name: 'GoodsType',
  props: {
    value: { type: String, default: null }
  },
  data() {
    return {
      cargoTypeList: ['GC', 'RF', 'DG'], // 货物类型 默认选择GC
      selVal: null
    }
  },
  watch: {
    value() {
      if (!this.selectValue) {
        this.selVal = this.value
      }
    }
  },
  created() {
    this.selVal = this.value
  },
  methods: {
    selChange(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
