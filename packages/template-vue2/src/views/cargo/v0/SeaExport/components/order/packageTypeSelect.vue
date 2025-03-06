<template>
  <el-select v-model="selVal" :placeholder="$t('sea.placeholder')" filterable @change="selChange" size="mini" :disabled="disabled">
    <el-option v-for="item in packageTypeList" :label="item.englishName" :value="item.englishName" :key="item.englishName"></el-option>
  </el-select>
</template>
<script>
import {dropdownlist} from "@/api/bl"

export default {
  name: 'PackageTypeSelect',
  props: {
    disabled: { type: Boolean, default: false },
    value: { type: String, default: null },
    packageTypeList: {
      type: Array, default: () => []
    }
  },
  data() {
    return {
      packageTypeOption: [], // 货物类型 默认选择GC
      selVal: null
    }
  },
  watch: {
    value(newVal) {
      this.selVal = newVal
    }
  },
  created() {
    this.selVal = this.value
    // 获取基础数据
    // dropdownlist({ termCode: 'PACKTYPE' }).then(res => {
    //   if (res.ok) {
    //     this.packageTypeOption = res.content
    //   }
    // })
  },
  methods: {
    selChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
