<template>
	<svg :class="svgClass" aria-hidden="true" v-on="$listeners">
		<use :xlink:href="iconName" />
	</svg>
</template>

<script>
export default {
	name: "SvgIcon",
	props: {
		iconClass: {
			type: String,
			required: true
		},
		className: {
			type: String,
			default: "icon"
		}
	},
	computed: {
		iconName() {
			return `#${this.iconClass}`;
		},
		svgClass() {
			if (this.className) {
				return "svg-icon " + this.className;
			} else {
				return "svg-icon";
			}
		}
	}
};
</script>

<style >
.svg-icon {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}

.svg-icon.clear-module-icon {
	width: 24px;
	height: 100%;
	float: left;
	margin-right: 10px!important;
}
</style>
