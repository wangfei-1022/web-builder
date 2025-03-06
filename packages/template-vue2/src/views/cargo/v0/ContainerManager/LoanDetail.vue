<template>
  <div v-loading="loading" class="right-main-wrapper">
    <h3 class="content-title">{{ title }}</h3>
    <div class="form-wrap">
      <el-form ref="containerForm" :model="containerForm" label-width="100px" :rules="containerFormRules" :inline="true" size="small" style="width: 700px; margin-top: 20px; margin-bottom: 20px;" class="inline-form">
        <el-form-item :label="`${$t('containerManager.containerNo')}: `" prop="containerNo" required>
          <el-input v-model="containerForm.containerNo" maxlength="200" :disabled="viewDetail" :placeholder="$t('common.placeholder')" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.ownerName')}: `" prop="ownerId">
          <el-select
            v-model="containerForm.ownerId"
            filterable
            placeholder=""
            disabled
            @change="filterOwnerInfo">
            <el-option
              v-for="item in ownerList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.containerType')}: `" prop="containerType">
          <el-input v-model="containerForm.containerType" disabled/>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.money')}: `" prop="costPrice">
          <el-input v-model="containerForm.costPrice" disabled/>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.orderNo')}: `" prop="orderId">
          <el-select
            v-model="orderObj"
            filterable
            remote
            value-key="id"
            :remote-method="searchOrder"
            :loading="remoteLoading"
            :disabled="viewDetail || containerForm.containerType === ''"
            @change="setInfoFromOrder"
          >
            <el-option
              v-for="item in orderList"
              :key="item.id"
              :label="item.orderNo"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.leaseList.tenantName')}: `">
          <el-input v-model="tenantName" disabled />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.leaseStartDate')}: `">
          <el-input v-model="startTime" disabled />
          <!-- <CommonPicker
            v-model="containerForm.startTime"
            :parent-date="parseInt(containerForm.startTime)"
            pikcer-type="date"
            size="small"
            clearable
            :disabled="viewDetail" /> -->
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.contractNo')}: `" prop="contractNo">
          <el-input v-model="contractNo" disabled />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.loanDetail.endDate')}: `">
          <el-input v-model="endTime" disabled />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.leaseList.contractDays')}: `">
          <el-input v-model="leaseTime" disabled />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.currency')}: `" prop="currency">
          <el-input v-model="currency" disabled />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.deliveryPlace')}: `" prop="deliveryPlace">
          <el-select
            v-model="containerForm.deliveryPlace"
            filterable
            remote
            :remote-method="searchDeliveryPlace"
            :loading="remoteLoading"
            :disabled="viewDetail"
            @change="setPortCode">
            <el-option
              v-for="item in deliveryPlaceList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.deliveryDate')}: `" prop="deliveryDate">
          <CommonPicker
            v-model="containerForm.deliveryDate"
            :parent-date="parseInt(containerForm.deliveryDate)"
            :startDependence="startTimeVal"
            :endDependence="endTimeVal"
            parent-option="betweenDependence"
            pikcer-type="date"
            size="small"
            clearable
            :disabled="viewDetail"
          />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.containerSituation')}: `" prop="containerSituation">
          <el-select v-model="containerForm.containerSituation" :disabled="viewDetail">
            <el-option
              v-for="item in containerSituationList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="皮重(KG):" prop="tareWeight">
          <normalNumberInput v-model="containerForm.tareWeight" :disabled="viewDetail" />
        </el-form-item>
        <el-form-item label="有效负载(KG):" prop="payload">
          <normalNumberInput v-model="containerForm.payload" :disabled="viewDetail" />
        </el-form-item>
        <el-form-item label="容量(m³):" prop="capacity">
          <normalNumberInput v-model="containerForm.capacity" :disabled="viewDetail" />
        </el-form-item> -->
        <el-form-item :label="`${$t('containerManager.remark')}: `" prop="remark">
          <el-input v-model="containerForm.remark" maxlength="500" type="textarea" rows="4" :disabled="viewDetail" />
        </el-form-item>
      </el-form>
      <el-form v-if="viewDetail" ref="imageForm" :model="containerForm" label-width="100px" :rules="containerFormRules" size="small" style="margin-top: 20px; width: 600px;" class="inline-form">
        <el-form-item :label="`${$t('containerManager.situationImage')}: `" prop="situationList">
          <PreviewImageList img-height="80px" img-width="auto" :img-list="containerForm.situationList" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.nameplateImage')}: `" prop="nameplateList">
          <PreviewImageList img-height="80px" img-width="auto" :img-list="containerForm.nameplateList" />
        </el-form-item>
      </el-form>
      <el-form v-else ref="imageForm" :model="containerForm" label-width="100px" :rules="containerFormRules" size="small" style="margin-top: 20px; width: 600px;" class="inline-form">
        <el-form-item :label="`${$t('containerManager.situationImage')}: `" prop="situationList">
          <MultipleImagesUpload v-model="containerForm.situationList" :multiple="true" :limit="10" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.nameplateImage')}: `" prop="nameplateList">
          <MultipleImagesUpload v-model="containerForm.nameplateList" :multiple="false" :limit="1" />
        </el-form-item>
      </el-form>
    </div>
    <div v-show="!viewDetail" class="btn-wrap">
      <el-button type="primary" size="small" :loading="loading" :disabled="loading" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
      <el-button size="small" :disabled="loading" @click="cancelEdit">{{$t('common.cancelBtn')}}</el-button>
    </div>
  </div>
