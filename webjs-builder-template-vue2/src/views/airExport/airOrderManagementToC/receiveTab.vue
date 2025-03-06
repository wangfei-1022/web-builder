<template>
  <charge-detail :order="order" :tabPane="tabPane"></charge-detail>
</template>
<script>
import chargeDetail from './components/chargeDetail'
export default {
  name: 'ReceiveToCTab',
  components: {
    chargeDetail
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
