<template>
  <div class="architecture-buttons-in-aggrid">
    <el-button v-permission="['sys:office:add']" type="text" size="mini" @click="invokeAddArchitecture()"> 新增 </el-button>
    <template v-if="!isRoot">
      <el-button v-permission="['sys:office:view']" type="text" size="mini" @click.stop="invokeEditArchitecture()"> 编辑 </el-button>
      <el-button v-permission="['sys:office:del']" type="text" size="mini" class="button-in-grid-danger" @click="invokeDelArchitectureRow"> 删除 </el-button>
    </template>
  </div>
</template>
<script>
export default {
	name: 'ArchitectureOperateButton',
	data() {
		return {
			enableEdit: false,
			isRoot: false
		}
	},
	created() {
	},
	beforeMount() {
		this.initData()
	},
	methods: {
		initData() {
			if (this.params.rowIndex === 0) {
				this.isRoot = true
			}
		},
		invokeAddArchitecture() {
			const data = this.params.data
			const self = this
			if (data.orgType === 0) {
				self.params.context.componentParent.popChooseAddTypeDialog(data)
			} else {
				self.params.context.componentParent.popDeptAddDialog(data)
			}
		},
		invokeEditArchitecture() {
			const data = this.params.data
			const self = this
			if (data.orgType === 0) {
				// 公司
				self.params.context.componentParent.editCompany(data.id)
			} else {
				self.params.context.componentParent.popDeptEditDialog(data)
			}
		},
		invokeDelArchitectureRow() {
			const data = this.params.data
			const self = this
			this.$confirm('你确定要删除该记录吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				self.params.context.componentParent.delArchitecture(data.id, data.orgType)
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				})
			})
		}
	}
}
</script>
<style scoped>
.architecture-buttons-in-aggrid .el-button {
	padding: 0;
}
</style>