</template>
<script>
// import {
//   getMemberListApi
// } from '@/api/orderManager'
import {
  remoteOrderListApi,
  getContainerTypeListApi,
  updateContainerApi,
  createContainerApi,
  getContainerDetailByOrderApi,
  getImageUrlApi,
  validateContainerNOApi,
  getOwnerListApi,
  getContainerYardListApi
} from '@/api/containerManager'
import MultipleImagesUpload from '@/components/UploadFile/MultipleImagesUpload'
import PreviewImageList from '@/components/ImagePreview/PreviewImageList'
export default {
  name: 'LoanDetail',
  components: {
    MultipleImagesUpload,
    PreviewImageList
  },
  data() {
    const validateContainerNo = async(rule, value, callback) => {
      if (value) {
        const res = await validateContainerNOApi(value)
        if (res.ok && res.content) {
          if (res.content.enableFlag) {
            if (this.modifyDetail) {
              if (this.containerForm.id !== res.content.id) {
                this.containerForm.updateContainerId = res.content.id
              }
            } else {
              this.containerForm.id = res.content.id
            }
            this.containerForm.ownerId = res.content.ownerId
            this.containerForm.containerType = res.content.containerType
            this.containerForm.costPrice = res.content.costPrice
            callback()
          } else {
            callback(new Error(this.$t('containerManager.loanDetail.containerDisabled')))
          }
        } else {
          callback(new Error(this.$t('containerManager.loanDetail.containerNoExist')))
        }
      } else {
        callback(new Error(this.$t('containerManager.containerEmptyInvalid')))
      }
    }
    return {
      currency: '',
      contractNo: '',
      startTime: '',
      startTimeVal: null,
      endTime: '',
      endTimeVal: null,
      leaseTime: '',
      loading: false,
      remoteLoading: false,
      containerTypeList: [],
      orderObj: null,
      orderNo: '',
      situationFileIds: [],
      nameplateFileIds: [],
      imagePreviewList: [],
      deliveryPlaceList: [],
      tenantName: '',
      containerForm: {
        id: '',
        updateContainerId: '',
        containerOrderId: '',
        containerNo: '',
        containerType: '',
        tenantId: '',
        orderId: '',
        oldOrderId: '',
        newOrderId: '',
        orderType: 2,
        costPrice: '',
        deliveryPlace: '',
        deliveryPlaceName: '',
        productionDate: null,
        ownerId: '1404745580659343360',
        ownerName: '',
        tareWeight: '',
        deliveryDate: null,
        payload: '',
        containerSituation: '',
        capacity: '',
        remark: '',
        situationList: [],
        nameplateList: [],
        portCode: ''
      },
      containerFormRules: {
        containerNo: [
          { validator: validateContainerNo, trigger: 'blur' }
        ],
        containerType: [
          { required: true, message: this.$t('containerManager.leaseList.containerTypeEmptyInvalid'), trigger: 'change' }
        ],
        orderId: [
          { required: true, message: this.$t('containerManager.orderNoEmptyInvalid'), trigger: 'change' }
        ],
        deliveryPlace: [
          { required: true, message: this.$t('containerManager.deliveryPlaceInvalid'), trigger: 'change' }
        ],
        deliveryDate: [
          { required: true, message: this.$t('containerManager.deliveryDateInvalid'), trigger: 'change' }
        ]
      },
      ownerList: [],
      // memberList: [],
      orderList: [],
      containerSituationList: [
        {
          label: this.$t('containerManager.newContainer'),
          value: 1
        },
        {
          label: this.$t('containerManager.oldContainer'),
          value: 2
        }
      ]
    }
  },
  computed: {
    currDate() {
      return this.$moment({ hour: 0, minute: 0 }).valueOf()
    },
    viewDetail() {
      return this.$route.params.editType === 'view'
    },
    modifyDetail() {
      return this.$route.params.editType === 'edit'
    },
    title() {
      if (this.$route.params.editType === 'view') {
        return this.$t('containerManager.loanDetail.viewLoanDetail')
      } else if (this.$route.params.editType === 'edit') {
        return this.$t('containerManager.loanDetail.modifyLoanDetail')
      } else {
        return this.$t('containerManager.loanDetail.createLoanDetail')
      }
    },
    editId() {
      return this.$route.params.id ? this.$route.params.id : ''
    }
  },
  watch: {
    startTimeVal: function(val) {
      if (this.containerForm.deliveryDate < val) {
        this.containerForm.deliveryDate = null
      }
    },
    endTimeVal: function(val) {
      if (this.containerForm.deliveryDate > val) {
        this.containerForm.deliveryDate = null
      }
    }
    // 'containerForm.costPrice': function(val) {
    //   if (/(^\d{0,7}$)|(^\d{0,7}\.\d{0,2}$)/.test(val)) {
    //     this.containerForm.costPrice = val
    //   } else {
    //     this.containerForm.costPrice = val.substring(0, val.length - 1)
    //   }
    // }
  },
  mounted() {
  },
  created() {
    // this.getMemberList()
    this.getOwnerList()
    // this.getContainerType()
    if (this.$route.params.orderType) {
      this.containerForm.orderType = this.$route.params.orderType
    }

    if (this.$route.params.id) {
      this.getContainerDetail()
    }
  },
  methods: {
    async searchOrder(val) {
      this.remoteLoading = true
      if (val.length > 2) {
        const res = await remoteOrderListApi(val, this.containerForm.orderType)
        if (res.ok) {
          this.orderList = res.content.filter(item =>
            item.containerTypeInfos.filter(item2 =>
              item2.containerType === this.containerForm.containerType
            ).length > 0
          )
        }
      }
      this.remoteLoading = false
    },
    setInfoFromOrder(_obj) {
      if (_obj && _obj.id) {
        this.containerForm.orderId = _obj.id
        this.currency = _obj.currency
        this.contractNo = _obj.contractNo
        this.startTime = this.$moment(Number(_obj.startTime)).format('YYYY-MM-DD')
        this.startTimeVal = Number(_obj.startTime)
        this.endTime = this.$moment(Number(_obj.endTime)).format('YYYY-MM-DD')
        this.endTimeVal = Number(_obj.endTime)
        this.leaseTime = _obj.leaseTime + 'D'
        this.containerForm.tenantId = _obj.memberId
        this.tenantName = _obj.memberName
      } else {
        this.containerForm.orderId = ''
        this.currency = ''
        this.contractNo = ''
        this.startTime = ''
        this.startTimeVal = null
        this.endTime = ''
        this.endTimeVal = null
        this.leaseTime = ''
        this.containerForm.tenantId = ''
        this.tenantName = ''
      }
    },
    async searchDeliveryPlace(val) {
      this.remoteLoading = true
      if (val.length > 0) {
        const res = await getContainerYardListApi({yardCode: val})
        if (res.ok) {
          this.deliveryPlaceList = res.content.map(item => {
            let _data = {
              label: item.code,
              value: item.code,
              name: item.name,
              portCode: item.portCode
            }
            return _data
          })
        }
      }
      this.remoteLoading = false
    },
    async getContainerDetail() {
      this.loading = true
      const res = await getContainerDetailByOrderApi(this.editId)
      if (res.ok) {
        this.containerForm = { ...this.containerForm, ...res.content }
        this.containerForm.productionDate = Number(this.containerForm.productionDate)
        this.containerForm.deliveryDate = res.content.deliveryDate ? Number(res.content.deliveryDate) : null
        this.containerForm.deliveryPlace = res.content.deliveryPlace
        this.orderNo = res.content.orderNo
        this.containerForm.oldOrderId = this.containerForm.orderId
        this.getImageList()
        this.filterOrderInfo()
      }
      this.loading = false
    },
    async getContainerType() {
      const res = await getContainerTypeListApi()
      if (res.ok) {
        this.containerTypeList = res.content.map(item => {
          let _data = {
            label: item.englishName,
            value: item.englishName
          }
          return _data
        })
      }
    },
    async getOwnerList() {
      const res = await getOwnerListApi({pageSize: 999, pageNum: 1})
      if (res.ok) {
        this.ownerList = res.content.list.map(item => {
          let _data = {
            label: item.name,
            value: item.id
          }
          return _data
        })

        if (!this.viewDetail) {
          this.filterOwnerInfo()
        }
      }
    },
    filterOwnerInfo() {
      const _owner = this.ownerList.filter(item => item.value === this.containerForm.ownerId)
      if (_owner.length > 0) {
        this.containerForm.ownerName = _owner[0].label
      }
    },
    // async getMemberList() {
    //   this.remoteLoading = true
    //   const res = await getMemberListApi()
    //   if (res.ok) {
    //     this.memberList = res.content.map(item => {
    //       return { label: item.name, value: item.id }
    //     })
    //   }
    // },
    // filterMemberName() {
    //   const _member = this.memberList.filter(item => item.value === this.containerForm.tenantId)
    //   this.tenantName = _member[0].label
    // },
    // 从箱信息中的订单号获取订单信息
    async filterOrderInfo() {
      const res = await remoteOrderListApi(this.orderNo, this.containerForm.orderType)
      if (res.ok) {
        this.orderList = res.content
        const orderInfo = this.orderList.filter(item => item.id === this.containerForm.orderId)
        this.orderObj = orderInfo[0]
        this.setInfoFromOrder(orderInfo[0])
      }
    },
    setPortCode(val) {
      const _arr = this.deliveryPlaceList.filter(item => item.value === val)
      this.containerForm.portCode = _arr[0].portCode
      this.containerForm.deliveryPlaceName = _arr[0].name
    },
    async getImageList() {
      if (this.containerForm.nameplateFileIds.length > 0) {
        const res = await getImageUrlApi({ fileIds: this.containerForm.nameplateFileIds })
        if (res.ok) {
          this.containerForm.nameplateList = res.content
        }
      }

      if (this.containerForm.situationFileIds.length > 0) {
        const res = await getImageUrlApi({ fileIds: this.containerForm.situationFileIds })
        if (res.ok) {
          this.containerForm.situationList = res.content
        }
      }
    },
    setSituationImges(imagesArr) {
      this.containerForm.situationList = imagesArr
    },
    setNamePlateImges(imagesArr) {
      this.containerForm.nameplateList = imagesArr
    },
    validateForm() {
      this.$refs.containerForm.validate(valid => {
        if (valid) {
          this.submitOrderForm()
        }
      })
    },
    async submitOrderForm() {
      this.loading = true
      let res = null
      if (this.editId) {
        this.containerForm.newOrderId = this.containerForm.orderId
        res = await updateContainerApi(this.containerForm.id, JSON.stringify(this.containerForm))
      } else {
        res = await createContainerApi(JSON.stringify(this.containerForm))
      }

      if (res.ok) {
        this.$message({
          type: 'success',
          message: this.$t('containerManager.submitOrderSuccess')
        })

        this.loading = false
        this.$router.push({name: 'LeaseList', params: { refresh: true }})
      }
      this.loading = false
    },
    cancelEdit() {
      this.$router.push({name: 'LeaseList'})
    }
  }
  // beforeRouteEnter(to, form, next) {
  //   next(vm => {
  //     if (vm.$route.params.id) {
  //       vm.getContainerDetail()
  //     }
  //   })
  // }
}
</script>
<style lang="scss" scoped>
.right-main-wrapper{
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
.form-wrap{
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: flex-start;
}
.btn-wrap{
  text-align: center;
}
::v-deep .inline-form{
  display: inline-block;
  vertical-align: top;
  .el-input--small > .el-input__inner{
    width: 199px;
  }
}
</style>
