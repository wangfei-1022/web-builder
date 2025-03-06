<template>
  <div>
    <div class="info-section-module">
      <div class="info-title">
        <span>{{$t("uexpressPriceCard.feeItemConfig")}}</span>
        <span style="margin-left: 20px;">
          <el-button type="primary" @click="addChargeItem" size="mini">{{$t("uexpressPriceCard.addFeeItem")}}</el-button>
        </span>
      </div>
      <div class="info-content">
        <el-table :data="templateChargesList" border style="width: 100%">
          <el-table-column prop="ruleNo" :label="$t('uexpressPriceCard.ruleNo')" min-width="150"></el-table-column>
          <el-table-column prop="categoryName" :label="$t('uexpressPriceCard.category')" min-width="150"></el-table-column>
          <el-table-column prop="feeItemName" :label="$t('uexpressPriceCard.feeItem')" min-width="150"></el-table-column>
          <el-table-column prop="attributeCommodityName" :label="$t('uexpressPriceCard.attributeCommodityName')" min-width="120"></el-table-column>
          <el-table-column prop="attributeChargeName" :label="$t('uexpressPriceCard.attributeChargeName')" min-width="120"></el-table-column>
          <el-table-column prop="chargeByArea" :label="$t('uexpressPriceCard.chargeByArea')" min-width="120">
            <template slot-scope="{ row }">
              <el-select v-model="row.chargeByArea" size="mini" style="width: 100%">
                <el-option :label="$t('uexpressPriceCard.YES')" :value="true" />
                <el-option :label="$t('uexpressPriceCard.NO')" :value="false" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="areaCodes" :label="$t('uexpressPriceCard.area')" min-width="180">
            <template slot-scope="{ row }">
              <div v-if="row.chargeByArea">
                <el-select v-model="row.areaCodes" size="mini" style="width: 100%" multiple filterable>
                  <el-option v-for="item in chargeAreaAllList" :key="item.id" :label="item.areaName" :value="item.areaCode" />
                </el-select>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column prop="reDeliveryFlag" :label="$t('uexpressPriceCard.reDeliveryFlag')" min-width="120">
            <template slot-scope="{ row }">
              <el-select v-model="row.reDeliveryFlag" size="mini" style="width: 100%">
                <el-option :label="$t('uexpressPriceCard.YES')" :value="true" />
                <el-option :label="$t('uexpressPriceCard.NO')" :value="false" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="ounceFlag" :label="$t('uexpressPriceCard.ounceFlag')" min-width="140" v-if="form.unitGroup === 2 && form.ounceFlag">
            <template slot-scope="{ row }">
              <el-select v-model="row.ounceFlag" size="mini" style="width: 100%">
                <el-option :label="$t('uexpressPriceCard.YES')" :value="true" />
                <el-option :label="$t('uexpressPriceCard.NO')" :value="false" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="operation" :label="$t('uexpressPriceCard.operation')" min-width="100" fixed="right">
            <template slot-scope="{ row, $index}">
              <el-button type="text" @click="deleteClick(row, $index)">{{$t('uexpressPriceCard.delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="addItemVisible" :close-on-click-modal="false" width="1000px" title='费用项选择'>
			<el-form class="contact-form" ref="batchImportRef" :model="addSearchForm" :inline="true" label-width="100px" size="mini">
				<el-form-item :label='$t("uexpressChargeItem.category")' prop="categoryCode">
					<el-input v-model="addSearchForm.categoryCode"></el-input>
				</el-form-item>
				<el-form-item :label='$t("uexpressChargeItem.feeItem")' prop="feeItemCode">
					<el-input v-model="addSearchForm.feeItemCode"></el-input>
				</el-form-item>
        <el-button size="mini" type="primary" @click="getChargeItemList">{{ $t("common.searchBtn") }}</el-button>
			</el-form>
			<el-table :data="chargeItemList" style="width: 100%" border height="400" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="ruleNo" :label="$t('uexpressPriceCard.ruleNo')" min-width="150"></el-table-column>
				<el-table-column prop="categoryName" :label="$t('uexpressPriceCard.category')" min-width="130"></el-table-column>
				<el-table-column prop="feeItemCode" :label="$t('uexpressPriceCard.feeItemCode')" min-width="130"></el-table-column>
				<el-table-column prop="feeItemName" :label="$t('uexpressPriceCard.feeItem')" min-width="130"></el-table-column>
				<el-table-column prop="attributeCommodityName" :label="$t('uexpressPriceCard.attributeCommodityName')" min-width="150"></el-table-column>
				<el-table-column prop="attributeChargeName" :label="$t('uexpressPriceCard.attributeChargeName')" min-width="120"></el-table-column>
				<el-table-column prop="desc" :label="$t('uexpressPriceCard.desc')" min-width="200"></el-table-column>
			</el-table>
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getChargeItemList" />
			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="addItemVisible = false">{{ $t("common.cancel") }}</el-button>
				<el-button size="mini" type="primary" @click="addItemConfirmFn">{{ $t("common.confirm") }}</el-button>
			</div>
		</el-dialog>
  </div>
</template>
<script>
import { getAllChargeAreaListApi } from "@/api/uexpress/priceCardTemplate";
import { getAllAreaChannelApi } from "@/api/uexpress/base";
import { getChargeRulesListApi } from "@/api/uexpress/chargeItem";
export default {
	name: "UexpressPriceCardTemplateChargeItemConfig",
	props: {
    supplierId: {
      type: String,
      default: ''
    },
    arAp: {
      type: Number,
      default: 0
    },
    form: {
      type: Object,
      default: function () {
        return {}
      }
    },
    templateCharges: {
      type: Array,
      default: function () {
        return []
      }
    }
	},
  watch: {
    templateCharges(val) {
      let arr = []
      val.forEach(v => {
        let obj = {
          ...v
        }
        let areaCodes = []
        v.areas.forEach(v => {
          areaCodes.push(v.areaCode)
        })
        obj.areaCodes = areaCodes
        arr.push(obj)
      })
      this.templateChargesList = arr
    },
    form: {
      handler(val) {
        // 应收使用的是渠道分区 - areaType 为 1的时候是成本的计费分区
        this.getBaseDataFn()
      },
      deep: true,
      immediate: true
    }
  },
	data() {
		return {
      chargeAreaAllList: [],
      templateChargesList: [],
      // 添加费用项
      chargeItemList: [],
      total: 0,
      pageSize: 50,
      pageNum: 1,
      addItemVisible: false,
      addSearchForm: {
        categoryCode: '',
        feeItemCode: ''
      }
		};
	},
	created() {
    this.getBaseDataFn()
  },
	methods: {
    getBaseDataFn() {
      if (this.arAp === 1) {
        let data = {
          areaType: 1,
          areaState: 2
        }
        // 应收使用的是产品分区 - areaType 为 1的时候是应收的计费分区
        getAllChargeAreaListApi(data).then(res => {
          if (res.ok) {
            this.chargeAreaAllList = res.content;
          }
        })
      } else {
        // 应收使用的是渠道分区 - areaType 为 1的时候是成本的计费分区
        if (this.form.supplierId) {
          let data = {
            areaType: 1, 
            supplierId: this.form.supplierId,
            areaState: 2
          }
          getAllAreaChannelApi(data).then(res => {
            if (res.ok) {
              this.chargeAreaAllList = res.content;
            }
          })
        }
      }
		},
    validate() {
      let VALID = true
      let templateChargesList = []
      let duplicateArr = []
      this.templateChargesList.forEach(v => {
        if (v.chargeByArea === true && v.areaCodes.length === 0) {
          VALID = false
        }
        templateChargesList.push({
          ruleNo: v.ruleNo,
          desc: v.desc,
          chargeByArea: v.chargeByArea,
          reDeliveryFlag: v.reDeliveryFlag,
          areaCodes: v.areaCodes || [],
          chargeRuleNo: v.ruleNo,
          ounceFlag: this.form.unitGroup === 2 ? v.ounceFlag : null
        })
        duplicateArr.push({
          ruleNo: v.ruleNo,
          chargeByArea: v.chargeByArea,
          reDeliveryFlag: v.reDeliveryFlag,
          ounceFlag: this.form.unitGroup === 2 ? v.ounceFlag : null
        })
      })

      let unRepeatArr = Array.from(new Set(duplicateArr.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
      // 存在相同的费用项且属性设置一样
      if (unRepeatArr.length !== duplicateArr.length) {
        this.$message.error(this.$t("uexpressPriceCard.existSaveAttributeFeeItem"))
        return
      }

      // 请先将分区信息填写完整！
      if (!VALID) {
        this.$message.error(this.$t("uexpressPriceCard.pleaseInputAreaInfo"))
        return
      }
      return VALID
    },
    getValue() {
      let templateChargesList = []
      this.templateChargesList.forEach(v => {
        templateChargesList.push({
          ruleNo: v.ruleNo,
          desc: v.desc,
          chargeByArea: v.chargeByArea,
          reDeliveryFlag: v.reDeliveryFlag,
          areaCodes: v.areaCodes || [],
          chargeRuleNo: v.ruleNo,
          ounceFlag: this.form.unitGroup === 2 ? v.ounceFlag : null
        })
      })
      return templateChargesList
    },
    addChargeItem() {
      this.addItemVisible = true
      this.getChargeItemList()
    },
    getChargeItemList() {
      let params = {
        ...this.addSearchForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        arAp: this.arAp
      }
      getChargeRulesListApi(params).then(res => {
        if (res.ok) {
          this.chargeItemList = res.content.list
          this.total = res.content.total
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addItemConfirmFn() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请先选择一行')
        return
      }
      // 添加
      this.addItemVisible = false
      this.multipleSelection.forEach(v => {
        let obj = {
          ...v,
          chargeByArea: false,
          ounceFlag: false,
          reDeliveryFlag: false,
          areaCodes: []
        }
        this.templateChargesList.push(obj)
      })
    },
    deleteClick(row, index) {
      this.templateChargesList.splice(index, 1)
    }
  }
};
</script>
<style scoped lang="scss">
::v-deep .el-form-item {
  width: auto!important;
  float: none!important;
}
</style>
