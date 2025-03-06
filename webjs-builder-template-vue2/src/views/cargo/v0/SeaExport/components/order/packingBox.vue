<template>
<el-form :inline="true" :model="item" @submit.native.prevent ref="containerListForm" v-loading="loading">

  <div  style="position: relative;padding-top: 30px">
    <div class="flex-bet" >
      <el-form-item :label="$t('sea.containerNo')" prop="containerNo" :rules="[{ required: true, message: $t('blInfo.containerNoError'), trigger: 'blur',validator:validateContainerNo(item), trigger: 'change' },]">
        <el-input v-trim v-model="item.containerNo" :disabled="item.disabled || !!item.NIL" v-input-auto="'EN_num_symbol'" maxlength="100" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
        <el-radio v-model="item.NIL" label="NIL" @click.native.prevent="NILClick" :disabled="item.disabled" style="margin-top: 30px">NIL</el-radio>
      </el-form-item>
      <span>{{ item.containerType }}</span>
      <span>{{ item.ownerType === 1 ? 'SOC' : 'COC'}}</span>
      <el-form-item :label="$t('sea.sealNo')" prop="sealNo" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur'},]">
        <el-input v-trim v-model="item.sealNo" :disabled="item.disabled || !!item.NIL" v-input-auto="'EN_num'" maxlength="30" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
      </el-form-item>
      <div>
        <div style="display: flex">
          <el-form-item :label="$t('sea.vgmWeight')" prop="vgmWeight">
            <el-input v-trim v-model="item.vgmWeight" :disabled="item.disabled" v-input-limit="[6,3]" maxlength="10" size="mini" :placeholder="$t('sea.pleaseEnter')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sea.vgmMode')" prop="vgmMode">
            <el-radio-group v-model="item.vgmMode" :disabled="item.disabled">
              <el-tooltip class="item" effect="dark" :content="$t('sea.overall')" placement="top-start"><el-radio :label="1"></el-radio></el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('sea.cumulative')" placement="top-start"><el-radio :label="2"></el-radio></el-tooltip>
            </el-radio-group>
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item :label="$t('sea.responsibleParty')" prop="responsibleParty" style="margin-left: 70px;">
            <el-autocomplete
              v-model="item.responsibleParty"
              :disabled="item.disabled"
              :fetch-suggestions="querySearchAsync"
              :placeholder="$t('sea.pleaseEnter')"
              @select="handleSelect"
              size="mini"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item :label="$t('sea.authorizer')" prop="authorizedPerson" style="margin-left: 23px;">
            <el-autocomplete
              v-model="item.authorizedPerson"
              :disabled="item.disabled"
              :fetch-suggestions="querySearch"
              :placeholder="$t('sea.pleaseEnter')"
              @select="handleSelect"
              size="mini"
            ></el-autocomplete>

          </el-form-item>
        </div>
      </div>

      <div v-if="item.jobState !== 20" style="width: 200px">
        <template v-if="!item.disabled">
          <i class="icon el-icon-folder-checked blue" @click="save(item)" style="margin-right: 10px"></i>
          <i class="icon el-icon-folder-delete red"  @click="noSave()"></i>
        </template>
        <template v-else-if="[30,40,50,80].indexOf(orderState)>-1">
          <!--                    <el-button type="text" :disabled="true" @click="editContainer(item,index)" style="margin-right: 10px"><i class="icon el-icon-edit blue"></i></el-button>-->
          <!--                    <el-button type="text" :disabled="isDisabled" @click="deletContainer(item.id,index)"><i class="icon el-icon-delete red"></i></el-button>-->


          <el-tooltip :content="$t('sea.edit')" placement="top">
            <el-button v-if="orderDetailsData.isUnlocked" type="primary" icon="el-icon-edit" circle :disabled="isDisabled" @click="editContainer()"></el-button>
          </el-tooltip>
          <el-tooltip :content="$t('sea.delete')" placement="top">
            <el-button v-if="orderDetailsData.isUnlocked && !item.containerNo" type="danger" icon="el-icon-delete" circle :disabled="isDisabled" @click="deletContainer(item.id,item)"></el-button>
          </el-tooltip>
          <el-tooltip v-if="orderDetailsData.isUnlocked && item.containerNo" :content="$t('sea.exitCustoms')" placement="top">
            <el-button type="danger" icon="el-icon-document-delete" circle :disabled="isDisabled" @click="exitCustomsContainer(item)" style="margin-right: 10px"></el-button>
          </el-tooltip>

        </template>

      </div>
    </div>

    <el-table class="case-data-table" :data="item.cargoList">
      <el-table-column>
        <template slot="header">
          <span class="red">*</span>SO
        </template>
        <template slot-scope="{row,$index}">
          <el-form-item label="" :prop="'cargoList.' + $index + '.soNo'" :rules="[{ required: true, message: $t('blInfo.placeholder'), trigger: 'change'},]">
            <el-select v-model="row.soNo" :disabled="item.disabled" filterable size="mini" >
              <el-option v-for="(opt,index) in packingForm.soList" :key="index" :label="opt" :value="opt" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          <span class="red">*</span>HS CODE
        </template>
        <template slot-scope="{row,$index}">
          <el-form-item label="" :prop="'cargoList.' + $index + '.hscode'" :rules="[{ required: true, trigger: 'change'},]">
