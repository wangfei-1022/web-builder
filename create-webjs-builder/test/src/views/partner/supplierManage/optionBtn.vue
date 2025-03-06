<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" class="ml-10" @click="detail(params.data)" v-permission="['scm:supplier:view']">
			{{ $t("customerManage.view") }}
		</el-button>
		<el-button type="text" size="mini" class="ml-10" @click="edit(params.data)" v-permission="['scm:supplier:update']">
			{{ $t("customerManage.edit") }}
		</el-button>
		<el-button type="text" size="mini" class="ml-10" v-permission="['scm:supplier:add:type']" @click="params.context.componentParent.addTypeFn(params.data)">
			{{ $t("customerManage.add_type") }}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "OptionBtn",
	data() {
		return {};
	},
	created() {},
	beforeMount() {},
	methods: {
		detail(item) {
			this.$router.push({
				name: "CRMSupplierDetail",
				query: {
					id: item.id
				}
			});
		},
		edit(item) {
			this.$router.push({
				name: "CRMSupplierEdit",
				query: {
					id: item.id
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

