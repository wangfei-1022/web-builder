
export default {
  data() {
    return {

    }
  },
  methods: {
    /**
    * 下拉框
    */
    selectZH(key, obj) {
      return this.getZH('selectPlaceholder', 'common') + this.getZH(key, obj)
    },
      /**
       * 输入框
       */
    inputZH(key, obj) {
      return this.getZH('placeholder', 'common') + this.getZH(key, obj)
    },
      /**
       * 获取中英文
       */
    getZH(key, obj) {
      obj = obj || 'putInStorageManage'
      let str = obj + '.' + key
      return this.$t(str)
    }
  }
}
