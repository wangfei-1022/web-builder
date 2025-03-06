<template>
  <div >
    <div class="form-module-title">
      <span>{{ getZH('baseInfo') }}</span>
      <el-button type="primary" v-permission="['thk:order:base']" class="ml-10" v-if="[0, 30].includes(formData.lockOrderState) && formData.orderState !==100 && isDisabled" size="mini" @click="dialog.visible=true">{{getZH('updateOrderInfo')}}</el-button>
    </div>
    <div class="form-module-item">
      <BaseInfo :formData="formData" :isDisabled="isDisabled" />
    </div>
    <div class="form-module-title">
      <span>{{ getZH('businessInfo') }}</span>
      <el-button type="primary" v-permission="['thk:order:business']" class="ml-10" size="mini" v-if="[0, 30].includes(formData.lockOrderState) && formData.orderState !==100 && isDisabled" @click="editBusinessFn" >{{getZH('updateBusinessInfo')}} </el-button>
      <el-button type="primary" v-permission="['thk:order:update:container']" class="ml-10" size="mini" v-if="[0, 30].includes(formData.lockOrderState) && formData.orderState !==100 && isDisabled" @click="updateContainerInfoFn" >{{getZH('updateContainerInfo')}} </el-button>
    </div>
    <div class="form-module-item">
      <BusinessInfoIntegrated :type="type" :formData="formData" :isDisabled="isDisabled"  v-if="formData.groupCode === ThirdBusinessGroup.INTEGRATED_SERVICE" />
      <BusinessInfoDomestic :type="type" :formData="formData" :isDisabled="isDisabled" v-if="formData.groupCode === ThirdBusinessGroup.DOMESTIC_TRADE" />
      <BusinessInfoRoad :type="type" :formData="formData" :isDisabled="isDisabled" v-if="formData.groupCode === ThirdBusinessGroup.ROAD_TRANSPORT" />
      <BusinessInfoRail :type="type" :formData="formData" :isDisabled="isDisabled" v-if="formData.groupCode === ThirdBusinessGroup.RAIL_BUSINESS" />
      <BusinessInfoOverseas :type="type" :formData="formData" :isDisabled="isDisabled" v-if="formData.groupCode === ThirdBusinessGroup.OVERSEAS_WAREHOUSE" />
    </div>
    <div class="form-module-title">
      <span>{{ getZH('fileIndo') }}</span>
    </div>
      <div class="form-module-item">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item :label="getZH('orderOrder')" prop="fileList">
            <div v-if="isDisabled">
              <div v-for="item in formData.fileList.filter(item=>item.documentTypeCode==='te_customer_power_attorney')" :key="item.id">
                <span class="link-box" @click="downloadElectronicFile(item)">{{item.fileName}}</span>
              </div>
            </div>
            <div v-else>
              <UploadFile :showFileList="true" v-model="formData.fileList">
                <div slot="upload"> <span class="link-box fs-12">{{ getZH('uploadClientRequest') }}</span></div>
              </UploadFile>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <BaseInfoEdit :id="formData.id" :visible.sync="dialog.visible" @saved="updateInfo" />
    <BusinessInfoDialog :id="formData.id" ref="businessInfoDialogRef" @saved="updateInfo" />
    <UpdateContainerDialog :formData="formData" ref="updateContainerDialogRef" @saved="updateInfo" />
  </div>
</template>
<script>
import getZHMixin from './getZHMixin'
import BaseInfo from './baseInfo'
import BaseInfoEdit from './baseInfoEdit'

import BusinessInfoIntegrated from './businessInfoIntegrated'
import BusinessInfoDomestic from './businessInfoDomestic'
import BusinessInfoRoad from './businessInfoRoad'
import BusinessInfoRail from './businessInfoRail'
import BusinessInfoOverseas from './businessInfoOverseas'
import BusinessInfoDialog from './businessInfoDialog'
import UpdateContainerDialog from './updateContainerDialog'

import { downloadElectronicFileApi } from '@/api/seaExport'
import { ThirdBusinessGroup } from '@/utils/constant'

export default {
	name: 'FormDataDetailBasic',
	mixins: [getZHMixin],
	components: { 
        BaseInfo, 
        BaseInfoEdit,
        BusinessInfoIntegrated,
        BusinessInfoDomestic,
        BusinessInfoRoad,
        BusinessInfoRail,
        BusinessInfoOverseas,
        BusinessInfoDialog,
        UpdateContainerDialog
    },
	props: {
		formData: {
			type: Object,
			default: () => { }
		},
        type: {
			type: String,
			default: ""
		},
        isDisabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			businessInfoVisible: false,
            ThirdBusinessGroup: ThirdBusinessGroup
		}
	},
	methods: {
        updateContainerInfoFn() {
            this.$refs.updateContainerDialogRef.show()
        },
		editBusinessFn() {
            this.$refs.businessInfoDialogRef.show()
        },
		downloadElectronicFile(obj) {
			downloadElectronicFileApi(obj.id).then(res => {
				if (res.ok) {
					res.content.fileName = obj.fileName
					this.downloadFile(res.content)
				}
			})
		},
		updateInfo() {
			this.$emit('saved')
		}
	}
}
</script>

<style scoped lang="less">
.form-module-title {
	font-size: 15px;
	margin-bottom: 10px;
	display: block;
	color: #1890ff;
	padding-left: 10px;
	border-left: 2px solid #1890ff;
	height: 28px;
	line-height: 28px;
}

.form-module-item {
	overflow: hidden;
	padding: 15px;
	background: #fff;
	margin-bottom: 20px;
	box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;

	.item {
		width: 33%;
		float: left;
		padding: 0 20px;
		margin-bottom: 10px;

		label {
			font-size: 14px;
			margin-right: 20px;
		}

		span {
			font-size: 12px;
		}
	}
}

.charge-list-data {
	margin: 20px 0;
}

.operation-btn {
	padding: 20px;
	text-align: right;
	background: #fff;
}

.shipping-info .item label {
	display: block;
	margin-bottom: 8px;
}

.shipping-info .item span {
	display: inline-block;
	min-height: 200px;
	width: 100%;
	border-radius: 5px;

	::v-deep .el-textarea.is-disabled .el-textarea__inner {
		background-color: #fff;
		font-size: 12px;
		color: #000;
	}
}

.dialog-footer {
	text-align: center;
}
</style>
