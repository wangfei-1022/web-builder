<template>
  <div ref="inputNumber" class="xtt-input-number" :class="{ 'xtt-input-number--group': $slots.append }">
    <div
      :class="[
        'el-input-number',
        inputNumberSize ? 'el-input-number--' + inputNumberSize : '',
        { 'is-disabled': inputNumberDisabled },
        { 'is-without-controls': !controls },
        { 'is-controls-right': controlsAtRight }
      ]"
      @dragstart.prevent
    >
      <span
        v-if="controls"
        class="el-input-number__decrease"
        role="button"
        :class="{ 'is-disabled': minDisabled }"
        @click="decrease"
        @keydown.enter="decrease"
      >
        <i :class="`el-icon-${controlsAtRight ? 'arrow-down' : 'minus'}`" />
      </span>
      <span
        v-if="controls"
        class="el-input-number__increase"
        role="button"
        :class="{ 'is-disabled': maxDisabled }"
        @click="increase"
        @keydown.enter="increase"
      >
        <i :class="`el-icon-${controlsAtRight ? 'arrow-up' : 'plus'}`" />
      </span>
      <el-input
        ref="input"
        v-model="userInput"
        :placeholder="placeholder"
        :disabled="inputNumberDisabled"
        :size="inputNumberSize"
        :max="max"
        :min="min"
        :name="name"
        :label="label"
        :readonly="readonly"
        type="number"
        title=""
        :class="[textRight ? 'text-right' : '']"
        @keydown.up.native.prevent="increase"
        @keydown.down.native.prevent="decrease"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handleChange"
        @input="handleInput(userInput)"
      />
    </div>
    <div v-if="$slots.append" class="input-number__append">
      <slot name="append" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'InputNumber',
  props: {
    value: [Number, String],
    step: {
      type: Number,
      default: 1
    },
    stepStrictly: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    disabled: Boolean,
    size: String,
    controls: {
      type: Boolean,
      default: false
    },
    controlsPosition: {
      type: String,
      default: ''
    },
    name: String,
    label: String,
    placeholder: String,
    precision: {
      type: Number,
      validator(val) {
        return val >= 0 && val === parseInt(val, 10)
      }
    },
    maxlength: Number,
    textRight: Boolean,
    readonly: Boolean
  },
  data() {
    return {
      userInput: null,
      isOut: false
    }
  },
  computed: {
    minDisabled() {
      return this._decrease(this.value, this.step) < this.min
    },
    maxDisabled() {
      return this._increase(this.value, this.step) > this.max
    },
    numPrecision() {
      const { value, step, getPrecision, precision } = this
      const stepPrecision = getPrecision(step)
      if (precision !== undefined) {
        if (stepPrecision > precision) {
          console.warn('[Element Warn][InputNumber]precision should not be less than the decimal places of step')
        }
        return precision
      } else {
        return Math.max(getPrecision(value), stepPrecision)
      }
    },
    controlsAtRight() {
      return this.controls && this.controlsPosition === 'right'
    },
    inputNumberSize() {
      return this.size || (this.$ELEMENT || {}).size
    },
    inputNumberDisabled() {
      return this.disabled
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        if (this.isOut) { // 如果是数据输出到外面的动作，不处理
          return
        }
        if (this.isEmpty(value)) {
          this.userInput = value
          return
        }
        const newVal = this.handValue(value, true)
        this.userInput = newVal
        this.$emit('input', newVal)
      }
    }
  },
  mounted() {
    const wrap = this.$refs.inputNumber
    const input = wrap.getElementsByTagName('input')[0]
    input.setAttribute('pattern', '\\d*')
  },
  methods: {
    toPrecision(num, precision) {
      if (precision === undefined) {precision = this.numPrecision}
      return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision))
    },
    getPrecision(value) {
      if (value === undefined) {return 0}
      const valueString = value.toString()
      const dotPosition = valueString.indexOf('.')
      let precision = 0
      if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1
      }
      return precision
    },
    _increase(val, step) {
      if (typeof val !== 'number' && val !== undefined) {return val}

      const precisionFactor = Math.pow(10, this.numPrecision)
      // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
      return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor)
    },
    _decrease(val, step) {
      if (typeof val !== 'number' && val !== undefined) {return val}

      const precisionFactor = Math.pow(10, this.numPrecision)

      return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor)
    },
    increase() {
      if (this.inputNumberDisabled || this.maxDisabled) {return}
      const value = this.value || 0
      const newVal = this._increase(value, this.step)
      if (this.isOutMaxLength(newVal)) {
        return
      }
      if (newVal) {this.handleInput(newVal, true)}
    },
    decrease() {
      if (this.inputNumberDisabled || this.minDisabled) {return}
      const value = this.value || 0
      const newVal = this._decrease(value, this.step)
      if (this.isOutMaxLength(newVal)) {
        return
      }
      this.handleInput(newVal, true)
    },
    handleBlur(event) {
      this.$emit('blur', event)
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
    handleChange(value) {
      this.handleInput(value, true)
    },
    handValue(value, isChange) {
      if (this.isEmpty(value)) {
        return value
      }
      if (isNaN(value)) {
        return value
      }
      let newVal = value
      if (isChange) { // 如果是change 动作，校验数据的有效性
        newVal = Number(value)
        if (this.stepStrictly) {
          const stepPrecision = this.getPrecision(this.step)
          const precisionFactor = Math.pow(10, stepPrecision)
          newVal = Math.round(newVal / this.step) * precisionFactor * this.step / precisionFactor
        }
        // 处理小数点
        if (this.precision !== undefined) {
          newVal = this.toPrecision(newVal, this.precision)
        }
        // 处理最大值，最小值问题
        if (newVal >= this.max) {newVal = this.max}
        if (newVal <= this.min) {newVal = this.min}
      }
      if (this.isOutMaxLength(newVal)) {
        newVal = Number(String(newVal).substr(0, this.maxlength))
      }
      return newVal
    },
    handleInput(value, isChange) {
      this.isOut = true
      const newVal = this.handValue(value, isChange)
      this.userInput = newVal
      this.$emit('input', newVal)
      if (isChange) {
        this.$emit('change', newVal)
      }
      this.$nextTick(() => {
        this.isOut = false
      })
    },
    isEmpty(value) {
      return value === null || value === '' || value === undefined
    },
    isOutMaxLength(value) {
      if (this.maxlength !== undefined && !this.isEmpty(value)) {
        const valStr = String(value)
        return valStr.length > this.maxlength
      }
      return false
    }
  }
}
</script>
<style type="text/css" lang="scss">
.xtt-input-number {
    display: inline-block;
    .el-input-number {
        width: 100%;
        .el-input input {
          text-align: left !important;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
        input[type='number'] {
            -moz-appearance: textfield;
        }
    }

    .is-without-controls {
        input {
            text-align: left;
        }
    }
    .el-input.text-right {
        input {
            text-align: right;
        }
    }
    .el-input-number__increase,
    .el-input-number__decrease {
        background: none;
        font-size: 16px;
        i {
            font-size: 16px;
        }
    }

    &.xtt-input-number--group {
        display: inline-table;
        line-height: normal;
        display: inline-table;
        border-collapse: separate;
        border-spacing: 0;
        vertical-align: middle;

        .el-input-number {
            display: table-cell;

            .el-input__inner {
                border-radius: 4px 0px 0px 4px;
                padding-right: 4px;
            }
        }

        .input-number__append {
            display: table-cell;
            min-width: 32px;
            text-align: center;
            background-color: #f5f7fa;
            color: #909399;
            border: 1px solid #dcdfe6;
            position: relative;
            padding: 0 4px;
            border-radius: 0px 4px 4px 0px;
            border-left: 0px;
        }
    }
}
</style>

