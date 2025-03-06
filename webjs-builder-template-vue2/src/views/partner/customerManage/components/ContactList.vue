<template>
  <div class="contact-table">
    <el-button size="mini" type="primary" @click="addOrEditContact()" :class="id ? 'contact-add inner-add' : 'contact-add'" v-if="!isDetail">
        {{ $t("customerManage.add") }}
    </el-button>
    <el-table ref="contactTable" :data="contactList" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" v-if="id"></el-table-column>
      <el-table-column prop="contact" :label='$t("customerManage.contact")' width="120"></el-table-column>
        <el-table-column prop="mobile" :label='$t("customerManage.mobile")' width="180"></el-table-column>
      <el-table-column prop="tel" :label='$t("customerManage.tel")' width="180"></el-table-column>
      <el-table-column prop="email" :label='$t("customerManage.email")' width="200"></el-table-column>
      <el-table-column prop="address" :label='$t("customerManage.address")' v-if="type == 'CUSTOMER'"> </el-table-column>
      <el-table-column prop="postStr" :label='$t("customerManage.post")'></el-table-column>
      <el-table-column prop="department" :label='$t("customerManage.department")'> </el-table-column>
      <el-table-column prop="remarks" :label='$t("customerManage.remarks")'> </el-table-column>
      <el-table-column prop="oper" :label='$t("customerManage.operation")' v-if="!isDetail && !id" width="100">
        <template slot-scope="{row, $index}">
          <a class="link" @click="addOrEditContact(row, $index)">{{$t("customerManage.edit")}}</a>
          <a class="link" @click="deleteFn($index)">{{$t("customerManage.delete")}}</a>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="contactVisible" v-if="contactVisible" :close-on-click-modal="false" :append-to-body="true" width="500px" :title="contactTitle">
      <el-form class="contact-form" ref="contactFormRef" :model="contactForm" :rules="contactFormRule" label-width="100px" size="small">
        <el-form-item :label='$t("customerManage.contact")' prop="contact">
          <el-input v-model="contactForm.contact" :disabled='!!contactForm.id'></el-input>
        </el-form-item>
        <el-form-item :label='$t("customerManage.mobile")' prop="mobile">
          <el-input v-model="contactForm.mobile" :disabled='!!contactForm.id' maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item :label='$t("customerManage.tel")' prop="tel">
          <el-input v-model="contactForm.tel" :disabled='!!contactForm.id' maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item :label='$t("customerManage.email")' prop="email">
          <el-input v-model="contactForm.email" :disabled='!!contactForm.id' maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item :label='$t("customerManage.address")' prop="address" v-if="type == 'CUSTOMER'">
          <el-input v-model="contactForm.address"></el-input>
        </el-form-item>
        <el-form-item :label='$t("customerManage.post")' prop="postArr">
           <el-select v-model="contactForm.postArr" size="mini" :placeholder="$t('customerManage.please_select')" multiple style="width: 100%">
              <el-option v-for="item in postList" :key="item.code" :label="item.name" :value="item.code"/>
            </el-select>
        </el-form-item>
        <el-form-item :label='$t("customerManage.department")' prop="department">
          <el-input v-model="contactForm.department"></el-input>
        </el-form-item>
        <el-form-item :label='$t("customerManage.remarks")' prop="remarks">
          <el-input type="textarea" v-model="contactForm.remarks"></el-input>
        </el-form-item>
        <div style="margin-left: 100px" v-if="type == 'CUSTOMER'">
          <el-checkbox v-model="contactForm.billReceiveFlag">{{$t("customerManage.bill_receive")}}</el-checkbox>
          <el-checkbox v-model="contactForm.invoiceReceiveFlag">{{$t("customerManage.invoice_receive")}}</el-checkbox>
        </div>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="contactVisible = false">{{ $t("customerManage.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="contactConfirm">{{ $t("customerManage.confirm") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="deleteVisible" :close-on-click-modal="false" width="400px" :title='$t("customerManage.delete_contact")'>
      <div style="text-align: center; padding: 25px;">{{$t("customerManage.confirm_delete_contact")}}</div>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="deleteVisible = false">{{ $t("customerManage.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="deleteConfirmFn">{{ $t("customerManage.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deleteCheckApi, getCustomerLinkmanApi, addCustomerLinkmanApi, getPostTypeListApi } from "@/api/partner/customerManage"
import { getSupplierContactListApi, addSupplierLinkmanApi } from "@/api/supplierManage"
import { validateEmail } from "@/utils/validate";

export default {
	name: "ContactTable",
	props: {
		isDetail: {
			type: Boolean,
			default: false
		},
		id: {
			type: String,
			default: ''
		},
		list: {
			type: Array,
			default: function () {
				return []
			}
		},
		type: {
			type: String,
			default: ''
		}
	},
	watch: {
		list: {
			handler(val) {
				let arr = this.$extends(true, [], val)
				arr.forEach(x => {
					let postStr = []
					let post = []
					x.post.forEach(y => {
						post.push(y.postType)
						postStr.push(y.postName)
					})
					x.postStr = postStr.join('、')
					x.postArr = post
				})
				this.contactList = arr
			},
			deep: true
		}
	},
	data() {
		const validateEmailFn = (rule, value, callback) => {
			if (value) {
				if (validateEmail(value)) {
					callback();
				} else {
					return callback(this.$t("customerManage.email_error"));
				}
			} else {
				callback();
			}
		};

		return {
			deleteVisible: false,
			deleteIndex: null,

			index: null,
			customerTypeList: [],
			contactVisible: false,
			contactTitle: "",
			contactList: [],
			contactForm: {
				billReceiveFlag: 0,
				invoiceReceiveFlag: 0,
				contact: "",
				department: "",
				address: '',
				email: "",
				memberId: "",
				postArr: [],
				remarks: "",
				tel: "",
				mobile: ''
			},
			multipleSelection: [],
			postList: [],
			postMap: {},
			contactFormRule: {
				contact: [{
					required: true,
					message: this.$t("customerManage.contact_cannot_be_null")
				}],
				email: [{
					required: true,
					message: this.$t("customerManage.email_cannot_be_null")
				}, {
					validator: validateEmailFn,
					trigger: "blur"
				}]
			},
			countryList: []
		};
	},
	created() {
		this.getBaseDataFn()
		this.getContactList()
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getPostTypeListApi()]).then(results => {
				const postRes = results[0]
				if (postRes.ok) {
					this.postList = postRes.content
					this.postList.forEach(x => {
						this.postMap[x.code] = x.name
					})
				}
			})
		},
		getContactList() {
			if (this.id) {
				let fn = this.type === 'CUSTOMER' ? getCustomerLinkmanApi : getSupplierContactListApi
				fn(this.id).then(res => {
					if (res.ok) {
						res.content.forEach(x => {
							let postStr = []
							let post = []
							x.post.forEach(y => {
								post.push(y.postType)
								postStr.push(y.postName)
							})
							x.postStr = postStr.join('、')
							x.postArr = post
						})
						this.contactList = res.content
					}
				})
			}

		},
		getValue() {
			let arr = this.contactList
			arr.forEach(function (v) {
				let post = []
				v.postArr.forEach(function (x) {
					post.push({
						postType: x
					})
				})
				v.memberId = ''
				v.post = post
			})
			return this.contactList
		},
		contactConfirm() {
			this.$refs.contactFormRef.validate(valid => {
				if (valid) {
					if (!this.contactForm.mobile && !this.contactForm.tel) {
						this.$message.error(this.$t("customerManage.mobileTelCheck"))
						return
					}
					this.contactVisible = false;
					// 当这种情况 是直接调用接口 进行联系人的新增
					if (this.id) {
						let data = {
							...this.contactForm,
							postArr: this.contactForm.postArr || [],
							memberId: this.id
						}
						let post = []
						data.postArr.forEach(function (x) {
							post.push({
								postType: x
							})
						})
						data.post = post
						let fn = this.type === 'CUSTOMER' ? addCustomerLinkmanApi : addSupplierLinkmanApi
						fn(data).then(res => {
							if (res.ok) {
								this.$message.success(this.$t("customerManage.addSuccess"))
								this.getContactList()
							}
						})
					} else {
						let postStr = []
						this.contactForm.postArr.forEach(x => {
							postStr.push(this.postMap[x])
						})
						this.contactForm.postStr = postStr.join('、')
						if (this.index !== null && this.index >= 0) {
							this.contactList.splice(this.index, 1, this.contactForm);
						} else {
							this.contactList.push(this.contactForm);
						}
					}
				}
			})
		},
		addOrEditContact(item, index) {
			if (item) {
				this.index = index
				this.contactForm = {
					...this.contactForm,
					...item
				};
				this.contactTitle = this.$t("customerManage.edit_contact");
			} else {
				this.index = null
				this.contactForm = {
					billReceiveFlag: 0,
					invoiceReceiveFlag: 0,
					contact: "",
					department: "",
					address: '',
					email: "",
					memberId: "",
					postArr: [],
					remarks: "",
					tel: "",
					mobile: ""
				};
				this.contactTitle = this.$t("customerManage.add_contact");
			}
			this.contactVisible = true;
		},
		deleteFn(index) {
			this.deleteVisible = true
			this.deleteIndex = index
		},
		deleteConfirmFn() {
			if (this.deleteIndex !== null) {
				let item = this.contactList[this.deleteIndex]
				if (item.id) {
					deleteCheckApi(item.id).then(res => {
						if (res.ok && !res.content) {
							this.contactList.splice(this.deleteIndex, 1)
							this.deleteVisible = false
						}
					})
				} else {
					this.contactList.splice(this.deleteIndex, 1)
					this.deleteVisible = false
				}
			}
		},
		handleSelectionChange(val) {
			if (val.length > 1) {
				let delRow = val.shift()
				this.$refs.contactTable.toggleRowSelection(delRow, false);
			}
			this.multipleSelection = val
		},
		// 拱外层使用 来获取选中的行
		getSelectedRow() {
			return this.multipleSelection
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
	right: 10px;
	top: -55px;
}
.contact-add.inner-add {
	top: -40px;
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
