<template>
  <div>
    <div v-for="(item,index) in templateCharges" :key="index" style="margin-bottom: 20px;">
      <price-edit-item :templateChargeItem="item" :charge="getCharge(item)" :ref="`refTem${index}`" :isDetail="isDetail" :baseForm="baseForm"></price-edit-item>
    </div>
  </div>
</template>
<script>
import PriceEditItem from './PriceEditTabItem'
export default {
	name: "UexpressPriceCardPublishReceiptPriceEdit",
  components: {
    PriceEditItem
  },
  props: {
    isDetail: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    templateCharges: {
      type: Array,
      default: function() {
        return []
      }
    },
    charges: {
      type: Array,
      default: function() {
        return []
      }
    },
    baseForm: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
	data() {
		return {

		};
	},
	created() {},
	methods: {
    getCharge(item) {
      let target = {}
      this.charges.forEach(v => {
        if (v.categoryCode === item.categoryCode &&
            v.feeItemCode === item.feeItemCode &&
            v.templateChargeId === item.templateChargeId) {
          target = {
            ...v
          }
        }
      })
      return target
    },
    validate() {
      let valid = true
      let arr = Object.keys(this.$refs)
      for (let i = 0, len = arr.length; i < len;i++) {
        let v = arr[i]
        let check = this.$refs[v][0].validate()
        if (!check) {
          valid = false
          break;
        }
      }
      return valid
    },
    getValue() {
      let arr = []
      Object.keys(this.$refs).forEach(v => {
        let tabItem = this.$refs[v][0].getValue()
        if (tabItem && tabItem.chargePrices && tabItem.chargePrices.length) {
          arr.push(tabItem)
        }
      })
      return arr
    }
  }
};
</script>
<style scoped lang="scss">

</style>
