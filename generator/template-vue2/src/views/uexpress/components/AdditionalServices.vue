<template>
  <div class="contact-table">
    <div class="edit-table">
      <div class="contact-add">
        <i class="icon-oper el-icon-edit" @click="editFn" v-if="type == 'EDIT' && !isEdit"></i>
        <i class="icon-oper el-icon-circle-check" @click="saveFn" v-if="type == 'EDIT' && isEdit"></i>
      </div>

      <div class="service">
        <el-checkbox-group v-model="checkList" :disabled="!isEdit" v-if="type == 'EDIT' || type == 'DETAIL'">
          <div v-for="item in serviceList" :key="item.code" class="check-item">
            <el-checkbox :label="item.code" v-if="isEdit || (!isEdit && checkList.indexOf(item.code) >= 0)">{{item.name}}</el-checkbox>
          </div>
        </el-checkbox-group>
        <el-checkbox-group v-model="checkList" v-if="type == 'ADD'">
          <div v-for="item in serviceList" :key="item.code" class="check-item">
            <el-checkbox :label="item.code">{{item.name}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>
<script>
import { updateProductSalesApi } from "@/api/uexpress/productSales"
import { getDictListApi } from "@/api/uexpress/base";
import { updateChannelApi } from "@/api/uexpress/channelList";
import { getCountryListApi } from "@/api/country";

export default {
	name: "Restrictions",
  components: {

  },
	props: {
    vasesList: {
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
    vasesList(val) {
      let arr = []
      val.forEach(v => {
        arr.push(Number(v.vasCode))
      })
      this.checkList = arr
    }
  },
	data() {
		return {
			index: null,
			visible: false,
      isEdit: false,
      restrictions: [],
      serviceList: [],
      checkList: []
		};
	},
	created() {
		this.getBaseDataFn()
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictListApi(7)]).then(results => {
				const serviceRes = results[0]
        if (serviceRes.ok) {
          this.serviceList = serviceRes.content
        }
			})
		},
    editFn() {
      this.isEdit = true
    },
    saveFn() {
      let data = {
        ...this.detail,
        vaseCodes: this.checkList
      }
      let fn = this.contentType === 'PRODUCT' ? updateProductSalesApi : updateChannelApi
      fn(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('uexpressProduct.add_service_update_success'))
          this.isEdit = false
          this.$emit('success')
        }
      })
    },
		getValue() {
			return this.checkList
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

.link {
	color: #1890ff;
}
.check-item{
  float: left;
  margin-right: 10px;
}
.icon-oper{
  font-size: 22px;
  cursor: pointer;
  color: #0085ff;
}
</style>
