<template>
  <div class="contact-table">
    <el-button size="mini" type="primary" @click="addOrEditFn()" class="contact-add">
      {{$t("uexpressProduct.add_router")}}
    </el-button>

    <el-table ref="contactTable" :data="dataList" border style="width: 100%" >
      <el-table-column prop="index" :label='$t("uexpressProduct.seq")' width="70">
        <template slot-scope="{$index}">
          <span>{{$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="departureAreaName" :label='$t("uexpressProduct.departure_area_name")' width="130" show-overflow-tooltip></el-table-column>
      <el-table-column prop="destinationAreaName" :label='$t("uexpressProduct.destination_area_name")' width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="oper" :label='$t("uexpressProduct.operation")' fixed="right">
        <template slot-scope="{row, $index}">
          <a class="link" @click="addOrEditFn(row, $index)">{{$t("uexpressProduct.edit")}}</a>
          <a class="link" @click="deleteFn(row, $index)">{{$t("uexpressProduct.delete")}}</a>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="visible" v-if="visible" :close-on-click-modal="false" :append-to-body="true" width="500px" :title="addOrEditTitle">
      <el-form class="contact-form" ref="formRef" :model="form" :rules="formRule" label-width="100px" size="small">
        <el-form-item :label='$t("uexpressProduct.departure_area_name")' prop="departureAreaCode">
           <el-select v-model="form.departureAreaCode" size="mini" style="width: 100%" filterable disabled>
              <el-option v-for="item in departureList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode"/>
            </el-select>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.destination_area_name")' prop="destinationAreaCode">
           <el-select v-model="form.destinationAreaCode" size="mini" style="width: 100%" filterable>
              <el-option v-for="item in areaChannelList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode"/>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="visible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="confirmFn">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { updateChannelApi } from "@/api/uexpress/channelList"
import { getChannelDepartureApi, getProductAreaChannelApi } from "@/api/uexpress/base";

export default {
	name: "ProductLine",
	props: {
    lines: {
			type: Array,
			default: function() {
        return []
      }
		},
    detail: {
			type: Object,
			default: function() {
        return {}
      }
		}
	},
	data() {
		return {
			index: null,
			visible: false,
			addOrEditTitle: "",
			dataList: [],
			form: {
				departureAreaCode: "CN",
        departureAreaName: '中国',
        destinationAreaCode: "",
        destinationAreaName: ''
			},
			formRule: {
				departureAreaCode: [{required: true,	message: this.$t("common.cannot_be_null")}],
				destinationAreaCode: [{required: true,	message: this.$t("common.cannot_be_null")}]
			},
			departureList: [],
      areaChannelList: []
		};
	},
	created() {
		this.getBaseDataFn()
     this.dataList = this.$extends(true, [], this.lines)
    this.id = this.$route.query.id
	},
	methods: {
		getBaseDataFn() {
			Promise.all([
        getChannelDepartureApi({areaType: 2}),
        getProductAreaChannelApi({productId: this.detail.productId, areaType: 2})]).then(results => {
        const departureRes = results[0]
        const areaChannelRes = results[1]
				if (departureRes.ok && departureRes.content) {
					this.departureList = [departureRes.content]
				}
				if (areaChannelRes.ok) {
					this.areaChannelList = areaChannelRes.content
				}
			})
		},
		getValue() {
			let arr = this.dataList
			return arr
		},
		confirmFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					this.visible = false;

          this.areaChannelList.forEach(v => {
            if (v.areaCode === this.form.destinationAreaCode) {
              this.form.destinationAreaName = v.areaName
            }
          })

          let arr = this.$extends(true, [], this.dataList)
          let msg = ""
					if (this.index !== null && this.index >= 0) {
            arr.splice(this.index, 1, this.form);
            msg = this.$t("uexpressProduct.update_success")
          } else {
            arr.push(this.form);
            msg = this.$t("uexpressProduct.add_success")
          }

          let data = {
            ...this.detail,
            lines: arr
          }
          updateChannelApi(data).then(res => {
            if (res.ok) {
              this.dataList = arr
              this.$message.success(msg)
              this.$emit('success')
            }
          })
				}
			})
		},
		addOrEditFn(item, index) {
			if (item) {
				this.index = index
				this.form = {
					...this.form,
					...item
				};
				this.addOrEditTitle = this.$t("uexpressProduct.edit");
			} else {
				this.index = null
				this.form = {
					departureAreaCode: "CN",
          departureAreaName: '中国',
          destinationAreaCode: "",
          destinationAreaName: ''
				};
				this.addOrEditTitle = this.$t("uexpressProduct.add");
			}
			this.visible = true;
		},
		deleteFn(item, index) {
      this.$confirm(this.$t("uexpressProduct.delete_info_confirm"), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
				let arr = this.$extends(true, [], this.dataList)
        let data = {
          ...this.detail,
          lines: arr
        }
        updateChannelApi(data).then(res => {
          if (res.ok) {
            this.$emit('success')
            this.dataList.splice(index, 1)
            this.$message.success(this.$t("uexpressProduct.delete_success"))
          }
        })


      }).catch(() => {})
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
