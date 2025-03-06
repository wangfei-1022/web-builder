<template>
  <div class="contact-table">
    <el-button size="mini" type="primary" @click="addOrEditFn()" class="contact-add">
      {{$t("uexpressProduct.add_area")}}
    </el-button>

    <el-table class="yht-table" size="mini" ref="contactTable" :data="dataList" border style="width: 100%" >
      <el-table-column prop="index" :label='$t("uexpressProduct.seq")' min-width="70">
        <template slot-scope="{ $index }">
          <span>{{$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="areaRangeTypeName" :label='$t("uexpressProduct.area_range_type")' min-width="120"></el-table-column>
      <el-table-column prop="countryName" :label='$t("uexpressProduct.country_name")' min-width="120"></el-table-column>
      <el-table-column prop="zipcodeFrom" :label='$t("uexpressProduct.zipcode_from")' min-width="120">
         <template slot-scope="{row}">
          <span>{{row.areaRangeType !== 2 ? row.zipcodeFrom : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="zipcodeTo" :label='$t("uexpressProduct.zipcode_to")' min-width="120"></el-table-column>
      <el-table-column prop="zipcode" :label='$t("uexpressProduct.zipcode")' min-width="120">
        <template slot-scope="{row}">
          <span>{{row.areaRangeType === 2 ? (row.zipcodeFrom || row.zipcode) : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="regularExpressionString" :label='$t("uexpressProduct.regularExpressionString")' min-width="120" />
      <el-table-column prop="excludeDtoList" :label='$t("uexpressProduct.excludeDtoList")' min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-for="(item, index) in row.excludeDtoList" :key="index">{{item.areaName}}&nbsp;</span>
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label='$t("uexpressProduct.operation")' min-width="100">
        <template slot-scope="{row, $index}">
          <a class="link" @click="addOrEditFn(row, $index)">{{$t("uexpressProduct.edit")}}</a>
          <a class="link" @click="deleteFn($index)">{{$t("uexpressProduct.delete")}}</a>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" v-if="type === 'EDIT'" />

    <el-dialog :visible.sync="visible" v-if="visible" :close-on-click-modal="false" :append-to-body="true" width="500px" :title="addOrEditTitle">
      <el-form class="contact-form" ref="formRef" :model="form" :rules="formRule" label-width="100px" size="small">
        <el-form-item :label='$t("uexpressProduct.area_range_type")' prop="areaRangeType">
           <el-select v-model="form.areaRangeType" size="mini" style="width: 100%" filterable>
              <el-option v-for="item in areaRangeTypeList" :key="item.code" :label="item.name" :value="item.code"/>
            </el-select>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.country_name")' prop="countryCode">
           <el-select v-model="form.countryCode" size="mini" style="width: 100%" filterable>
              <el-option v-for="item in countryList" :key="item.code2" :label="item.chineseName" :value="item.code2"/>
            </el-select>
        </el-form-item>
        <el-form-item :label="form.areaRangeType === 3 ? $t('uexpressProduct.zipcode_from') : $t('uexpressProduct.zipcode_val')" prop="zipcodeFrom" v-if="form.areaRangeType == 3 || form.areaRangeType == 2">
          <el-input v-model="form.zipcodeFrom"></el-input>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.zipcode_to")' prop="zipcodeTo" v-if="form.areaRangeType === 3">
           <el-input v-model="form.zipcodeTo"></el-input>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.regularExpressionString")' prop="regularExpressionString" v-if="form.areaRangeType === 4">
           <el-input v-model="form.regularExpressionString"></el-input>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.excludeDtoList")' prop="excludeDtoListIds"  v-if="form.areaRangeType === 5">
          <el-select v-model="form.excludeDtoListIds" size="mini" style="width: 100%" filterable multiple>
              <el-option v-for="item in chargeAreaAllList" :key="item.areaId" :label="item.areaName" :value="item.areaId"/>
            </el-select>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.remark")' prop="remarks">
          <el-input type="textarea" v-model="form.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="visible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="confirmFn">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDictListApi } from "@/api/uexpress/base"
import { getCountryListApi } from "@/api/country";
import { getAllAreaChannelApi } from "@/api/uexpress/base";
import { getAllChargeAreaListApi } from "@/api/uexpress/priceCardTemplate";

export default {
	name: "AreaComponent",
	props: {
    // 分区类型 AP_CHARGE_AREA 成本报价分区 AR_CHARGE_AREA 应收报价分区
		areaType: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: ''
		},
		supplierId: {
			type: String,
			default: ''
		},
		getListApi: {
			type: Function,
			default: function() {
        return function() {}
      }
		},
		addApi: {
			type: Function,
			default: function() {
        return function() {}
      }
		},
		updateApi: {
			type: Function,
			default: function() {
        return function() {}
      }
		},
		deleteApi: {
			type: Function,
			default: function() {
        return function() {}
      }
		}
	},
	data() {
		return {
      pageSize: 50,
			pageNum: 1,
			total: 0,

			index: null,
			visible: false,
			addOrEditTitle: "",
			dataList: [],
			form: {
				areaRangeType: "",
        areaRangeTypeName: "",
				countryCode: "",
				zipcodeFrom: '',
				zipcodeTo: "",
        regularExpressionString: '',
        excludeDtoListIds: [],
				remarks: ""
			},
			multipleSelection: [],
			postList: [],
			postMap: {},
			formRule: {
				areaRangeType: [{required: true,	message: this.$t("common.cannot_be_null")}],
				countryCode: [{required: true,	message: this.$t("common.cannot_be_null")}],
        zipcodeFrom: [{required: true,	message: this.$t("common.cannot_be_null")}],
        zipcodeTo: [{required: true,	message: this.$t("common.cannot_be_null")}],
        excludeDtoListIds: [{required: true,	message: this.$t("common.cannot_be_null")}],
        regularExpressionString: [{required: true,	message: this.$t("common.cannot_be_null")}]
			},
			countryList: [],
      areaRangeTypeList: [],
      areaRangeTypeMap: {},
      chargeAreaAllList: []
		};
	},
  watch: {
    supplierId: {
      handler(val) {
        // 应收使用的是渠道分区 - areaType 为 1的时候是成本的计费分区
        if (val && this.areaType === 'AP_CHARGE_AREA') {
          let data = {
            areaType: 1, 
            supplierId: val, 
            areaState: 2
          }
          getAllAreaChannelApi(data).then(res => {
            if (res.ok) {
              this.chargeAreaAllList = res.content;
            }
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
	created() {
		this.getBaseDataFn()
    this.areaId = this.$route.query.id
    if (this.areaId) {
      this.getList()
    }
    if(this.areaType === 'AR_CHARGE_AREA') {
      let data = {
        areaType: 1,
        areaState: 2
      }
      getAllChargeAreaListApi(data).then(res => {
       if (res.ok) {
        this.chargeAreaAllList = res.content;
      }})
    }
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictListApi(47), getCountryListApi()]).then(results => {
				const areaRangeTypeRes = results[0]
        const countryRes = results[1]
				if (areaRangeTypeRes.ok) {
					this.areaRangeTypeList = areaRangeTypeRes.content
          let areaRangeTypeMap = {}
          this.areaRangeTypeList.forEach(v => {
            areaRangeTypeMap[v.code] = v.name
          })
          this.areaRangeTypeMap = areaRangeTypeMap
				}
				if (countryRes.ok) {
					this.countryList = countryRes.content
				}
			})
		},
		getList() {
      let data = {
        areaId: this.areaId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.getListApi(data).then(res => {
        if (res.ok) {
          this.dataList = res.content.list
          this.total = res.content.total
        }
      })
		},
		getValue() {
			let arr = this.dataList
			return arr
		},
		confirmFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					this.visible = false;
          this.form.areaRangeTypeName = this.areaRangeTypeMap[this.form.areaRangeType]
          this.countryList.forEach(v => {
            if (v.code2 === this.form.countryCode) {
              this.form.countryName = v.chineseName
            }
          })
          let excludeDtoList = []
          this.chargeAreaAllList.forEach(v => {
            if (this.form.excludeDtoListIds.indexOf(v.areaId) >= 0) {
              excludeDtoList.push({
                areaId: v.areaId,
                areaCode: v.areaCode,
                areaName: v.areaName
              })
            }
          })
          let data = {
            ...this.form,
            areaId: this.areaId,
            excludeDtoList: excludeDtoList
          }
					// 当这种情况 是直接调用接口 进行联系人的新增
					if (this.areaId) {
            let fn = this.form.areaRangeId ? this.updateApi : this.addApi
            let msg = this.form.areaRangeId ? this.$t("uexpressProduct.edit_success") : this.$t("uexpressProduct.add_success");
						fn(data).then(res => {
							if (res.ok) {
								this.$message.success(msg)
								this.getList()
							}
						})
					} else {
						if (this.index !== null && this.index >= 0) {
							this.dataList.splice(this.index, 1, data);
						} else {
							this.dataList.push(data);
						}
					}
				}
			})
		},
		addOrEditFn(item, index) {
			if (item) {
				this.index = index
        let excludeDtoListIds = []
        if(item.excludeDtoList){
          item.excludeDtoList.forEach(v => {
            excludeDtoListIds.push(v.areaId)
          })
        }
				this.form = {
					...this.form,
					...item,
          excludeDtoListIds: excludeDtoListIds
				};
        if (item.areaRangeType === 2) {
          this.form.zipcodeFrom = item.zipcode
        }
				this.addOrEditTitle = this.$t("uexpressProduct.edit")
			} else {
				this.index = null
				this.form = {
					areaRangeType: "",
          countryCode: "",
          zipcodeFrom: '',
          zipcodeTo: "",
          remarks: "",
          excludeDtoListIds: []
				};
				this.addOrEditTitle = this.$t("uexpressProduct.add")
			}
			this.visible = true;
		},
		deleteFn(index) {
       this.$confirm(this.$t("uexpressProduct.delete_info_confirm"), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        let item = this.dataList[index]
				if (item.areaRangeId) {
					this.deleteApi({areaRangeId: item.areaRangeId}).then(res => {
						if (res.ok && !res.content) {
							this.dataList.splice(index, 1)
							this.deleteVisible = false
              this.$message.success(this.$t("uexpressProduct.delete_success"))
						}
					})
				} else {
					this.dataList.splice(index, 1)
					this.deleteVisible = false
				}
      }).catch(() => {})
		}
	}
};
</script>
<style scoped lang="scss">
.contact-table {
	position: relative;
}
.contact-add {
	position: absolute;
	right: 10px;
	top: -55px;
}

.link {
	color: #1890ff;
}
.contact-form {
	::v-deep .el-form-item {
		width: 100% !important;
	}
}
</style>
