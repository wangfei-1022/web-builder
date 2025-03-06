<template>
  <el-form ref="baseForm" :rules="formRule" :model="form" label-width="70px" size="mini" class="member-form">
    <div class="base-item">
      <i class="iconfont icon-minus-circle minus-btn" @click="deleteFn" v-if="type != 'DETAIL'"></i>
      <el-form-item label="" prop="restrictionCategory" label-width="0px">
        <el-select v-model="form.restrictionCategory" :disabled="isDisabled" style="width:100%"  @change="categoryChange">
          <el-option v-for="(item, index) in weightTypeList" :key="index" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="restrictionType" label-width="0px">
        <el-select v-model="form.restrictionType" :disabled="isDisabled"  style="width:100%">
          <el-option v-for="(item, index) in restrictionTypeList" :key="index" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <!--重量 尺寸 申报价值 体积的时候展示-->
      <div v-if="[1, 2, 3, 5].indexOf(form.restrictionCategory) >= 0">
        <!--申请价值的时候 选择币种-->
        <el-form-item label="" prop="currencyCode1" label-width="0px"  v-if="form.restrictionCategory === 3">
          <el-select v-model="form.currencyCode1" :disabled="isDisabled"  style="width:100%">
            <el-option v-for="(item, index) in currencyList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="quantityUnit" label-width="0px" v-if="form.restrictionCategory !== 3">
          <el-select v-model="form.quantityUnit" :disabled="isDisabled"  style="width:100%">
            <el-option v-for="(item, index) in unitList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
      </div>
    </div>

    <!--重量 尺寸 申报价值 体积的时候展示-->
    <div v-if="[1, 2, 3, 5].indexOf(form.restrictionCategory) >= 0">
      <div class="base-item">
        <el-form-item label="" prop="test" label-width="0px" style="text-align: right;">
          <i data-v-2caf994f="" class="iconfont icon-add-circle" @click="addSecond" v-if="!isSecond && type != 'DETAIL'"></i>
        </el-form-item>
        <el-form-item label="" prop="conditionSignType1" label-width="0px">
          <el-select v-model="form.conditionSignType1" :disabled="isDisabled"  style="width:100%">
            <el-option v-for="(item, index) in symbolList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="quantityValue1" label-width="0px">
          <el-input v-model="form.quantityValue1" :disabled="isDisabled"></el-input>
        </el-form-item>
      </div>

      <div class="base-item second" v-if="isSecond">
        <el-form-item label="" prop="test" label-width="0px" style="text-align: right;">
          <i data-v-2caf994f="" class="iconfont icon-minus-circle" @click="removeSecond" v-if="type != 'DETAIL'"></i>
        </el-form-item>
        <el-form-item label="" prop="conditionSignType2" label-width="0px">
          <el-select v-model="form.conditionSignType2" :disabled="isDisabled"  style="width:100%">
            <el-option v-for="(item, index) in symbolList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="quantityValue2" label-width="0px">
          <el-input v-model="form.quantityValue2" :disabled="isDisabled"></el-input>
        </el-form-item>
      </div>
    </div>

    <!--邮编 不可达邮编 客户不可达邮编的时候展示-->
    <div v-if="[4, 6, 7].indexOf(form.restrictionCategory) >= 0">
      <div class="base-item">
        <el-form-item label="" prop="test" label-width="0px">

        </el-form-item>
        <el-form-item label="" prop="stringValue" label-width="0px">
          <el-input v-model="form.stringValue" :disabled="isDisabled" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="" prop="stringValue2" label-width="0px" v-if="form.restrictionCategory === 7">
          <el-input v-model="form.stringValue2" :disabled="isDisabled" type="textarea"></el-input>
        </el-form-item>
      </div>
    </div>

  </el-form>
</template>
<script>
import { getRestrictionTypeApi, getRestrictionUnitTypeApi } from "@/api/uexpress/base";
import { getRestrictionCurrencyApi } from "@/api/uexpress/base";

export default {
	name: "RestrictionsItem",
	components: {

	},
  props: {
    index: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: function() {
        return {}
      }
    },
    weightTypeList: {
      type: Array,
      default: function() {
        return []
      }
    },
    symbolList: {
      type: Array,
      default: function() {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  watch: {
    item: {
      handler(val) {
        this.form = {
          ...val
        }
        if (val.conditionSignType2) {
          this.isSecond = true
        }
        if (this.form.restrictionCategory) {
          this.getRelationList()
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    isDisabled() {
      return false
    }
  },
	data() {
		return {
      restrictionTypeList: [],
      unitList: [],
      currencyList: [],
			form: {},
			formRule: {
				restrictionCategory: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        restrictionType: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        quantityUnit: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        currencyCode1: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        conditionSignType1: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        quantityValue1: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        conditionSignType2: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        quantityValue2: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        effectiveTime: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        stringValue: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        stringValue2: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},
			loading: false,
      isSecond: false
		};
	},
	created() {

	},
	methods: {
    initForm() {
       this.form = {
        restrictionCategory: "",
				restrictionType: "", // 约束条件类型
				quantityUnit: "", // 约束单位类型
        currencyCode1: '',
        conditionSignType1: '', // 约束操作符1
        quantityValue1: '', // 约束数量1
        conditionSignType2: '', // 约束操作符1
        quantityValue2: '', // 约束数量1
        effectiveTime: '', // 生效时间
        stringValue: '', // 文本  邮编
        stringValue2: '' // 文本  邮编
      }
    },
    categoryChange() {
      let restrictionCategory = this.form.restrictionCategory
      this.initForm()
      this.form.restrictionCategory = restrictionCategory
      this.getRelationList()
    },
		getRelationList() {
      getRestrictionTypeApi(this.form.restrictionCategory).then(res => {
        if (res.ok) {
          this.restrictionTypeList = res.content
        }
      })
      if (this.form.restrictionCategory === 3) {
        getRestrictionCurrencyApi(this.form.restrictionCategory).then(res => {
          if (res.ok) {
            this.currencyList = res.content
          }
        })
      } else {
        getRestrictionUnitTypeApi(this.form.restrictionCategory).then(res => {
          if (res.ok) {
            this.unitList = res.content
          }
        })
      }

    },
    validate() {
      let valid = true
      this.$refs.baseForm.validate(v => {
        valid = v
      })
      return valid
    },
    getValue() {
      return this.form
    },
    deleteFn() {
      this.$emit('delete', this.index)
    },
    addSecond() {
      this.isSecond = true
    },
    removeSecond() {
      this.isSecond = false
      this.form.conditionSignType2 = ''
      this.form.quantityValue2 = ''
    }
	}
};
</script>
<style scoped lang="scss">
.member-form{
  overflow: hidden;

  ::v-deep .el-form-item{
    width: 33.33333%!important;
    float: left!important;
    padding: 0 5px;
  }
  .right-item{
   ::v-deep  .el-form-item{
    float: right!important;
    }
  }
}

.icon-minus-circle,
.icon-add-circle{
  color: #1890ff;
  font-size: 24px;
}
.base-item{
  padding-left: 30px;
  position: relative;
  overflow: hidden;

  .minus-btn{
    position: absolute;
    left: 0;
    cursor: pointer;
  }
}
.right-item{
  .icon-minus-circle{
    float: right;
    cursor: pointer;
  }
  .icon-add-circle{
    float: right;
    cursor: pointer;
  }
}

</style>
