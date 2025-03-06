<template>
  <el-dialog   :title="$t('sea.adjustBoxTypeAndVolume')" :visible.sync="showDialog" :close-on-click-modal="false" :before-close="closeDialog" width="950px" class="dialog-box">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent ref="dataForm" v-loading="loading">
      <div class="flex-bet">
        <el-form-item :label="$t('sea.boxQuantityStatistics')" style="width: 48%">
          {{calculateBoxVolume }}
        </el-form-item>
        <el-form-item label="" style="width: 48%">
          <el-checkbox v-model="dataForm.checked">{{ $t('sea.batchAdjustment') }}</el-checkbox>
        </el-form-item>
      </div>
      <el-table class="data-table" :data="dataForm.list" height="280">
<!--        箱号-->
        <el-table-column prop="name" :label="$t('sea.containerNo')" align="center"  width="200px" >
          <template slot-scope="{row,$index}">
            <el-form-item label="" :prop="`list.${$index}.containerNo`" >
              <span v-if="row.containerNo">{{row.containerNo}}</span>
              <span v-else>{{$t('sea.beSpecified')}}</span>
            </el-form-item>
          </template>
        </el-table-column>
<!--        箱型-->
        <el-table-column prop="name" :label="$t('sea.box')" align="center"  width="120px" >
          <template slot-scope="{row,$index}">
            <el-form-item label="" :prop="`list.${$index}.containerType`"  :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <ContainerSelect :name="`list.${$index}.containerType`" v-if="row.isEdit" :itemObj="row" @change="containerTypesChange($event,row,$index)"></ContainerSelect>
              <span v-else>{{row.containerType}}</span>
            </el-form-item>
          </template>
        </el-table-column>
<!--        箱属-->
        <el-table-column prop="name" :label="$t('sea.boxGenus')" align="center"  width="150px" >
          <template slot-scope="{row,$index}">
            <el-form-item label="" :prop="`list.${$index}.ownerType`">
              <el-checkbox  v-if="row.isEdit"  v-model="row.ownerType" :true-label="1" :false-label="2">SOC</el-checkbox>
              <span v-else>{{row.ownerType === 1 ? 'SOC' : 'COC' }}</span>
            </el-form-item>
          </template>
        </el-table-column>
<!--        毛重（KGS）-->
        <el-table-column prop="name" :label="$t('sea.weight')" align="center"  width="200px" >
          <template slot-scope="{row,$index}">
            <el-form-item label="" :prop="`list.${$index}.weight`" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },{message: $t('sea.doNotExceed30000'),validator:checkNumber,}]">
              <el-input  v-if="row.isEdit" v-model="row.weight" v-input-limit="[5,0]" size="mini" :placeholder="$t('sea.containerWeight30000')" />
              <span v-else>{{row.weight}}</span>
            </el-form-item>
          </template>
        </el-table-column>
<!--        操作-->
        <el-table-column prop="name" :label="$t('sea.operating')" align="center" fixed="right" width="150" >
          <template slot-scope="{ row, $index }">
            <template v-if="row.isEdit">
              <i class="icon el-icon-folder-checked blue" @click="saveRow(row,$index)" style="margin-right: 10px"></i>
              <i class="icon el-icon-folder-delete red" v-if="dataForm.list.length > 1"  @click="noSave(row,$index)"></i>
            </template>
            <template v-else>
              <el-button :disabled="isEdit || row.jobState ===20" type="text" icon="el-icon-edit-outline" class="icon blue"  @click="listEdit(row,$index )"></el-button>
              <el-button :disabled="isEdit" type="text" icon="el-icon-circle-plus" class="icon blue"  @click="addlist(row)" ></el-button>
              <el-button v-show="dataForm.list.length>1 && !row.containerNo" :disabled="isEdit || row.jobState ===20" type="text" icon="el-icon-remove" class="icon red"  @click="dellist($index)"></el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submit" :disabled="isEdit">{{$t('sea.save')}}</el-button>
        <el-button size="mini" @click="closeDialog">{{$t('sea.cancel')}}</el-button>
      </span>
  </el-dialog>
