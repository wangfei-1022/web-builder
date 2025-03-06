<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot filter-type="single" :searchFun="getData" :resetFun="reset">
      <el-form slot="singleSearch" ref="serachForm" :inline="true" :model="form" label-width="100px" size="mini">
        <el-form-item label="日期" prop="period">
          <common-picker type="daterange" v-model="form.period" clearable/>
        </el-form-item>
        <el-form-item label="时区范围" prop="period">
          <common-picker :zone="-8" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" v-model="form.period" clearable/>
        </el-form-item>
        <el-form-item label="西八区日期" prop="date">
          <common-picker :zone="-8" format="yyyy-MM-dd" v-model="form.date" type="date" />
        </el-form-item>
        <el-form-item label="西八区" prop="date">
          <common-picker :zone="-8" format="yyyy-MM-dd HH:mm:ss" v-model="form.date" type="datetime" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>

     <div class="text-container">
      {{form.date | parseTimeZone(-8)}}
    </div>
  </div>
</template>
<script>

export default {
	name: 'Demo',
	data() {
		return {
			loading: false,
			form: {
				period: [1694707200000, 1697040000000],
        date: 1695196800000
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
.text-container {
  padding: 20px 0;
  font-size: 14px;
}
</style>
