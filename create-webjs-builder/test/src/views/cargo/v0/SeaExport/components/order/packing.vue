<template>
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="packingForm" @submit.native.prevent ref="packingForm">
<!--      基础信息-->
      <div class="box_title">{{$t('sea.basicInformation')}}</div>
      <div class="box_child">
        <div class="flex-bet" style="width: 1000px">
          <div>
            <el-form-item :label="$t('sea.SO')" prop="SO">
              <div v-for="item in packingForm.soList" :key="item">{{item}}</div>
            </el-form-item>
          </div>
          <div>
            <el-form-item :label="$t('sea.sumCount')" prop="sumContainerStr">{{packingForm.sumContainerStr}}</el-form-item>
            <el-form-item :label="$t('sea.sumQuantity')" prop="sumQuantity">{{packingForm.sumQuantity}}</el-form-item>
          </div>
          <div>
            <el-form-item :label="$t('sea.unboxed')" prop="unboxedContainerStr">{{packingForm.unboxedContainerStr}}</el-form-item>
            <el-form-item :label="$t('sea.sumGrossWeight')" prop="sumGrossWeight">{{packingForm.sumGrossWeight}}</el-form-item>
          </div>
           <div>
             <el-form-item ></el-form-item>
             <el-form-item :label="$t('sea.sumVolume')" prop="sumVolume">{{packingForm.sumVolume}}</el-form-item>
           </div>
        </div>
      </div>
    </el-form>

<!--      装箱信息-->
      <div class="box_title">
        <span>{{$t('sea.packingInformation')}}</span>
        <div class="operate-buttons-left">
          <el-button type="primary" v-if="orderDetailsData.isUnlocked" size="mini" @click="importPackingInformation">{{$t('sea.importPackingInformation')}}</el-button>
        </div>
        <span style="color: red; font-size: 12px; margin-left: 20px">{{$t('sea.notePacking')}}</span>
      </div>
      <div class="box_child">
        <div v-for="(item,index) in containerListForm.containerList" :key="index" :inline="true" :model="containerListForm" :ref="`containerListForm${index}`">
          <PackingBox :listData="item"
            @changeContainer="changeContainer"
            @deletContainer="deletContainer"
            :packageTypeList="packageTypeList"
            :orderState="customerInformationForm.orderState"
            :index="index"
            :packingForm="packingForm"
            :bookingJobData="bookingJobData"
            :orderDetailsData="orderDetailsData"
          >
          </PackingBox>
        </div>
      </div>
    <DataImport :btnText="updateMsg.btnText"
        :code="updateMsg.code"
        :name="updateMsg.name"
        :showDataImportDialog.sync="showDataIportDialog"
        @close="colseDialog"
        :isDownloadExcel="true"
        :autoUpload = "autoUpload"
        uploadType="packing"
        :limit="1"
        :whiteList="whiteList"
        :uploadUrl="`/api/sea-service/sea/ex/load/job/${bookingJobId}/uploadContainer`"
        @packingUpdate="packingUpdate"
        downLoadFileName="装箱信息模板.xlsx"
    ></DataImport>

  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import { validContainerNo, validContainerNo53HC } from "@/utils/validate"
