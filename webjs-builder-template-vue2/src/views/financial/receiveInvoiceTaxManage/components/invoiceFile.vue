<template>
	<div>
		<el-tabs v-if="tabs.length" v-model="activeName" tab-position="left" style="min-height: 400px">
			<el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.fileTypeName" :name="item.fileTypeCode">
				<span slot="label">
					<div style="width:100px;text-align: left;">
						<el-checkbox v-model="item.checked" style="float:left;margin-right:8px;"></el-checkbox> {{item.fileTypeName}}
					</div>
				</span>
				<div class="img-container">
					<div class="img-block" v-for="(file, index) in item.fileList" :key='index'>
						<el-image :src="file.fileUrl" fit="contain">
							<div slot="error" class="image-slot">
								<svg-icon iconClass="icon-bianzu14beifen3" />
							</div>
						</el-image>
						<a class="demonstration" :href="file.fileUrl" target="blank">{{file.fileName}}</a>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
		<div v-if="!tabs.length" style="text-align: center;line-height: 300px;">{{$t("fmsReceiveInvoice.noContent")}}</div>
		<div style="margin-bottom: 20px">
			<el-button size="mini" type="primary" @click="fileDownload" v-if="tabs.length">{{$t("fmsReceiveInvoice.batchDownload")}}</el-button>
		</div>
	</div>
</template>
<script>
import { getTaxInvoiceFilesApi, getCommercialInvoiceFilesApi, invoiceTaxDownloadFilesByIdApi, invoiceCommercialDownloadFilesByIdApi } from "@/api/financial/fmsReceiveInvoice";

export default {
	name: "FmsTaxInvoiceDetail",
	props: {
		id: {
			type: [String, Number],
			default: ""
		},
		invoiceType: {
			type: [String, Number],
			default: ""
		}
	},
	data() {
		return {
			activeName: "first",
			bill: {},
			tableData: [],
			visible: false,
			tabs: []
		};
	},
	created() {
		this.getDetail();
	},
	methods: {
		fileDownload() {
			let type = [];
			this.tabs.forEach(v => {
				if (v.checked) {
					type.push(v.fileTypeCode);
				}
			});
			if (type.length === 0) {
        // 请先选一个下载的文件类型
				this.$message.error(this.$t("fmsReceiveInvoice.pleaseSelectFileType"));
				return;
			}
			let fn = this.invoiceType === 3 ? invoiceCommercialDownloadFilesByIdApi : invoiceTaxDownloadFilesByIdApi;
			fn(this.id, type).then(res => {
				if (res.ok) {
					window.location.href = res.content.url;
				}
			});
		},
		getDetail() {
			let map = {};
			let fn = this.invoiceType === 3 ? getCommercialInvoiceFilesApi : getTaxInvoiceFilesApi;
			this.tabs = [];
			fn(this.id).then(res => {
				if (res.ok && res.content && res.content.length) {
					res.content.forEach(v => {
						// 如果没有 则init
						if (!map[v.fileTypeCode]) {
							map[v.fileTypeCode] = {
								fileTypeCode: v.fileTypeCode,
								fileTypeName: v.fileTypeName,
								fileList: [],
								checked: false
							};
						}
						map[v.fileTypeCode].fileList.push({
							fileUrl: v.fileUrl,
							fileName: v.fileName
						});
					});
					let arr = [];
					Object.keys(map).forEach(v => {
						arr.push(map[v]);
					});
					this.activeName = arr[0].fileTypeCode;
					this.tabs = arr;
				}
			});
		},
		backList() {
			this.$store.dispatch("tagsView/delView", this.$route);
			this.$router.push({ name: "FmsTaxInvoiceListFinance" });
		}
	}
};
</script>
<style lang="scss" scoped>
.page-edit-container .page-edit-content {
	padding: 0;
	background: #fff;
}
.dialog-footer {
	text-align: left;
}
.img-container {
	.img-block {
		float: left;
		margin-right: 15px;
		margin-bottom: 15px;

		.demonstration {
			display: block;
			color: #1890ff;
			font-size: 14px;
			margin-top: 6px;
			text-align: center;
		}
		.el-image {
			width: 185px;
			height: 150px;

			::v-deep .image-slot {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100%;
				font-size: 56px;
			}
		}
	}
}

::v-deep .el-tabs__item {
	padding-left: 0 !important;
	height: 30px;
	line-height: 30px;
}
</style>

