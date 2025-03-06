<template>
  <div class="option-btn-wrap">
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      @click="edit(params.data)"
    >
      {{ $t("customerManage.edit") }}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      @click="copy(params.data)"
    >
      {{ $t("customerManage.copy") }}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      @click="detail(params.data)"
    >
      {{ $t("customerManage.view") }}
    </el-button>

  </div>
</template>
<script>
export default {
	name: "OptionBtn",
	data() {
		return {}
	},
	created() { },
	beforeMount() { },
	methods: {
		detail(item) {
			this.$router.push({
				name: "InformationInvoicingAdd",
				query: {
					id: item.id,
          type: 'view'
				}
			})
		},
		edit(item) {
			this.$router.push({
				name: "InformationInvoicingAdd",
				query: {
					id: item.id
				}
			})
		},
    copy(item) {
      this.$router.push({
        name: "InformationInvoicingAdd",
        query: {
          id: item.id,
          type: 'copy'
        }
      })
    }
	}
}
</script>
<style lang="scss" scoped>
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

