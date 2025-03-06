<template>
  <div v-loading="loading" class="right-main-wrapper">
    <section class="info-form">
      <ul>
        <li>
          <span class="label-item">{{$t('packageWarehouse.scheduleNo')}}:</span>
          <span class="label-content">{{scheduleDetail.scheduleNo}}</span>
        </li>
        <li>
          <span class="label-item">{{$t('packageWarehouse.scheduleOrderNo')}}:</span>
          <span class="label-content">{{scheduleDetail.trackingNo}}</span>
        </li>
        <li>
          <span class="label-item">{{$t('packageWarehouse.dutyName')}}:</span>
          <span class="label-content">{{scheduleDetail.dutyName}}</span>
        </li>
        <li class="remark-item">
          <span class="label-item">{{$t('packageWarehouse.scheduleDesc')}}:</span>
          <span class="label-content">
            <el-tooltip placement="top">
              <div slot="content" style="max-width: 420px;">{{scheduleDetail.scheduleDesc}}</div>
              <span class="tip-content">{{scheduleDetail.scheduleDesc}}</span>
            </el-tooltip>
          </span>
        </li>
        <li class="remark-item">
          <span class="label-item">{{$t('packageWarehouse.scheduleRemark')}}:</span>
          <span class="label-content">
            <el-tooltip placement="top">
              <div slot="content" style="max-width: 420px;">{{scheduleDetail.remark}}</div>
              <span class="tip-content">{{scheduleDetail.remark}}</span>
            </el-tooltip>
          </span>
        </li>
      </ul>
    </section>
    <section class="info-form panel-form">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('packageWarehouse.followTab')" name="1">
          <div style="width: 500px;">
            <el-form label-width="80px" :model="followForm" :rules="followFormRule" ref="followForm" size="mini">
              <el-form-item :label="`${$t('packageWarehouse.dutyName')}: `" prop="dutyId">
                <el-select v-model="followForm.dutyId" filterable :placeholder="$t('common.placeholder')" style="width: 100%;">
                  <el-option
                    v-for="item in employeeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="`${$t('packageWarehouse.scheduleRemark')}: `" prop="remark">
                <el-input :placeholder="$t('common.placeholder')" type="textarea" :rows="4" v-model="followForm.remark" />
              </el-form-item>
              <el-form-item :label="`${$t('packageWarehouse.uploadImg')}: `" prop="fileDTO">
                <MultipleImagesUpload v-model="imgList" :multiple="false" :limit="1" />
              </el-form-item>
            </el-form>
            <div style="text-align: right;">
              <el-button type="primary" :loading="loading" size="mini" @click="finishedValidate">{{$t('packageWarehouse.finishedCommit')}}</el-button>
              <el-button type="primary" :loading="loading" size="mini" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
              <el-button size="mini" :loading="loading" @click="goBack">{{$t('common.cancelBtn')}}</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('packageWarehouse.processLog')" name="2">
          <el-table
            height="100%"
            :data="scheduleDetail.logList"
            style="width: 100%;">
            <el-table-column
              prop="operatorName"
              :label="$t('packageWarehouse.operatorName')"
              width="100">
            </el-table-column>
            <el-table-column
              prop="operatorTime"
              :label="$t('packageWarehouse.operatorTime')"
              width="200">
              <template slot-scope="scope">
                {{scope.row.operatorTime | filterTime(vm)}}
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="remark"
              :label="$t('packageWarehouse.operatorRemark')"
              width="200">
            </el-table-column>
            <el-table-column
              prop="fileDTO"
              :label="$t('packageWarehouse.viewImg')"
              width="400">
              <template slot-scope="scope">
                <span class="img-url" @click="viewImg(scope.$index)">
                  {{scope.row.fileDTO | filterImageName}}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </section>
    <ImagePreview
      ref="imagePreview"
      :z-index="2100"
      :control-bar="true"
      :close-btn="true"
      :arrow-btn="true"
      :multiple="true"
      :now-img-index="nowImgIndex"
      :img-list="imgViewList"
    />
  </div>
