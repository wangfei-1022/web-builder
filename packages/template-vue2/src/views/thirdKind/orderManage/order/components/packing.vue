<template>
  <div class="box" v-loading="loading">
    <div class="form-module-title">
      <span>{{$t('sea.basicInformation')}}</span>
    </div>
    <div class="form-module-item">
      <el-form :inline="true" @submit.native.prevent ref="packingForm">
        <el-form-item class="item" :label="$t('thirdKindOrder.orderNo')" prop="orderNo">{{orderDetail.orderNo}}</el-form-item>
        <el-form-item class="item" style="width: 70%;" :label="$t('thirdKindOrder.sumCount')" prop="sumContainerStr">{{orderDetail.containerDesc}}</el-form-item>
        <el-form-item class="item" :label="$t('thirdKindOrder.sumQuantity')" prop="sumQuantity">{{orderDetail.actualQuantity}}</el-form-item>
        <el-form-item class="item" :label="$t('thirdKindOrder.sumGrossWeight')" prop="sumGrossWeight">{{orderDetail.actualGrossWeight}}</el-form-item>
        <el-form-item class="item" :label="$t('thirdKindOrder.sumVolume')" prop="sumVolume">{{orderDetail.actualVolume}}</el-form-item>
      </el-form>
    </div>
    <div class="form-module-title">
      <span>{{$t('sea.packingInformation')}}</span>
      <el-button type="primary" class="ml-10" size="mini" v-if="orderDetail.isUnLocked" @click="importPackingInformation">{{$t('sea.importPackingInformation')}}</el-button>
    </div>
    <div class="form-module-item">
        <el-form :inline="true" :model="item" @submit.native.prevent ref="containerListForm">
            <div style="position: relative;">
                <el-table class="case-data-table" size="mini" border :data="item.boxList" style="width: 100%">
                    <el-table-column  min-width="110">
                        <template slot="header">
                            <span class="red">*</span>{{ $t('sea.containerNo')  }}
                        </template>
                        <template slot-scope="{row, $index}">
                            <span v-if="!row.isEdit"> {{row.containerNo}}</span>
                            <el-form-item v-else label="" :prop="`boxList[${$index}].containerNo`" :rules="[{ required: true, message: $t('blInfo.placeholder'), trigger: 'change'},]">
                            <el-input v-model="row.containerNo" size="mini" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column  min-width="110">
                        <template slot="header">
                            <span class="red">*</span>{{ $t('sea.sealNo')  }}
                        </template>
                        <template slot-scope="{row, $index}">
                            <span v-if="!row.isEdit"> {{row.sealNo}}</span>
                            <el-form-item v-else label="" :prop="`boxList[${$index}].sealNo`" :rules="[{ required: true, message: $t('blInfo.placeholder'), trigger: 'change'},]">
                            <el-input v-model="row.sealNo" size="mini" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('thirdKindOrder.containerType')" min-width="60">
                        <template slot-scope="{row}">
                            <span>{{row.englishName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('thirdKindOrder.ownerType')" min-width="60">
                        <template slot-scope="{row}">
                            <span>{{row.ownerTypeName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="HS CODE" min-width="100">
                        <template slot-scope="{row}">
                            <span v-if="!row.isEdit"> {{row.hsCode}}</span>
                            <el-form-item v-else label="">
                            <div class="el-input el-input--mini">
                                <el-input v-model.lazy="row.hsCode" size="mini"/>
                            </div>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('sea.number')" min-width="60">
                        <template slot-scope="{row}">
                            <span v-if="!row.isEdit"> {{row.quantity}}</span>
                            <el-form-item v-else label="">
                            <div class="el-input el-input--mini">
                                <el-input v-model.lazy="row.quantity" oninput="value=value.replace(/[^\d]/g,'')" size="mini" />
                            </div>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <!-- 毛重(KGS)-->
                    <el-table-column min-width="100" :label="$t('sea.grossWeight')">
                        <template slot-scope="{row}">
                            <span v-if="!row.isEdit"> {{row.weight}}</span>
                            <el-form-item v-else label="">
                            <el-input v-model.lazy="row.weight" size="mini"/>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100" :label="$t('sea.volume')">
                        <template slot-scope="{row}">
                            <span v-if="!row.isEdit"> {{row.volume}}</span>
                            <el-form-item v-if="row.isEdit" label="">
                                <el-input v-model.lazy="row.volume" size="mini"  />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="80">
                        <template slot-scope="{row,$index}">
                            <template>
                            <el-button type="text" size="mini" v-if="!row.isEdit && orderDetail.isUnLocked" @click="editFn(row, $index)">
                                <i class="icon el-icon-edit blue"></i>
                            </el-button>
                            <el-button type="text" size="mini" v-if="!row.isEdit && orderDetail.isUnLocked" @click="delFn(row,$index)">
                                <i class="icon el-icon-delete red"></i>
                            </el-button>
                            <el-button type="text" size="mini" v-if="row.isEdit && orderDetail.isUnLocked" @click="saveFn(row, $index)">
                                <i class="icon el-icon-circle-check blue"></i>
                            </el-button>
                            <el-button type="text" size="mini" v-if="row.isEdit && orderDetail.isUnLocked" @click="cancelFn(row, $index)">
                                <i class="icon el-icon-circle-close blue"></i>
                            </el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-form>
    </div>
    <PackingBoxExportDialog ref="PackingBoxExportDialogRef" :orderDetail="orderDetail" @success="successSave"></PackingBoxExportDialog>
  </div>
</template>

<script>
import { deleteOrderBoxInfoApi, saveOrderBoxInfoApi, detailThiOrderApi } from '@/api/thirdKind'
import PackingBoxExportDialog from './PackingBoxExportDialog';

export default {
    name: 'Packing',
    props: {
        
    },
    components: {
        PackingBoxExportDialog
    },
    data() {
        return {
            loading: false,
            id: this.$route.query.id,
            item: {
                boxList: []
            },
            orderDetail: {}
        };
    },
    async created() {
       await this.getDetail()
       this.initBox()
    },
    methods: {
        initBox() {
            let arr = []
            this.orderDetail.boxList.forEach(v => {
                v.isEdit = false
                arr.push({
                    ...v
                })
            })
            this.item.boxList = arr;
        },
        async getDetail() {
			this.loading = true
			let res = await detailThiOrderApi(this.id)
			if (res.ok) {
                res.content.isUnLocked = [0, 30].includes(res.content.lockOrderState) && res.content.orderState !==100
                this.orderDetail = res.content
			}
			this.loading = false
		},
        editFn(row) {
            row.isEdit = true
            row.editRow = {
                ...row
            }
        },
        cancelFn(row, index) {
            row = row.editRow
            row.isEdit = false
            this.$set(this.item.boxList, index, row)
        },
        async delFn(row, index) {
            this.$confirm('是否确认删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
                deleteOrderBoxInfoApi(row.id).then(res => {
                    if(res.ok) {
                        this.item.boxList.splice(index, 1);
                        this.$message.success('删除成功');
                        this.$emit('init')
                        this.getDetail()
                    }
                })
                
			}).catch(() => {

			});
        },
        async saveFn(row, index) {
            this.$refs.containerListForm.validate(async valid => {
                if (valid) {
                    saveOrderBoxInfoApi(row).then(res => {
                        if (res.ok) {
                            row.isEdit = false
                            this.$message.success('保存成功');
                            this.$emit('init')
                            this.getDetail()
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        async successSave() {
            this.$emit('init')
            await this.getDetail()
            this.initBox()
        },
        // 导入
        importPackingInformation() {
           this.$refs.PackingBoxExportDialogRef.show()
        }
    }
};
</script>
<style lang="scss" scoped>
.form-module-title {
    font-size: 15px;
    margin-bottom: 10px;
    display: block;
    color: #1890ff;
    padding-left: 10px;
    border-left: 2px solid #1890ff;
    height: 28px;
    line-height: 28px;
}

.form-module-item {
    overflow: hidden;
    padding: 15px;
    background: #fff;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;

    .item {
        width: 25%;
        float: left;
        padding: 0 20px;
        margin-bottom: 10px;

        label {
            font-size: 14px;
            margin-right: 20px;
        }

        span {
            font-size: 12px;
        }
    }
}
.blue {
    font-size: 16px;
}
.red {
    color: red;
    font-size: 16px;
}
::v-deep .el-form-item {
    margin-bottom: 0px;
}
</style>
