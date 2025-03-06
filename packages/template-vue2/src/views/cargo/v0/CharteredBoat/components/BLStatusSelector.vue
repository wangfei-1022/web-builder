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
  name: 'BLStatusSelector',
  props: {
    value: Number,
    typePage: {
      type: Number,
      default: 1
    }
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
          label: this.$t('common.waitForVerify'),
          value: 2
        },
        {
          label: this.$t('common.verified'),
          value: 3
        },
        {
          label: this.$t('common.rejected'),
          value: 4
        },
        {
          label: this.$t('common.signed'),
          value: 5
        },
        {
          label: this.$t('boatBlList.askRelease'),
          value: 6
        },
        {
          label: this.$t('boatBlList.releaseOrder'),
          value: 7
        }
      ]
    }
  },
  watch: {
    value(val) {
      this.valueStr = val
    }
  },
  created() {
    if (this.typePage === 1) {
      this.selectorList.splice(1, 0, {
        label: this.$t('boatBlList.unfill'),
        value: 1
      })
      this.selectorList.unshift()
    } else {
      this.selectorList.push({
        label: this.$t('common.deleted'),
        value: 8
      })
    }
  },
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