</template>
<script>
import { getScheduleDetailApi, employeeDropdownListApi, followScheduleDetailApi } from '@/api/packageWarehouse'
import MultipleImagesUpload from '@/components/UploadFile/MultipleImagesUpload'
import ImagePreview from '@/components/ImagePreview'
export default {
  name: 'ScheduleDetail',
  components: {
    MultipleImagesUpload,
    ImagePreview
  },
  data() {
    return {
      vm: this,
      loading: false,
      id: '',
      scheduleDetail: {},
      activeName: '1',
      employeeList: [],
      imgList: [],
      imgViewList: [],
      nowImgIndex: 0,
      followForm: {
        dutyId: '',
        remark: '',
        fileDTO: {
          cloudFileName: '',
          originFileName: ''
        },
        completeFlag: false,
        id: ''
      },
      followFormRule: {
        dutyId: [
          { required: true, message: this.$t('packageWarehouse.dutyNameEmptyError'), trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  filters: {
    filterTime(time, vm) {
      if (time) {
        return vm.$moment(Number(time)).format('YYYY-MM-DD HH:mm:ss')
      }
      return ''
    },
    filterImageName(obj) {
      return obj ? obj.originFileName : ''
    }
  },
  methods: {
    async getScheduleDetail() {
      this.loading = true
      const res = await getScheduleDetailApi(this.id)
      if (res.ok && res.content) {
        this.scheduleDetail = res.content
        this.followForm.dutyId = res.content.dutyId
        if (res.content.logList && res.content.logList.length > 0) {
          this.scheduleDetail.logList = this.scheduleDetail.logList.sort((item1, item2) => Number(item1.operatorTime) > Number(item2.operatorTime) ? -1 : Number(item1.operatorTime) === Number(item2.operatorTime) ? 0 : 1)
        }
      }
      this.loading = false
      this.perloadImg()
    },
    perloadImg() {
      this.imgViewList = []
      this.scheduleDetail.logList.forEach(v => {
        let _urlStr = ''
        if (v.fileDTO) {
          _urlStr = v.fileDTO.url ? v.fileDTO.url : ''
        }
        this.imgViewList.push(_urlStr)
      })
    },
    async getEmployeeDropdown() {
      const res = await employeeDropdownListApi()
      if (res && res.ok && res.content) {
        this.employeeList = res.content.map(item => ({
            label: item.userName,
            value: item.id
          }))
      }
    },
    finishedValidate() {
      this.$refs.followForm.validate(valid => {
        if (valid) {
          this.followForm.completeFlag = true
          this.submitFormData()
        }
      })
    },
    validateForm() {
      this.$refs.followForm.validate(valid => {
        if (valid) {
          this.followForm.completeFlag = false
          this.submitFormData()
        }
      })
    },
    async submitFormData() {
      if (this.imgList[0]) {
        this.followForm.fileDTO.cloudFileName = this.imgList[0].cloudFileName
        this.followForm.fileDTO.originFileName = this.imgList[0].originFileName
      }

      const res = await followScheduleDetailApi(this.id, this.followForm)
      if (res.ok) {
        this.$message.success(this.$t('packageWarehouse.submitSuccess'))
        this.getScheduleDetail()
        this.clearfollowForm()
      }
    },
    clearfollowForm() {
      this.imgList = []
      this.$refs.followForm.resetFields()
      this.$nextTick(() => {
        this.$refs.followForm.clearValidate()
      })
      this.followForm = {
        dutyId: '',
        remark: '',
        fileDTO: {
          cloudFileName: '',
          originFileName: ''
        },
        completeFlag: false,
        id: ''
      }
    },
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({name: 'ScheduleList'})
    },
    viewImg(index) {
      if (this.imgViewList.length > 0) {
        this.nowImgIndex = index
        this.$refs.imagePreview.show = true
      }
      return false
    }
  },
  mounted() {
  },
  created() {
    // this.getMemberList()
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.followForm.id = this.id
      this.getScheduleDetail()
      this.getEmployeeDropdown()
    }
  }
}
</script>
<style lang="scss" scoped>
.info-form{
  height: 150px;
  ul{
    padding: 0;
    margin: 0;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;
  }
  li{
    width: 33%;
    min-width: 200px;
    min-height: 40px;
    margin-bottom: 20px;
    &.remark-item{
      min-width: 320px;
      .label-content{
        line-height: 20px;
      }
    }
  }
  span {
    display: inline-block;
    vertical-align: top;
  }
  .label-item{
    width: 80px;
  }
  .label-content{
    min-width: 120px;
    max-width: 230px;
    height: 60px;
    overflow: hidden;
    .tip-content{
      min-width: 120px;
      max-width: 230px;
      height: 100%;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }
  .img-url{
    color: #007DFF;
    &:hover{
      text-decoration: underline;
      cursor: pointer;
    }
  }
  &.panel-form{
    height: calc(100% - 150px);
    .el-tabs--top{
      height: 100%;
      .el-tab-pane{
        height: 100%;
      }
      ::v-deep.el-tabs__content{
        height: calc(100% - 55px);
        overflow: hidden;
        overflow-y: auto;
      }
    }
  }
}
</style>
