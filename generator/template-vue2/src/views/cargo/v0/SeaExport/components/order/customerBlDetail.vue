<template>
  <div class="box" v-loading="loading">
    <CustomerBlList ref="CustomerBlList"
      v-if="page ===1 && $isNotEmpty(orderDetailsData)"
                    :orderDetailsData="orderDetailsData"
                    @changePage="changePage1"
                    :editableTabsValue="editableTabsValue"
                    @returnshipBossBlListLen="returnshipBossBlListLen"
                    :type="type"
                    @addCustomerBill="addCustomerBill"
    ></CustomerBlList>
    <CustomerBlEditBox v-if="page ===2 && $isNotEmpty(orderDetailsData)"
                       :orderDetailsData="orderDetailsData" :blId="blId"
                       :customSelect="customSelect" @changePage="changePage"
                       :editableTabsValue="editableTabsValue"
                       @returnBillDetails="returnBillDetails"
                       v-on="$listeners"
                       :type="type"></CustomerBlEditBox>
  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import CustomerBlList from './customerBlList'
import CustomerBlEditBox from './customerBlEditBox'
import CustomerBlEdit from './carrierBlEdit'
import CustomerBlEdit2 from './customerBlEdit2MBL'
export default {
	name: 'CustomerBlDetail',
	components: { CustomerBlList, CustomerBlEdit, CustomerBlEdit2, CustomerBlEditBox },
	props: {
		uploadRadioType: { type: String, default: null },
		orderDetailsData: { type: Object, default: () => { } },
		type: { type: String, default: null },
		editableTabsValue: { type: String, default: '4' },
		customSelect: { type: Array, default: () => [] },
		propsBlId: { type: String, default: null }
	},
	data() {
		return {
			loading: false,
			id: this.$route.query.id,
			dataForm: {},
			page: 1,
			customerInformationForm: {},
			blId: null
		}
	},
	computed: {
		url() {
			return URL
		},
		withoutAnimation() {
			return this.$store.state.app.sidebar.opened // 需要监听的数据
		},
		getCustomerBlList() {
			return this.$refs.CustomerBlList.getListData
		}
	},
	watch: {
		type(val) {
			if (val === 'list') {
				this.page = 1
			} else if (val === 'create' || val === 'edit') {
				this.page = 2
			}

		}
	},
	created() {
		if (this.propsBlId) {
			this.blId = this.propsBlId
		}
		if (this.type === 'list') {
			this.page = 1
		} else if (this.type === 'create' || this.type === 'edit') {
			this.page = 2
		}
	},
	methods: {
		addCustomerBill() {
			this.$emit('typeChange', 'edit')
		},
		returnshipBossBlListLen(val) {
			this.$emit('returnshipBossBlListLen', val)
		},
		returnBillDetails() {
			this.$emit('typeChange', 'list')
			this.blId = null
		},
		changePage1(val, id) {
			this.page = val
			this.blId = id
			this.$emit('typeChange', 'edit')
		},
		changePage(val) {
			this.page = val
		},
		clientEdit() {
			this.$router.push({ name: 'SeaExportOrderCreate', query: { id: this.id } })
		},
    tabPaneChange(select){
      this.$emit('change', '5', true, 'carrierCreate', select)
    }
	}
}
</script>
<style lang="scss" scoped>
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
	padding: 8px 8px 50px 8px;
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
//::v-deep .el-form--inline .el-form-item{ display: block}
//**
.oneToOne {
	font-size: 28px;
	font-weight: 500;
	transform: rotate(25deg);
	padding: 8px 12px;
	border-radius: 15px;
	margin-top: 30px;
}
.unmatched {
	border: 4px solid rgb(255, 204, 102);
	color: rgb(255, 204, 102);
}
.matched {
	border: 4px solid rgb(255, 255, 255);
	color: rgb(255, 255, 255);
}
</style>
