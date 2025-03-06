<template>
  <div class="contact-table">
    <div class="edit-table">
      <div class="contact-add">
        <el-button size="mini" type="primary" @click="addOrEditFn()" v-if="type == 'ADD' || isEdit">
           {{$t("uexpressProduct.add_product_restriction")}}
        </el-button>
        <i class="icon-oper el-icon-edit" @click="editFn" v-if="type == 'EDIT' && !isEdit"></i>
        <i class="icon-oper el-icon-circle-check" @click="saveFn" v-if="type == 'EDIT' && isEdit"></i>
      </div>

      <div class="restrictions" v-for="(item, index) in restrictions" :key="index">
        <restrictions-item
          :ref="'restrictions_item_' + index"
          :item="item"
          :weightTypeList="weightTypeList"
          :symbolList="symbolList"
          :isEdit="isEdit"
          :type="type"
          :index="index"
          @delete="deleteFn"
        ></restrictions-item>
      </div>
    </div>
  </div>
</template>
<script>
import { updateProductSalesApi } from "@/api/uexpress/productSales"
import { getDictListApi } from "@/api/uexpress/base";
import { updateChannelApi } from "@/api/uexpress/channelList";
import RestrictionsItem from './RestrictionsItem'

export default {
	name: "Restrictions",
  components: {
    RestrictionsItem
  },
	props: {
    restrictionsList: {
      type: Array,
      default: function() {
        return []
      }
    },
		id: {
			type: String,
			default: ''
		},
    type: {
      type: String,
			default: ''
    },
    contentType: {
      type: String,
			default: ''
    },
    detail: {
      type: Object,
			default: function() {
        return {}
      }
    }
	},
  watch: {
    restrictionsList: {
      handler(val) {
        this.restrictions = this.$extends(true, [], val)
      },
      deep: true,
      immediate: true
    }
  },
	data() {
		return {
			index: null,
			visible: false,
      isEdit: false,
      weightTypeList: [],
      restrictions: [],
      symbolList: []
		};
	},
	created() {
		this.getBaseDataFn()
	},
	methods: {
    validate() {
      if (this.restrictions.length === 0) {
        return true
      }
      let valid = true
      Object.keys(this.$refs).forEach(key => {
        let v = this.$refs[key][0].validate()
        if (!v) {
          valid = false
        }
      })
      return valid
    },
		getBaseDataFn() {
			Promise.all([getDictListApi(5), getDictListApi(6)]).then(results => {
				const weightTypeRes = results[0]
        const symbolRes = results[1]
        const currencyRes = results[2]
        if (weightTypeRes.ok) {
          this.weightTypeList = weightTypeRes.content
        }
        if (symbolRes.ok) {
          this.symbolList = symbolRes.content
        }
			})
		},
    editFn() {
      this.isEdit = true
    },
    saveFn() {
      let restrictions = []
      let valid = true
      Object.keys(this.$refs).forEach(key => {
        let refItem = this.$refs[key][0]
        if (refItem) {
          let v = refItem.validate()
          if (!v) {
            valid = false
          }
          let item = refItem.getValue()
          restrictions.push(item)
        }
      })
      if (!valid) {
        return
      }
      let data = {
        ...this.detail,
        restrictions: restrictions
      }
      let fn = this.contentType === 'PRODUCT' ? updateProductSalesApi : updateChannelApi
      fn(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('uexpressProduct.restriction_edit_success'))
          this.$emit('success')
          this.isEdit = false
        }
      })
    },
		getValue() {
			let restrictions = []
      Object.keys(this.$refs).forEach(key => {
        let item = this.$refs[key][0].getValue()
        restrictions.push(item)
      })
			return restrictions
		},
		addOrEditFn() {
      this.restrictions.push({})
		},
		deleteFn(index) {
			this.restrictions.splice(index, 1)
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

.icon-oper{
  font-size: 22px;
  cursor: pointer;
  color: #0085ff;
}
</style>