import PackageTypeSelect from './packageTypeSelect'
import lodash from 'lodash'
import PackingBox from './packingBox'
import {
	containerGatherApi,
	containerInfoListApi,
	delContainerApi,
	loadJobApi,
	seaBookingAddApi, seaBookingDetailApi
} from "@/api/seaExportOrder"
import { dropdownlist } from "@/api/bl"
import DataImport from "@/components/DataImport"
export default {
	name: 'Packing',
	props: {
		uploadRadioType: { type: String, default: null },
		orderDetailsData: {
			type: Object, default: () => {
			}
		}
	},
	components: { PackageTypeSelect, PackingBox, DataImport },
	data() {
		return {
			loading: false,
			id: this.$route.query.id,
			bookingJobId: this.$route.query.bookingJobId,
			packingForm: {
				soList: [],
				sumCount: null,
				unboxed: null,
				sumQuantity: null,
				sumGrossWeight: null,
				sumVolume: null

			},
			containerListForm: {
				containerList: [
					// {
					//   disabled: true,
					//   id: '',
					//   containerNo: null, // 箱号
					//   containerType: '40HC222', // 箱型
					//   ownerType: null, // 箱属
					//   sealNo: null, //  封号
					//   vgmWeight: null, // vgm重量
					//   vgmMode: null, // 称重方式
					//   containerStatus: null, // 状态
					//   cargoList: [{
					//     soNo: null, //
					//     hscode: null, //
					//     quantity: null, // 重量
					//     packageType: null, //  包装单位
					//     grossWeight: null, //
					//     volume: null, //
					//     cargoDesc: null //
					//   }]
					// }
				]
			},
			editCopy: {},
			customerInformationForm: {},
			packageTypeList: [],
			isDisabled: false,
			showDataIportDialog: false,
			updateMsg: {
				btnText: '',
				code: '',
				name: ''
			},
			autoUpload: false,
			whiteList: ['xlsx', 'xls', 'XLSX', 'XLS'],
			bookingJobData: {}
		}
	},
	watch: {
		orderDetailsData(newVal) {
			this.customerInformationForm = newVal
			if (!this.bookingJobId && this.customerInformationForm.bookingJobId) {
				this.bookingJobId = this.customerInformationForm.bookingJobId
				this.getSeaBookingDetail()
				this.getContainerGather(this.bookingJobId)
				this.getContainerInfoList(this.bookingJobId)
			}
		}
	},
	computed: {
		url() {
			return URL
		}
	},
	created() {
		if (this.customerInformationForm.bookingJobId) {
			this.bookingJobId = this.customerInformationForm.bookingJobId
		}

		if (this.$isNotEmpty(this.orderDetailsData)) {
			this.customerInformationForm = this.orderDetailsData
			if (this.customerInformationForm.bookingJobId) {
				this.bookingJobId = this.customerInformationForm.bookingJobId
				this.getSeaBookingDetail()
				this.getContainerGather(this.bookingJobId)
				this.getContainerInfoList(this.bookingJobId)
			}
		} else if (this.bookingJobId) {
			this.getSeaBookingDetail()
			this.getContainerGather(this.bookingJobId)
			this.getContainerInfoList(this.bookingJobId)
		}

		// 获取基础数据
		dropdownlist({ termCode: 'PACKTYPE' }).then(res => {
			if (res.ok) {
				this.packageTypeList = res.content
			}
		})
	},
	methods: {
		// 获取订舱详情
		async getSeaBookingDetail() {
			this.loading = true
			const res = await seaBookingDetailApi(this.bookingJobId)
			this.loading = false
			if (res.ok) {
				this.bookingJobData = res.content
			}
		},
		packingUpdate() {
			this.getContainerGather(this.bookingJobId)
			this.getContainerInfoList(this.bookingJobId)
		},
		async getContainerGather(id) {
			this.loading = true
			const res = await containerGatherApi(id)
			this.loading = false
			if (res.ok) {
				if (this.$isNotEmpty(res.content.sumContainer)) {
					let str = ''
					for (let key in res.content.sumContainer) {
						str += `${key}*${res.content.sumContainer[key]} `
					}
					res.content.sumContainerStr = str
				}
				if (this.$isNotEmpty(res.content.unboxedContainer)) {
					let str = ''
					for (let key in res.content.unboxedContainer) {
						str += `${key}*${res.content.unboxedContainer[key]} `
					}
					res.content.unboxedContainerStr = str
				}
				this.packingForm = res.content
			}
		},
		async getContainerInfoList(id) {
			this.loading = true
			const res = await containerInfoListApi(id)
			this.loading = false
			if (res.ok) {
				res.content.map(item => {
					item.disabled = true
					if (this.$isEmpty(item.cargoList)) {
						item.cargoList = [{
							soNo: null, //
							hscode: null, //
							quantity: null, // 重量
							packageType: null, //  包装单位
							grossWeight: null, //
							volume: null, //
							cargoDesc: null // customerBlDetail
						}]
					}
				})
				this.$set(this.containerListForm, 'containerList', [])
				this.$nextTick(() => {
					this.$set(this.containerListForm, 'containerList', res.content)
				})
			}
		},
		validateContainerNo(item) {
			return (rule, value, callback) => {
				if (item === '53HC' ? !validContainerNo53HC(value) : !validContainerNo(value)) {
					callback(new Error(this.$t('blInfo.containerNoError')))
				} else {
					callback()
				}
			}
		},
		async addCargo(index, $index) {
			this.containerListForm.containerList[index].cargoList.push({
				soNo: null, //
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
		async delCargo(index, $index) {
			this.containerListForm.containerList[index].cargoList.splice($index, 1)
			// this.loading = true
			// const res = await delContainerApi(id)
			// if (res) {
			//   this.loading = false
			// }
		},
		editContainer(item, index) {
			this.editCopy = lodash.cloneDeep(item)
			item.disabled = false
			this.isDisabled = true
		},
		async save(item, index) {
			this.$refs['containerListForm' + index][0].validate(async valid => {
				if (valid) {
					this.loading = true
					const res = await loadJobApi(this.containerListForm.containerList[index])
					if (res.ok) {
						item.disabled = !item.disabled
						this.getContainerGather(this.bookingJobId)
						this.$message.success('保存成功！')
						this.isDisabled = false
						// this.$emit('change', '1')
					} else {
						this.loading = false
					}
				} else {
					this.mixinsFormScrollIntoView()
					return false
				}
			})

		},
		noSave(item, index) {
			this.$refs['containerListForm' + index][0].clearValidate()
			this.isDisabled = false
			this.$set(this.containerListForm.containerList, index, this.editCopy)

		},
		changeContainer(type) { // type = 2 退关 重新刷新列表
			this.getContainerGather(this.bookingJobId)
			this.getContainerInfoList(this.bookingJobId)
		},
		// 删除箱子
		async deletContainer() {
			this.changeContainer()
			//  this.containerListForm.containerList.splice(index, 1)
			// this.loading = true
			// const res = await delContainerApi(id)
			// this.loading = false
			// if (res.ok) {
			//   this.containerListForm.containerList.splice(index, 1)
			//
			// }
		},
		// 导入
		importPackingInformation() {
			this.updateMsg = {
				btnText: this.$t('sea.selectFileToImport'),
				code: 'PROXY',
				name: '客户委托书'
			}
			this.showDataIportDialog = true
		},
		colseDialog() {
			this.updateMsg = {
				btnText: '',
				code: '',
				name: ''
			}
			this.showDataIportDialog = false
		}
	}
}
</script>
<style lang="scss" scoped>
.icon {
	font-size: 28px;
	transition: all 0.2s ease 0s;
	cursor: pointer;
	user-select: none;
	&:hover {
		transform: scale(1.1);
	}
}
.blue {
	color: #1890ff;
}
.red {
	color: #ff4949;
}
.flex-bet {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-wrap: wrap;
}
.box_title {
	border-left: solid 3px rgb(24, 144, 255);
	font-size: 18px;
	color: #199ed8;
	padding-left: 8px;
	height: 28px;
	line-height: 28px;
	margin: 5px 0 8px 0;
	display: flex;
	.operate-buttons-left {
		margin-left: 20px;
	}
}
.box {
	background-color: #f5f7f7;
	padding: 8px;
	::v-deep .el-form-item--medium {
		.el-form-item__content {
			line-height: 28px;
		}
		.el-form-item__label {
			line-height: 28px;
		}
	}
}
.box_child {
	border: solid 1px rgba(121, 121, 121, 1);
	padding: 20px 30px;
	background: #fff;
	margin-bottom: 15px;
	.box25 {
		width: 20%;
	}
}
::v-deep .el-form--inline .el-form-item {
	display: block;
}
//**
.case-data-table {
	width: 90%;
	::v-deep {
		.el-form-item {
			margin: 10px 0;
		}
		.el-form-item__error {
			display: none;
		}
	}
}
</style>
