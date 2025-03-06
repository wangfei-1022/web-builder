export default {
  name: 'InnerMixins',
  data() {
    return {
      /*
       * 小于零 不产生扣件，入库失败
       * 5 6 7 8 11产生扣件入库失败
       * 1 2 3 4 9 10 12产生扣件，入库成功
      */
      failArr: [5, 6, 7, 8, 11],
      closeMenuList: [
        'QuicklyInQuicklyOut',
        'PackageCheckin',
        'PackageCheckout',
        'PackageReceived',
        'AgentParcelRecived',
        'BoxPerOrder',
        'SwapBox',
        'SecondaryMatch',
        'LargePackageCheckin',
        'Transferred',
        'DistrainScan'
      ],
      providerList: [
        {
          label: '京东',
          value: '京东',
          indexKey: 'JD'
        },
        {
          label: '顺丰',
          value: '顺丰',
          indexKey: 'SF'
        },
        {
          label: '申通',
          value: '申通',
          indexKey: 'ST'
        },
        {
          label: 'DHL',
          value: 'DHL',
          indexKey: 'DHL'
        },
        {
          label: 'UPS',
          value: 'UPS',
          indexKey: 'UPS'
        }
      ],
      isIlpOMSList: [
        {
          label: this.$t('common.all'),
          value: null
        },
        {
          label: this.$t('packageWarehouse.ilpOMS.ilpOMS'),
          value: 'ilpOMS'
        },
        {
          label: this.$t('packageWarehouse.ilpOMS.oldOMS'),
          value: 'oldOMS'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    filterCloseMenu() {
      const tabArr = this.$store.getters.visitedViews.filter(v => this.closeMenuList.includes(v.name) && v.name !== this.$route.name)
      // const filterArr = tabArr.filter(v => v.name != this.$route.name)
      tabArr.forEach(item => {
        this.$store.dispatch('tagsView/delView', item)
      })
    },
    setCallbackObj(_res) { // 请求接口成功后，判断返回给小工具的数据
      let _callbackObj = null
      if (_res && _res.ok) {
        // 左右滚动判断，稍后开启
        // if (typeof _res.content.parcelBatteryFlagMsg !== 'undefined' || _res.content.parcelBatteryFlagMsg !== null || _res.content.parcelBatteryFlagMsg !== '') {
        //   _callbackObj = {"result": false, "message": _res.content.lockTypeName ? _res.content.lockTypeName : '', "parcelBatteryFlagMsg": _res.content.parcelBatteryFlagMsg}
        //   console.log(_callbackObj)
        //   return _callbackObj
        // }
        if (typeof _res.content.lockType === 'number' && !isNaN(_res.content.lockType)) {
          // 发送给小工具的消息
          _callbackObj = {"result": false, "message": _res.content.lockTypeName}
        } else {
          _callbackObj = {"result": true, "message": "成功"}
        }
      } else {
        if (_res.errors) {
        // 重量差异第一次报错
          _callbackObj = {"result": false, "message": _res.errors[0].message}
        } else {
         _callbackObj = {"result": false, "message": this.$t('packageWarehouse.systemError')}
        }
      }
      return _callbackObj
    }
  }
}
