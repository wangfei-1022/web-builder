<!--受限的select选择器，可根据传入的类型type进行渲染不同的select。
  如不满足，请使用 丰富的组件：cargo-advance-select(如何使用，可参考searchItem组件)
type目前支持：
  country：国家
  seaport:港口-海港code5 五字码
  airport:港口-空港code3 三字码
  shippingType：船舶类型
  customer: 结算单位
  shipping:船名
  user: 用户
  office: 公司
  arApType：应收应付
  customerType: 结算单位类型
  feeItem:费用项
  feeItemMul:费用项多选
  feeUnit: 计费方式
  invoiceTitle：发票抬头
  bank：开户银行
  currency: 币种
  clearType: 结算方式
  payType: 支付方式
  lines: 航线
  dept: 部门
  fullSpellType: 整拼类型
  carrier: 船公司
-->
<template>
  <cargo-advance-select
    v-if="type==='country'"
    :url="url.sys.countryList"
    :headers="['二字码','中文名称','英文名称']"
    :fields="['code2','chineseName','englishName']"
    :remote-default-obj="{chineseName:selectLabel,code2:selectValue}"
    tag-value="code2"
    tag-name="code2"
    style="width:205px;"
    remote
    :placeholder="placeholder"
    @parentCallBack="getItemFromChild"
  >
    <template slot-scope="{option:{item,fields}}">
      <div style="display: flex;justify-content: space-between;width:400px;">
        <div v-for="(field) in fields" :key="field" style="width:30%">{{ item[field] }}</div>
      </div>
    </template>
  </cargo-advance-select>
  <!--船公司-->
  <cargo-advance-select
    v-else-if="type==='carrier'"
    :default-value="selectValue"
    :url="url.qf.partnerOfCarrier"
    tag-name="englishShortname"
    tag-value="englishShortname"
    :fields="['scacCode', 'englishShortname', 'chineseName', 'englishName']"
    :headers="['代码', '简称', '中文名', '英文名']"
    :remote-default-obj="remoteDefaultObj"
    style="width:205px;"
    remote
    :placeholder="placeholder"
    @parentCallBack="getItemFromChild"
    :disabled="disabled"
  />
  <!--空港-->
  <cargo-advance-select
    v-else-if="type==='airport'"
    :url="url.qf.seaport"
    :headers="['三字码','中文名称','英文名称']"
    :default-value="selectValue"
    :fields="['code3','chineseName','englishName']"
    :remote-default-obj="{chineseName:selectLabel,englishName:selectLabel,code3:selectValue}"
    tag-value="code3"
    tag-name="code3"
    style="width:205px;"
    remote
    :placeholder="placeholder"
    @parentCallBack="getItemFromChild"
  />
  <!--海港-->
  <cargo-advance-select
    v-else-if="type==='seaport'"
    :url="url.qf.seaport"
    :headers="['五字码','中文名称','英文名称']"
    :default-value="selectValue"
    :fields="['code5','chineseName','englishName']"
    :remote-default-obj="{chineseName:selectLabel,englishName:selectLabel,code5:selectValue}"
    tag-value="code5"
    tag-name="code5"
    style="width:205px;"
    remote
    :placeholder="placeholder"
    @parentCallBack="getItemFromChild"
  >
    <!--<template slot-scope="{option:{item,fields}}">
      <div style="display: flex;justify-content: space-between;width:400px;">
        &lt;!&ndash;<el-tooltip v-for="(field) in fields" :key="field" :disabled="!item[field] || item[field].length<15" :content="item[field]" effect="dark" placement="left">
          <div style="width:30%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
            {{ item[field] }}
          </div>
        </el-tooltip>&ndash;&gt;
        <div v-for="(field) in fields" :key="field" :title="(item[field]).length>5?(item[field]):''" style="width:30%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ item[field] }}</div>
      </div>
    </template>-->
  </cargo-advance-select>
  <cargo-advance-select
    v-else-if="type==='shipping'"
    :url="url.dmn.shippingSelect"
    :default-value="selectValue"
    :headers="['船公司','中文名称','英文名称']"
    :fields="['carrierName','chineseName','englishName']"
    :remote-default-obj="remoteDefaultObj"
    tag-value="vesselCode"
    tag-name="englishName"
    style="width:205px;"
    remote
    :placeholder="placeholder"
    @parentCallBack="getItemFromChild"
  >
    <template slot-scope="{option:{item,fields}}">
      <div style="display: flex;justify-content: space-between;width:400px;">
        <el-tooltip v-for="(field) in fields" :key="field" :disabled="!item[field] || item[field].length<15" :content="item[field]" effect="dark" placement="left">
          <div style="width:30%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
            {{ item[field] }}
          </div>
        </el-tooltip>
      </div>
    </template>
  </cargo-advance-select>
  <cargo-advance-select
    v-else-if="type==='shippingType'"
    :url="url.dmn.shippingType"
    :default-value="selectValue"
    :fields="['label']"
    callback-method-type="value"
    tag-value="value"
    tag-name="label"
    options-width="200px"
    style="width:205px;"
    :placeholder="placeholder"
    @parentCallBack="getItemValueFromChild"
  />
  <cargo-advance-select
    v-else-if="type==='lines'"
    :url="url.sys.chargeSchemeLineList"
    :default-value="selectValue"
    :fields="['label']"
    callback-method-type="value"
    tag-value="value"
    tag-name="label"
    options-width="200px"
    style="width:205px;"
    :placeholder="placeholder"
    @parentCallBack="getItemValueFromChild"
  />
  <cargo-advance-select
    v-else-if="type==='dept'"
    ref="deptRef"
    :callback-params="callbackParams"
    :url="url.sys.departmentListDown"
    :default-value="selectValue"
    :headers="['公司名称','上级部门','部门名称']"
    :fields="['officeName','parentName','departmentName']"
    tag-name="departmentName"
    options-width="450px"
    style="width:205px;"
    @parentCallBack="getItemFromChild"
  />
  <cargo-advance-select
    v-else-if="type==='customer'"
    ref="customerRef"
    :callback-params="callbackParams"
    :default-value="selectValue"
    :url="method?'':url.sys.partnerDropDownList"
    :filterable="filterable"
    :disabled="disabled"
    :method="method"
    :method-params="methodParams"
    :headers="['中文名称','英文名称']"
    :fields="['chineseName','englishName']"
    :remote-default-obj="{ id:selectValue, chineseName: selectLabel }"
    style="width:205px;"
    :remote="remote"
    :placeholder="placeholder"
    @blur="onBlur"
    @parentCallBack="getItemFromChild"
  >
    <template slot-scope="{option:{item,fields}}">
      <div style="display: flex;justify-content: space-between;width:400px;">
        <div v-for="(field) in fields" :key="field" style="width:30%">{{ item[field] }}</div>
      </div>
    </template>
  </cargo-advance-select>
  <!--公司-->
  <cargo-advance-select
    v-else-if="type==='office'"
    :fixed-options="fixedOptions"
    :url="url.sys.companyList"
    :default-value="selectValue"
    :method-params="{}"
    options-width="300px"
    style="width:205px;"
    :placeholder="placeholder"
    @parentCallBack="getItemFromChild"
  />
  <cargo-advance-select
    v-else-if="type==='user'"
    :allow-create="allowCreate"
    :url="url.sys.userDropDownList"
    :default-value="multiple?'':selectValue"
    :default-multiple-value="multiple?selectValue:[]"
    :multiple="multiple"
    :method-params="methodParams"
    :tag-value="tagValue"
    :remote-default-obj="remoteDefaultObj"
    remote
    callback-method-type="obj"
    options-width="230px"
    style="width:205px;"
    :placeholder="placeholder"
    @parentCallBack="getItemFromChild"
    :disabled="disabled"
  />
  <cargo-advance-select
    v-else-if="type==='arApType'"
    :url="url.act.arApDropDownList"
    :default-value="selectValue"
    tag-value="value"
    tag-name="label"
    options-width="200px"
    style="width:205px;"
    :placeholder="placeholder"
    @parentCallBack="getItemFromChild"
  />
  <cargo-advance-select
    v-else-if="type==='feeItem'"
    :url="url.act.feeItemDropdownList"
    :filter-tag-names="['code','englishName','chineseName']"
    :default-value="selectValue"
    :filterable="filterable"
    :placeholder="placeholder"
    :headers="['英文名称','中文名称']"
    :fields="['englishName','chineseName']"
    options-width="450px"
    style="width:205px;"
    @parentCallBack="getItemFromChild"
  />
  <!--费用项多选-->
  <cargo-advance-select
    v-else-if="type==='feeItemMul'"
    :url="url.act.feeItemDropdownList"
    :default-multiple-value="selectValue"
    :multiple="1==1"
    :filterable="filterable"
    :headers="['英文名称','中文名称']"
    :fields="['englishName','chineseName']"
    options-width="450px"
    style="width:205px;"
    @parentCallBack="getItemFromChild"
  />
  <cargo-advance-select
    v-else-if="type==='feeUnit'"
    :url="url.sys.chargeSchemeUnitList"
    :default-value="selectValue"
    tag-value="value"
    tag-name="label"
    options-width="200px"
    style="width:205px;"
    :placeholder="placeholder"
    @parentCallBack="getItemFromChild"
  />
  <cargo-advance-select
    v-else-if="type==='invoiceTitle'"
    ref="invoiceTitleRef"
    :url="url.pnr.invoice"
    :allow-fetch="allowFetch"
    :default-value="selectValue"
    :method-params="methodParams"
    :allow-create="allowCreate"
    :filterable="filterable"
    tag-name="invoiceTitle"
    tag-value="invoiceTitle"
    :fields="['invoiceTitle']"
    options-width="300px"
    style="width:205px;"
    :placeholder="placeholder"
    @parentCallBack="getItemFromChild"
  />
  <cargo-advance-select
    v-else-if="type==='bank'"
    ref="bankRef"
    :allow-fetch="allowFetch"
    :url="url.pnr.account"
    :default-value="selectValue"
    :method-params="methodParams"
    tag-name="accountName"
    tag-value="accountName"
    :fields="['accountName']"
    options-width="200px"
    style="width:205px;"
    :placeholder="placeholder"
    @parentCallBack="getItemFromChild"
  />
  <cargo-advance-select
    v-else-if="type==='customerType'"
    :url="url.sys.chargeSchemeCustomerList"
    :default-value="selectValue"
    :method-params="{}"
    tag-value="value"
    tag-name="label"
    options-width="200px"
    style="width:205px;"
    :placeholder="placeholder"
    @parentCallBack="getItemFromChild"
  />
  <!--币种-->
  <cargo-advance-select
    v-else-if="type==='currency'"
    :url="url.dmn.currencyDropDownList"
    :default-value="selectValue"
    :fields="['label']"
    callback-method-type="value"
    tag-value="value"
    tag-name="label"
    options-width="200px"
    style="width:205px;"
    :placeholder="placeholder"
    @parentCallBack="getItemValueFromChild"
  />
  <!--结算方式-->
  <cargo-advance-select
    v-else-if="type==='clearType'"
    :url="url.act.payTypeForClearDropdownList"
    :default-value="selectValue"
    :fields="['label']"
    :disabled="disabled"
    callback-method-type="value"
    tag-value="value"
    tag-name="label"
    options-width="200px"
    style="width:205px;"
    :placeholder="placeholder"
    @parentCallBack="getItemValueFromChild"
  />
  <!--支付方式-->
  <cargo-advance-select
    v-else-if="type==='payType'"
    :url="url.act.payTypeDropDownList"
    :default-value="selectValue"
    :fields="['label']"
    callback-method-type="value"
    tag-value="value"
    tag-name="label"
    options-width="200px"
    style="width:205px;"
    :placeholder="placeholder"
    @parentCallBack="getItemValueFromChild"
  />
  <!--整拼类型-->
  <el-select v-else-if="type==='fullSpellType'" v-model="fullSpellTypeVal" size="mini" :placeholder="placeholder">
    <el-option :value="1" label="FCL"><div style="display: flex; justify-content: space-between"><div><svg-icon icon-class="fcllcl-F" /> FCL</div><div>整箱</div></div></el-option>
    <el-option :value="3" label="LCL"><div style="display: flex; justify-content: space-between"><div><svg-icon icon-class="fcllcl-L" /> LCL</div><div>货代自拼箱小票</div></div></el-option>
    <el-option :value="4" label="M-B/C"><div style="display: flex; justify-content: space-between"><div><svg-icon icon-class="fcllcl-M" /> M-B/C</div><div>客户加拼主票</div></div></el-option>
    <el-option :value="6" label="Co-load"><div style="display: flex; justify-content: space-between"><div><svg-icon icon-class="fcllcl-C" /> Co-load</div><div>委托外拼</div></div></el-option>
    <el-option :value="7" label="Bulk"><div style="display: flex; justify-content: space-between"><div><svg-icon icon-class="fcllcl-B" /> Bulk</div><div>散杂货</div></div></el-option>
    <el-option :value="2" label="Consol"><div style="display: flex; justify-content: space-between"><div><svg-icon icon-class="fcllcl-P" /> Consol</div><div>货代自拼箱</div></div></el-option>
    <el-option :value="5" label="S-B/C"><div style="display: flex; justify-content: space-between"><div><svg-icon icon-class="fcllcl-S" /> S-B/C</div><div>客户加拼小票</div></div></el-option>
  </el-select>
