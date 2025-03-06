<template>
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="customerInformationForm" @submit.native.prevent ref="customerInformationForm">
<!--      船期信息-->
      <div class="box_title">{{$t('sea.customerInformation')}}</div>
      <div class="box_child">
        <div class="flex-bet" style="min-width: 1000px">

        </div>

      </div>

    </el-form>
  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
export default {
	name: 'BookingAdd',
	props: {
		uploadRadioType: { type: String, default: null }
	},
	data() {
		return {
			loading: false,
			id: this.$route.query.id,
			customerInformationForm: {}
		}
	},
	computed: {
		url() {
			return URL
		}
	},
	created() { },
	methods: {
		clientEdit() {
			this.$router.push({ name: 'SeaExportOrderCreate', query: { id: this.id } })
		},
		clientBooking() {
			console.log(this.id)
		},
		clientCcancel() {
			console.log(this.id)
		},
		clientUploadEntrustment() {
			console.log(this.id)
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
</style>
