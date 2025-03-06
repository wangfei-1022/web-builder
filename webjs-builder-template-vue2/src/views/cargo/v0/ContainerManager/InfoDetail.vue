<template>
  <div v-loading="loading" class="right-main-wrapper">
    <h3 class="content-title">{{ title }}</h3>
    <div class="form-wrap">
      <el-form ref="containerForm" :model="containerForm" label-width="100px" :rules="containerFormRules" :inline="true" size="small" style="width: 700px; margin-top: 20px;" class="inline-form">
        <el-form-item :label="`${$t('containerManager.containerNo')}: `" prop="containerNo">
          <el-input v-model="containerForm.containerNo" maxlength="200" :disabled="viewDetail || modifyDetail" :placeholder="$t('common.placeholder')" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.typeOf')}: `" prop="containerCategory">
          <el-radio v-model="containerForm.containerCategory" :label="3" :disabled="viewDetail">{{$t('containerManager.categoryList.financing')}}</el-radio>
          <el-radio v-model="containerForm.containerCategory" :label="1" :disabled="viewDetail">{{$t('containerManager.categoryList.owner')}}</el-radio>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.orderNo')}: `" prop="orderId">
          <el-select
            v-model="orderObj"
            filterable
            remote
            value-key="id"
            :remote-method="searchOrder"
            :loading="remoteLoading"
            :disabled="viewDetail"
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
        <el-form-item :label="`${$t('containerManager.containerType')}: `" prop="containerType">
          <el-select v-model="containerForm.containerType" :disabled="viewDetail" filterable>
            <el-option
              v-for="item in containerTypeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.ownerName')}: `" prop="ownerId">
          <el-select
            v-model="containerForm.ownerId"
            filterable
            placeholder=""
            :disabled="!createDetail"
            @change="filterOwnerInfo">
            <el-option
              v-for="item in ownerList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.contractAndBatch')}: `" prop="contractNo">
          <el-input v-model="contractNo" disabled />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.productionDate')}: `" prop="productionDate">
          <CommonPicker
            v-model="containerForm.productionDate"
            :parent-date="containerForm.productionDate"
            pikcer-type="date"
            size="small"
            clearable
            :disabled="viewDetail"
          />
        </el-form-item>
        <!-- <el-form-item v-show="containerForm.containerCategory == 3" label="金额:" prop="costPrice">
          <el-input v-model="containerForm.costPrice" maxlength="10" placeholder="请输入金额" />
        </el-form-item> -->
        <el-form-item :label="`${$t('containerManager.currency')}: `" prop="currency">
          <el-input v-model="currency" disabled />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.money')}: `" prop="costPrice">
          <el-input v-model="containerForm.costPrice" maxlength="10" :placeholder="$t('common.placeholder')" :disabled="viewDetail" />
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
        <el-form-item :label="`${$t('containerManager.tareWeight')}: `" prop="tareWeight">
          <normalNumberInput v-model="containerForm.tareWeight" maxLength="5" :disabled="viewDetail" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.deliveryDate')}: `" prop="deliveryDate">
          <CommonPicker
            v-model="containerForm.deliveryDate"
            :parent-date="containerForm.deliveryDate"
            :dependenceDate="containerForm.productionDate"
            parentOption="followingDependence"
            pikcer-type="date"
            size="small"
            clearable
            :disabled="viewDetail"
          />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.payload')}: `" prop="payload">
          <normalNumberInput v-model="containerForm.payload" maxLength="5" :disabled="viewDetail" />
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
        <el-form-item :label="`${$t('containerManager.capacity')}: `" prop="capacity">
          <normalNumberInput v-model="containerForm.capacity" maxLength="5" :disabled="viewDetail" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.remark')}: `" prop="remark">
          <el-input v-model="containerForm.remark" maxlength="500" type="textarea" rows="4" :disabled="viewDetail" />
        </el-form-item>
      </el-form>
      <el-form v-if="viewDetail" ref="imageForm" :model="containerForm" label-width="100px" :rules="containerFormRules" size="small" style="margin-top: 20px; width: 600px;" class="inline-form">
        <el-form-item :label="`${$t('containerManager.situationImage')}: `" prop="situationList">
          <PreviewImageList img-height="80px" img-width="auto" :img-list="containerForm.situationList" />
        </el-form-item>
        <!-- <el-form-item label="铭牌图片:" prop="nameplateList">
          <PreviewImageList imgHeight="80px" imgWidth="auto" :imgList="containerForm.nameplateList"/>
        </el-form-item> -->
      </el-form>
      <el-form v-else ref="imageForm" :model="containerForm" label-width="100px" :rules="containerFormRules" size="small" style="margin-top: 20px; width: 600px;" class="inline-form">
        <el-form-item :label="`${$t('containerManager.situationImage')}: `" prop="situationList">
          <MultipleImagesUpload v-model="containerForm.situationList" :multiple="true" :limit="10" />
        </el-form-item>
        <!-- <el-form-item label="铭牌图片:" prop="nameplateList">
          <MultipleImagesUpload v-model="containerForm.nameplateList" :multiple="false" :limit="1" />
        </el-form-item> -->
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
  // getContainerTypeListApi,
  updateContainerApi,
  createContainerApi,
  getContainerDetailApi,
  getImageUrlApi,
  getOwnerListApi,
  getContainerYardListApi,
  validateContainerNOApi
} from '@/api/containerManager'
import MultipleImagesUpload from '@/components/UploadFile/MultipleImagesUpload'
import PreviewImageList from '@/components/ImagePreview/PreviewImageList'
export default {
  name: 'InfoDetail',
  components: {
    MultipleImagesUpload,
    PreviewImageList
  },
  data() {
    // 箱号是否存在，已存在则不能新建
    const validateContainerNo = async(rule, value, callback) => {
      if (value) {
        if (!this.modifyDetail) {
          const res = await validateContainerNOApi(value)
          if (res.ok) {
            if (res.content) {
              callback(new Error(this.$t('containerManager.containerExisted')))
            }
          }

          callback()
        }
      } else {
        callback(new Error(this.$t('containerManager.containerEmptyInvalid')))
      }
    }
    return {
      currency: '',
      contractNo: '',
      loading: false,
      remoteLoading: false,
      containerTypeList: [],
      orderObj: null,
      orderNo: '',
      situationFileIds: [],
      nameplateFileIds: [],
      imagePreviewList: [],
      deliveryPlaceList: [],
      containerForm: {
        containerNo: '',
        containerOrderId: '',
        containerCategory: 3,
        containerType: '',
        orderId: '',
        oldOrderId: '',
        newOrderId: '',
        orderType: 1,
        deliveryPlace: '',
        productionDate: null,
        costPrice: '',
        ownerId: '1404745580659343360',
        ownerName: '',
        tareWeight: '',
        deliveryPlaceName: '',
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
          { required: true, validator: validateContainerNo, trigger: 'blur' }
        ],
        containerType: [
          { required: true, message: this.$t('containerManager.containerTypeInvalid'), trigger: 'change' }
        ],
        productionDate: [
          { required: true, message: this.$t('containerManager.productionDateInvalid'), trigger: 'change' }
        ],
        deliveryDate: [
          { required: true, message: this.$t('containerManager.deliveryDateInvalid'), trigger: 'change' }
        ],
        orderId: [
          {required: true, message: this.$t('containerManager.orderNoEmptyInvalid'), trigger: 'change'}
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
    createDetail() {
      return !this.modifyDetail && !this.viewDetail
    },
    title() {
      if (this.$route.params.editType === 'view') {
        return this.$t('containerManager.viewContainerInfo')
      } else if (this.$route.params.editType === 'edit') {
        return this.$t('containerManager.modifyContainerInfo')
      } else {
        return this.$t('containerManager.createContainerInfo')
      }
    },
    editId() {
      return this.$route.params.id ? this.$route.params.id : ''
    }
  },
  watch: {
    'containerForm.productionDate': function() {
      if (this.containerForm.productionDate > this.containerForm.deliveryDate) {
        this.containerForm.deliveryDate = null
      }
    },
    'containerForm.costPrice': function(val) {
      if (val === null) {
        this.containerForm.costPrice = ""
      } else if (/(^\d{0,7}$)|(^\d{0,7}\.\d{0,2}$)/.test(val)) {
        this.containerForm.costPrice = val
      } else {
        this.containerForm.costPrice = val.substring(0, val.length - 1)
      }
    }
  },
  mounted() {
  },
  created() {
    // this.getMemberList()
    this.getOwnerList()
    // this.getContainerType()
    if (this.$route.params.id) {
      this.getContainerDetail()
    }
  },
  methods: {
    async searchOrder(val) {
      this.remoteLoading = true
      if (val.length > 2) {
        const res = await remoteOrderListApi(val, 1)
        if (res.ok) {
          this.orderList = res.content
        }
      }
      this.remoteLoading = false
    },
    setInfoFromOrder(_obj) {
      if (_obj && _obj.id) {
        this.containerForm.orderId = _obj.id
        this.currency = _obj.currency
        this.contractNo = _obj.contractNo
        this.setContainerTypeList(_obj)
      } else {
        this.containerForm.orderId = ''
        this.currency = ''
        this.containerTypeList = []
        this.contractNo = ''
      }
    },
    setContainerTypeList(_obj) {
      this.containerTypeList = _obj.containerTypeInfos.map(item => {
        let _data = {
          value: item.containerType,
          label: item.containerType
        }
        return _data
      })
      if (!this.containerTypeList.map(item => item.value === this.containerForm.containerType).includes(true)) {
        this.containerForm.containerType = ''
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
      const res = await getContainerDetailApi(this.editId, 1)
      if (res.ok) {
        this.containerForm = { ...this.containerForm, ...res.content }
        this.containerForm.productionDate = Number(this.containerForm.productionDate)
        this.containerForm.deliveryDate = Number(this.containerForm.deliveryDate)
        this.orderNo = res.content.orderNo
        this.containerForm.oldOrderId = this.containerForm.orderId
        this.getImageList()
        this.filterOrderInfo()
        // this.filterMemberName(true)
      }
      this.loading = false
    },
    // async getContainerType() {
    //   const res = await getContainerTypeListApi()
    //   if (res.ok) {
    //     this.containerTypeList = res.content.map(item => {
    //       return {
    //         label: item.englishName,
    //         value: item.englishName
    //       }
    //     })
    //   }
    // },
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
      this.containerForm.ownerName = _owner[0].label
    },
    // async getMemberList() {
    //   this.remoteLoading = true
    //   const res = await getMemberListApi()
    //   if (res.ok) {
    //     this.memberList = res.content.map(item => {
    //       return { label: item.name, value: item.id }
    //     })

    //     if (!this.viewDetail) {
    //       this.filterMemberName(true)
    //     }
    //   }
    // },
    // filterMemberName(val) {
    //   const _member = this.memberList.filter(item => item.value === this.containerForm.ownerId)
    //   this.containerForm.ownerName = _member[0].label
    // },
    // 从箱信息中的订单号获取订单信息
    async filterOrderInfo() {
      const res = await remoteOrderListApi(this.orderNo, 1)
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
        res = await updateContainerApi(this.editId, JSON.stringify(this.containerForm))
      } else {
        res = await createContainerApi(JSON.stringify(this.containerForm))
      }

      if (res.ok) {
        this.$message({
          type: 'success',
          message: this.$t('containerManager.submitOrderSuccess')
        })

        this.loading = false
        this.$router.push({name: 'InfoList', params: {refresh: true}})
      }
      this.loading = false
    },
    cancelEdit() {
      this.$router.push({name: 'InfoList' })
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
