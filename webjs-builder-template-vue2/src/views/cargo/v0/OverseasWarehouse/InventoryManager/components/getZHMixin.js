
export default {
  data() {
    return {

    }
  },
  methods: {
    /**
    * 下拉框
    */
    selectZH(key) {
      return this.getZH('selectPlaceholder', 'common') + this.getZH(key)
    },
      /**
       * 输入框
       */
    inputZH(key) {
      return this.getZH('placeholder', 'common') + this.getZH(key)
    },
      /**
       * 获取中英文
       */
    getZH(key, obj) {
      obj = obj || 'inventoryManager'
      let str = obj + '.' + key
      return this.$t(str)
    }
  }
}
