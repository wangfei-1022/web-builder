<template>
  <pay-charge-detail :order="order" :tabPane="tabPane"></pay-charge-detail>
</template>
<script>
import payChargeDetail from './components/payChargeDetail'
export default {
  name: 'PayTab',
  components: {
    payChargeDetail
  },
  props: {
    order: {
      type: Object,
      default: function () {
        return {}
      }
    },
    tabPane: {
      type: String,
      default () {
        return ""
      }
    }
  },
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped lang="less">

</style>