<!--            <el-input v-trim v-model="row.hscode" :disabled="item.disabled" size="mini" type="number" maxlength="255" />-->
            <div class="el-input el-input--mini">
              <input v-model.lazy="row.hscode" :disabled="item.disabled" @blur="validateInput('cargoList.' + $index + '.hscode')" size="mini" type="number" maxlength="500" class="el-input__inner" :class="{disabled:item.disabled}" />
            </div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          <span class="red">*</span>{{ $t('sea.number')  }}
        </template>
        <template slot-scope="{row,$index}">
          <el-form-item label="" :prop="'cargoList.' + $index + '.quantity'" :rules="[{ required: true, trigger: 'change'},]">
<!--            <el-input v-trim v-model="row.quantity" :disabled="item.disabled" size="mini" v-input-limit="[99,0]" maxlength="255" />-->
            <div class="el-input el-input--mini">
              <input v-model.lazy="row.quantity" :disabled="item.disabled" @blur="validateInput('cargoList.' + $index + '.quantity')" size="mini" v-input-limit="[9,0]" maxlength="255" class="el-input__inner" :class="{disabled:item.disabled}" />
            </div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          <span class="red">*</span>{{ $t('sea.packageType')  }}
        </template>
        <template slot-scope="{row,$index}">
          <el-form-item label="" :prop="'cargoList.' + $index + '.packageType'" :rules="[{ required: true, trigger: 'change'},]">
            <PackageTypeSelect :packageTypeList="packageTypeList" v-model="row.packageType" :disabled="item.disabled"></PackageTypeSelect>
          </el-form-item>
        </template>
      </el-table-column>
      <!--            毛重(KGS)-->
      <el-table-column>
        <template slot="header">
          <span class="red">*</span>{{ $t('sea.grossWeight')  }}
        </template>
        <template slot-scope="{row,$index}">
          <el-form-item label="" :prop="'cargoList.' + $index + '.grossWeight'" :rules="[{ required: true, trigger: 'blur'},]">
<!--            <el-input v-trim v-model="row.grossWeight" :disabled="item.disabled" size="mini" v-input-limit="[99,3]" maxlength="255" class="el-input__inner"/>-->
            <div class="el-input el-input--mini">
              <input v-model.lazy="row.grossWeight" :disabled="item.disabled" @blur="validateInput('cargoList.' + $index + '.grossWeight')" size="mini" v-input-limit="[6,3]" maxlength="255" class="el-input__inner" :class="{disabled:item.disabled}"/>
            </div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          <span class="red">*</span>{{ $t('sea.volume')  }}
        </template>
        <template slot-scope="{row,$index}">
          <el-form-item label="" :prop="'cargoList.' + $index + '.volume'" :rules="[{ required: true, trigger: 'blur'},]">
