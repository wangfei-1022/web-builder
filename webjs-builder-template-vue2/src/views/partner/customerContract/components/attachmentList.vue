<template>
  <div class="contact-table">
    <upload-file :show-file-list="false" class="contact-add" @success="attachmentUploadFn" v-if="operType !== 'DETAIL'"></upload-file>
    <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="originFileName" :label='$t("contract.attachment_info_name")'>
          <template slot-scope="{row}">
            <a class="link" :href="row.url" target="_blank">{{row.originFileName}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="uploadByName" :label='$t("contract.uploader")'></el-table-column>
        <el-table-column prop="uploadTime" :label='$t("contract.upload_time")'>
           <template slot-scope="{row}">
            <span>{{parseTime(row.uploadTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oper" :label='$t("contract.operation")'>
          <template slot-scope="{row, $index}">
            <a class="link" :href="row.url" target="_blank">{{$t("contract.view")}}</a>
            <a class="link" @click="deleteFn($index)" v-if="operType !== 'DETAIL' && operType !== 'ADJUST'">{{$t("contract.delete")}}</a>
          </template>
        </el-table-column>
    </el-table>

    <el-dialog :visible.sync="deleteVisible" :close-on-click-modal="false" width="400px" :title='$t("contract.delete_attachment")'>
      <div style="text-align: center; padding: 25px;">{{$t("contract.confirm_delete_attachment")}}</div>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="deleteVisible = false">{{ $t("contract.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="deleteConfirmFn">{{ $t("contract.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { uploadFileContractApi } from '@/api/partner/customerContract'
import { parseTime } from "@/utils";

export default {
	name: "AttachmentList",
	props: {
		id: {
			type: String,
			default: ''
		},
		operType: {
			type: String,
			default: ''
		},
		postList: {
			type: Array,
			default: function () {
				return []
			}
		},
		list: {
			type: Array,
			default: function () {
				return []
			}
		}
	},
	watch: {
		list: {
			handler(val) {
				let arr = this.$extends(true, [], val)
				this.tableData = arr
			},
			deep: true,
			immediate: true
		}
	},
	data() {
		return {
			tableData: [],
			deleteVisible: false,
			deleteIndex: null
		};
	},
	created() { },
	methods: {
		parseTime(value) {
			return value ? parseTime(value, '{y}-{m}-{d}') : ''
		},
		attachmentUploadFn(item) {
			this.tableData.push(item)
      if (this.operType === 'ADJUST') {
        let data = {
          id: this.id,
          attachments: this.tableData // 覆盖操作
        }
        uploadFileContractApi(data).then(res => {})
      }
		},
		getValue() {
			return this.tableData
		},
		deleteFn(index) {
			this.deleteVisible = true
			this.deleteIndex = index
		},
		deleteConfirmFn() {
			if (this.deleteIndex !== null) {
				this.tableData.splice(this.deleteIndex, 1)
				this.deleteVisible = false
			}
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
	right: 0px;
	top: -55px;
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
