<template>
	<div class="option-btn-wrap">
		{{params.data.orderNo}}
    <span v-if="params.data.innerBusinessFlag" class='INNER'>
      <!--异-->
      {{$t('fmsProfit.INNER')}}
    </span>
	</div>
</template>
<script>
export default {
	name: "OrderNo",
	data() {
		return {};
	},
	created() {},
	beforeMount() {},
	methods: {}
};
</script>
<style lang="scss" scoped>
.INNER {
		color: #fff;
    background: #1890ff;
    display: inline-block;
    border-radius: 2px;
    height: 18px;
    line-height: 18px;
    width: 18px;
    text-align: center;
    font-size: 12px;
	}
</style>

