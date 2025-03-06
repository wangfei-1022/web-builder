<template>
  <div v-loading="loading" class="right-main-wrapper">
    <h3 class="content-title">{{ title }}</h3>
    <el-form ref="orderForm" id="orderForm" :model="orderForm" label-width="100px" :rules="orderFormRules" :inline="true" size="mini" style="width: 1000px; margin-top: 20px;" class="inline-form">
      <el-form-item :label="`${$t('containerManager.orderType')}: `" prop="orderType">
        <el-select v-model="orderForm.orderType" :disabled="notCreate">
          <el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="`${$t('containerManager.orderNo')}: `" prop="orderNo">
        <el-input v-model="orderForm.orderNo" maxlength="200" :disabled="viewDetail" />
      </el-form-item>
      <el-form-item :label="`${$t('containerManager.contractNo')}: `" prop="contractNo">
        <el-input v-model="orderForm.contractNo" maxlength="200" :disabled="viewDetail" />
      </el-form-item>
      <el-form-item :label="`${$t('containerManager.currency')}: `" prop="currency">
        <el-select v-model="orderForm.currency" :disabled="viewDetail">
          <el-option v-for="item in currencyList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="`${$t('containerManager.orderDetail.depreciationRate')}: `" prop="depreciationRate" v-show="orderForm.orderType != 3">
        <NumberInput :suffix="'iconfont icon-baifenhao'" v-model="orderForm.depreciationRate" :disabled="viewDetail" :limitRange="{digits: 2, decimal: 2}"></NumberInput>
      </el-form-item>
      <el-form-item :label="`${$t('containerManager.orderDetail.minimumSalvageRate')}: `" prop="minimumSalvageRate" v-show="orderForm.orderType != 3">
        <NumberInput :suffix="'iconfont icon-baifenhao'" v-model="orderForm.minimumSalvageRate" :disabled="viewDetail" :limitRange="{digits: 2, decimal: 2}"></NumberInput>
      </el-form-item>
      <el-form-item :label="orderClient" prop="memberId">
        <el-select
          v-model="orderForm.memberId"
          filterable
          remote
          :remote-method="getMemberList"
          :loading="remoteLoading"
          :disabled="viewDetail"
          @change="filterMemberName"
        >
          <el-option
            v-for="item in memberList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="startTimeName" prop="startTime">
        <CommonPicker
          v-model="orderForm.startTime"
          :parent-date="orderForm.startTime"
          pikcer-type="date"
          clearable
          :disabled="viewDetail"
        />
      </el-form-item>
      <el-form-item :label="`${$t('containerManager.orderDetail.endDate')}: `" prop="endTime">
        <CommonPicker
          v-model="orderForm.endTime"
          :parent-date="orderForm.endTime"
          :dependence-date="$moment(orderForm.startTime).add(1,'days').valueOf()"
          parent-option="followingDependence"
          pikcer-type="date"
          clearable
          :disabled="viewDetail"
        />
      </el-form-item>
    </el-form>
    <section class="info-wrapper">
      <section class="info-section">
        <SectionTitle :title="$t('containerManager.orderDetail.containerInfo')"></SectionTitle>
        <div class="info-content-wrap">
          <ContainerTypeTableForm ref="containerBaseList" />
        </div>
      </section>
      <section class="info-section" v-show="orderForm.orderType > 1">
        <SectionTitle :title="$t('containerManager.orderDetail.stepRate')"></SectionTitle>
        <div class="info-content-wrap">
          <ContainerStepTableForm ref="containerStepList" />
        </div>
      </section>
    </section>
    <div v-show="!viewDetail" class="btn-wrap">
      <el-button type="primary" size="mini" :loading="loading" :disabled="loading" @click="checkOrderInfo">{{$t('common.submitBtn')}}</el-button>
      <el-button size="mini" :disabled="loading" @click="cancelEdit">{{$t('common.cancelBtn')}}</el-button>
    </div>
    <!-- <el-divider></el-divider> -->
  </div>
