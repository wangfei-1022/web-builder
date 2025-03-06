<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("uexpressProduct.product_code")' prop="productCode">
							<uexpress-type-select type="productSales" v-model="formData.productCode" clearable filterable @selected="list" />
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.product_type")' prop="productType">
							<el-select v-model="formData.productType" size="mini" @change="list">
								<el-option :label="$t('customerManage.ALL')" value="" />
								<el-option v-for="(item, index) in productTypeList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
						<el-form-item :label='$t("uexpressProduct.state")' prop="productLineState">
							<el-select v-model="formData.productLineState" size="mini" @change="list">
								<el-option :label="$t('customerManage.ALL')" value="" />
								<el-option v-for="(item, index) in productLineStateList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressProduct.channel_code")' prop="channelCode">
							<uexpress-type-select type="channel" v-model="formData.channelCode" clearable filterable @selected="list" />
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.destination_area_name")' prop="destinationAreaCode">
              <el-select v-model="formData.destinationAreaCode" size="mini" style="width: 100%" filterable clearable  @change="list">
                  <el-option v-for="item in areaProductList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode"/>
                </el-select>
            </el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button type="primary" size="mini" icon="el-icon-plus" @click="addOrEditFn()">{{$t("uexpressProduct.add")}}</el-button>
			</div>
			<el-table
        class="yht-table yht-aggird-table"
        :data="dataList" 
        :height="tableHeight" 
        style="width: 100%;" 
        row-key="id" 
        border 
        size="mini" 
        lazy
      >
        <el-table-column prop="productCode" :label="$t('uexpressProduct.product_code')" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="productName" :label="$t('uexpressProduct.product_name')" min-width="220"></el-table-column>
        <el-table-column prop="productTypeName" :label="$t('uexpressProduct.product_type')" min-width="90"></el-table-column>
        <el-table-column prop="departureAreaName" :label="$t('uexpressProduct.departure_area_name')" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="destinationAreaName" :label="$t('uexpressProduct.destination_area_name')" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column prop="timerStr" :label="$t('uexpressProduct.effect_timer_str')" min-width="100"> </el-table-column>
        <el-table-column prop="effectiveDateStr" :label="$t('uexpressProduct.effective_date')"  min-width="150"> </el-table-column>
        <el-table-column prop="channelBaseInfos" :label="$t('uexpressProduct.channel')"  min-width="250">
          <template slot-scope="{row}">
            <div v-for="(item, index) in row.channelBaseInfos" :key="index">
              <span>{{item.channelName}}</span>
              <el-button type="text" size="mini" @click="restrictionFn(row, item.channelCode)">{{$t("uexpressProduct.restriction")}}</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productLineStateName" :label="$t('uexpressProduct.state')" min-width="80"></el-table-column>
        <el-table-column fixed="right" prop="operationBtn" :label="$t('uexpressProduct.operation')" min-width="150">
          <template slot-scope="{row}">
            <div>
              <el-button type="text" size="mini" @click="viewFn(row)">{{$t("uexpressProduct.view")}}</el-button>
              <el-button type="text" size="mini" @click="addOrEditFn(row)">{{$t("uexpressProduct.edit")}}</el-button>
              <el-button v-if="row.productLineState == 2" type="text" size="mini" @click="ableFn(row, false)">{{$t("uexpressProduct.disabled")}}</el-button>
              <el-button v-if="row.productLineState == 3 || row.productLineState == 1" type="text" size="mini" @click="ableFn(row, true)">{{$t("uexpressProduct.enabled")}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>

    <el-dialog :visible.sync="visible" v-if="visible" :close-on-click-modal="false" :append-to-body="true" width="500px" :title="addOrEditTitle">
      <el-form class="contact-form" ref="formRef" :model="form" :rules="formRule" label-width="100px" size="mini">
        <el-form-item :label='$t("uexpressProduct.service_product")' prop="productCode">
          <uexpress-type-select type="productSales" v-model="form.productCode" clearable filterable :defaultDisplay="form.defaultDisplay"/>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.departure_area_name")' prop="departureAreaCode">
           <el-select v-model="form.departureAreaCode" size="mini" style="width: 100%" filterable disabled>
              <el-option v-for="item in departureList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode"/>
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
        <el-button size="mini" @click="visible = false">{{ $t("customerManage.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="confirmFn">{{ $t("customerManage.confirm") }}</el-button>
      </div>
    </el-dialog>

    <product-channel-restrictions ref="productChannelRestrictionsRef" @refresh="list"></product-channel-restrictions>
	</div>
</template>

<script>
import {
  getProductLineListApi,
  productLineForbiddenApi,
  productLineActivateApi,
  updateProductLineApi,
  addProductLineApi
 } from "@/api/uexpress/productLine";
import { getDictListApi, getProductDepartureApi, getAllAreaProductApi, getAllChannelApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import optionBtn from "./optionBtn";
import ProductChannelRestrictions from "./components/ProductChannelRestrictions";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "ProductLineList",
	components: {
		AgGridVue,
		optionBtn,
    ProductChannelRestrictions
	},
	data() {
		return {
			formData: {
        productCode: '',
        productType: '',
				productLineState: "",
        channelCode: '',
        customerType: '',
        destinationAreaCode: ''
			},

      visible: false,
			addOrEditTitle: "",
			form: {
        productCode: '',
				departureAreaCode: "CN",
        destinationAreaCode: "",
				productLineChannelDtos: [],
        limitationType: 1,
				fastest: '',
				slowest: "",
				effectiveDate: "",
        defaultDisplay: []
			},
			formRule: {
        productCode: [{required: true,	message: this.$t("common.cannot_be_null")}],
				departureAreaCode: [{required: true,	message: this.$t("common.cannot_be_null")}],
				destinationAreaCode: [{required: true,	message: this.$t("common.cannot_be_null")}],
        productLineChannelDtos: [{required: true,	message: this.$t("common.cannot_be_null")}]
			},
      editItem: {},
      editChannelCode: '',

			productTypeList: [],
			productLineStateList: [],
      areaProductList: [],
      departureList: [],
      channelList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			columnFields: [],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "multiple", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
					componentParent: this
				}
			},
			loading: false
		};
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictListApi(3), getDictListApi(4), getAllAreaProductApi(), getProductDepartureApi(), getAllChannelApi()]).then(results => {
				const productLineStateRes = results[0];
        const productTypeRes = results[1];
        const areaProductRes = results[2];
        const departureRes = results[3];
        const channelRes = results[4];
				if (productLineStateRes.ok) {
					this.productLineStateList = productLineStateRes.content;
				}
				if (productTypeRes.ok) {
					this.productTypeList = productTypeRes.content;
				}
        if (areaProductRes.ok) {
					this.areaProductList = areaProductRes.content
				}
				if (departureRes.ok && departureRes.content) {
					this.departureList = [departureRes.content]
				}
				if (channelRes.ok) {
					this.channelList = channelRes.content
				}
			});
		},

		onReady(params) {
			params.api.sizeColumnsToFit();
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit();
				});
			});
		},
		async list() {
			this.loading = true;
			const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
			const res = await getProductLineListApi(params);
			if (res.ok) {
				res.content.list.forEach(function (item) {
					item.effectiveDateStr = parseTime(item.effectiveDate, "{y}-{m}-{d} {h}:{i}:{s}");
          item.timerStr = (item.fastest || '') + '-' + (item.slowest || '') + item.limitationTypeName
          item.productLineChannelDtos = []
          item.channelBaseInfos.forEach(v => {
            item.productLineChannelDtos.push(v.channelCode)
          })
				});
				this.total = parseInt(res.content.total, 10);
				this.dataList = res.content.list;
			} else {
				this.total = 0;
				this.dataList = [];
			}
			this.loading = false;
		},
    confirmFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					this.visible = false;

					// 当这种情况 是直接调用接口 进行新增
					let arr = []
          this.form.productLineChannelDtos.forEach(v => {
            arr.push({
              channelCode: v
            })
          })
          let data = {
            ...this.form,
            productLineChannelDtos: arr
          }
          let fn = data.productLineId ? updateProductLineApi : addProductLineApi
          let msg = data.productLineId ? this.$t("uexpressProduct.edit_success") : this.$t("uexpressProduct.add_success")
          fn(data).then(res => {
            if (res.ok) {
              this.$message.success(msg)
              this.list()
            }
          })
				}
			})
		},
		addOrEditFn(item, index) {
      // 获取最新的产品分区列表
      getAllAreaProductApi().then(res => {
        if (res.ok) {
					this.areaProductList = res.content
				}
      })
			if (item) {
				this.index = index
				this.form = {
					...this.form,
					...item,
          defaultDisplay: [{
            productCode: item.productCode,
            productName: item.productName
          }]
				};
				this.addOrEditTitle = this.$t("uexpressProduct.edit");
			} else {
				this.index = null
				this.form = {
					departureAreaCode: "CN",
          destinationAreaCode: "",
          productLineChannelDtos: [],
          defaultDisplay: [],
          limitationType: 1,
          fastest: '',
          slowest: "",
          effectiveDate: ""
				};
				this.addOrEditTitle = this.$t("uexpressProduct.add");
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
    restrictionFn(item, channelCode) {
     this.$refs.productChannelRestrictionsRef.show(item, channelCode)
    },
    viewFn(item) {
      this.$router.push({
				name: "ProductLineDetail",
				query: {
					id: item.productId
				}
			});
    },
		reset() {
			this.$refs.formData.resetFields();
			this.list();
		}
	}
};
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
</style>
