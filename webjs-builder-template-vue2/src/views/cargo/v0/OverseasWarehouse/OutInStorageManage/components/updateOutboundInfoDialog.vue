<template>
	<div>
		<el-dialog	:visible.sync="dialogVisible"	:title="$t('outInStorageManage.updateOutbound')"	width="1400px" :close-on-click-modal="false">
      <div class="dialog-content" v-loading="loading" >
        <div class="info-title">{{ getZH("baseInfo") }}</div>
        <div class="page-content mt-20 mb-10 flex-box">
          <div class="mr-20">
            <span>{{getZH('orderNo')}}：</span>
            <span>{{detailContent.outboundNo || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('customerOutboundNo')}}：</span>
            <span>{{detailContent.customerOutboundNo || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('containerNumber')}}：</span>
            <span>{{detailContent.containerNumber || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('warehouseName')}}：</span>
            <span>{{detailContent.warehouseName || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('traceAppoint')}}：</span>
            <span>{{detailContent.traceAppointFlag ? 'Y' :'N'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('unpackFlag')}}：</span>
             <span>{{detailContent.unpackFlag ? 'Y' :'N'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('isPickup')}}：</span>
             <span>{{detailContent.pickup ? 'Y' :'N'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('trayCount')}}：</span>
             <span>{{detailContent.trayCount || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('goods')}}：</span>
             <span>{{detailContent.productTypeName || '-'}}</span>
          </div>
        </div>
        <div class="info-title mb-20">
					{{ getZH("outBoundInfo") }}
					<span class="el-icon-info fs-12 ml-20"></span>
					<span class="fs-12 ml-4">{{ getZH('mergeCallbackTips')}}</span>
				</div>

        <el-form label-width="70px"  v-loading="loading" label-position="left" :inline="true" :model="formData" :rules="rules" ref="formData"  v-if="dialogVisible" >
          <div>
            <div v-for="(item,index) in formData.outboundDetailList || []" :key="item.orderNo" :label="item.orderNo" :name="item.orderNo">
							<div class="content-title fs-12 ">{{ getZH("orderNo") }} ：  {{ item.orderNo }}</div>
              <div class="page-content mt-20 mb-10 flex-box">
                <div class="mr-20">
                  <span>{{getZH('status')}}：</span>
                  <span>{{item.statusName || '-'}}</span>
                </div>
                <div class="mr-20">
                  <span>{{getZH('trayNum')}}：</span>
                  <span>{{item.actualPalletQuantity || '-'}}</span>
                </div>
                <div class="mr-20">
                  <span>{{getZH('numberPackages')}}：</span>
                  <span>{{item.skuQuantity || '-'}}</span>
                </div>
                <div class="mr-20">
                  <span>{{getZH('netWeightTotal')}}：</span>
                  <span>{{item.totalWeight || '-'}}</span>
                </div>
              </div>
              <el-table border :data="item.outboundConfirmGoodsList || []" size="mini" stripe style="width: 100%" class="mb-20">
                <el-table-column :label="getZH('number')" width="50">
                  <template slot-scope="{$index}">
                    <span>{{$index+1}}</span>
                  </template>
                </el-table-column>
                <!-- v-if="detailContent.productType === 1 && !detailContent.traceAppointFlag" -->
                <el-table-column  :label="getZH('containerNumber')" min-width="150" show-overflow-tooltip >
                  <template slot-scope="{row}">
                    <span >{{row.containerNumber}}</span>
                  </template>
                </el-table-column>
                <el-table-column  :label="getZH('trayNo')" min-width="150" show-overflow-tooltip >
                  <template slot-scope="{row}">
                    <span >{{row.traceId}}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="110" :label="detailContent.productType === 2 ? getZH('materielCode') : getZH('specifications')">
                  <template slot-scope="{row}">
                    <div>{{detailContent.productType === 2 ? (row.productCode || '-') : (row.specifications || '-')}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="quantity" :label="getZH('blockNum')" width="110">
                  <template slot-scope="{row}">
                    {{row.quantity || '-'}}
                  </template>
                </el-table-column>
                <el-table-column :label="getZH('location')" min-width="110" show-overflow-tooltip>
                  <template slot-scope="{row}">
                    <span>{{row.stockLocation || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="SN" min-width="120" show-overflow-tooltip>
                  <!--  -->
                  <template slot-scope="{row,$index}">
                    <el-form-item label-width="0px" label="" class="mb-0" :prop="`outboundDetailList[${index}].outboundConfirmGoodsList[${$index}].sn`" :rules="[{required:detailContent.unpackFlag && detailContent.productType === 1,message:getZH('select_sn_no') }]">
                      <el-input v-model="row.sn"  size="mini" :placeholder="getZH('placeholder','common')"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column :label="getZH('ownerCode')" min-width="110" show-overflow-tooltip>
                  <template slot-scope="{row}">
                    <span>{{row.ownerName || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="grossWeightPallet" :label="getZH('grossWeightPallet')" width="130">
                  <template slot-scope="{row}">
                    {{row.palletWeight || '-'}}
                  </template>
                </el-table-column>
                <el-table-column :label="getZH('damageFlag')" width="110" show-overflow-tooltip>
                  <template slot-scope="{row}">
                    <span>{{row.damageFlag ? 'Y' :'N'}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="$isEmpty(formData.outboundDetailList)" class="empty-data fc-red">
            暂无可出库的出库单，请检查
          </div>
          <el-form-item :label="getZH('outTime')" prop="outTime">
             <el-date-picker value-format="timestamp"  v-model="formData.outTime" type="datetime" placeholder="选择日期时间" size="mini"></el-date-picker>
          </el-form-item>
          <el-form-item :label="getZH('pickTime')" >
            <CommonPicker  v-model="formData.pickTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" size="mini" />
          </el-form-item>
          <el-form-item :label="getZH('loadingTime')" >
            <CommonPicker  v-model="formData.loadingTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" parentOption="betweenDependence" :startDependence="todayTime - 14 * 24 * 60 * 60 * 1000 + 1" size="mini" />
          </el-form-item>
          <el-form-item :label="getZH('carNo')" >
            <el-input v-model="formData.carNo" maxlength="20" size="mini"  :placeholder="inputZH('carNo')"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" :disabled="$isEmpty(formData.outboundDetailList)" @click="saveForm('formData')">{{ $t("common.confirmBtn") }}</el-button>
        <el-button size="mini" @click="dialogVisible = false">{{$t("common.cancelBtn") }}</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { detailTaskOutboundBackApi, cloudTaskOutboundApi } from '@/api/OverseasWarehouse/outInStorageManage.js'
import getZHMixin from './getZHMixin'
export default {
	name: 'UpdateOutboundInfoDialog',
	mixins: [getZHMixin],
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String
	},
	data() {
		let defaultForm = {
			id: null,
			outboundId: null,
			outTime: null,
			pickTime: null,
			loadingTime: null,
			carNo: null,
			outboundDetailList: []
		}
		return {
			detailContent: {},
			dialogVisible: false,
			loading: false,
			mergeCallbackFlag: false,
			activeName: null,
			todayTime: null,
			defaultForm,
			rules: {
				outTime: [{ required: true, message: this.getZH('please_select_outTime'), trigger: 'blur' }]
			},
			formData: this.$extends({}, defaultForm)
		}
	},
	created() {
		let time = new Date()
		time.setHours(0)
		time.setMinutes(0)
		time.setSeconds(0)
		time.setMilliseconds(0)
		this.todayTime = time.getTime()
	},
	methods: {
		async saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					let saveForm = this.$extends(true, {}, this.formData)
					saveForm.optZone = -new Date().getTimezoneOffset() / 60
					this.loading = true
					cloudTaskOutboundApi(saveForm).then(res => {
						if (res.ok) {
							this.$message.success(this.$t('common.saveSuccess'))
							this.$emit('saved')
							this.dialogVisible = false
						}
						this.loading = false
					})
				} else {
					this.mixinsFormScrollIntoView()
				}
			})
		},
		/**
		 * 获取详情
		 */
		async getDetail(id) {
			this.loading = true
			let res = await detailTaskOutboundBackApi(id)
			if (res.ok) {
				this.$copyProps(this.formData, res.content, 'outTime')
				this.formData.outboundDetailList = res.content.outboundDetailList
				this.detailContent = res.content
			}
			this.loading = false
		}

	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData = this.$extends({}, this.defaultForm)
				this.formData.outTime = this.todayTime
				if (this.$isNotEmpty(this.id)) {
					this.getDetail(this.id)
				}
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style scoped lang="less">
.page-content {
	color: #606266;
	font-size: 12px;
	flex-wrap: wrap;
	& > div {
		white-space: nowrap;
		margin-bottom: 10px;
	}
}
.empty-data {
	width: 500px;
	height: 200px;
	text-align: center;
	line-height: 200px;
	font-size: 16px;
}
</style>
