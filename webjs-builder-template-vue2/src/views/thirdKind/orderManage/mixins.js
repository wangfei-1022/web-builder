import { getThikPageListApi, getThikBusinessTypeListGroupApi, exportThikOrderApi } from '@/api/thirdKind'
import FmsSelect from '@/components/Form/FmsSelect.vue'
import operationBtn from './order/components/operationBtn'
import ImportOrderDialog from './components/ImportOrderDialog';
import ImportOrderChargeDialog from "./components/ImportOrderChargeDialog";
import getZHMixin from './order/components/getZHMixin.js'
import moment from 'moment'
export default {
	mixins: [getZHMixin],
	components: { 
        operationBtn, 
        FmsSelect,
        ImportOrderDialog,
        ImportOrderChargeDialog 
    },
	data() {
		return {
			formData: {
				orderNo: '',
				businessType: null,
				mblNo: '',
				polCode: null,
				podCode: null,
				supplierId: null,
				customerId: null,
				receivableState: null,
				payableState: null,
				orderState: null,
				lockOrderState: "",
                businessDate: [], // ETD
                eta: [],
				pageSize: 50,
				pageNum: 1
			},
			addForm: {
				businessType: null,
				businessTypeName: null,
				businessDate: null
			},
			total: 0,
			dataList: [],
			businessTypeList: [],
			
			gridOptionsRight: {},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			loading: false
		}
	},
	created() {
		this.gridOptionsRight = {
			context: {
				componentParent: this
			}
		}
		this.formData.goodsStatus = this.$route.meta.status
		this.init()
        this.formData.businessDate = [
            moment().subtract(15, 'days').startOf('day').valueOf(),
            moment().subtract(-15, 'days').endOf('day').valueOf()
        ]
	},
	mounted() {

	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.list()
		})
	},
	methods: {
        importOrderChargeFn(type) {
            this.$refs.importOrderChargeDialogRef.show(type)
        },
		/**
		 * 初始化数据
		 */
		async init() {
			let res = await getThikBusinessTypeListGroupApi({ groupCode: this.groupCode})
			if (res.ok) {
				this.businessTypeList = res.content[0].businessTypes || []
			}
		},
        importFn() {
            this.$refs.importOrderDialogRef.show()
        },
        exportFn() {
            this.loading = true
            let params = this.getParams()
            params.businessType = 'OVERSEAS_WAREHOUSE'
            exportThikOrderApi(params).then(res => {
              if (res.ok) {
                this.$message.success(this.$t('thirdKindOrder.exportSuccess'))
              }
              this.loading = false
            })
        },
		addItem() {
			this.addForm = {
				businessType: null,
				businessTypeName: null,
				businessDate: null
			}
            if(this.businessTypeList.length === 1) {
                this.addForm.businessType = this.businessTypeList[0].code
                this.addForm.businessTypeName = this.businessTypeList[0].chineseName
            }
			this.dialog.visible = true
		},
		businessTypeChange(val) {
			let businessData = this.businessTypeList.find(item => item.code === val)
			if (this.$isNotEmpty(businessData)) {
				this.addForm.businessTypeName = businessData.chineseName
			}
		},
		onReadyRight(params) {
			params.api.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
        getParams() {
            let data = {
                ...this.formData,
                groupCode: this.groupCode
            }
            // ETD
            if(this.formData.businessDate && this.formData.businessDate.length) {
                data.businessDateStart = this.formData.businessDate[0]
                data.businessDateEnd = this.formData.businessDate[1]
                delete data.businessDate
            }
            // ETA
            if(this.formData.eta && this.formData.eta.length) {
                data.etaStart = this.formData.eta[0]
                data.etaEnd = this.formData.eta[1]
                delete data.eta
            }
            return data
        },
		async list() {
			this.loading = true
            let data = this.getParams()
			const res = await getThikPageListApi(data).catch(res => {
				this.loading = false
			})
			if (res.ok) {
				this.dataList = res.content.list || []
				this.total = Number(res.content.total)
				this.loading = false
			} else {
				this.loading = false
			}
		},
		detailFn(row) {
			this.$router.push({ 
                name: `ThirdKindOrderDetail`, 
                query: { 
                    id: row.id, 
                    businessType: this.addForm.businessType,
                    businessTypeName: this.addForm.businessTypeName,
                    businessDate: this.addForm.businessDate,
                    groupCode: this.groupCode,
                    origin: this.origin
                } })
		},
		addItemFn(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					this.dialog.visible = false
                    let data = {
                        ...this.addForm,
                        
                    }
					data = JSON.stringify(data)
					this.$router.push({ 
                        name: `ThirdKindOrderAdd`, 
                        query: { 
                            businessType: this.addForm.businessType,
                            businessTypeName: this.addForm.businessTypeName,
                            businessDate: this.addForm.businessDate,
                            groupCode: this.groupCode,
                            origin: this.origin
                        } 
                    })
				} else {
					return false
				}
			})
		},
		cancelAddFn() {
			this.addForm.businessType = null
			this.addForm.businessDate = null
			this.dialog.visible = false
		},
		reset() {
			this.$refs.formData.resetFields()
			this.list()
		}
	}
}