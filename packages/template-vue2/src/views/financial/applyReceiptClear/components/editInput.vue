<template>
	<span>
		<el-input v-model="modleValue" type="text" size="mini" style="width: 100px" :disabled="isDisabled" @input="inputFn" @blur="blurFn"/>
		<span v-if="canEdit">
			<i v-if="isDisabled" class="icon el-icon-edit" @click="edit"></i>
			<i v-if="!isDisabled" class="icon iconfont icon-checkmark-circle-outline" @click="okFn"></i>
		</span>
	</span>
</template>

<script>
export default {
	name: "EditInput",
	props: {
		value: {
			type: [Number, String],
			default: ""
		},
		canEdit: {
			type: Boolean,
			default: true
		},
    type: {
			type: [Number, String],
			default: ""
		}
	},
	watch: {
		value(val) {
			this.modleValue = val;
		}
	},
	data() {
		return {
			modleValue: "",
			isDisabled: true
		};
	},
	created() {
		this.modleValue = this.value;
	},
	methods: {
		edit() {
			this.isDisabled = false;
		},
    blurFn() {
      this.$emit("input", this.modleValue);
			this.$emit("calc");
    },
    inputFn(value) {
      if (this.type === 'AMOUNT') {
        let match = value.toString().match(/^\d+(?:\.\d{0,2})?/)
        if (match !== null) {
          this.modleValue = match[0]
        }
      } else {
        this.modleValue = value.replace(/[^\d.-]/g, '')
      }
    },
		okFn() {
			this.isDisabled = true;
			this.$emit("input", this.modleValue);
			this.$emit("calc");
		}
	}
};
</script>

<style lang="scss" scoped>
.icon {
	cursor: pointer;
	color: #1890ff;
	font-size: 18px;
	margin-left: 8px;
	font-weight: 500;
	width: 22px;
}
.icon.icon-checkmark-circle-outline {
	font-size: 22px;
}
</style>
