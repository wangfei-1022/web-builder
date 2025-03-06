<template>
  <div class="page-total">
    <span class="page-total-item">
      <span>{{$t('fmsPayablePayment.applyPaymentTotal')}}：</span>
      <span>
        <span class="value-item" v-for="(item, index) in applyPaymentTotal" :key='index'>
          <span class='value'>{{item.currency}}</span>
          <span>{{item.value | numberToThousands}}</span>
        </span>
      </span>
    </span>

    <span class="page-total-item">
      <span>{{$t('fmsPayablePayment.unPaymentTotal')}}：</span>
      <span>
        <span class="value-item" v-for="(item, index) in unPaymentTotal" :key='index'>
          <span class='value'>{{item.currency}}</span>
          <span>{{item.value | numberToThousands}}</span>
        </span>
      </span>
    </span>

    <span class="page-total-item">
      <span>{{$t('fmsPayablePayment.applyClearTotal')}}：</span>
      <span>
        <span class="value-item" v-for="(item, index) in applyClearTotal" :key='index'>
          <span class='value'>{{item.currency}}</span>
          <span>{{item.value | numberToThousands}}</span>
        </span>
      </span>
    </span>


    <span class="page-total-item">
      <span>{{$t('fmsPayablePayment.unClearTotal')}}：</span>
      <span>
        <span class="value-item" v-for="(item, index) in unClearTotal" :key='index'>
          <span class='value'>{{item.currency}}</span>
          <span>{{item.value | numberToThousands}}</span>
        </span>
      </span>
      <span></span>
    </span>
  </div>
</template>
<script>
export default {
	name: "PageTotal",
  props: {
    applyPaymentTotal: {
      type: Array,
      default: function() {
        return []
      }
    },
    unPaymentTotal: {
      type: Array,
      default: function() {
        return []
      }
    },
    applyClearTotal: {
      type: Array,
      default: function() {
        return []
      }
    },
    unClearTotal: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
	data() {
		return {};
	}
};
</script>
<style lang="scss" scoped>

</style>

