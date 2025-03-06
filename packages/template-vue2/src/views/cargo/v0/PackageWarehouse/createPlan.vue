<template>
  <div v-loading="loading" class="right-main-wrapper">
    <div class="top-form">
      <el-form ref="createForm" :inline="true" :model="createForm" :rules="createFormRule" label-width="80px"  size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('planManager.warehouseId')}: `" prop="warehouseId">
          <el-select v-model="createForm.warehouseId"
            filterable
            default-first-option
            @change="clearList">
            <el-option v-for="item in warehouseList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.planDate')}: `" prop="planTime">
          <CommonPicker
            v-model="createForm.planTime"
            pickerFormat="yyyy-MM-dd"
            pikcerType="date"
            :clearable="false"
            @change="clearList"/>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.billOrigin')}: `" prop="billOrigin">
          <el-select v-model="createForm.billOrigin">
            <el-option v-for="item in billOriginList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table
        :data="planList"
        style="width: 100%;"
        :height="tableHeight"
        align="center"
        row-key>
        <el-table-column header-align="center" align="center" prop="planNo" :label="$t('planManager.planNo')" width="120">
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="countryName" :label="$t('planManager.countryName')" width="120">
          <template slot-scope="{row}">
            <el-select v-model="rowForm.countryCode" v-show="row.edit" size="mini" @change="setCountryName">
              <el-option v-for="item in countryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span v-show="!row.edit">{{row.countryName}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="lastMailCarrier" :label="$t('planManager.lastMailCarrier')" width="120">
          <template slot-scope="{row}">
            <el-input v-model="rowForm.lastMailCarrier" v-show="row.edit" size="mini"></el-input>
            <span v-show="!row.edit">{{row.lastMailCarrier}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="cargoType" :label="$t('planManager.cargoType')" width="120">
          <template slot-scope="{row}">
            <el-select v-model="rowForm.cargoType" v-show="row.edit" size="mini">
              <el-option v-for="item in cargoList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span v-show="!row.edit">{{row.cargoType}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="outboundCarrier" :label="$t('planManager.outboundCarrier')" width="120">
          <template slot-scope="{row}">
            <el-input v-model="rowForm.outboundCarrier" v-show="row.edit" size="mini"></el-input>
            <span v-show="!row.edit">{{row.outboundCarrier}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="customsAgent" :label="$t('planManager.customsAgentLabel')" width="120">
          <template slot-scope="{row}">
            <el-input v-model="rowForm.customsAgent" v-show="row.edit" size="mini"></el-input>
            <span v-show="!row.edit">{{row.customsAgent}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="airAgent" :label="$t('planManager.airAgent')" width="120">
          <template slot-scope="{row}">
            <el-input v-model="rowForm.airAgent" v-show="row.edit" size="mini"></el-input>
            <span v-show="!row.edit">{{row.airAgent}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column header-align="center" align="center" prop="billNo" :label="$t('planManager.billNo')" width="180">
          <template slot-scope="{row}">
            <el-input v-model="rowForm.billNo" v-show="row.edit" size="mini"></el-input>
            <span v-show="!row.edit">{{row.billNo}}</span>
          </template>
        </el-table-column> -->
        <el-table-column header-align="center" align="center" prop="etd" :label="$t('planManager.etd')" width="180">
          <template slot-scope="{row}">
            <CommonPicker
              v-model="rowForm.etd"
              pickerFormat="yyyy-MM-dd"
              pikcerType="date"
              :clearable="true"
              v-show="row.edit"
              size="mini" />
            <span v-show="!row.edit">{{row.etd | filterDate(vm)}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="flightNo" :label="$t('planManager.flightNo')" width="120">
          <template slot-scope="{row}">
            <el-input v-model="rowForm.flightNo" v-show="row.edit" size="mini"></el-input>
            <span v-show="!row.edit">{{row.flightNo}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="polCode" :label="$t('planManager.polCode')" width="220">
          <template slot-scope="{row}">
            <!-- <el-input v-model="rowForm.polCode" v-show="row.edit" size="mini"></el-input> -->
            <span v-show="row.edit" class="required-mark">*</span>
            <cargo-advance-select
              v-show="row.edit"
              ref="polCodeSelect"
              :url="airPortListUrl"
              :headers="[$t('common.threeCharCode')]"
              :fields="['code3']"
              tag-value="code3"
              tag-name="code3"
              remote
              @parentCallBack="(data) => {
                rowForm.polCode = data.code3
                rowForm.polName = data.chineseName
              }" />
            <span v-show="!row.edit">{{row.polCode}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="podCode" :label="$t('planManager.podCode')" width="220">
          <template slot-scope="{row}">
            <!-- <el-input v-model="rowForm.podCode" v-show="row.edit" size="mini"></el-input> -->
            <span v-show="row.edit" class="required-mark">*</span>
            <cargo-advance-select
              v-show="row.edit"
              ref="podCodeSelect"
              :url="airPortListUrl"
              :headers="[$t('common.threeCharCode')]"
              :fields="['code3']"
              tag-value="code3"
              tag-name="code3"
              remote
              @parentCallBack="(data) => {
                rowForm.podCode = data.code3
                rowForm.podName = data.chineseName
              }" />
            <span v-show="!row.edit">{{row.podCode}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="customsClearance" :label="$t('planManager.customsClearance')" width="120">
          <template slot-scope="{row}">
            <el-input v-model="rowForm.customsClearance" v-show="row.edit" size="mini"></el-input>
            <span v-show="!row.edit">{{row.customsClearance}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="density" :label="$t('planManager.density')" width="120">
          <template slot-scope="{row}">
            <el-input v-model="rowForm.density" v-show="row.edit" size="mini" @input="checkDensityInput"></el-input>
            <span v-show="!row.edit">{{row.density}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="boxQuantity" :label="$t('planManager.boxQuantity')" width="120">
          <template slot-scope="{row}">
            <span v-show="row.edit" class="required-mark">*</span>
            <el-input class="required-input" v-model="rowForm.boxQuantity" v-show="row.edit" size="mini" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
            <span v-show="!row.edit">{{row.boxQuantity}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="totalWeight" :label="$t('planManager.totalWeight')" width="120">
          <template slot-scope="{row}">
            <span v-show="row.edit" class="required-mark">*</span>
            <el-input class="required-input" v-model="rowForm.totalWeight" v-show="row.edit" size="mini" oninput="value=value.replace(/[^\d.-]/g,'')"></el-input>
            <span v-show="!row.edit">{{row.totalWeight}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="totalVolume" :label="$t('planManager.totalVolume')" width="120">
          <template slot-scope="{row}">
            <span v-show="row.edit" class="required-mark">*</span>
            <el-input class="required-input" v-model="rowForm.totalVolume" v-show="row.edit" size="mini" oninput="value=value.replace(/[^\d.-]/g,'')"></el-input>
            <span v-show="!row.edit">{{row.totalVolume}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="timeliness" :label="$t('planManager.timeliness')" width="180">
          <template slot-scope="{row}">
            <span v-show="row.edit" class="required-mark" style="vertical-align: top;">*</span>
            <el-input class="required-input" v-model="rowForm.timeliness" v-show="row.edit" type="textarea" rows="3" size="mini"></el-input>
            <span v-show="!row.edit">{{row.timeliness}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="remark" :label="$t('planManager.remark')" width="180">
          <template slot-scope="{row}">
            <el-input v-model="rowForm.remark" v-show="row.edit" type="textarea" rows="3" size="mini"></el-input>
            <span v-show="!row.edit">{{row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="id" :label="$t('common.operation')" width="120" fixed="right">
          <template slot-scope="{row, column, $index}">
            <el-button type="text" @click="editRow($index)" v-show="!row.edit">{{$t('common.editBtn')}}</el-button>
            <el-button type="text" @click="checkSaveRow($index)" v-show="row.edit">{{$t('common.saveBtn')}}</el-button>
            <el-button type="text" @click="dropEdit($index)" v-show="row.edit">{{$t('common.cancelBtn')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button type="text" icon="el-icon-plus" @click="createNewLine">{{$t('planManager.addPlan')}}</el-button>
  </div>
</template>
<script>
import { getWarehouseListApi } from '@/api/packageWarehouse'
import {
  getPlanCountryListApi,
  createNewPlanApi,
  updatePlanApi
} from '@/api/planManager'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import airPortAPIPath from './mixin/airPortAPIPath'
export default {
  name: 'CreatePlan',
  components: { cargoAdvanceSelect },
  mixins: [airPortAPIPath],
  filters: {
    filterDate(dateStr, vm) {
      return dateStr ? vm.$moment(Number(dateStr)).format('YYYY-MM-DD') : ''
    }
  },
  data() {
    return {
      vm: this,
      loading: false,
      tableHeight: '300',
      warehouseList: [],
      countryList: [],
      planList: [],
      createForm: {
        planTime: null,
        warehouseId: null,
        billOrigin: 1
      },
      createFormRule: {
        planTime: [
          { required: true, message: this.$t('planManager.opreatorTimeEmptyErr'), trigger: 'change'}
        ],
        warehouseId: [
          { required: true, message: this.$t('planManager.warehouseIdEmptyErr'), trigger: 'change'}
        ],
        billOrigin: [
          { required: true, message: this.$t('planManager.billOriginEmptyErr'), trigger: 'change'}
        ]
      },
      billOriginList: [
        {
          label: this.$t('planManager.outsidePurchase'),
          value: 0
        },
        {
          label: this.$t('planManager.airDelivery'),
          value: 1
        }
      ],
      cargoList: [
        {
          label: this.$t('planManager.normalProduct'),
          value: this.$t('planManager.normalProduct')
        },
        {
          label: this.$t('planManager.electricProduct'),
          value: this.$t('planManager.electricProduct')
        },
        {
          label: this.$t('planManager.mixinProduct'),
          value: this.$t('planManager.mixinProduct')
        }
      ],
      rowForm: {
        planNo: '',
        countryCode: '',
        countryName: '',
        lastMailCarrier: '',
        cargoType: '',
        outboundCarrier: '',
        customsAgent: '',
        airAgent: '',
        // billNo: '',
        boxQuantity: null,
        totalWeight: null,
        totalVolume: null,
        etd: '',
        flightNo: '',
        polCode: '',
        polName: '',
        podCode: '',
        podName: '',
        customsClearance: '',
        density: '',
        timeliness: '',
        remark: '',
        edit: false
      }
    }
  },
  computed: { },
  watch: {},
  methods: {
    async getWarehouseList() {
      const res = await getWarehouseListApi({pageNum: 1, pageSize: 100})
      if (res && res.ok && res.content) {
        this.warehouseList = []
        res.content.list.forEach(item => {
          this.warehouseList.push({
            label: item.name,
            value: item.id
          })
        })
        this.createForm.warehouseId = this.warehouseList[0].value
      }
    },
    async getCountryList() {
      const res = await getPlanCountryListApi()
      if (res && res.ok) {
        this.countryList = []
        res.content.forEach(item => {
          this.countryList.push({
            label: item.countryName,
            value: item.countryCode
          })
        })
      }
    },
    createNewLine() {
      if (this.rowForm.edit) {
        this.$message.warning(this.$t('planManager.saveFirstWarning'))
        return false
      } else {
        this.$refs.createForm.validate(valid => {
          if (valid) {
            this.rowForm.edit = true
            this.planList.push(this.rowForm)
          }
        })
      }
    },
    editRow(index) {
      const _obj = {...this.planList[index]}
      _obj.edit = true
      this.rowForm = _obj
      this.$set(this.planList, index, _obj)
    },
    checkDensityInput(val) {
      const reg = /^(<|=|>|<=|>=)?\d*$/
      if (reg.test(val)) {
        this.rowForm.density = val
      } else {
        this.rowForm.density = val.substring(0, val.length - 1)
      }
    },
    checkSaveRow(index) {
      this.$refs.createForm.validate(async valid => {
        if (valid) {
          const reg = /^(<|=|>|<=|>=)?\d+$/
          if (this.rowForm.density.length > 0 && !reg.test(this.rowForm.density)) {
            this.$message.error(this.$t('planManager.densityErr'))
          } else if (this.rowForm.polCode.trim().length === 0) {
            this.$message.error(this.$t('planManager.polRequired'))
          } else if (this.rowForm.podCode.trim().length === 0) {
            this.$message.error(this.$t('planManager.podRequired'))
          } else if (!this.rowForm.boxQuantity) {
            this.$message.error(this.$t('planManager.quantityRequired'))
          } else if (!this.rowForm.totalWeight) {
            this.$message.error(this.$t('planManager.weightRequired'))
          } else if (!this.rowForm.totalVolume) {
            this.$message.error(this.$t('planManager.volumeRequired'))
          } else if (this.rowForm.timeliness.trim().length === 0) {
            this.$message.error(this.$t('planManager.timelinessRequired'))
          } else {
            this.rowForm = {...this.rowForm, ...this.createForm}
            this.submitPlan(index)
          }
        }
      })
    },
    async submitPlan(index) {
      this.loading = true
      let res = null
      if (!this.planList[index].id || this.planList[index].id.length === 0) {
        res = await createNewPlanApi(this.rowForm)
      } else {
        res = await updatePlanApi(this.planList[index].id, this.rowForm)
      }
      if (res && res.ok) {
        this.$message.success(this.$t('planManager.savedSuccess'))
        this.planList[index] = res.content
        this.planList[index].edit = false
        this.resetForm()
      }
      this.loading = false
    },
    dropEdit(index) {
      this.$confirm(this.$t('planManager.unSaveWarnningTips'), this.$t('common.warnningText'), {
        confirmButtonText: this.$t('common.dropEditBtn'),
        cancelButtonText: this.$t('planManager.thinkOver'),
        type: 'warning'
      }).then(() => {
        this.planList[index].edit = false
        if (!this.planList[index].id || this.planList[index].id.length === 0) {
          this.planList.splice(index, 1)
        }
        this.resetForm()
      }).catch(() => {})
    },
    clearList() {
      this.planList = []
      this.resetForm()
    },
    resetForm() {
      this.rowForm = {
        countryCode: '',
        countryName: '',
        lastMailCarrier: '',
        cargoType: '',
        outboundCarrier: '',
        customsAgent: '',
        airAgent: '',
        // billNo: '',
        boxQuantity: null,
        totalWeight: null,
        totalVolume: null,
        etd: '',
        flightNo: '',
        polCode: '',
        polName: '',
        podCode: '',
        podName: '',
        customsClearance: '',
        density: '',
        timeliness: '',
        remark: '',
        edit: false
      }
    },
    resetHeight() {
      this.tableHeight = document.querySelector('.right-main-wrapper').offsetHeight - 160
    },
    setCountryName(val) {
      this.rowForm.countryName = this.countryList.find(item => item.value === val).label
    }
  },
  created() { },
  mounted() {
    this.createForm.planTime = new Date().getTime()
    this.getWarehouseList()
    this.getCountryList()
    window.addEventListener('resize', this.throttle(this.resetHeight, 200, 300))
    this.$nextTick(() => {
      this.resetHeight()
    })
  }
}
</script>
<style lang="scss" scoped>
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
</style>
