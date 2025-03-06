<template>
  <div class="form-wrap">
    <div class="inner-form-wrap">
      <el-form :model="packageForm" ref="packageForm" size="mini" :rules="packageFormRules" label-width="100">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="enGoodsName" :label="$t('spaceRule.packageForm.goodsName')">
              <el-input v-model="packageForm.enGoodsName" maxlength="60"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="packageType" :label="$t('spaceRule.packageForm.packageAndLogo')">
              <el-select v-model="packageForm.packageType" filterable clearable style="width: 100%;">
                <el-option v-for="item in packageList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-form-item prop="quantity" :label="$t('spaceRule.packageForm.quantity')">
              <el-input v-model="packageForm.quantity" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="grossWeight" :label="$t('spaceRule.packageForm.grossWeight')">
              <el-input v-model="packageForm.grossWeight" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="volume" :label="$t('spaceRule.packageForm.volume')">
              <el-input v-model="packageForm.volume" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-form-item prop="remark" :label="$t('common.remark')">
              <el-input type="textarea" rows="4" maxlength="240" v-model="packageForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import logoPackageData from './logoPackagesData.json'
  export default {
    name: 'PackageForm',
    data() {
      return {
        packageForm: {
          enGoodsName: '',
          packageType: '',
          quantity: '',
          grossWeight: '',
          volume: '',
          remark: ''
        },
        packageFormRules: {
          enGoodsName: [
            {required: true, message: this.$t('spaceRule.packageForm.goodsNameEmptyInvalid'), trigger: 'blur'}
          ],
          packageType: [
            {required: true, message: this.$t('spaceRule.packageForm.packageAndLogoEmptyInvalid'), trigger: 'change'}
          ],
          quantity: [
            {required: true, message: this.$t('spaceRule.packageForm.quantityEmptyInvalid'), trigger: 'blur'}
          ],
          grossWeight: [
            {required: true, message: this.$t('spaceRule.packageForm.weightEmptyInvalid'), trigger: 'blur'}
          ],
          volume: [
            {required: true, message: this.$t('spaceRule.packageForm.volumeEmptyInvalid'), trigger: 'blur'}
          ]
        },
        packageList: []
      }
    },
    methods: {
      setFormInfo(formObj) {
        this.packageForm = {
          enGoodsName: formObj.enGoodsName,
          packageType: formObj.packageType,
          quantity: formObj.quantity,
          grossWeight: formObj.grossWeight,
          volume: formObj.volume,
          remark: formObj.remark
        }
      },
      clearForm() {
        this.$refs.packageForm.resetFields()
        // this.$nextTick(() => {
        //   this.$refs.packageForm.resetFields()
        // })
      },
      validateForm() {
        return new Promise((resolve, reject) => {
          this.$refs.packageForm.validate(valid => {
            if (!valid) {
              reject('packageForm')
            } else {
              resolve({packageForm: this.packageForm})
            }
          })
        })
      }
    },
    created() {
      for (const [key, val] of Object.entries(logoPackageData)) {
        this.packageList.push({
          label: val,
          value: key
        })
      }
    },
    mounted() {

    }
  }
</script>
<style scoped lang="scss">
  .inner-form-wrap{
    padding-left: 16px;
    h3{
      font-weight: normal;
    }
  }
</style>
