<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot filter-type="single" :searchFun="getData" :resetFun="reset">
      <el-form slot="singleSearch" ref="serachForm" :inline="true" :model="form" label-width="80px" size="mini">
        <el-form-item label="客户" prop="memberId">
            <type-select v-model="form.memberId" type="customer" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
  </div>
</template>
<script>

export default {
	name: 'Demo',
	data() {
		return {
			loading: false,
			form: {
				memberId: '',
				period: [],
        date: ''
			}
		}
	},
	created() {

	},
	methods: {
		getData() {
      console.log(this.form)
    },
		reset() { },
		fileChange(file) {
			console.log(file)
		}
	}
}
</script>
<style lang="scss" scoped>
.upload {
	margin: 10px;
}
</style>
