<!--待废弃，请谨慎使用。若使用相关功能，请查看cargoAdvanceSelect组件-->
<template>
  <el-tooltip :content="tips" :disabled="!tips" class="item" effect="light" placement="right">
    <el-select
      v-model="companyValue"
      size="mini"
    >
      <el-option
        v-for="item in list"
        :key="item.id"
        :label="item.chineseName"
        :value="item.id"
      />
    </el-select>
  </el-tooltip>
</template>

<script>
import { getCompanyList } from '@/api/commonComponent'
export default {
  name: 'CompanySelect',
  props: {
    'value': { type: String, default: '' },
    method: { type: Function, default: getCompanyList },
    methodParams: { type: Object, default: () => {}}
  },
  data() {
    return {
      companyValue: this.value,
      list: [],
      tips: ''
    }
  },
  watch: {
    companyValue(newVal, oldVal) {
      this.$emit('set', newVal)
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.toGetCompanyValue().then(res => {
        if (res.ok && res.content) {
          this.list = res.content
          // this.value = this.value || this.list[0].value
        } else {
          return Promise.reject(res.message)
        }
      }).catch(err => {
        this.tips = err
      })
    },
    toGetCompanyValue() {
      return this.method(this.methodParams)
    }
  }

}

</script>
