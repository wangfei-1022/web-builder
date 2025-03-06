<template>
  <el-input :suffix-icon="suffix" v-model="innerValue" :disabled="disabled" :size="size" @keyup.enter.native="handlerChangeEvents" ref="numberInput" style="min-width: 65px;"></el-input>
</template>
<script>
  export default {
    name: 'NumberInput',
    props: {
      value: {
        type: [Number, String],
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      suffix: {
        type: String,
        default: ''
      },
      limitType: {
        /*
          int 数字
          positive 正整数 不包含0
          decimal 小数
        */
        type: String,
        default: 'decimal'
      },
      limitRange: {
        type: Object,
        default: () => ({
            digits: 4,
            decimal: 2
          })
      },
      size: {
        type: String,
        default: 'mini'
      }
    },
    data() {
      return {}
    },
    created() {},
    mounted() {},
    computed: {
      innerValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
          return val
        }
      }
    },
    watch: {
      innerValue: function(val) {
        let reg = null
        if (this.limitType === 'int') {
          // reg = new RegExp('(^\d{0,'+this.limitRange.digits+'$)')
          reg = new RegExp('^(-)?\\d{0,' + this.limitRange.digits + '}$')
        } else if (this.limitType === 'positive') {
          reg = new RegExp('^\\d{0,' + this.limitRange.digits + '}$')
        } else {
          reg = new RegExp('(^(-)?\\d{0,' + this.limitRange.digits + '}$)|(^(-)?\\d{0,' + this.limitRange.digits + '}\\.\\d{0,' + this.limitRange.decimal + '}$)')
        }
        if (reg.test(val)) {
          this.innerValue = val
        } else {
          this.innerValue = val ? val.substring(0, val.length - 1) : ''
        }
      }
    },
    methods: {
      handlerChangeEvents() {
        if (this.$attrs.change) {
          this.$attrs.change()
        }
      },
      keepFocus() {
        this.$refs.numberInput.focus()
      }
    }
  }
</script>
