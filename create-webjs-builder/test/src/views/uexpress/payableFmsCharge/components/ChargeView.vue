<template>
	<div class="page-edit-container full-page">
		<div class="customer-edit page-edit-content">
			<el-form ref="baseFormRef" :rules="formRule" :model="form" label-width="120px" size="mini">
				<div class="info-section-module">
					<div class="info-title">
            {{$t("uexpressFmsCharge.baseInfo")}}
            <i class="icon-oper el-icon-edit" @click="editBaseFn" v-if="type == 'ADJUST' && !isEditBase"></i>
            <i class="icon-oper el-icon-circle-close" @click="cancelBaseFn" v-if="type == 'ADJUST' && isEditBase"></i>
            <i class="icon-oper el-icon-circle-check" @click="saveBaseFn" v-if="type == 'ADJUST' && isEditBase"></i>
          </div>
					<div class="info-content">
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.orderNo")}}：</span>
              <span class="info-span">{{form.orderNo}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.channelOrderNo")}}：</span>
              <span class="info-span">{{form.channelOrderNo}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.currency")}}：</span>
              <span class="info-span">{{form.currency}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.supplierName")}}：</span>
              <span class="info-span">{{form.supplierName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.supplierProductName")}}：</span>
              <span class="info-span">{{form.supplierProductName}}</span>
            </div>

            <div style="clear: both;"></div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.preWeight")}}：</span>
              <span class="info-span">{{form.preWeight}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.volumeWeight")}}：</span>
              <span class="info-span">{{form.inboundVolumeWeight}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.inboundWeight")}}：</span>
              <span class="info-span">{{form.inboundWeight}}</span>
            </div>

            <div style="clear: both;"></div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.billWeight")}}：</span>
              <span class="info-span">{{form.billWeight}}</span>
            </div>
            <div class="info-item" v-if="type === 'DETAIL' || (type == 'ADJUST' && !isEditBase)">
              <span class="info-label">{{$t("uexpressFmsCharge.chargeWeight")}}：</span>
              <span class="info-span">{{form.chargeWeight}}</span>
            </div>
						<el-form-item :label='$t("uexpressFmsCharge.chargeWeight")' prop="chargeWeight"  v-if="type == 'ADJUST' && isEditBase">
							<el-input v-model="form.chargeWeight" ></el-input>
						</el-form-item>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.diffWeight")}}：</span>
              <span>{{(Number(form.chargeWeight || 0) - Number(form.billWeight || 0)).toFixed(2)}}</span>
            </div>

            <div style="clear: both;"></div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.billDimensionDesc")}}：</span>
              <span class="info-span">{{form.billDimensionDesc}}</span>
            </div>
            <div class="info-item" v-if="type === 'DETAIL' || (type == 'ADJUST' && !isEditBase)">
              <span class="info-label">{{$t("uexpressFmsCharge.chargeDimensionDesc")}}：</span>
              <span class="info-span">{{form.chargeDimensionDesc}}</span>
            </div>
						<el-form-item :label='$t("uexpressFmsCharge.chargeDimensionDesc")' prop="chargeDimensionDesc"  v-if="type == 'ADJUST' && isEditBase">
							<el-row>
                <el-col :span="7">
                  <el-input v-model="form.chargeLength" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
                </el-col>
                <el-col :span="2" style="text-align: center">*</el-col>

                <el-col :span="7">
                  <el-input v-model="form.chargeWidth" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
                </el-col>
                <el-col :span="2" style="text-align: center">*</el-col>

                <el-col :span="6">
                  <el-input v-model="form.chargeHeight" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
                </el-col>
                <el-col :span="2" style="text-align: center">{{form.lengthUnitName}}</el-col>
              </el-row>
						</el-form-item>

            <div style="clear: both;"></div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.billAreaCode")}}：</span>
              <span class="info-span">{{form.billAreaCode}}</span>
            </div>
            <div class="info-item" v-if="type === 'DETAIL' || (type == 'ADJUST' && !isEditBase)">
              <span class="info-label">{{$t("uexpressFmsCharge.areaCode")}}：</span><span class="info-span">{{form.areaCode}}</span>
            </div>
						<el-form-item :label='$t("uexpressFmsCharge.areaCode")' prop="areaCode"  v-if="type == 'ADJUST' && isEditBase">
              <el-select v-model="form.areaCode" style="width: 100%">
                <el-option v-for="item in chargeAreaAllList" :key="item.areaCode" :label="item.areaCode" :value="item.areaCode"></el-option>
              </el-select>
						</el-form-item>
					</div>
				</div>
			</el-form>

      <div class="info-section-module">
        <div class="info-title">
          <span>{{$t("uexpressFmsCharge.chargeInfo")}}</span>
          <i class="icon-oper el-icon-edit" @click="editChargeFn" v-if="type == 'ADJUST' && !isEditCharge"></i>
          <i class="icon-oper el-icon-circle-close" @click="cancelChargeFn" v-if="type == 'ADJUST' && isEditCharge"></i>
          <i class="icon-oper el-icon-circle-check" @click="saveChargeFn" v-if="type == 'ADJUST' && isEditCharge"></i>
        </div>
        <div class="info-content">
          <el-table ref="contactTable" :data="dataList" border style="width: 100%" >
            <el-table-column prop="index" :label='$t("uexpressFmsCharge.seq")' min-width="70">
              <template slot-scope="{$index}">
                <span>{{$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="categoryName" :label='$t("uexpressFmsCharge.categoryName")' min-width="120"></el-table-column>
            <el-table-column prop="feeItemCode" :label='$t("uexpressFmsCharge.feeItemCode")' min-width="120"></el-table-column>
            <el-table-column prop="feeItemName" :label='$t("uexpressFmsCharge.feeItemName")' min-width="120"></el-table-column>
            <el-table-column prop="chargeWeightRule" :label='$t("uexpressFmsCharge.chargeWeightRule")' min-width="120"></el-table-column>
            <el-table-column prop="attributeChargeName" :label='$t("uexpressFmsCharge.attributeChargeName")' min-width="120"></el-table-column>

            <el-table-column prop="amount" :label='$t("uexpressFmsCharge.amount")' min-width="120">
              <template slot-scope="{row}">
                <el-input v-model="row.amount" size="mini" oninput="value=value.replace(/[^\d.-]/g,'')" v-if="isEditCharge"/>
                <span v-else>{{row.amount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="billAmount" :label='$t("uexpressFmsCharge.billAmount")' min-width="120"></el-table-column>
            <el-table-column prop="diffValue" :label='$t("uexpressFmsCharge.diffValue")' min-width="120">
              <template slot-scope="{row}">
                <span>{{((row.amount || 0) - (row.billAmount || 0)).toFixed(2)}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="price" :label='$t("uexpressFmsCharge.price")' min-width="120">
              <template slot-scope="{row}">
                <el-input v-model="row.price" size="mini" oninput="value=value.replace(/[^\d.-]/g,'')" v-if="isEditCharge"/>
                <span v-else>{{row.price}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="billPrice" :label='$t("uexpressFmsCharge.billPrice")' min-width="120"></el-table-column>
            <el-table-column prop="diffValue" :label='$t("uexpressFmsCharge.diffValue")' min-width="120">
              <template slot-scope="{row}">
                <span>{{((row.price || 0) - (row.billPrice || 0)).toFixed(2)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

			<div class="page-edit-footer">
        <el-button size="mini" @click="backList">{{$t("common.close")}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { getPayableChargeDetailApi, updateOrderPayableChargeApi, updateChargePayableChargeApi } from "@/api/uexpress/payableFmsCharge";
import { getAllAreaChannelApi } from "@/api/uexpress/base";
export default {
	name: "UexpressPayableFmsChargeAdjust",
  props: {
    type: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
      isEditBase: false, // 基础信息是否处于编辑状态
      isEditCharge: false,
			id: "",
			form: {
				chargeLength: "",
				chargewidth: "",
				chargeHeight: "",
				areaCode: "",
				chargeWeight: ""
			},
			formRule: {
        chargeLength: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        chargewidth: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        chargeHeight: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        chargeWeight: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},
			loading: false,
      supplierProductList: [],
      areaRanges: [],
      dataList: [],
      chargeAreaAllList: [],
      detail: {}
		};
	},
	created() {
    this.id = this.$route.query.id
    this.orderSk = this.$route.query.orderSk
    if (this.id) {
      this.getDetail()
    }
	},
	methods: {
    getDetail() {
      let data = {
        billOrderId: this.id,
        orderSk: this.orderSk
      }
      getPayableChargeDetailApi(data).then(res => {
        if (res.ok) {
          this.detail = res.content
          this.dataList = this.$extends(true, [], res.content.billOrderChargeDtos)
          this.form = {
            ...res.content
          }
          let data = {
            areaType: 1, 
            supplierId: this.form.supplierId,
            areaState: 2
          }
          getAllAreaChannelApi(data).then(areaRes => {
            if (areaRes.ok) {
              this.chargeAreaAllList = areaRes.content;
            }
          })
        }
      })

    },
    editBaseFn() {
      this.isEditBase = true
    },
    cancelBaseFn() {
      this.isEditBase = false
      this.form = {
        ...this.detail
      }
    },
    saveBaseFn() {
      this.$refs.baseFormRef.validate(valid => {
				if (valid) {
          let data = {
            chargeLength: this.form.chargeLength,
            chargeWidth: this.form.chargeWidth,
            chargeHeight: this.form.chargeHeight,
            areaCode: this.form.areaCode,
            chargeWeight: this.form.chargeWeight,
            id: this.form.id,
            orderSk: this.form.orderSk
          }
					this.loading = true;
					updateOrderPayableChargeApi(data).then(res => {
						if (res.ok) {
							this.$message.success(this.$t("uexpressFmsCharge.edit_success"));
              this.getDetail()
              this.isEditBase = false
						}
						this.loading = false;
					});
				} else {
					this.mixinsFormScrollIntoView();
				}
			});
    },

    editChargeFn() {
      this.isEditCharge = true
    },
    cancelChargeFn() {
      this.isEditCharge = false
      this.dataList = this.$extends(true, [], this.detail.billOrderChargeDtos)
    },
    saveChargeFn() {
      let updateOrderChargeDtos = []
      let VALID = true
      this.dataList.forEach(v => {
        updateOrderChargeDtos.push({
          id: v.id,
          amount: v.amount,
          price: v.price
        })

        if (!v.amount || !v.price) {
          VALID = false
        }
      })
      if (!VALID) {
        this.$message.error(this.$t("uexpressFmsCharge.autocompleteInput"));
        return
      }
      let data = {
        id: this.id,
        orderSk: this.orderSk,
        updateOrderChargeDtos: updateOrderChargeDtos
      }
      this.loading = true;
      updateChargePayableChargeApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t("uexpressFmsCharge.edit_success"));
          this.getDetail()
          this.isEditCharge = false
        }
        this.loading = false;
      });
    },
		backList() {
			this.$store.dispatch("tagsView/delView", this.$route);
			this.$router.push({ name: `UExpressPayableFmsChargeList` });
		}
	}
};
</script>
<style scoped lang="scss">
.customer-edit {
	::v-deep .el-table th > .cell {
		color: #555;
		font-size: 15px;
	}

	::v-deep .el-form-item {
		width: 33.33%;
		float: left;
	}
}

.info-section-module .info-item .info-label {
  width: 130px;
  margin-right: 0px;
}
.info-section-module .info-item {
  width: 33.33%;
}

.icon-oper{
  float: right;
  font-size: 22px;
  cursor: pointer;
  color: #0085ff;
  margin-left: 7px;
}
.icon-oper.el-icon-circle-close{
  color: #9a9a9a;
}
</style>

