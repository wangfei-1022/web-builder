<template>
  <el-select v-model="selectValue" style="width: 100%" :filterable="filterable" :multiple="multiple" :clearable="clearable" :disabled="disabled" @change="changeFn">
    <el-option v-for="item in optionList" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]" />
  </el-select>
</template>

<script>
import { 
  getDictListApi, 
  getAbnormalityStateListApi, 
  getPreocessPlanListApi, 
  getPreocessPlanStateListApi, 
  getAbnormalityTypeListApi,
  getChargeItemApi 
} from "@/api/uexpress/base";

export default {
	name: "UexpressSelect",
  props: {
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
    disabled: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    addALL: {
      type: Boolean,
      default: false
    },
    addAll: {
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
    this.init()
  },
  methods: {
    init() {
      let fn = null
      switch (this.type) {
        // 订单状态
        case 'orderState':
          fn = getDictListApi
          this.dictCode = 18
        break;
        // 异常订单状态
        case 'abnormalityState':
          fn = getAbnormalityStateListApi
        break;
        // 异常订单状态
        case 'abnormalityType':
          fn = getAbnormalityTypeListApi
        break;
        // 处理方案
        case 'abnormalityProcessPlan':
          fn = getPreocessPlanListApi
        break;
        // 处理状态
        case 'abnormalityProcessState':
          fn = getPreocessPlanStateListApi
        break;
        // 确认单类型
        case 'confirmationType':
          fn = getDictListApi
          this.dictCode = 49
        break;
        // 清关数据状态
        case 'importDeclareState':
          fn = getDictListApi
          this.dictCode = 19
        break;
        // 尾程推送状态
        case 'lastMileManifestState':
          fn = getDictListApi
          this.dictCode = 40
        break;
        // 订单支付状态
        case 'salesSettlementState':
          fn = getDictListApi
          this.dictCode = 10
        break;
        // 订单取号状态
        case 'channelPushState':
          fn = getDictListApi
          this.dictCode = 11
        break;
        // 产品类型-业务类型
        case 'productType':
          fn = getDictListApi
          this.dictCode = 4
        break;
        // 度量单位
        case 'unitGroup':
          fn = getDictListApi
          this.dictCode = 32
        break;
        // 费用项
        case 'chargeItem':
          fn = getChargeItemApi
          this.valueKey = 'feeItemCode' 
          this.labelKey = 'feeItemName'
        break;
        default:
        break;
      }
      if (fn) {
        let data = this.dictCode ? this.dictCode : this.params
        fn(data).then(res => {
          if (res.ok) {
            this.optionList = res.content.list || res.content
            if (this.addAll || this.addALL) {
              this.optionList.unshift({
                [this.valueKey]: '',
                [this.labelKey]: this.$t('common.ALL')
              })
            }
          }
        })
      }
    },
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
