<template>
  <el-select
    v-model="selectValue"
    style="width: 100%"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :placeholder="placeholder"
    :collapse-tags="collapseTags"
    @change="changeFn">
    <el-option v-for="item in optionList" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]" />
  </el-select>
</template>

<script>
import { getCountryListApi } from "@/api/country";
import { getYHTListApi, getRechargeModeApi } from "@/api/partner/base";
import { getBusinessTypeListApi, getSalesListApi } from "@/api/partner/customerManage";
import { getCurrenciesListApi, getDepartmentListApi, getSettementCompanyTypeListApi, getCustomerServiceListApi, getUserDropDownList } from "@/api/common"

export default {
	name: "BaseSelect",
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    value: {
      type: [String, Number, Array],
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: function () {
        return {}
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    addAll: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
    }
  },
  // 重置的时候需要 监听到
  watch: {
		value: {
			handler(val) {
        this.selectValue = val
			}
		}
	},
	data() {
    return {
      dictCode: null,
      selectValue: null,
      optionList: [],
      valueKey: 'code',
      labelKey: 'name'
    }
  },
  created() {
    this.selectValue = this.value
    let fn = null
    switch (this.type) {
      case 'businessType':
        this.valueKey = 'code'
        this.labelKey = 'chineseName'
        fn = getBusinessTypeListApi
      break;
      case 'currency':
        fn = getCurrenciesListApi
      break;
      case 'country':
        this.valueKey = 'code2'
        this.labelKey = 'chineseName'
        fn = getCountryListApi
      break;
      case 'settlementMode':
        fn = getRechargeModeApi
      break;
      // 结算分公司
      case 'settlementOffice':
        this.valueKey = 'value'
        this.labelKey = 'label'
        fn = getYHTListApi
      break;
      // 根据业务类型获取应付供应商结算单位类型列表
      case 'payableSettementCompanyType':
        fn = getSettementCompanyTypeListApi
      break;
      // 销售
      case 'sale':
        this.valueKey = 'id'
        this.labelKey = 'chineseName'
        fn = getSalesListApi
      break;
      // 客服
      case 'customerService':
        this.valueKey = 'id'
        this.labelKey = 'chineseName'
        fn = getCustomerServiceListApi
      break;
      // 部门（如果未来有树形结构的数据支撑，在挪出来做树形）
      case 'department':
        this.valueKey = 'value'
        this.labelKey = 'label'
        fn = getDepartmentListApi
      break;
      // 用户
      case 'user':
        this.valueKey = 'id'
        this.labelKey = 'chineseName'
        fn = getUserDropDownList
      break;
      default:
      break;
    }
    if (fn) {
      let data = this.dictCode ? this.dictCode : this.params
      fn(data).then(res => {
        if (res.ok) {
          this.optionList = res.content
          if (this.addAll) {
            this.optionList.unshift({
              [this.valueKey]: '',
              [this.labelKey]: this.$t('common.ALL')
            })
          }
        }
      })
    }
  },
  methods: {
    changeFn() {
      this.$emit('input', this.selectValue)
      if(this.multiple) {
        let list = []
        this.optionList.forEach(v => {
          if (this.selectValue.indexOf(v[this.valueKey]) >= 0) {
            list.push(v)
          }
        })
        this.$emit('selected', list)
        this.$emit('change', list)
      } else {
        let item = {}
        this.optionList.forEach(v => {
          if (v[this.valueKey] === this.selectValue) {
            item = v
          }
        })
        this.$emit('selected', item)
        this.$emit('change', item)
      }
    }
  }
}
</script>
