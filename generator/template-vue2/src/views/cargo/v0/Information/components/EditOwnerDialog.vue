<template>
  <el-dialog
    :visible.sync="showDialog"
    width="600px"
    :title="title"
    :show-close="false"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="ownerForm" :model="ownerForm" :rules="ownerFormRules" size="mini" label-width="80px">
      <el-form-item label="箱主代码" prop="code">
        <el-row>
          <el-col :span="15">
            <el-input v-model="ownerForm.code" maxlength="50" :disabled="edit" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="箱主名称" prop="name">
        <el-row>
          <el-col :span="15">
            <el-input v-model="ownerForm.name" maxlength="50" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="箱主简称" prop="shortName">
        <el-row>
          <el-col :span="15">
            <el-input v-model="ownerForm.shortName" maxlength="50" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="国家" prop="ownerCountry">
        <el-row>
          <el-col :span="15">
            <el-select
              v-model="ownerForm.ownerCountry"
              filterable
              allow-create
              default-first-option
              placeholder=""
              @change="handleCountrySelection">
              <el-option
                v-for="(item, index) in countryList"
                :key="item.value+index"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="州/省/区" prop="ownerCountry">
        <el-row>
          <el-col :span="15">
            <el-select
              v-model="ownerForm.ownerProvince"
              filterable
              allow-create
              default-first-option
              placeholder=""
              @change="handleProvinceSelection">
              <el-option
                v-for="(item, index) in provinceyList"
                :key="item.value+index"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="城市" prop="ownerCountry">
        <el-row>
          <el-col :span="15">
            <el-select
              v-model="ownerForm.ownerCity"
              filterable
              allow-create
              default-first-option
              placeholder=""
              @change="handleCitySelection">
              <el-option
                v-for="(item, index) in cityList"
                :key="item.value+index"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div class="btn-wrap">
      <el-button type="primary" size="mini" @click="validateForm">确认</el-button>
      <el-button type="default" size="mini" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getOwnerDetailApi, createOwnerApi, updateOwnerApi, getCountryApi, getProvinceApi } from '@/api/containerManager'
export default {
  name: 'EditOwnerDialog',
  props: {
    edit: { type: Boolean, default: false },
    showDialog: { type: Boolean, default: false }
  },
  data() {
    return {
      editId: null,
      title: '新建箱主信息',
      countryList: [],
      provinceyList: [],
      cityList: [],
      ownerForm: {
        code: '',
        name: '',
        shortName: '',
        ownerCountry: '',
        ownerProvince: '',
        ownerCity: '',
        divisionCode: ''
      },
      ownerFormRules: {
        code: [
          { required: true, message: '请输入箱主代码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入箱主名称', trigger: 'blur' }
        ],
        ownerCountry: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        ownerProvince: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        ownerCity: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    edit: function(val) {
      if (val) {
        this.title = '编辑箱主信息'
      } else {
        this.title = '新建箱主信息'
      }
    },
    "$route.path": function(val) {
      if(this.showDialog) {
        this.closeDialog()
      }
    }
  },
  mounted() {
    this.getCountryList()
  },
  methods: {
    async getOwnerDetail(id) {
      this.editId = id
      const res = await getOwnerDetailApi(id)
      if (res.ok) {
        this.ownerForm.code = res.content.code
        this.ownerForm.name = res.content.name
        this.ownerForm.shortName = res.content.shortName
        this.ownerForm.ownerCountry = res.content.ownerCountry
        this.ownerForm.ownerProvince = res.content.ownerProvince
        this.ownerForm.ownerCity = res.content.ownerCity
        this.ownerForm.divisionCode = res.content.divisionCode

        if (this.ownerForm.ownerCountry === 'CN') {
          this.getProvince()
          this.getCity(this.ownerForm.ownerProvince)
        }
      }
    },
    async getCountryList() {
      const res = await getCountryApi()
      if (res.ok) {
        this.countryList = []
        res.content.forEach(item => {
          this.countryList.push({
            label: item.chineseName,
            value: item.code2
          })
        })
      }
    },
    handleCountrySelection(val) {
      // 选择国家后，获取省列表
      this.provinceyList = []
      this.cityList = []
      this.ownerForm.ownerProvince = ''
      this.ownerForm.ownerCity = ''
      if (val === 'CN') {
        this.getProvince()
      }
    },
    async getProvince() {
      const res = await getProvinceApi({ areaLevel: 1 })
      if (res.ok) {
        res.content.list.forEach(item => {
          this.provinceyList.push({
            value: item.code,
            label: item.chineseName
          })
        })
      }
    },
    handleProvinceSelection(val) {
      this.cityList = []
      this.ownerForm.ownerCity = ''
      this.getCity(val)
    },
    async getCity(parentCode) {
      const res = await getProvinceApi({ areaLevel: 2, parentCode: parentCode })
      if (res.ok) {
        res.content.list.forEach(item => {
          this.cityList.push({
            value: item.code,
            label: item.chineseName
          })
        })
      }
    },
    handleCitySelection(val) {
      const isInclude = this.cityList.some(item => item.value === val)
      if (isInclude) {
        this.ownerForm.divisionCode = val
      } else {
        this.ownerForm.divisionCode = ''
      }
    },
    validateForm() {
      this.$refs.ownerForm.validate(async valid => {
        if (valid) {
          // 提交表单
          let res = null
          if (this.edit) {
            res = await updateOwnerApi(this.editId, JSON.stringify(this.ownerForm))
          } else {
            res = await createOwnerApi(JSON.stringify(this.ownerForm))
          }

          if (res.ok) {
            this.$message({
              type: 'success',
              message: '箱主信息保存成功'
            })

            this.closeDialog()
            this.$emit('refreshData')
          }
        }
      })
    },
    closeDialog() {
      this.$refs.ownerForm.resetFields()
      this.$emit('closeDialog')
    }
  }
}
</script>
<style lang="scss" scoped>
  .btn-wrap{
    margin-top: 10px;
    text-align: right;
  }
</style>
