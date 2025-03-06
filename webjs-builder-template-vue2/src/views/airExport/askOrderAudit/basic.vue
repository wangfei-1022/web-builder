<template>
  <div class="basic-wrapper">
    <el-form ref="entityForm" :model="job" label-position="left" label-width="90px">
      <span>基本信息</span>
      <el-row :gutter="25">
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
          <div class="el-form-item-group" >
            <el-form-item label="委托单位"><el-input v-model="job.jobNo" class="job-no-input" size="mini"  /></el-form-item>
            <el-form-item label="货物类型"><el-input v-model="job.jobNo" class="job-no-input" size="mini"  /></el-form-item>
            <el-form-item label="托盘尺寸"><el-input v-model="job.jobNo" class="job-no-input" size="mini"  /></el-form-item>
            <el-form-item label="货好日期"><el-input v-model="job.jobNo" class="job-no-input" size="mini"  /></el-form-item>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
          <div class="el-form-item-group" >
            <el-form-item label="装货港"><el-input v-model="job.jobNo" class="job-no-input" size="mini"  /></el-form-item>
            <el-form-item label="卸货港"><el-input v-model="job.jobNo" class="job-no-input" size="mini"  /></el-form-item>
            <el-form-item label="预计航班日期"><el-input v-model="job.jobNo" class="job-no-input" size="mini"  /></el-form-item>
            <el-form-item label="询盘备注"><el-input v-model="job.jobNo" class="job-no-input" type="textarea" rows="3"  /></el-form-item>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
          <div class="el-form-item-group" >
            <el-form-item label="委托件数"><el-input v-model="job.jobNo" class="job-no-input" size="mini" /></el-form-item>
            <el-form-item label="委托毛重"><el-input v-model="job.jobNo" class="job-no-input" size="mini"  /></el-form-item>
            <el-form-item label="委托体积"><el-input v-model="job.jobNo" class="job-no-input" size="mini"  /></el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
	name: 'SeaExportOperateBasic',
	components: {},
	props: {

	},
	data() {
		return {
			job: {
				jobNo: ''
			}
		}
	},

	created() {
	},
	mounted() {

	},
	methods: {

	}
}
</script>

<style scoped lang="less">
.basic-wrapper {
	padding-bottom: 30px;
}
</style>
