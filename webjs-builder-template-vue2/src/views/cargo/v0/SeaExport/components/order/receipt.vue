<template>
  <el-select v-model="selectValue" :placeholder="$t('sea.placeholder')" filterable @change="receiptChange" size="mini">
    <el-option v-for="(item, index) in receiptList" :label="item.receiptCode" :value="item.receiptCode" :key="index"></el-option>
  </el-select>
</template>
<script>
import URL from '@/api/urlTranslator'
export default {
  name: 'Receipt',
  props: {
    value: { type: String, default: null }
  },
  data() {
    return {
      selectValue: null,
      receiptList: [{receiptCode: '111', receipt: '收货地描述'}]
    }
  },
  computed: {
    url() {
      return URL
    }
  },
  watch: {
    value() {
      if (!this.selectValue) {
        this.selectValue = this.value
      }
    }
  },
  created() {
    this.selectValue = this.value
  },
  methods: {
    receiptChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-bet{ display: flex; align-items:flex-start ; justify-content: space-between;flex-wrap:wrap;}
.box_title{ border-left: solid 3px rgb(24,144,255);font-size: 18px; color: #199ED8; padding-left: 8px; height: 28px; line-height: 28px; margin:5px 0 8px 0; display: flex;
  .operate-buttons-left{ margin-left: 20px}
}
.box{ background-color: #f5f7f7; padding: 8px;
  ::v-deep .el-form-item--medium{
    .el-form-item__content{ line-height: 28px}
    .el-form-item__label{ line-height: 28px}
  }
}
.box_child{border: solid 1px rgba(121, 121, 121, 1); padding: 20px 30px; background: #fff; margin-bottom: 15px;
  .box25{ width: 20%}
}
::v-deep .el-form--inline .el-form-item{ display: block}
//**
</style>
