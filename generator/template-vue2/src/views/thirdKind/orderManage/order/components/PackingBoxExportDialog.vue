<template>
  <el-dialog :visible.sync="dialogVisible" title="数据导入" width="800px" :close-on-click-modal="false">
    <div class="dialog-content" v-loading="loading">
      <el-form ref="formData" :model="formData" label-width="0px" :rules="rules">
        <el-form-item label="">
            <el-input v-model="formData.containerNo" @change="infoChange" type="textarea" :rows="3" placeholder="请粘贴所需导入箱子数据" size="mini" />
        </el-form-item>
      </el-form>
      <el-table class="case-data-table" size="mini" border :data="boxList" :cell-class-name="tableCellClassName" style="width: 100%; margin-top: 12px;">
            <el-table-column prop="containerNo" :label="$t('sea.containerNo')" min-width="110"></el-table-column>
            <el-table-column prop="sealNo" :label="$t('sea.sealNo')" min-width="110"></el-table-column>
            <el-table-column prop="containerType" :label="$t('thirdKindOrder.containerType')" min-width="60"></el-table-column>
            <el-table-column prop="ownerTypeName" :label="$t('thirdKindOrder.ownerType')" min-width="60"></el-table-column>
            <el-table-column prop="hsCode" label="HS CODE" min-width="100"></el-table-column>
            <el-table-column prop="quantity" :label="$t('sea.number')" min-width="60"></el-table-column>
            <el-table-column prop="weight" :label="$t('sea.grossWeight')" min-width="100"></el-table-column>
            <el-table-column prop="volume" :label="$t('sea.volume')" min-width="100"></el-table-column>
      </el-table>

      <div class="info-container">
        <p>注意事项：</p>
        <p>1.请根据表头列顺序复制粘贴对应所需导入的数据，只支持Excel格式；</p>
        <p>2.箱号、封号、箱型、箱属为必填字段，必须在对应列上有值；</p>
        <p>3.粘贴的数据箱型、箱属必须跟订单上的完全匹配，否则不允许导入；</p>
        <p>4.粘贴的条数必须跟订单的箱子数一致，才允许导入。</p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary"	size="mini" @click="saveForm()" :loading="loading">导入</el-button>
      <el-button size="mini"	@click="dialogVisible = false" :loading="loading">{{ $t("common.cancelBtn") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { batchSaveOrderBoxInfoApi } from '@/api/thirdKind'
import { isObjectEqual } from '@/utils/index'
import getZHMixin from './getZHMixin'

export default {
	name: 'BusinessInfoOverseasDialog',
    mixins: [getZHMixin],
	props: {
		orderDetail:  {
			type: Object,
			default: function() {
                return {}
            }
		},
	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			rules: {
				containerNo: [{ required: true, message: '不能为空' }],
			},
			boxList: [],
			formData: {
                containerNo: ''
            }
		}
	},
	methods: {
        show() {
            this.dialogVisible = true
            this.formData = {
                containerNo: ''
            }
            this.boxList = []
        },
		infoChange() {
            this.boxList = []
            let containerNo = this.formData.containerNo.replace(/\t$/, '')
            let containerList = containerNo.split('\n')
			containerList.forEach(v => { 
               if(v) {
                    let item = v.split('\t')
                    this.boxList.push({
                        containerNo: item[0],
                        sealNo: item[1],
                        containerType: item[2],
                        ownerTypeName: item[3],
                        hsCode: item[4],
                        quantity: item[5],
                        weight: item[6],
                        volume: item[7]
                    })
               }
            })
		},
        tableCellClassName({ row, column, rowIndex, columnIndex }) {
            let arr = ['containerNo', 'sealNo', 'containerType', 'ownerTypeName']
            if (columnIndex < 4 && !row[arr[columnIndex]]) {
                return 'cell-border-error'
            } else {
                return ''
            }
        },
		async saveForm() {
            if(this.boxList.length === 0) {
                this.$message.error('请先粘贴装箱信息')
                return  
            }
            let containerList = this.orderDetail.containerList
            this.boxList.forEach(v => {
                let index = containerList.findIndex(item => item.englishName === v.containerType && item.ownerTypeName === v.ownerTypeName) 
                if(index >= 0) {
                    v.ownerType = containerList[index].ownerType
                    v.typeCode = containerList[index].typeCode
                    v.chineseName = containerList[index].chineseName
                    v.englishName = containerList[index].englishName
                }
            })

            let containerMap = { }
            let oldContainerMap = { }

            this.boxList.forEach(v => {
                if(containerMap[v.containerType + v.ownerTypeName]) {
                    containerMap[v.containerType + v.ownerTypeName] ++
                } else {
                    containerMap[v.containerType + v.ownerTypeName] = 1
                }
            })
            containerList.forEach(v => {
                oldContainerMap[v.englishName + v.ownerTypeName] = v.ctnrNum
            })

            if(!isObjectEqual(containerMap, oldContainerMap)) {
                this.$message.error('导入的箱型数量不符合' + this.orderDetail.containerDesc)
                return
            }
			this.loading = true
            let data = {
                orderId: this.orderDetail.id, 
                boxes: this.boxList
            }
			let res = await batchSaveOrderBoxInfoApi(data)
			if (res.ok) {
				this.$message.success(this.getZH('saveSuccess', 'common'))
				this.dialogVisible = false
				this.$emit('success')
			}
			this.loading = false
		}
	}

}
</script>

<style lang="scss" scoped>
.info-container {
    color: red;
    line-height: 22px;
    margin-top: 15px;
    p {
        margin: 0;
        padding: 0;
    }
}
::v-deep .cell-border-error {
   background: rgba(255, 0, 0, 0.5);
} 
</style>