</template>
<script>
import lodash from 'lodash'
import ContainerSelect from "@/views/cargo/v0/SeaExport/components/order/containerSelect";
import {jobBookingContainersApi, jobUpdateContainerApi} from "@/api/seaExportOrder";
export default {
  name: 'AdjustBoxTypeAndVolume',
  components: {ContainerSelect },
  props: {
    // value: { type: String, default: null },
    showDialog: { type: Boolean, default: false },
    bookingJobId: { type: String, default: null }
  },
  data() {
    return {
      loading: false,
      dataForm: {
        list: [{}],
        bookingChannel: 1,
        bookingJobMethod: null
      },
      containerListData: [],
      isEdit: false,
      editCopy: {}
    }
  },
  computed: {
    calculateBoxVolume() {
      // 计算箱量
      const containerType = {}
      this.dataForm.list.map(item => {
        containerType[item.containerType] ? containerType[item.containerType]++ : containerType[item.containerType] = 1
      })
      const containerTypeArr = []
      for (const key in containerType) {
        if (key && key.toString() !== 'undefined') {
          containerTypeArr.push(`${key}*${containerType[key]}`)
        }
      }
      return containerTypeArr.join('、')
    }
  },
  created() {
    this.adjustBoxTypeAndVolume()
  },
  methods: {
    checkNumber(rule, val, callback, source) {
      if (!Number(val) > 0) {
        // this.message = this.$message.error(this.$t('booking.pleaseEnterGreaterThan0'))
        callback(new Error())
      } else if (Number(val) > 30000) {
        // this.message = this.$message.error('预估单箱货重请勿超过30000KGS')
        callback(new Error())
      } else {
        callback()
      }
    },
// 调整箱型箱量
    async adjustBoxTypeAndVolume() {
      this.loading = true
      const res = await jobBookingContainersApi(this.bookingJobId)
      this.loading = false
      if (res.ok) {
        this.$set(this.dataForm, 'list', res.content)
      }
    },

    async submit() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.loading = true
          const res = await jobUpdateContainerApi(this.dataForm.list, this.bookingJobId)
          this.loading = false
          if (res.ok) {
            this.bookingConfirmCallBack()
            this.closeDialog()
          }

        }
      })
    },
    bookingConfirmCallBack() {
      this.$emit('submitCallBack', this.dataForm)
    },
    closeDialog() {
      this.$emit('update:showDialog', false)
    },
    containerTypesChange(val, item, index) {
      this.$set(item, 'containerType', val.englishName)
    },
    addlist(row) {
      const copyRow = lodash.pick(row, ['containerType', 'ownerType', 'weight'])
      this.dataForm.list.push(lodash.merge(copyRow, {
          isEdit: true,
          isNewAdd: true
        })
        )
      this.isEdit = true
    },
    dellist(i) {
      this.dataForm.list.splice(i, 1)
    },
    listEdit(row) {
      this.editCopy = lodash.cloneDeep(row)
      this.$set(row, 'isEdit', true)
      this.isEdit = true
    },
    saveRow(row, $index) {
      let fieldName = [
        'list.' + $index + '.containerType',
        'list.' + $index + '.weight'
      ]
      let flag = true
      this.$refs.dataForm.validateField(fieldName, valid => {
        if (valid !== '') {
          flag = false
        }
      })
      if (flag) {
        this.dictListOps = this.dictListOpsCopy
        this.$set(row, 'isEdit', false)
        this.$set(row, 'isNewAdd', false)
        this.isEdit = false
        if (this.dataForm.checked) { // 批量调整
          this.dataForm.list.map((item, i) => {
            if (item.jobState !== 20) {
              const copyRow = lodash.pick(row, ['containerType', 'ownerType', 'weight'])
              const mergeRow = lodash.merge(item, copyRow)
              this.$set(this.dataForm.list, i, mergeRow)
            }

          })
        }
        this.dataForm.list.map((item, i) => {
          this.$set(this.dataForm.list[i], 'weight', row.weight)
        })
      }
    },
    noSave(row, i) {
      this.$refs.dataForm.clearValidate()
      this.$set(this.dataForm.list, i, this.editCopy)
      this.$set(row, 'isEdit', false)
      this.isEdit = false
      if (row.isNewAdd) {
        this.dataForm.list.splice(i, 1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.icon{ font-size: 28px; transition: all 0.2s ease 0s; cursor: pointer;user-select: none;
  &:hover{ transform: scale(1.1)}
}
.blue{ color: #1890ff}
.red{color: #ff4949}
.flex-bet{ display: flex; align-items:flex-start ; justify-content: space-between;flex-wrap:wrap;}
.box_title{ border-left: solid 3px rgb(24,144,255);font-size: 18px; color: #199ED8; padding-left: 8px; height: 28px; line-height: 28px; margin:5px 0 8px 0; display: flex;
  .operate-buttons-left{ margin-left: 20px}
}
.box{ background-color: #f5f7f7; padding: 8px;
  ::v-deep .el-form-item--medium{
    .el-form-item__content{ line-height: 28px}
    .el-form-item__label{ line-height: 28px}
  }
}
.box_child{border: solid 1px rgba(121, 121, 121, 1); padding: 20px 30px; background: #fff; margin-bottom: 15px;
  .box25{ width: 20%}
}
::v-deep .el-form--inline .el-form-item{ display: inline-block}
//**
.data-table{
  ::v-deep {
    .el-form-item{ margin: 10px 0}
    .el-form-item__error{ display: none}
    .el-form-item__content{
      max-width: 100%;
    }
  }
}

.el-input__inner.disabled {
  background-color: #F5F7FA;
  border-color: #dfe4ed;
  color: #606266 ;
  cursor: not-allowed;
}
::v-deep {
  .el-checkbox{ display: block}
}
</style>
