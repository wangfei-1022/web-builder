<template>
  <div class="contact-table">
    <el-button size="mini" type="primary" @click="addOrEditFn()" class="contact-add" v-if="type != 'DETAIL'">
      {{$t("uexpressProduct.add_product_line")}}
    </el-button>

    <el-table ref="contactTable" :data="dataList" border style="width: 100%" >
      <el-table-column prop="index" :label='$t("uexpressProduct.seq")' min-width="60">
        <template slot-scope="{$index}">
          <span>{{$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="departureAreaName" :label='$t("uexpressProduct.departure_area_name")' min-width="150"></el-table-column>
      <el-table-column prop="destinationAreaName" :label='$t("uexpressProduct.destination_area_name")' min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="timerStr" :label='$t("uexpressProduct.ageing")' min-width="120">
         <template slot-scope="{row}">
          <span>{{row.fastest}}-{{row.slowest}}{{row.limitationTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="effectiveDate" :label='$t("uexpressProduct.effective_date")' min-width="160">
         <template slot-scope="{row}">
          <span>{{row.effectiveDate | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productLineStateName" :label='$t("uexpressProduct.state")' min-width="120"></el-table-column>
      <el-table-column prop="channelBaseInfos" :label='$t("uexpressProduct.channel")' min-width="220">
        <template slot-scope="{row}">
          <div v-for="(item, index) in row.channelBaseInfos" :key="index">
            <span>{{item.channelName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label='$t("uexpressProduct.operation")' min-width="120" fixed="right" v-if="type != 'DETAIL'">
        <template slot-scope="{row, $index}">
          <a class="link" @click="addOrEditFn(row, $index)">{{$t("uexpressProduct.edit")}}</a>
          <a class="link" v-if="row.productLineState == 2" @click="ableFn(row, false)">{{$t("uexpressProduct.disabled")}}</a>
          <a class="link" v-if="row.productLineState == 3" @click="ableFn(row, true)">{{$t("uexpressProduct.enabled")}}</a>
          <a class="link" @click="deleteFn(row, $index)">{{$t("uexpressProduct.delete")}}</a>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="visible" v-if="visible" :close-on-click-modal="false" :append-to-body="true" width="500px" :title="addOrEditTitle">
      <el-form class="contact-form" ref="formRef" :model="form" :rules="formRule" label-width="100px" size="mini">
        <el-form-item :label='$t("uexpressProduct.departure_area_name")' prop="departureAreaCode">
           <el-select v-model="form.departureAreaCode" size="mini" style="width: 100%" filterable disabled>
              <el-option v-for="item in countryList" :key="item.code2" :label="item.chineseName" :value="item.code2"/>
            </el-select>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.destination_area_name")' prop="destinationAreaCode">
           <el-select v-model="form.destinationAreaCode" size="mini" style="width: 100%" filterable>
              <el-option v-for="item in areaProductList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode"/>
            </el-select>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.channel")' prop="productLineChannelDtos">
           <el-select v-model="form.productLineChannelDtos" size="mini" style="width: 100%" filterable multiple>
              <el-option v-for="item in channelList" :key="item.channelCode" :label="item.localName" :value="item.channelCode"/>
            </el-select>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.ageing")' prop="fastest">
          <el-row>
            <el-col :span="8">
              <el-input v-model="form.fastest"></el-input>
            </el-col>
            <el-col :span="2" style="text-align: center;">
              -
            </el-col>
            <el-col :span="8">
              <el-input v-model="form.slowest"></el-input>
            </el-col>
            <el-col :span="6">
              {{$t("uexpressProduct.weekday")}}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.effective_date")' prop="effectiveDate">
           <CommonPicker v-model="form.effectiveDate" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" />
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
import { getProductLineListBySalesApi } from "@/api/uexpress/productSales"
 import {
  addProductLineApi,
  updateProductLineApi,
  deleteProductLineApi,
  productLineForbiddenApi,
  productLineActivateApi
 } from "@/api/uexpress/productLine"
 import { getDictListApi, getAllAreaProductApi, getAllChannelApi } from "@/api/uexpress/base";
import { getCountryListApi } from "@/api/country";

export default {
	name: "ProductLine",
	props: {
    detail: {
      type: Object,
      default: function() {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    }
	},
	data() {
		return {
			index: null,
			visible: false,
			addOrEditTitle: "",
			dataList: [],
			form: {
				departureAreaCode: "CN",
        destinationAreaCode: "",
				productLineChannelDtos: [],
        limitationType: 1,
				fastest: '',
				slowest: "",
				effectiveDate: ""
			},
			formRule: {
				departureAreaCode: [{required: true,	message: this.$t("common.cannot_be_null")}],
				destinationAreaCode: [{required: true,	message: this.$t("common.cannot_be_null")}],
        productLineChannelDtos: [{required: true,	message: this.$t("common.cannot_be_null")}]
			},
			countryList: [],
      channelList: [],
      areaProductList: []
		};
	},
	created() {
		this.getBaseDataFn()
    this.id = this.$route.query.id
    if (this.id) {
      this.getList()
    }
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getCountryListApi(), getAllChannelApi(), getAllAreaProductApi()]).then(results => {
        const countryRes = results[0]
        const channelRes = results[1]
        const areaProductRes = results[2]
				if (countryRes.ok) {
					this.countryList = countryRes.content
				}
				if (channelRes.ok) {
					this.channelList = channelRes.content
				}
				if (areaProductRes.ok) {
					this.areaProductList = areaProductRes.content
				}
			})
		},
		getList() {
      getProductLineListBySalesApi(this.id).then(res => {
        if (res.ok) {
          this.dataList = res.content
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

					// 当这种情况 是直接调用接口 进行新增
					if (this.id) {
            let arr = []
            this.form.productLineChannelDtos.forEach(v => {
              arr.push({
                channelCode: v
              })
            })
						let data = {
              productCode: this.detail.productCode,
							...this.form,
              productLineChannelDtos: arr
						}
            let fn = data.productLineId ? updateProductLineApi : addProductLineApi
            let msg = data.productLineId ? this.$t("uexpressProduct.edit_success") : this.$t("uexpressProduct.add_success")
						fn(data).then(res => {
							if (res.ok) {
								this.$message.success(msg)
								this.getList()
							}
						})
					} else {
						if (this.index !== null && this.index >= 0) {
							this.dataList.splice(this.index, 1, this.form);
						} else {
							this.dataList.push(this.form);
						}
					}
				}
			})
		},
		addOrEditFn(item, index) {
			if (item) {
				this.index = index
				this.form = {
					...this.form,
					...item
				};
				this.addOrEditTitle = this.$t("uexpressProduct.edit")
			} else {
				this.index = null
				this.form = {
					departureAreaCode: "CN",
          destinationAreaCode: "",
          productLineChannelDtos: [],
          limitationType: 1,
          fastest: '',
          slowest: "",
          effectiveDate: ""
				};
				this.addOrEditTitle = this.$t("uexpressProduct.add")
			}
			this.visible = true;
		},
    ableFn(item, flag) {
      let successMsg = flag ? this.$t("uexpressProduct.enabled_success") : this.$t("uexpressProduct.disabled_success")
      let confirmMsg = flag ? this.$t("uexpressProduct.enabled_info_confirm") : this.$t("uexpressProduct.disabled_info_confirm")
      let fn = flag ? productLineActivateApi : productLineForbiddenApi
      let data = {
        productLineId: item.productLineId
      }
      this.$confirm(confirmMsg, this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        fn(data).then(res => {
          if (res.ok) {
            this.$message.success(successMsg)
            this.list()
          }
        })
      }).catch(() => {})
    },
		deleteFn(item, index) {
      this.$confirm(this.$t("uexpressProduct.delete_info_confirm"), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
				if (item.productLineId) {
					deleteProductLineApi(item.productLineId).then(res => {
						if (res.ok && !res.content) {
               this.$message.success(this.$t("uexpressProduct.delete_success"))
							this.getList()
						}
					})
				} else {
					this.dataList.splice(index, 1)
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
.contact-add.inner-add {
	top: -40px;
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