</template>
<script>
import SectionTitle from '@/components/Cargo/Common/sectionTitle'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
import ContainerTypeTableForm from './components/ContainerTypeTableForm'
import ContainerStepTableForm from './components/ContainerStepTableForm'
import { getCurrencyListApi, getMemberListApi, createOrderApi, getOrderDetailApi, updateOrderApi } from '@/api/orderManager'
export default {
  name: 'OrderDetail',
  components: {
    SectionTitle,
    NumberInput,
    ContainerTypeTableForm,
    ContainerStepTableForm
  },
  data() {
    return {
      loading: false,
      remoteLoading: false,
      viewDetail: false,
      editId: '',
      title: this.$t('containerManager.orderDetail.createOrder'),
      orderClient: `${this.$t('containerManager.orderDetail.client')}: `,
      startTimeName: `${this.$t('containerManager.orderDetail.startDate')}: `,
      startTime: null,
      orderForm: {
        orderType: 1,
        orderNo: '',
        contractNo: '',
        currency: '',
        depreciationRate: '',
        minimumSalvageRate: '',
        memberId: '',
        memberName: '',
        startTime: null,
        endTime: null
      },
      orderFormRules: {
        orderType: [
          { required: true, message: this.$t('containerManager.orderDetail.orderTypeInvalid'), trigger: 'change' }
        ],
        orderNo: [
          { required: true, message: this.$t('containerManager.orderDetail.orderNoInvalid'), trigger: 'blur' }
        ],
        contractNo: [
          { required: true, message: this.$t('containerManager.orderDetail.contractNoInvalid'), trigger: 'blur' }
        ],
        currency: [
          { required: true, message: this.$t('containerManager.orderDetail.currencyInvalid'), trigger: 'change' }
        ],
        memberId: [
          { required: false, message: this.$t('containerManager.orderDetail.contractInvalid'), trigger: 'change' }
        ],
        startTime: [
          { required: false, message: this.$t('containerManager.orderDetail.startDateInvalid'), trigger: 'change' }
        ],
        endTime: [
          { required: false, message: this.$t('containerManager.orderDetail.endDateInvalid'), trigger: 'change' }
        ]
      },
      orderTypeList: [
        {
          label: this.$t('containerManager.newContainer'),
          value: 1
        },
        {
          label: this.$t('containerManager.rent'),
          value: 2
        },
        {
          label: this.$t('containerManager.loan'),
          value: 3
        }
      ],
      currencyList: [],
      memberList: []
    }
  },
  computed: {
    currDate() {
      return this.$moment({ hour: 0, minute: 0 }).valueOf()
    },
    notCreate() {
      return this.$route.params.operate && this.$route.params.operate.length > 0
    }
  },
  watch: {
    'orderForm.orderType': function(val) {
      const _name = ['', `${this.$t('containerManager.orderDetail.client')}: `, `${this.$t('containerManager.lessor')}: `, `${this.$t('containerManager.Lessee')}: `]
      const _time = ['', `${this.$t('containerManager.orderDetail.startDate')}: `, `${this.$t('containerManager.leaseStartDate')}: `, `${this.$t('containerManager.leaseStartDate')}: `]
      this.orderClient = _name[val]
      this.startTimeName = _time[val]
      this.orderFormRules.memberId = [
        { required: val !== 1, message: this.$t('containerManager.orderForm.contractInvalid'), trigger: 'change' }
      ]
      this.orderFormRules.startTime = [
        { required: val !== 1, message: this.$t('containerManager.orderForm.startDateInvalid'), trigger: 'change' }
      ]
      this.orderFormRules.endTime = [
        { required: val !== 1, message: this.$t('containerManager.orderForm.endDateInvalid'), trigger: 'change' }
      ]

      if (val === 1) {
        this.$refs.orderForm.clearValidate(['memberId', 'startTime', 'endTime'])
      }
    },
    'orderForm.startTime': function() {
      this.orderForm.endTime = null
    },
    'orderForm.minimumSalvageRate': function(val) {
      if (/(^\d{0,2}$)|(^\d{0,2}\.\d{0,3}$)/.test(val)) {
        this.orderForm.minimumSalvageRate = val
      } else {
        this.orderForm.minimumSalvageRate = val ? val.substring(0, val.length - 1) : ''
      }
    }
  },
  methods: {
    async getCurrencyList() {
      const res = await getCurrencyListApi()
      if (res.ok) {
        this.currencyList = res.content
      }
    },
    async getMemberList(val) {
      this.remoteLoading = true
      if (val.length > 2) {
        const res = await getMemberListApi(val)
        if (res.ok) {
          this.memberList = res.content.map(item => {
            let _data = { label: item.name, value: item.id }
            return _data
          })
        }
      }
      this.remoteLoading = false
    },
    async getOrderDetail() {
      this.loading = true
      const res = await getOrderDetailApi(this.editId)
      if (res.ok) {
        this.orderForm = { ...this.orderForm, ...res.content }
        this.getMemberList(this.orderForm.memberName)
        this.orderForm.startTime = Number(this.orderForm.startTime)
        this.$refs.containerBaseList.setList(res.content.containerTypeInfos)
        this.$refs.containerStepList.setList(res.content.orderContainerCharges)
        this.$nextTick(() => {
          this.orderForm.endTime = Number(res.content.endTime)
        })
      }
      this.loading = false
    },
    filterMemberName(val) {
      const _member = this.memberList.filter(item => item.value === this.orderForm.memberId)
      this.orderForm.memberName = _member[0].label
    },
    // 验证所有提交
    checkOrderInfo() {
      const checkList = [
        new Promise((resolve, reject) => {
          this.$refs.orderForm.validate(valid => {
            if (!valid) {
              reject('orderForm')
            }
            resolve('ok')
          })
        }),
        new Promise((resolve, reject) => {
          if (!this.$refs.containerBaseList.validateTableInfo()) {
            reject('containerBaseList')
          }
          resolve('ok')
        })
      ]

      if (this.orderForm.orderType > 1) {
        checkList.push(
          new Promise((resolve, reject) => {
            if (!this.$refs.containerStepList.validateTableInfo()) {
              reject('containerStepList')
            }
            resolve('ok')
          })
        )
      }

      Promise.all(checkList).then(res => {
        this.orderForm.containerTypeInfos = this.$refs.containerBaseList.containerTypeInfos
        if (this.orderForm.orderType > 1) {
          this.orderForm.orderContainerCharges = this.$refs.containerStepList.orderContainerCharges
        }
        // this.orderForm.containerTypeInfos.forEach(item1 => {
        //   this.orderForm.orderContainerCharges.forEach(item2 => {
        //     if (item2.containerType == item1.containerType) {
        //       item2.containerQuantity = item1.quantity
        //     }
        //   })
        // })
        this.submitOrderForm()
      }).catch(err => {
        this.loading = false
        const dom = document.querySelector(`#${err}`)
        dom.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    },
    // validateForm() {
    //   this.$refs.orderForm.validate(valid => {
    //     if (valid) {
    //       this.submitOrderForm()
    //     }
    //   })
    // },
    async submitOrderForm() {
      let res = null
      let _clear = false
      if (this.editId) {
        res = await updateOrderApi(this.editId, JSON.stringify(this.orderForm))
      } else {
        _clear = true
        res = await createOrderApi(JSON.stringify(this.orderForm))
      }

      if (res.ok) {
        this.$message({
          type: 'success',
          message: this.$t('containerManager.submitOrderSuccess')
        })

        this.$router.push({name: 'OrderList', params: { refresh: true }})
      }
    },
    cancelEdit() {
      this.$router.push({name: 'OrderList'})
    }
  },
  mounted() {
  },
  created() {
    this.getCurrencyList()
    // this.getMemberList()
    if (this.$route.params.id) {
      this.editId = this.$route.params.id
      this.getOrderDetail()
    }

    if (this.$route.params.operate) {
      this.title = this.$route.params.operate === 'view' ? this.$t('containerManager.orderDetail.viewOrder') : this.$t('containerManager.orderDetail.editOrder')
      this.viewDetail = this.$route.params.operate === 'view'
    }
  }
}
</script>
<style lang="scss" scoped>
.right-main-wrapper{
  overflow: hidden;
  overflow-y: auto;
}
.btn-wrap{
  margin: 20px 0 0 740px;
}
::v-deep .inline-form{
  .el-input--mini > .el-input__inner{
    width: 178px;
  }
}
</style>
