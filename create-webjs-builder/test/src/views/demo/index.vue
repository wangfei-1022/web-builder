<template>
  <div style="padding: 20px;">
    <el-tabs type="border-card" >
      <el-tab-pane label="TypeSelect">
        <demo-type-select></demo-type-select>
      </el-tab-pane>
      <el-tab-pane label="日期">
        <demo-date></demo-date>
      </el-tab-pane>
      <el-tab-pane label="上传文件">
        <demo-upload></demo-upload>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import DemoTypeSelect from './TypeSelect'
import DemoDate from './Date'
import DemoUpload from './Upload'

export default {
	name: 'Demo',
  components: {
    DemoTypeSelect,
    DemoDate,
    DemoUpload
  },
	data() {
		return {

		}
	}
}
</script>
<style lang="scss" scoped>
.upload {
	margin: 10px;
}
</style>
