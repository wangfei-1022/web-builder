<template>
  <el-select size="mini" v-model="value" :default-first-option="true" @change="selected" clearable >
    <el-option
     v-for="item in selectorList"
     :key="item.value"
     :value="item.value"
     :label="item.label">
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: 'SplitOrderSelector',
  data() {
    return {
      value: null,
      selectorList: [
        {
          label: this.$t('common.all'),
          value: ''
        },
        {
          label: this.$t('common.trueText'),
          value: true
        },
        {
          label: this.$t('common.falseText'),
          value: false
        }
      ]
    }
  },
  methods: {
    selected() {
      this.$emit('selectorChange', this.value)
    }

  },
  created() {},
  mounted() {}
}
</script>
