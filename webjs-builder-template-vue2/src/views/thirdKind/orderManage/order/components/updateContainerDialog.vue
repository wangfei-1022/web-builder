<template>
  <el-dialog :visible.sync="dialogVisible" :title="getZH('updateContainerInfo')" width="800px" :close-on-click-modal="false">
    <div class="dialog-content" v-loading="loading">
        <div style="margin-bottom: 10px;overflow: hidden;">
            <el-button type="primary" size="mini" @click="addFn()" style="float: left; margin-top: 3px;">{{ $t("common.addBtn") }}</el-button>
            <el-form-item class="item" :label="$t('thirdKindOrder.sumCount')" prop="sumContainerStr" style="float: left; ">
                {{formData.containerDesc}}
            </el-form-item>
        </div>
      <el-form :inline="true" :model="item" @submit.native.prevent ref="containerListForm">
       
        <div style="position: relative;">
          <el-table class="case-data-table" size="mini" border :data="item.boxList" style="width: 100%">
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>{{ $t('sea.containerNo')  }}
              </template>
              <template slot-scope="{row}">
                <span> {{row.containerNo}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('thirdKindOrder.containerType')">
              <template slot-scope="{row, $index}">
                <span v-if="!row.isEdit">{{row.englishName}}</span>
                <el-form-item v-else label="" :prop="`boxList[${$index}].typeCode`" :rules="[{ required: true, message: $t('blInfo.placeholder'), trigger: 'change'},]">
                  <ContainerSelect class="w-140" @change="ContainerTypesChange($event,row)" :itemObj="row"></ContainerSelect>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('thirdKindOrder.ownerType')">
              <template slot-scope="{row, $index}">
                <span v-if="!row.isEdit">{{row.ownerTypeName}}</span>
                <el-form-item v-else label="" :prop="`boxList[${$index}].ownerType`" :rules="[{ required: true, message: $t('blInfo.placeholder'), trigger: 'change'},]">
                  <el-checkbox v-model="row.ownerType" :true-label="1" :false-label="2">（SOC）</el-checkbox>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row,$index}">
                <template>
                  <el-button type="text" size="mini" v-if="!row.isEdit" @click="editFn(row, $index)">
                    <i class="icon el-icon-edit blue"></i>
                  </el-button>
                  <el-button type="text" size="mini" v-if="!row.isEdit && !row.containerNo" @click="delFn(row,$index)">
                    <i class="icon el-icon-delete red"></i>
                  </el-button>
                  <el-button type="text" size="mini" v-if="row.isEdit" @click="saveFn(row, $index)">
                    <i class="icon el-icon-circle-check blue"></i>
                  </el-button>
                  <el-button type="text" size="mini" v-if="row.isEdit" @click="cancelFn(row, $index)">
                    <i class="icon el-icon-circle-close blue"></i>
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm()" :loading="loading">{{ $t("common.saveBtn") }}</el-button>
      <el-button size="mini" @click="dialogVisible = false" :loading="loading"> {{ $t("common.cancelBtn") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import getZHMixin from './getZHMixin';
import { saveThiOrderContainerInfoApi } from '@/api/thirdKind';
import ContainerSelect from "@/views/cargo/v0/SeaExport/components/order/containerSelect";

export default {
    name: 'UpdateContainerDialog',
    mixins: [getZHMixin],
    components: {
       ContainerSelect 
    },
    props: {
        formData: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            loading: false,
            item: {
                boxList: []
            }
        };
    },
    watch: {
        formData: {
            handler() {
                this.init()
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        init() {
            let arr = [];
            this.formData.boxList.forEach(v => {
                v.isEdit = false;
                arr.push({
                    ...v
                });
            });
            this.item.boxList = arr;
        },
        show() {
            this.dialogVisible = true;
            this.init()
        },
        editFn(row) {
            row.isEdit = true;
            row.editRow = {
                ...row
            }
        },
        addFn() {
            this.item.boxList.push({
                isEdit: true,
                ownerType: 2,
                ownerTypeName: 'COC',
                englishName: '',
                chineseName: '',
                typeCode: ''
            })
        },
		ContainerTypesChange(val, row) {
			if (this.$isNotEmpty(val)) {
				row.chineseName = val.chineseName
				row.englishName = val.englishName
				row.typeCode = val.typeCode
			} else {
				row.chineseName = null
				row.englishName = null
				row.typeCode = null
			}
		},
        cancelFn(row, index) {
            row = row.editRow;
            row.isEdit = false;
            this.$set(this.item.boxList, index, row);
        },
        delFn(row, index) {
            this.item.boxList.splice(index, 1);
        },
        saveFn(row) {
            row.ownerTypeName = row.ownerType ===  1 ? 'SOC' : 'COC'
            row.isEdit = false
        },
        async saveForm() {
            let check = true
            this.item.boxList.forEach(v => {
                if(!v.englishName || !v.ownerType) {
                    check = false
                }
            })
            if(!check) {
                this.$message.error(this.getZH('updateContainerError'));
                return
            }
            let data = {
                orderId: this.formData.id,
                boxes: this.item.boxList
            }
             this.loading = true;
            let res = await saveThiOrderContainerInfoApi(data);
            if (res.ok) {
                this.$message.success(this.getZH('saveSuccess', 'common'));
                this.dialogVisible = false;
                this.$emit('saved');
            }
            this.loading = false;
        }
    }
};
</script>

<style lang="scss" scoped>
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
