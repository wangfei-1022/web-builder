<!-- 分配提箱点-->
<template>
  <div class="suitcase-chunk">
    <div v-if="mode === modes.dialog" style="font-size: 14px;font-weight: 20;margin-top: 10px;">
      <div>{{$t('charteredBoat.suitCase.soQuantity')}}{{ containerTitles }}</div>
    </div>
    <div>
      <el-form
        ref="suitcaseGridForm"
        label-width="0px"
        :show-message="false"
        label-position="left"
        :model="suitcaseGrid"
      >
        <el-table
          v-if="!allSoc"
          header-row-class-name="el-grid-header el-grid-header-required"
          row-class-name="el-grid-row "
          :cell-style="{padding:'0px'}"
          :data="suitcaseGrid.data"
          stripe
          :height="modes.dialog===mode?'200px':'200px'"
          style="width: 100%"
        >
          <!--    todo 已作业不可编辑      -->
          <el-table-column
            prop="qty"
            :label="$t('common.quantity')"
            align="center"
            width="150"
          >
            <template slot-scope="{row,$index}">
              <el-form-item
                label=""
                label-width="0px"
                :prop="'data.' + $index + '.qty'"
                :rules="[{ required:true,type:'number',validator:checkQty },]"
              >
                <el-input v-model="row.qty" size="mini" :disabled="row.lock" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="containerSizeType"
            :label="$t('charteredBoat.containerType')"
            align="center"
            class-name="not-required"
            width="200"
          >
            <template slot-scope="{row}">
              <span>{{ row.containerSizeType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="pickUpAddr"
            align="center"
            :label="$t('charteredBoat.suitCase.containerType')"
          >
            <template slot-scope="{row,$index}">
              <el-form-item
                label=""
                label-width="0px"
                :prop="'data.' + $index + '.pickUpAddr'"
                :rules="[
                  { required: true, message: $t('charteredBoat.suitCase.pickUpAddrEmptyInvalid') },
                ]"
              >
                <el-select v-model="row.pickUpAddr" :disabled="row.lock" size="mini" class="w-full" @change="pickUpChange($event,row)">
                  <el-option v-for="(item,index) in suitcaseSelectList" v-if="item.supportContainerSizeType.indexOf(row.containerSizeType) > -1 " :key="index" :label="item.pickUpAddr" :value="item.pickUpAddr" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            align="center"
            class-name="not-required"
            :label="$t('charteredBoat.suitCase.remark')"
          >
            <template slot-scope="{row}">
              <el-form-item
                label=""
                label-width="0px"
              >
                <el-input v-model="row.remark" maxlength="255" size="mini" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            width="170"
            class-name="not-required"
            label=""
          >
            <template slot-scope="{row,$index}">
              <div v-show="!row.lock" style="display: flex;justify-content: center">
                <el-button v-if="row.isGroupFirst" type="primary" size="mini" @click="add(row,$index)">
                  {{$t('charteredBoat.suitCase.addPickup')}}
                </el-button>
                <el-button v-else type="danger" size="mini" @click="del(row, $index)">
                  {{$t('charteredBoat.suitCase.removePickup')}}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <!--    <div v-if="mode===modes.dialog" style="color:red;padding-top: 20px;">-->
    <!--      提箱点分配的集装箱数量与客户申请的集装箱数量不符，请确认后再试。-->
    <!--    </div>-->
    <div v-if="mode===modes.dialog" style="display: flex;justify-content: flex-end;margin-top: 20px;">
      <el-button type="primary" size="mini" @click="confirm">{{$t('common.confirmBtn')}}</el-button>
      <el-button type="" size="mini" @click="cancel">{{$t('common.cancelBtn')}}</el-button>
    </div>

  </div>
</template>

<script>

import { getAddressList, saveAddressList, loadingPortAddressList } from '@/api/charteredBoat/booking4Manager'
import lodash from 'lodash'
import { commonReg } from '@/utils/validate'
const modes = { // 展示的模式
  dialog: 'dialog',
  form: 'form'
}
export default {
  name: 'Suitcase',
  props: {
    polCode: { type: String, default: '' },
    sailingId: { type: String, default: '' },
    containerSizeTypeQty: { type: String, default: '' },
    orderId: { type: [String, Number] },
    formContainers: { type: Array, default: () => [] }, // 表单的集装箱数据
    list: { type: Array }, // 审核页传递过来的提箱点数据
    mode: {
      type: String, default: modes.dialog, validator(value) {
        return [modes.dialog, modes.form].includes(value)
      }
    }
  },
  data() {
    return {
      modes,
      allSoc: false, // 是否全部为货主自有的
      originalSuitcaseDetail: {}, // 原始的提箱点详情信息
      containers: [],
      containerTitles: '',
      suitcaseGrid: {
        titleTotalInfo: [], // 头部统计箱型展示
        rowTemplate: {
          containerSizeType: '',
          createBy: 0,
          createByName: '',
          createTime: 0,
          doneCount: 0,
          grossWeight: 0,
          id: 0,
          optUrl: '',
          orderId: 0,
          pickId: '',
          pickUpAddr: '',
          qty: 0,
          remark: '',
          returnAddr: '',
          socFlag: 0,
          tenantId: 0,
          unCount: 0,
          updateBy: 0,
          updateByName: '',
          updateTime: 0
        },
        data: []
      },
      suitcaseSelectList: []
    }
  },
  watch: {
    formContainers() {

    },
    polCode() {
      this.initLoadingPortAddressList()
    }
  },
  async created() {
    if (this.list) { // 外部数据优先
      this.suitcaseGrid.data = this.list
    } else if (this.orderId) {
      // 提箱点结构和集装箱一致
      await getAddressList(this.orderId).then(res => {
        // 获取提箱点列表
        if (res.ok) {
          this.suitcaseGrid.data = res.content.distributeContainers
          // 测试锁定
          this.originalSuitcaseDetail = res.content
        } else {
          this.$message.error(this.$t('charteredBoat.suitCase.getPickupList'))
        }
      })
    }
    this.preDealAddressList()
    this.initLoadingPortAddressList()
    if (this.mode === this.modes.dialog) {
      this.onContainerChange()
    }
  },
  methods: {
    initLoadingPortAddressList() {
      // 下拉框数据
      loadingPortAddressList(this.polCode, this.sailingId).then(res => {
        if (res.ok) {this.suitcaseSelectList = res.content}
      })
    },
    checkQty(r, v, c) { // 提箱点数量校验
      console.log('checkQty', v)
      if (v && commonReg.isNumber.test(v) && Number(v) > 0) {
        c()
      } else {
        c(new Error(this.$t('charteredBoat.suitCase.inputZeroError')))
      }
    },
    preDealNotEditData(listData) { // 处理不让编辑的数据
      listData.forEach(item => {
        if (item.doneCount && item.qty === item.doneCount) {
          //
          item.lock = true
        } else {
          item.lock = false
        }
      })
    },
    preDealAddressList() { // 预处理提箱列表信息(第一条添加组变量)
      // 根据箱型分组
      this.preDealNotEditData(this.suitcaseGrid.data)
      const groupObj = lodash.groupBy(this.suitcaseGrid.data, item => item.containerSizeType)
      const arr = []
      Object.keys(groupObj).forEach(key => {
        const values = groupObj[key]
        // 同箱型（对象键一样：如40Gp）的记录集合
        const orderValues = lodash.orderBy(values, ['lock'], ['desc'])

        for (let i = 0; i < orderValues.length; i++) {
          const v = orderValues[i]
          if (!v.lock) {
            v.isGroupFirst = true
            break
          }
        }
        arr.push(...orderValues)
      })
      const oldLength = this.suitcaseGrid.data.length
      this.suitcaseGrid.data.splice(0, oldLength, ...arr) // 为了不改变引用
      //
      // this.suitcaseGrid.data = arr
    },
    add(row, index) {
      // isGroupFirst 同箱型组的第一条
      this.suitcaseGrid.data.splice(index + 1, 0, {
        ...this.suitcaseGrid.rowTemplate,
        isGroupFirst: false,
        isEdit: true,
        containerSizeType: row.containerSizeType
      })
    },
    del(row, index) {
      this.suitcaseGrid.data.splice(index, 1) // 删除选中的数据
    },
    onContainerChange() {
      // 集装箱信息发生变化
      this.computeSuitcaseListData()
      this.computeTitleTotal()
    },
    computeSuitcaseListData() {
      // 根据集装箱数量的调整，动态计算更新 提箱点列表
      const r = this.getContainerWithoutSocFlag()
      const groupArr = Object.keys(r).map(k => {
        const item = r[k]
        return { containerSizeType: item.containerSizeType, qty: item.qty }
      })
      const diff = lodash.differenceBy(groupArr, this.suitcaseGrid.data, 'containerSizeType')
      // 待添加的（集装箱列表有，提箱点无的）数据
      const waitAddSuitcases = diff.map(item => ({ ...this.suitcaseGrid.rowTemplate,
          isGroupFirst: true,
          isEdit: true,
          qty: item.qty,
          containerSizeType: item.containerSizeType
        }))
      // console.log('waitAddSuitcases', waitAddSuitcases)
      this.suitcaseGrid.data.push(...waitAddSuitcases)
    },
    getContainerWithoutSocFlag() {
      const arr = this.mode === this.modes.dialog ? this.originalSuitcaseDetail.useContainers : this.formContainers
      let r = []
      if (this.$isNotEmpty(arr)) {
        const noSocFlagContainers = arr.filter(item => !item.socFlag)
        r = this.getListCountSum(noSocFlagContainers)
      }
      return r
    },
    computeTitleTotal() {
      // 根据集装箱列表计算，总计title内容
      console.log('====computeTitleTotal')
      const result = ''
      const r = this.getContainerWithoutSocFlag()
      // todo 需要剔除货主自有的不
      if (this.$isEmpty(r)) { // 全部都是货主自有的，不显示提箱点模块
        this.allSoc = true
        const oldLength = this.suitcaseGrid.data.length
        this.suitcaseGrid.data.splice(0, oldLength)
      } else {
        this.allSoc = false
      }

      Object.keys(r).forEach((k, index) => {
        this.containerTitles += index > 0 ? ',' : ''
        this.containerTitles += `${k}*${r[k].qty}`
      })
      this.containerTitles = result
      // return result
    },
    getListCountSum(listData) {
      const groupContainerType = {}
      listData.forEach(item => {
        const containerSizeType = item.containerSizeType
        const qty = Number(item.qty)
        const doneCount = Number(item.doneCount)
        const unCount = Number(item.unCount)
        if (groupContainerType[containerSizeType] === undefined) {
          groupContainerType[containerSizeType] = { qty, doneCount, unCount, containerSizeType: item.containerSizeType }
        } else {
          groupContainerType[containerSizeType].qty += qty
          groupContainerType[containerSizeType].doneCount += doneCount
          groupContainerType[containerSizeType].unCount += unCount
        }
      })
      return groupContainerType
    },
    toCheckDialogGirdData() {
      const noSocFlagContainers = this.originalSuitcaseDetail.useContainers.filter(item => !item.socFlag)
      return this.toCheckGridData(noSocFlagContainers)
    },
    toCheckFormGridData() {
      const noSocFlagContainers = this.formContainers.filter(item => !item.socFlag)
      return this.toCheckGridData(noSocFlagContainers)
    },
    toCheckGridData(sourceContainers) { // 校验同箱型的数量和 集装箱（非货主自有）的数量比较
      let pass = true
      const containersNumSum = this.getListCountSum(sourceContainers) // 集装箱记录数量合计
      const suitcaseNumSum = this.getListCountSum(this.suitcaseGrid.data)// 提箱点记录数量合计
      console.log(containersNumSum, suitcaseNumSum)
      if (this.$isEmpty(containersNumSum) && this.$isNotEmpty(suitcaseNumSum) || this.$isNotEmpty(containersNumSum) && this.$isEmpty(suitcaseNumSum)) {
        // 一条有数据 另一条没数据 直接pass
        pass = false
      } else {
        Object.keys(containersNumSum).forEach(cK => {
          const container = containersNumSum[cK]
          const suitcase = suitcaseNumSum[cK]
          if (!suitcase || !container || suitcase.qty !== container.qty) {
            pass = false
            return
          }
        })
      }

      if (!pass) {
        const msg = this.$t('charteredBoat.suitCase.allotContainerAmoutnError')
        this.$alert(msg, {
          confirmButtonText: this.$t('common.confirmBtn'),
          type: 'error'
        })
        // this.$emit('numCheckFail') // 提箱点数量校验失败
      }
      return pass
    },
    toCheckTypeAndPickUpAddrUnique() {
      // 校验（箱型和提箱点）组合唯一
      let pass = true
      const excludeLock = this.suitcaseGrid.data.filter(item => !item.lock)
      const groupObj = lodash.countBy(excludeLock, item => item.containerSizeType + item.pickUpAddr)
      Object.keys(groupObj).forEach(key => {
        const count = groupObj[key]
        if (count > 1) {
          // 存在重复
          const msg = this.$t('charteredBoat.suitCase.sameContainerTypeError')
          this.$alert(msg, {
            confirmButtonText: this.$t('common.confirmBtn'),
            type: 'error'
          })
          pass = false
        }
      })
      return pass
    },
    checkForm() {
      // 校验表单
      let pass = true
      this.$refs.suitcaseGridForm.validate((valid, failFields) => {
        if (valid && this.toCheckTypeAndPickUpAddrUnique()) {
          // 校验同箱型的数量和 集装箱（非货主自有）的数量比较
          if (this.mode === this.modes.dialog) {
            pass = this.toCheckDialogGirdData()
          } else {
            pass = this.toCheckFormGridData()
          }
          console.log('提箱点信息校验通过')
        } else {
          pass = false
          console.error('提箱点信息校验失败')
        }
      })
      console.log('提箱点信息校验结束')
      return pass
    },
    /**
     * 提还箱点信息变更
     */
    pickUpChange(val, row) {
      const selectedItem = this.suitcaseSelectList.find(item => item.pickUpAddr === val)
      this.$set(row, 'returnAddr', selectedItem.returnAddr)
      this.$set(row, 'pickId', selectedItem.id)
      console.log(val, row, selectedItem)
    },
    confirm() {
      // 提交 初步校验下同箱型的总数
      if (this.checkForm()) {
        // 分配成功触发
        saveAddressList({ ...this.originalSuitcaseDetail, distributeContainers: this.suitcaseGrid.data }, this.orderId).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('charteredBoat.suitCase.allotSuccess'))
            this.$emit('success')
            this.$emit('update:visible', false)
          } else {
            this.$message.error(this.$t('charteredBoat.suitCase.allotFailed'))
          }
        })
      }
    },
    cancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss">
.suitcase-chunk {
  .el-grid-row {
    .el-form-item {
      margin-bottom: 0px !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.suitcase-chunk {
  width: 100%;
}
</style>
