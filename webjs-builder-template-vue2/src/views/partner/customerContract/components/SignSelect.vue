<template>
  <div>
    <el-select v-model="memberSignatoryId" size="mini" @change="changeFn" class="member-signatory-id">
      <div slot="prefix" @click="addContact" style="text-align: left; padding-left: 10px;cursor: pointer; color: #3e84e9;">+添加</div>
      <el-option v-for="item in signList" :key="item.id" :label="item.contact" :value="item.id"/>
    </el-select>

    <el-dialog :visible.sync="contactVisible" :close-on-click-modal="false" :append-to-body="true" class="customize" width="800px" title="签约人">
      <div style="padding-top: 30px;">
        <contact-list ref="contactRef" :id="memberId" :type="type === 'CUSTOMER' ? 'CUSTOMER' : 'SUPPLIER'" />
      </div>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="contactVisible = false">{{ $t("contract.cancel")}}</el-button>
        <el-button size="mini" type="primary" @click="contactConfirm">{{ $t("contract.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCustomerSignListApi } from "@/api/partner/customerContract"
import { getSupplierContactListApi } from '@/api/supplierManage'
import ContactList from "@/views/partner/customerManage/components/ContactList"
export default {
	name: 'SignSelect',
  components: {
    ContactList
  },
	props: {
    type: {
      type: String,
      default: ''
    },
    memberId: {
      type: [String, Number],
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
	},
  watch: {
    value: {
			handler(val) {
        this.memberSignatoryId = val
			}
		},
    memberId() {
      this.init()
    }
  },
	data() {
		return {
      contactVisible: false,
      signList: [],
      memberSignatoryId: ''
		}
	},
	created() {
    this.init()
	},
	methods: {
    init() {
      this.memberSignatoryId = this.value
      if (this.type === 'CUSTOMER') {
        // 客户签约人的数据
        getCustomerSignListApi(this.memberId).then(res => {
          if (res.ok) {
            this.signList = res.content
          }
        })
      } else {
        // 供应商签约人的数据
        getSupplierContactListApi(this.memberId).then(res => {
          if (res.ok) {
            this.signList = res.content
          }
        })
      }
    },
    // 添加客户联系人
		addContact(e) {
			e.preventDefault()
			e.stopPropagation()
			this.contactVisible = true
		},
		// 选择了一个客户/供应商签约人
		contactConfirm() {
			let val = this.$refs.contactRef.getSelectedRow()
			if (val && val.length) {
				let item = val[0]
				// 判断是供应商签约人还是客户签约人
				let index = this.signList.findIndex(v => v.id === item.id)
        if (index < 0) {
          this.signList.push({
            id: item.id,
            contact: item.contact
          })
        }

				this.memberSignatoryId = item.id
        this.$emit('input', this.memberSignatoryId)
				this.contactVisible = false
			} else {
				this.$message.error('请先选择一行')
			}
		},
    changeFn() {
      this.$emit('input', this.memberSignatoryId)
    }
	}
}
</script>
<style scoped lang="scss">
.member-signatory-id {
	::v-deep.el-input__prefix {
		width: 100%;
		left: 0;
	}
	::v-deep .el-input__inner {
		padding-left: 50px;
	}
}
</style>