<!--            <el-input v-model.lazy="row.volume" :disabled="item.disabled" size="mini" v-input-limit="[99,3]" maxlength="255" class="el-input__inner"/>-->
            <div class="el-input el-input--mini">
              <input v-model.lazy="row.volume" :disabled="item.disabled" @blur="validateInput('cargoList.' + $index + '.volume')" size="mini" v-input-limit="[6,3]" maxlength="255" class="el-input__inner" :class="{disabled:item.disabled}"/>
            </div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          <span class="red">*</span>{{ $t('sea.marks')  }}
        </template>
        <template slot-scope="{row,$index}">
          <el-form-item label="" :prop="'cargoList.' + $index + '.cargoDesc'" :rules="[{ required: true, trigger: 'blur'},]">
<!--            <el-input v-trim v-model="row.cargoDesc" :disabled="item.disabled" size="mini" v-input-limit="[99,3]" maxlength="255" />-->
            <div class="el-input el-input--mini">
              <input v-model.lazy="row.cargoDesc" :disabled="item.disabled" @blur="validateInput('cargoList.' + $index + '.cargoDesc')" size="mini" maxlength="60" class="el-input__inner" :class="{disabled:item.disabled}"/>
            </div>
          </el-form-item>
        </template>
      </el-table-column>
<!--       巴西木包装类型”字段仅在订舱信息的交货地中含有"Brazil"字眼时出现在页面中，不满足此条件则隐藏该字段-->
      <el-table-column v-if="isBrazil" :label=" $t('sea.brazilianWoodPackagingTypes')">
        <template slot-scope="{row,$index}">
          <el-form-item label="" :prop="'cargoList.' + $index + '.brazilPackageType'" >
            <el-select v-model="row.brazilPackageType" :disabled="item.disabled" filterable size="mini" >
              <el-option label="Wood-Treated and certified" value="Wood-Treated and certified" />
              <el-option label="Wood-Processed" value="Wood-Processed" />
              <el-option label="Wood-Not-treated and not-certified" value="Wood-Not-treated and not-certified" />
            </el-select>

          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="{row,$index}">
          <template v-if="!item.disabled">
            <el-button type="text" size="mini" :disabled="item.disabled" v-show="item.cargoList.length<50" @click="addCargo()">
              <i  class="icon el-icon-circle-plus blue" ></i>
            </el-button>
            <el-button type="text" size="mini" :disabled="item.disabled" v-show="item.cargoList.length<50" @click="addCopy(row)">
              <i  class="icon el-icon-document-copy blue" ></i>
            </el-button>
            <el-button type="text" size="mini" :disabled="item.disabled" v-show="item.cargoList.length>1" @click="delCargo($index)">
              <i  class="icon el-icon-remove red" ></i>
            </el-button>
          </template>
        </template>
      </el-table-column>

    </el-table>
    <img v-if="item.jobState === 20" src="@/assets/fail.png" style="width:100px; position: absolute; right: 0; top: 50px">
  </div>
</el-form>
</template>
<script>
import {validContainerNo, validContainerNo53HC} from "@/utils/validate"
import {
  delContainerApi,
  exitCustomsContainerApi,
  getRecentAuthorizedPersonApi,
  getRecentResponsiblePartyApi,
  loadJobApi
} from "@/api/seaExportOrder"
import lodash from 'lodash'
import PackageTypeSelect from "@/views/cargo/v0/SeaExport/components/order/packageTypeSelect"
import {getCompanyListByOwnApi} from "@/api/partner/member";
import orderMixin from './orderMixin'

