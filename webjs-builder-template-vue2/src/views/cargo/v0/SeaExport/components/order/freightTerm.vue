<template>
  <div>
    <el-radio-group v-model="freightTermCode" @change="freightTermChange" :disabled="disabled">
      <el-radio v-for="(item, index) in freightTermList" :label="item.code" :key="index">{{item.code}}</el-radio>
    </el-radio-group>
  </div>

</template>
<script>
import URL from '@/api/urlTranslator'
import lodash from 'lodash'
import {getContainerTypeList, getDmnTermItemList} from "@/api/seaExport"

export default {
  name: 'FreightTerm',
  props: {
    code: null,
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      selectObj: {
        freightTermCode: null,
        freightTerm: null
      },
      freightTermCode: null,
      freightTermList: [] // 付款方式,
    }
  },
  computed: {
    url() {
      return URL
    }
  },
  watch: {
    code(val) {
      if (!this.freightTermCode) {
        this.freightTermCode = val
      }
    }
  },
  created() {
    this.freightTermCode = this.code
    getDmnTermItemList({ termCode: 'PAYMODE' }).then(res => {
      this.freightTermList = res.content
    })
  },
  methods: {
    freightTermChange(code) {
      this.freightTermList.map(item => {
        if (item.code === code) {
          this.selectObj = {
              freightTermCode: code,
              freightTerm: item.englishName
          }
        }
      })
      this.$emit('change', this.selectObj)

    }
  }
}
</script>
<style lang="scss" scoped>

</style>
