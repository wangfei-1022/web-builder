<template>
	<div>
    <div :class="'status-icon-container status-icon-' + statusName.length">
      <svg-icon className="status-icon" :style="{color: statusColor}" icon-class="icon-zhuangtaituzhang" />
      <span class="status-name" :style="{color: statusColor}">{{statusName}}</span>
    </div>
  </div>
</template>

<script>
import SvgIcon from './index'
export default {
	name: "StatusIcon",
  components: {
    SvgIcon
  },
	props: {
		statusName: {
			type: String,
			default: ""
		},
		statusColor: {
			type: String,
			default: "#409EFF"
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

<style lang="scss" scoped>
.status-icon-container{
  position: relative;
  transform: rotate(-30deg);

  .status-icon{
    font-size: 120px;
    transform: rotate(30deg);
  }
  .status-name{
    position: absolute;
    left: 16px;
    top: 34px;
    letter-spacing: 3px;
    font-weight: 500;
    font-size: 24px;
  }
}
.status-icon-3{
  .status-name{
    left: 16px;
  }
}

.status-icon-4 {
  .status-name{
    left: 8px;
  }
}
</style>
