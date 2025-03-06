<template>
	<div class="option-btn-wrap">
		{{params.data.instructionNo}}
    <span v-if="params.data.exchangeCurrency" class='YI'>
      <!--异-->
      {{$t('fmsReceiveClear.DIFF')}}
    </span>
	</div>
</template>
<script>
export default {
	name: "InstructionNo",
	data() {
		return {};
	},
	created() {},
	beforeMount() {},
	methods: {}
};
</script>
<style lang="scss" scoped>
.YI {
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

