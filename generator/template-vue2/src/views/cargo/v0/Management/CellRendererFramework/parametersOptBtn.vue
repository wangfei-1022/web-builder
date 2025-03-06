<!--此文件 勿随意删除-->
<template>
  <div class="parameters-buttons-in-aggrid">
    <!--<currency-select v-model="currency" @set="currency=$event"/>-->
    <el-button v-permission="['sys:param:view']" size="mini" type="text" @click="invokeEdit()"> 编辑 </el-button>
    <!--下面是控制 行内编辑的，因aggrid行内自定义组件不好控制，所以暂换为 dialog处理-->
    <!--<el-button v-show="!isEditing" size="mini" type="text" @click="invokeEdit()"> 编辑 </el-button>-->
    <!--<el-button v-show ="isEditing" size="mini" type="text" class="button-in-grid-success" @click="invokeSave()"> 保存 </el-button>-->
    <!--<el-button v-show="isEditing" size="mini" type="text" class="button-in-grid-danger" @click="invokeCancelEdit()"> 取消编辑 </el-button>-->
  </div>
</template>
<script>
import currencySelect from '@/components/Cargo/Dmn/currencySelect'
export default {
  name: 'ParametersOptBtn',
  components: { currencySelect },
  data() {
    return {
      currency: 'CNY',
      isEditing: false
    }
  },
  created() {
    this.isEditing = this.params.data.isEditing
    console.log('this.isEditing', this.isEditing)
  },
  methods: {
    invokeCancelEdit() {
      this.isEditing = false
      const componentParent = this.params.context.componentParent
      componentParent.toCancelEditParameterItem(this.params.rowIndex)
    },
    invokeEdit() {
      const data = this.params.data
      const componentParent = this.params.context.componentParent
      componentParent.toEditParameterItem(data)
    },
    // 下述方法为行内编辑相关
    invokeEditOnRowEdit() {
      const data = this.params.data
      const componentParent = this.params.context.componentParent
      const self = this
      // 定义编辑哪一行
      const startEditingParams = {
        rowIndex: self.params.rowIndex,
        colKey: 'configValue'
      }
      // console.log('startEditingParams', startEditingParams)
      // console.log('this.params', this.params)
      componentParent.toEditParameterItemOnRowEdit(data.parameterCode).then((data) => {
        console.log('======data', data)
        this.params.api.startEditingCell(startEditingParams)
      }).then(() => {
        componentParent.setCurrentEditRowData(data)
        this.isEditing = true
        this.params.data.isEditing = true
        // componentParent.toRefreshChargeSchemeGridCell()
      }).catch(err => {
        this.$message.error(err)
      })
    },
    invokeSave() {
      const data = this.params.data
      const componentParent = this.params.context.componentParent
      componentParent.toSaveParameterItem(data).then((res) => {
        if (res.ok) {
          this.$message.success('保存成功')
          componentParent.setCurrentEditRowData({})
          this.isEditing = false
          this.params.data.isEditing = false
        } else {
          return Promise.reject(res.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>
<style scoped>
  .parameters-buttons-in-aggrid .el-button{
    padding: 0;
  }
</style>

