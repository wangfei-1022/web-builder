<template>
  <el-select :value="value"  filterable size="mini" @change="selChange" allow-create default-first-option :disabled="disabled">
    <el-option v-for="(opt,index) in opts" :key="index" :label="opt" :value="opt" />
  </el-select>
</template>
<script>
import {seaCityListApi} from "@/api/seaExportOrder"

export default {
  name: 'SeaCitySelect',
  props: {
    value: { type: String, default: null },
    type: { type: Number, default: 1 },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      opts: []
    }
  },
  created() {
    this.getSeaCityListApi(this.type)
  },
  methods: {
    async getSeaCityListApi(type) {
      this.loading = true
      const res = await seaCityListApi(type)
      this.loading = false
      if (res.ok) {
        this.opts = res.content
      }
    },
    selChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