export default {
  name: 'PackingBox',
  mixins: [orderMixin],
  components: { PackageTypeSelect },
  props: {
    value: { type: String, default: null },
    listData: { type: Object, default: () => {} },
    orderState: { type: Number, default: null },
    packingForm: { type: Object, default: () => {} },
    packageTypeList: { type: Array, default: () => [] },
    index: { type: Number, default: null },
    bookingJobData: { type: Object, default: () => {} },
    orderDetailsData: { type: Object, default: function(){ return {} } }
  },
  computed: {
    isBrazil() {
     if (this.bookingJobData.destinationCode) {
       return this.bookingJobData.destinationCode.indexOf('Brazil') > -1
     }if (this.bookingJobData.podCode) {
        return this.bookingJobData.podCode.indexOf('BR') > -1
      } else {
       return false
     }
    }
  },
  data() {
    return {
      loading: false,
      isDisabled: false,
      item: {},
      restaurants:[]
    }
  },
  watch: {
    listData() {
      if (this.$isEmpty(this.item)) {
        this.item = this.listData
      }
    }
  },
  created() {
    this.item = this.listData
    if(this.item.containerNo === 'NIL'){
      this.$set(this.item,'NIL','NIL')
    }
  },
  methods: {
    NILClick(){
      if(this.item.disabled){
        return
      }
      if(this.item.NIL){
        this.$set(this.item,'NIL',null)
        this.$set(this.item,'containerNo',null)
        this.$set(this.item,'sealNo',null)
      }else{
        this.$set(this.item,'NIL','NIL')
        this.$set(this.item,'containerNo','NIL')
        this.$set(this.item,'sealNo','NOSEAL')
        this.$refs.containerListForm.clearValidate('containerNo')

      }
    },
    selChange(val) {
      this.$emit('input', val)
    },
    validateContainerNo(item) {

      return (rule, value, callback) => {
        if(item.NIL){
          this.$refs.containerListForm.clearValidate('containerNo')
          callback()
        }else{
          if (item === '53HC' ? !validContainerNo53HC(value) : !validContainerNo(value)) {
            callback(new Error(this.$t('blInfo.containerNoError')))
          } else {
            callback()
          }
        }

      }
    },
    async addCargo() {
      let soNo = null
      if (this.packingForm.soList.length === 1) {
        soNo = this.packingForm.soList[0]
      }
      this.item.cargoList.push({
        soNo: soNo, //
        hscode: null, //
        quantity: null, // 重量
        packageType: null, //  包装单位
        grossWeight: null, //
        volume: null, //
        cargoDesc: null //
      })
      // this.loading = true
      // const res = await delContainerApi(id)
      // if (res) {
      //   this.loading = false
      // }
    },
    addCopy(row) {
      const rowCoyy = lodash.cloneDeep(row)
      rowCoyy.id = null
      this.item.cargoList.push(rowCoyy)
    },
    async delCargo(index) {
      this.item.cargoList.splice(index, 1)
    },
    editContainer() {
      this.searchAuthorized()
      this.editCopy = lodash.cloneDeep(this.item)
      if (this.packingForm.soList.length === 1) {
        const soNo = this.packingForm.soList[0]
        this.item.cargoList.map(val => {
          if (!val.soNo) {
            val.soNo = soNo
          }
        })
      }
      this.item.disabled = false
      this.isDisabled = true
    },
    async save(item, index) {
      this.$refs.containerListForm.validate(async valid => {
        if (valid) {
          const isBlJobId = item.cargoList.some(val => val.blJobId)
          if (isBlJobId) {
            this.$confirm(this.$t('sea.containerIsAssociatedWithBill'), this.$t('sea.tips'), {
              confirmButtonText: this.$t('sea.determine'),
              cancelButtonText: this.$t('sea.cancel'),
              type: 'warning'
            }).then(async() => {
              this.saveApi()
            })
          } else {
            this.saveApi()
          }

        } else {
          this.mixinsFormScrollIntoView()
          return false
        }
      })

    },
    async saveApi() {
      this.loading = true
      const res = await loadJobApi(this.item)
      this.loading = false
      if (res.ok) {
        this.item.disabled = !this.item.disabled
        // this.getContainerGather(this.bookingJobId)
        this.$emit('changeContainer')
        this.$message.success(this.$t('sea.successSaved'))
        this.isDisabled = false
        // this.$emit('change', '1')
      }
    },
    noSave() {
      this.$refs.containerListForm.clearValidate()
      this.isDisabled = false
      this.item = this.editCopy
      // this.$set(this.containerListForm.containerList, index, this.editCopy)

    },
    // 删除箱子
    async deletContainer(id) {
      this.$confirm(this.$t('sea.deletedContainersCannotBeRecovered'), this.$t('sea.tips'), {
        confirmButtonText: this.$t('sea.determine'),
        cancelButtonText: this.$t('sea.cancel'),
        type: 'warning'
      }).then(async() => {
        this.deletContainerASpi(id)
      })

    },
    async deletContainerASpi(id) {
      this.loading = true
      const res = await delContainerApi(id)
      this.loading = false
      if (res.ok) {
        this.$emit('deletContainer')
        // this.containerListForm.containerList.splice(index, 1)
        // this.getContainerGather(this.bookingJobId)
      }
    },
    // 退关 blJobId cargoList
    exitCustomsContainer(item) {
      const isBlJobId = item.cargoList.some(val => !!val.blJobId)
      // 已关联
      let tips
      if (isBlJobId) {
        tips = this.$t('sea.linkedOut')
      } else {
        tips = this.$t('sea.unconnectedExit')
      }
      this.$confirm(tips, this.$t('sea.tips'), {
        confirmButtonText: this.$t('sea.determine'),
        cancelButtonText: this.$t('sea.cancel'),
        type: 'warning'
      }).then(async() => {
        this.getExitCustomsContainerApi(item.id)
      })
    },
    async getExitCustomsContainerApi(id) {
      this.loading = true
      const res = await exitCustomsContainerApi([id])
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.exitSuccessfully'))
        this.$emit('changeContainer', 2) // type = 2 退关 重新刷新列表
      }

    },
    handleSelect(val){
      this.searchAuthorized()
    },
    querySearchAsync(queryString, cb) {
      let params = {
        responsibleParty: queryString || null
      }
      getRecentResponsiblePartyApi(params).then(res => {
        if (res.ok) {
          let results = res.content
          res.content.map(v=> {
            results.push({
              value: v,
              id: v
            })
          })
          cb(results)
        }
      })
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    searchAuthorized() {
      if(!this.item.responsibleParty){
        return
      }
      let params = {
        responsibleParty: this.item.responsibleParty
      }
      getRecentAuthorizedPersonApi(params).then(res => {
        if (res.ok) {
          let results = []
          res.content.map(v=> {
            results.push({
              value: v,
              id: v
            })
          })
          this.restaurants = results
          if(res.content.length === 1){
            this.$set(this.item,'authorizedPerson',res.content[0])
          }

        }
      })
    },
    validateInput(validate) {
      this.$refs.containerListForm.validateField(validate, valid => {

      })
    }
  }
}
</script>
<style lang="scss" scoped>
.icon{ font-size: 28px; transition: all 0.2s ease 0s; cursor: pointer;user-select: none;
  &:hover{ transform: scale(1.1)}
}
.blue{ color: #1890ff}
.red{color: #ff4949}
.flex-bet{ display: flex; align-items:flex-start ; justify-content: space-between;flex-wrap:wrap;}
.box_title{ border-left: solid 3px rgb(24,144,255);font-size: 18px; color: #199ED8; padding-left: 8px; height: 28px; line-height: 28px; margin:5px 0 8px 0; display: flex;
  .operate-buttons-left{ margin-left: 20px}
}
.box{ background-color: #f5f7f7; padding: 8px;
  ::v-deep .el-form-item--medium{
    .el-form-item__content{ line-height: 28px}
    .el-form-item__label{ line-height: 28px}
  }
}
.box_child{border: solid 1px rgba(121, 121, 121, 1); padding: 20px 30px; background: #fff; margin-bottom: 15px;
  .box25{ width: 20%}
}
::v-deep .el-form--inline .el-form-item{ display: block}
//**
.case-data-table{ width: 90%;
  ::v-deep {
    .el-form-item{ margin: 10px 0}
    .el-form-item__error{ display: none;}
  }
}

.el-input__inner.disabled {
  background-color: #F5F7FA;
  border-color: #dfe4ed;
  color: #606266 ;
  cursor: not-allowed;
}

</style>
