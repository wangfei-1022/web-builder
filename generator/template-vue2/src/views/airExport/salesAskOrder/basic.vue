<template>
  <div class="app-main-inner">
    <el-form :model="job" label-width="90px" label-position="left" class="page-form">
      <div class="form-module-title">基本信息</div>
      <div class="form-module-item">
        <el-form-item label="委托单位">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="装货港">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="委托件数">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="货物类型">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="卸货港">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="委托毛重">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="托盘尺寸">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="预计航班日期">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="委托体积">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="货好日期">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="询盘备注">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'SeaExportOperateBasic',
    components: { },
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
  .app-main-inner {
    width: 100%;
    height: 100%;
  }

  .page-form {
    width: 100%;
    max-width: 1200px;
    padding: 20px;
    background: #f5f7fa;
  }

  .form-module-item {
    overflow: hidden;
    padding: 20px;
    background: #fff;
    margin-bottom: 20px;

    ::v-deep .el-form-item {
      width: 33%;
      float: left;
      padding: 0 20px;
    }
  }

  .form-module-title {
    font-size: 16px;
    margin-bottom: 10px;
    display: block;
    color: #1890ff;
    padding-left: 10px;
    border-left: 2px solid #1890ff;
  }

  .operation-btn {
    padding: 20px;
    text-align: right;
    background: #fff;
  }

</style>
