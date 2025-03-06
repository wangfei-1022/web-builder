<template>
  <el-dialog
    :visible.sync="showDialog"
    width="600px"
    :title="title"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
  >
    <el-form ref="yardForm" :model="yardForm" :rules="yardFormRules" size="mini" label-width="120px" label-position="right">
      <el-form-item label="是否堆场" prop="yardType">
        <el-radio v-model="yardForm.yardType" :label="1" @change="checkYardType">是</el-radio>
        <el-radio v-model="yardForm.yardType" :label="2" @change="checkYardType">否</el-radio>
      </el-form-item>
      <el-form-item label="堆场代码" prop="code">
        <el-row>
          <el-col :span="15">
            <el-input v-model="yardForm.code" maxlength="50" :disabled="edit" placeholder="请输入堆场代码" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="堆场名称" prop="name">
        <el-row>
          <el-col :span="15">
            <el-input v-model="yardForm.name" maxlength="50" placeholder="请输入堆场名称" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="国家" prop="yardCountry">
        <el-row>
          <el-col :span="15">
            <el-select
              v-model="yardForm.yardCountry"
              filterable
              allow-create
              placeholder="请选择国家"
              default-first-option
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
      <el-form-item label="州/省/区" prop="yardProvince">
        <el-row>
          <el-col :span="15">
            <el-select
              v-model="yardForm.yardProvince"
              filterable
              allow-create
              placeholder="请选择地区"
              default-first-option
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
      <el-form-item label="城市" prop="yardCity">
        <el-row>
          <el-col :span="15">
            <el-select
              v-model="yardForm.yardCity"
              filterable
              allow-create
              placeholder="请选择城市"
              default-first-option
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
      <el-form-item label="堆场地址" prop="yardAddress">
        <el-row>
          <el-col :span="15">
            <el-input v-model="yardForm.yardAddress" maxlength="50" placeholder="请输入堆场地址" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="关联港口" prop="portCode">
        <el-row>
          <el-col :span="15">
            <type-select v-model="yardForm.portCode" type="seaport" placeholder="请选择港口" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-row>
          <el-col :span="15">
            <el-input v-model="yardForm.contact" maxlength="50" placeholder="请输入联系人" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-row>
          <el-col :span="15">
            <el-input v-model="yardForm.email" maxlength="50" placeholder="请输入邮箱地址" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone">
        <el-row>
          <el-col :span="15">
            <el-input v-model="yardForm.contactPhone" maxlength="50" placeholder="请输入联系电话" />
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
import { getCountryApi, getProvinceApi } from '@/api/containerManager'
import { getYardDetailApi, createYardApi, updateYardApi } from '@/api/yardManager'
export default {
  name: 'EditYardDialog',
  props: {
    edit: { type: Boolean, default: false },
    showDialog: { type: Boolean, default: false }
  },
  data() {
    // const validateMobile = async(rule, value, callback) => {
    //   if (value) {
    //     if (!this.$validators.validateMobile(value)) {
    //       return callback(new Error('请正确填写手机号码'))
    //     }
    //   }
    //   callback()
    // }
    const trimSpaceCode = (rule, value, callback) => {
      if(!!value) {
        const str = value.replace(/^\s+|\s+$/gm, '')
        if(str.length == 0) {
          callback(new Error('请输入堆场代码'))
        }
      }
      callback()
    }
    const trimSpaceName = (rule, value, callback) => {
      if(!!value) {
        const str = value.replace(/^\s+|\s+$/gm, '')
        if(str.length == 0) {
          callback(new Error('请输入堆场名称'))
        }
      }
      callback()
    }
    const trimSpaceAddress = (rule, value, callback) => {
      if(!!value) {
        const str = value.replace(/^\s+|\s+$/gm, '')
        if(str.length == 0) {
          callback(new Error('请填写堆场地址'))
        }
      }
      callback()
    }
    return {
      editId: null,
      title: '新建堆场信息',
      countryList: [],
      provinceyList: [],
      cityList: [],
      yardForm: {
        yardType: 1,
        code: '',
        name: '',
        contact: '',
        contactPhone: '',
        portName: '',
        portCode: '',
        shortName: '',
        yardCountry: '',
        yardProvince: '',
        yardCity: '',
        yardAddress: '',
        divisionCode: '',
        email: ''
      },
      yardFormRules: {
        code: [
          { required: true, message: '请输入堆场代码', trigger: 'blur' },
          { validator: trimSpaceCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入堆场名称', trigger: 'blur' },
          { validator: trimSpaceName, trigger: 'blur' }
        ],
        // contactPhone: [
        //   { validator: validateMobile, trigger: 'blur' }
        // ],
        yardCountry: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        yardProvince: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        yardCity: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        yardAddress: [
          { required: true, message: '请填写堆场地址', trigger: 'change' },
          { validator: trimSpaceAddress, trigger: 'blur' }
        ],
        portCode: [
          { required: true, message: '请选择港口', trigger: 'blur' }
        ],
        email: [
          { validator: this.$validators.checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    edit: function(val) {
      if (val) {
        this.title = '编辑堆场信息'
      } else {
        this.title = '新建堆场信息'
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
    async getYardDetail(id) {
      this.editId = id
      const res = await getYardDetailApi(id)
      if (res.ok) {
        this.yardForm = { ...this.yardForm, ...res.content }

        if (this.yardForm.yardCountry === 'CN') {
          this.getProvince()
          this.getCity(this.yardForm.yardProvince)
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
    checkYardType(val) {
      if (val === 2) {
        this.yardForm.portCode = ''
      }
    },
    handleCountrySelection(val) {
      // 选择国家后，获取省列表
      this.provinceyList = []
      this.cityList = []
      this.yardForm.yardProvince = ''
      this.yardForm.yardCity = ''
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
      this.yardForm.yardCity = ''
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
        this.yardForm.divisionCode = val
      } else {
        this.yardForm.divisionCode = ''
      }
    },
    validateForm() {
      this.$refs.yardForm.validate(async valid => {
        if (valid) {
          // 格式化输入框
          this.yardForm.code = this.yardForm.code.replace(/^\s+|\s+$/gm,'')
          this.yardForm.name = this.yardForm.name.replace(/^\s+|\s+$/gm,'')
          this.yardForm.yardAddress = this.yardForm.yardAddress.replace(/^\s+|\s+$/gm,'')
          // 提交表单
          let res = null
          if (this.edit) {
            res = await updateYardApi(this.editId, JSON.stringify(this.yardForm))
          } else {
            this.yardForm.id = ''
            res = await createYardApi(JSON.stringify(this.yardForm))
          }

          if (res.ok) {
            this.$message({
              type: 'success',
              message: '堆场信息保存成功'
            })

            this.closeDialog()
            this.$emit('refreshData')
          }
        }
      })
    },
    closeDialog() {
      this.$refs.yardForm.resetFields()
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
