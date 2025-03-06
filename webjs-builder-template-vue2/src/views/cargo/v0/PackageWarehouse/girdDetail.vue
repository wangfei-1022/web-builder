<template>
  <div v-loading="loading" class="right-main-wrapper">
    <div class="top-form">
      <el-form ref="createForm" :inline="true" :model="createForm" :rules="createFormRule" label-width="100px"  size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('packageWarehouse.girdConfig.girdName')}: `" prop="girdName">
          <el-input :disabled="viewDetail" v-model="createForm.girdName" :placeholder="$t('common.placeholder')"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="collapse-title-box">
            <p>{{$t('packageWarehouse.girdConfig.girdProductDTOList')}}</p>
            <el-button type="text" size="mini" style="margin-left: 20px;" @click.stop="importProductInfo" v-if="!viewDetail">{{$t('packageWarehouse.girdConfig.productImportBtn')}}<i class="el-icon-upload el-icon--right"></i></el-button>
          </div>
        </template>
        <div class="info-content-wrap">
          <GirdProductList ref="girdProductDTOList" :girdProductDTOList="girdProductDTOList" :viewDetail="viewDetail" />
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="collapse-title-box">
            <p>{{$t('packageWarehouse.girdConfig.girdLockDTOList')}}</p>
          </div>
        </template>
        <div class="info-content-wrap">
          <GirdLockList ref="girdLockDTOList" :girdLockDTOList="girdLockDTOList" :viewDetail="viewDetail" />
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <div class="collapse-title-box">
            <p>{{$t('packageWarehouse.girdConfig.girdSortDTOList')}}</p>
            <el-button type="text" size="mini" style="margin-left: 20px;" @click.stop="importSortInfo" v-if="!viewDetail">{{$t('packageWarehouse.girdConfig.productImportBtn')}}<i class="el-icon-upload el-icon--right"></i></el-button>
          </div>
        </template>
        <div class="info-content-wrap">
          <GirdSortList ref="girdSortDTOList" :girdProductSortCodeDTOList="girdProductSortCodeDTOList" :viewDetail="viewDetail" />
        </div>
      </el-collapse-item>
    </el-collapse>


    <!-- <section class="info-section">
      <SectionTitle :title="$t('packageWarehouse.girdConfig.girdProductDTOList')"></SectionTitle>
      <div class="info-content-wrap">
        <GirdProductList ref="girdProductDTOList" :girdProductDTOList="girdProductDTOList" :viewDetail="viewDetail" />
      </div>
    </section>
    <section class="info-section">
      <SectionTitle :title="$t('packageWarehouse.girdConfig.girdProductDTOList')"></SectionTitle>
      <div class="info-content-wrap">
        <GirdSortList ref="girdProductDTOList" :girdProductDTOList="girdProductDTOList" :viewDetail="viewDetail" />
      </div>
    </section>
    <section class="info-section">
      <SectionTitle :title="$t('packageWarehouse.girdConfig.girdLockDTOList')"></SectionTitle>
      <div class="info-content-wrap">
        <GirdLockList ref="girdLockDTOList" :girdLockDTOList="girdLockDTOList" :viewDetail="viewDetail" />
      </div>
    </section> -->
    <div class="page-edit-footer">
      <el-button type="primary" size="mini" class="ml-10" :loading="loading" v-if='!viewDetail' @click="validateForm"> {{$t('common.submitBtn')}} </el-button>
      <el-button size="mini" @click="backToList" :loading="loading">{{$t('common.returnBtn')}}</el-button>
    </div>
    <ImportGirdDialog :title="$t('packageWarehouse.girdConfig.importGirdInfo')" :visible.sync="showImportDialog" :excelFileName="$t('packageWarehouse.girdConfig.importFileName')" @uploadSuccess="setUploadData" />
    <ImportGirdDialog :importType="'sort'" :title="$t('packageWarehouse.girdConfig.importGirdInfo')" :visible.sync="showSortDialog" :excelFileName="$t('packageWarehouse.girdConfig.importSortFileName')" @uploadSuccess="setUploadSort" />
  </div>
</template>
<script>
import {
  getGirdDetailApi,
  saveGirdDetailApi,
  updateGirdDetailApi
} from '@/api/packageWarehouse'
import SectionTitle from '@/components/Cargo/Common/sectionTitle'
import GirdProductList from './components/GirdProductList'
import GirdSortList from './components/GirdSortList'
import GirdLockList from './components/GirdLockList'
import ImportGirdDialog from './components/ImportGirdDialog'
export default {
  name: 'GirdDetail',
  components: {
    SectionTitle,
    GirdProductList,
    GirdSortList,
    GirdLockList,
    ImportGirdDialog
  },
  data() {
    return {
      vm: this,
      loading: false,
      activeName: '1',
      createForm: {
        id: null,
        girdName: '',
        girdProductDTOList: [],
        girdLockDTOList: [],
        girdProductSortCodeDTOList: []
      },
      createFormRule: {
        girdName: [
          {required: true, message: this.$t('packageWarehouse.girdConfig.girdNameInvalid'), trigger: 'blur'}
        ]
      },
      girdProductDTOList: [],
      girdLockDTOList: [],
      girdProductSortCodeDTOList: [],
      viewDetail: false,
      showImportDialog: false,
      showSortDialog: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    async getDetail() {
      this.loading = true
      const res = await getGirdDetailApi(this.createForm.id)
      if (res && res.ok) {
        this.createForm.id = res.content.id
        this.createForm.girdName = res.content.girdName
        this.girdProductDTOList = res.content.girdProductDTOList
        this.girdLockDTOList = res.content.girdLockDTOList
        this.girdProductSortCodeDTOList = res.content.girdProductSortCodeDTOList
      }
      this.loading = false
    },
    setUploadData(_arr) {
      this.girdProductDTOList = _arr
      // this.girdProductDTOList = []
      // _arr.map(item => {
      //   this.girdProductDTOList.push({
      //     productId: item.productId,
      //     girdNo: item.girdNo
      //   })
      // })
    },
    setUploadSort(_arr) {
      this.girdProductSortCodeDTOList = _arr
    },
    validateForm() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.checkGirdProductDTOList()
          this.checkSortDTOList()
        }
      })
    },
    checkGirdProductDTOList() {
      // let _girdProductList = Array.from(new Set(this.$refs.girdProductDTOList.girdProductList.map(item => item.productCode)))
      // else if(_girdProductList.length < this.$refs.girdProductDTOList.girdProductList.length) {
      //   this.$message.error(this.$t('packageWarehouse.girdConfig.productDuplicateInvalid'))
      //   return
      // }
      if (this.$refs.girdProductDTOList.girdProductList.length === 0) {
        this.$message.error(this.$t('packageWarehouse.girdConfig.girdProductDTOListInvalid'))
        return
      } else {
        this.createForm.girdProductDTOList = this.$refs.girdProductDTOList.girdProductList.map(item => ({
            productId: item.productId,
            girdNo: item.girdNo,
            queryNumberCode: item.queryNumberCode
          }))
        this.checkGirdLockDTOList()
      }
    },
    checkGirdLockDTOList() {
      // let _girdLocktList = Array.from(new Set(this.$refs.girdLockDTOList.girdLocktList.map(item => item.lockType)))
      // else if(_girdLocktList.length < this.$refs.girdLockDTOList.girdLocktList.length) {
      //   this.$message.error(this.$t('packageWarehouse.girdConfig.lockTypeDuplicateInvalid'))
      //   return
      // }
      if (this.$refs.girdLockDTOList.girdLocktList.length === 0) {
        this.$message.error(this.$t('packageWarehouse.girdConfig.girdLockDTOList'))
        return
      } else {
        this.createForm.girdLockDTOList = this.$refs.girdLockDTOList.girdLocktList.map(item => ({
            lockType: item.lockType,
            girdNo: item.girdNo
          }))
        this.submitForm()
      }
    },
    checkSortDTOList() {
      if (this.$refs.girdSortDTOList.girdProductList.length === 0) {
        this.$message.error(this.$t('packageWarehouse.girdConfig.girdProductDTOListInvalid'))
        return
      } else {
        this.createForm.girdProductSortCodeDTOList = this.$refs.girdSortDTOList.girdProductList.map(item => ({
            productId: item.productId,
            girdNo: item.girdNo,
            sortCode: item.sortCode
          }))
      }
    },
    async submitForm() {
      let res = null
      if (this.$route.params.operator === 'edit') {
        res = await updateGirdDetailApi(this.createForm)
      } else {
        res = await saveGirdDetailApi(this.createForm)
      }

      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.girdConfig.saveSuccess'))
        this.backToList()
      }
    },
    async importProductInfo() {
      this.showImportDialog = true
    },
    async importSortInfo() {
      this.showSortDialog = true
    },
    backToList() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({name: 'GirdList', query: {refresh: 'refresh'}})
    }
  },
  created() {},
  mounted() {
    if (this.$route.params.operator === 'view') {
      this.viewDetail = true
    }
    if (this.$route.params.id) {
      this.createForm.id = this.$route.params.id
      this.getDetail()
    }
  }
}
</script>
<style lang="scss" scoped>
.right-main-wrapper{
  height: calc(100% - 50px);
  overflow: hidden;
  overflow-y: auto;
}
.collapse-title-box{
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  p{
    font-size: 16px;
    margin: 0;
  }
}
.el-form-item__content .el-input-group{
  display: inline-table!important;
}
.table-wrap{
  width: 100%;
  margin-top: 20px;
  border-top: 1px solid #ccc;
}
.required-mark{
  color: red;
}
.required-input{
  width: 90%;
}
.page-edit-footer {
  border-top: 1px solid #f0f2f5;
  position: fixed;
  left: 0;
  right: 0;
  height: 50px;
  line-height: 50px;
  z-index: 20;
  bottom: 0;
  width: 100%;
  text-align: right;
  background: #fff;
  padding-right: 36px
}
</style>
