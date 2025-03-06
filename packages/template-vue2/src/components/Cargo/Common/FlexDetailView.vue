<template>
	<div class="flex-column-wrap">
		<section
			:class="[columnClass]"
			v-for="item in detailList"
			:key="item.label"
		>
			<div class="title">{{ item.label }}:</div>
			<div class="content">
				{{ item.value }}
				<el-tooltip
					class="item"
					effect="dark"
					:content="item.tooltip"
					v-if="checkTooltip(item.tooltip)"
					placement="top"
				>
					<i
						class="el-icon-warning-outline"
						style="
							font-size: 18px;
							cursor: pointer;
							color: #f7c955;
							vertical-align: middle;
						"
					></i>
				</el-tooltip>
			</div>
		</section>
	</div>
</template>
<script>
import SectionTitle from '@/components/Cargo/Common/sectionTitle'
export default {
	name: 'FlexDetailView',
	components: {},
	props: {
		columns: {
			type: Number,
			default: 2
		},
		detailList: {
			type: [Array, Object],
			default: () => []
		}
	},
	data() {
		return {}
	},
	computed: {
		columnClass: function () {
			return `column-${this.columns}`
		}
	},
	watch: {},
	methods: {
		checkTooltip: function (val) {
			return !!val
		}
	},
	mounted() { },
	created() { }
}
</script>
<style lang="scss" scoped>
@mixin flexDom {
	display: flex;
	flex-flow: row wrap;
	justify-content: flex-start;
	align-items: flex-start;
}
.flex-column-wrap {
	@include flexDom;
	font-size: 14px;
	font-weight: normal;
	width: 900px;
	.column-2 {
		width: calc(50% - 40px);
		@include flexDom;
		padding: 20px;
	}
	.title {
		width: 120px;
		text-align: left;
		color: #333;
	}
	.content {
		padding-left: 20px;
		width: calc(100% - 120px);
		color: #666;
	}
}
</style>
