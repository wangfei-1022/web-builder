<!--仅用于千分位数字格式化-->
<template>
  <el-input v-model="value" :disabled="disabled" size="mini" class="cargo-number-input" :placeholder="placeholder" @change="onChange" @focus="onFocus" @blur="onBlur" />
</template>

<script>
import { formatThousandsToNumber, formatNumberToThousands, isNumber, cutOutDecimalNum } from '@/utils'
export default {
  name: 'CargoNumberInput',
  props: {
    showValue: { type: [String, Number], default: '0', required: true },
    decimalNum: { type: Number, default: 2 }, // 默认截取小数位数 2
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    showValue(newVal) {
      // 外面值初始时或不断改变时都会触发这个
      console.log('--CargoNumberInput---showvalue', newVal)
      console.log('--CargoNumberInput---showvalue==this.value', this.value)
      newVal = newVal + ''
      if (newVal === formatThousandsToNumber(this.value) + '' || newVal === this.value + '') {
        // 传入值和当前框值 相等，则不做其他处理 （进这个if的情况1、watched value 逻辑中$emit出去的值，再进来showValue）
        return
      } else {
        this.value = formatNumberToThousands(newVal)
      }
    },
    value(newVal, oldVal) {
      let value = 0
      newVal = newVal + ''
      if (isNumber(newVal)) {
        console.log('if isNumber(newVal) ', newVal)
        value = newVal
      } else {
        if (newVal.lastIndexOf('.') === newVal.length - 1) { // 以小数点结尾，则不做处理（）
          return
        }
        console.log('else isNumber(newVal) ', newVal)
        value = formatThousandsToNumber(newVal) // 转为数字
      }
      if (!isNumber(value)) { // 经前述代码处理后，还不是数字，直接返回旧值
        this.value = oldVal
        return
      }
      console.log('===this.value', this.value, '===value', value, '===this.showValue', this.showValue)
      if (value === this.showValue || value + '' === this.showValue + '') { // todo '12.00'==='12.0'
        // 如果相等，则不向外通知改变
        console.log('如果相等，则不向外通知改变')
        return
      } else {
        this.$emit('set', cutOutDecimalNum(value, this.decimalNum))
        // this.value = formatNumberToThousands(cutOutDecimalNum(value, this.decimalNum))
        this.value = formatThousandsToNumber(cutOutDecimalNum(value, this.decimalNum))
      }
    }
  },
  created() {
    console.log('--created showValue', this.showValue)
    this.value = formatNumberToThousands(this.showValue)
  },
  methods: {
    onChange(val) {
      console.log('--CargoNumberInput---onChange')
      console.log('--CargoNumberInput---onChange this.value', this.value)
      this.$emit('set', formatThousandsToNumber(cutOutDecimalNum(this.value, this.decimalNum)))
      this.value = formatNumberToThousands(cutOutDecimalNum(this.value, this.decimalNum))
    },
    onBlur() {
      this.onChange()
    },
    onFocus() {
      console.log('--CargoNumberInput---onFocus')
      this.value = formatThousandsToNumber(this.value)
    }
  }
}
</script>

<style scoped>
  #app .cargo-number-input >>> input{
    text-align:right;
  }
</style>