</template>

<script>
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import URL from '@/api/urlTranslator'
export default {
  name: 'CargoLimitedSelect',
  components: { cargoAdvanceSelect },
  props: {
    disabled: { type: Boolean, default: false }, // 不可编辑
    allowFetch: { type: Boolean, default: true }, // 是否让该组件去调取接口
    allowCreate: { type: Boolean, default: false }, // 是否允许创建项
    filterable: { type: Boolean, default: true }, // （是否允许过滤）-- 未测试通过
    type: { type: String, default: '' },
    callbackParams: { type: Object, default: null }, // 回传参数，即把父组件传递的参数原样传回（场景：table编辑rowIndex）
    selectValue: { type: [String, Number, Array], default: '' }, // Array类型，是为多选默认赋值的
    fixedOptions: { type: Array, default: null }, // 固定的select的option
    selectLabel: { type: String, default: '' },
    remote: { type: Boolean, default: true }, // （是否为远程搜索组件） 仅结算单位使用
    // remoteDefaultObj: { type: Object, default: () => { return {} } },
    remoteDefaultObj: { type: [Object, Array], default: null }, // 远程默认实体（远程组件在编辑后，再次访问是有默认值的）
    methodParams: { type: Object, default: () => {} }, // 请求数据的方法参数
    method: { type: Function, default: null }, // 请求数据的方法  注意：url优先级高
    multiple: { type: Boolean, default: false }, // （是否多选）
    placeholder: { type: String, default: '请选择' },
    tagValue: { type: String, default: 'id' } // select的value对应的字段，默认id(目前只用在type='user'上)
  },
  data() {
    return {
    }
  },
  computed: {
    fullSpellTypeVal: {
      get() {
        console.log('=selectValue=computed=', this.selectValue)
        return this.selectValue
      },
      set(val) {
        this.$emit('set', val)
      }

    },
    remoteObj() {
      // 多选无用，单选远程对象设置默认值-暂时无用
      return { id: this.selectValue, chineseName: this.selectLabel }
    },
    url() {
      return URL
    }
  },
  beforeMount() {
  },
  methods: {
    callbackFetchData(ref, paramsObj) {
      // 由父组件回调使用的
      this.$refs[ref].fetchData(paramsObj)
    },
    callbackClearData(ref) {
      this.$refs[ref].clearData()
    },
    callbackFillData(ref, defaultOptions) { // defaultOptions 指定的options
      this.$refs[ref].fillData(defaultOptions)
    },
    getItemFromChild(obj) {
      console.log('cargoLimitedSelect getItemFromChild obj', obj)
      if (this.callbackParams) {
        this.$emit('set', { ...obj, ...this.callbackParams })
      } else {
        this.$emit('set', obj)
      }
    },
    getItemValueFromChild(value) {
      console.log('getItemValueFromChild value-----', value)
      if (this.callbackParams) {
        this.$emit('set', { value, ...this.callbackParams })
      } else {
        this.$emit('set', value)
      }
    },
    getItemLabelFromChild(label) {
      if (this.callbackParams) {
        this.$emit('set', { label, ...this.callbackParams })
      } else {
        this.$emit('set', label)
      }
    },
    onBlur() {
      this.$emit('blur')
    }

  }
}
</script>

<style scoped>

</style>
