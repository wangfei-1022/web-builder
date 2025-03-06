<template>
  <div class="contact-table">
    <el-button size="mini" type="primary" class="contact-add" @click="uploadAttachmentFn" v-if="operType !== 'DETAIL'">{{ $t("contract.uploadAttachment") }}</el-button>
    <el-table :data="attachmentList" border style="width: 100%">
      <el-table-column prop="originFileName" :label='$t("contract.attachment_info_name")'>
        <template slot-scope="{row}">
          <a class="link" :href="row.url" target="_blank">{{row.originFileName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="entityTypeName" :label='$t("contract.attachmentType")'></el-table-column>
      <el-table-column prop="uploadByName" :label='$t("contract.uploader")'></el-table-column>
      <el-table-column prop="uploadTime" :label='$t("contract.upload_time")'>
          <template slot-scope="{row}">
          <span>{{row.uploadTime | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label='$t("contract.operation")'>
        <template slot-scope="{row, $index}">
          <a class="link" :href="row.url" target="_blank">{{$t("contract.view")}}</a>
          <a class="link delete" @click="deleteFn($index)" v-if="operType !== 'DETAIL' && operType !== 'ADJUST'">{{$t("contract.delete")}}</a>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="addVisible" :close-on-click-modal="false" width="400px" :title='$t("contract.uploadAttachment")'>
      <el-form ref="settlementFormRef" :rules="addFormRule" :model="addForm" label-width="120px" size="small" class="contact-form ">
        <el-form-item :label="$t('contract.attachmentType')" prop="entityType">
          <el-select v-model="addForm.entityType" size="mini" >
            <el-option v-for="item in attachmentTypeList" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('contract.uploadAttachment')" prop="businessLicence">
          <upload-file v-model="addForm.businessLicence" multiple></upload-file>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="addVisible = false">{{ $t("contract.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="addConfirmFn">{{ $t("contract.confirm") }}</el-button>
      </div>
    </el-dialog>

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
import { uploadFileContractSupplierApi, getAttachmentTypeListApi } from '@/api/partner/supplierContract'

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
				this.attachmentList = arr
			},
			deep: true,
			immediate: true
		}
	},
	data() {
		return {
			attachmentList: [],
			deleteVisible: false,
			deleteIndex: null,

      attachmentTypeList: [],
      addVisible: false,
      addLoading: false,
      addForm: {
        entityType: '',
        businessLicence: []
      },
      addFormRule: {
        entityType: [{ required: true, message: this.$t("contract.cannot_be_null"), trigger: "blur"}],
        businessLicence: [{ required: true, message: this.$t("contract.cannot_be_null"), trigger: "blur"}]
      }
		};
	},
	created() {
    this.getBase()
   },
	methods: {
    getBase() {
      Promise.all([getAttachmentTypeListApi()]).then(results => {
				const attachmentRes = results[0]
        if (attachmentRes.ok) {
          this.attachmentTypeList = attachmentRes.content || []
        }
			})
    },
    uploadAttachmentFn() {
      this.addForm = {
        entityType: '',
        businessLicence: []
      }
      this.addVisible = true
    },
		addConfirmFn() {
      this.$refs.settlementFormRef.validate(valid => {
        if (valid) {
          let entityTypeName = ''
          this.attachmentTypeList.forEach(v => {
            if (v.code === this.addForm.entityType) {
              entityTypeName = v.name
            }
          })
          this.addForm.businessLicence.forEach(v => {
            this.attachmentList.push({
              ...v,
              entityType: this.addForm.entityType,
              entityTypeName: entityTypeName
            })
          })
          this.addVisible = false
          if (this.operType === 'ADJUST') {
            let data = {
              id: this.id,
              attachments: this.attachmentList // 覆盖操作
            }
            uploadFileContractSupplierApi(data).then(res => {
              if (res.ok) {
                this.$message.success(this.$t("contract.attachment_info_success"))
              }
            })
          }
        }
      })
		},
		validate() {
      let VALIAD = false
			this.attachmentList.forEach(v => {
        if (v.entityType === 'cms_contract') {
          VALIAD = true
        }
      })
      if (!VALIAD) {
        this.$message.error(this.$t("contract.pleaseAddContractFile"))
      }
      return VALIAD
		},
		getValue() {
			return this.attachmentList
		},
		deleteFn(index) {
			this.deleteVisible = true
			this.deleteIndex = index
		},
		deleteConfirmFn() {
			if (this.deleteIndex !== null) {
				this.attachmentList.splice(this.deleteIndex, 1)
				this.deleteVisible = false
        if (this.operType === 'ADJUST') {
          let data = {
            id: this.id,
            attachments: this.attachmentList // 覆盖操作
          }
          uploadFileContractSupplierApi(data).then(res => {
            if (res.ok) {
              this.$message.success(this.$t("contract.delete_success"))
            }
          })
        }
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
.contact-form {
	::v-deep .el-form-item {
		width: 100% !important;
	}
}
</style>
