<template>
  <el-dialog :visible.sync="visible" v-if="visible" :close-on-click-modal="false" :append-to-body="true" width="800px" title="约束">
    <el-button size="mini" type="primary" @click="addFn()" style="margin-bottom: 10px;">
        {{$t("uexpressProduct.add")}}
    </el-button>

    <div class="restrictions" v-for="(item, index) in restrictions" :key="index">
      <restrictions-item
        :ref="'restrictions_item_' + index"
        :item="item"
        :weightTypeList="weightTypeList"
        :symbolList="symbolList"
        :isEdit="isEdit"
        type=""
        :index="index"
        @delete="deleteFn"
      ></restrictions-item>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">{{$t("common.cancel")}}</el-button>
      <el-button type="primary" @click="submitFn" size="mini">{{$t("common.confirm")}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { updateProductLineApi, getProductLineDetailApi } from "@/api/uexpress/productLine";
import { getDictListApi } from "@/api/uexpress/base";
import RestrictionsItem from './RestrictionsItem';

export default {
	name: "Restrictions",
  components: {
    RestrictionsItem
  },

	data() {
		return {
      editItem: {},
      channelCode: '',
			index: null,
			visible: false,
      isEdit: false,
      weightTypeList: [],
      restrictions: [],
      symbolList: [],
      form: {
        restrictionCategory: ''
      }
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
    show(item, channelCode) {
      getProductLineDetailApi(item.productLineId).then(res => {
        if (res.ok) {
          this.editItem = res.content
          this.channelCode = channelCode
          this.visible = true
          let index = this.editItem.productLineChannels.findIndex(v => v.channelCode === channelCode)
          if (index >= 0) {
            let item = this.editItem.productLineChannels[index]
            this.restrictions = this.$extends(true, [], item.restrictions)
          }
        }
      })
    },
		getBaseDataFn() {
			Promise.all([getDictListApi(5), getDictListApi(6)]).then(results => {
				const weightTypeRes = results[0]
        const symbolRes = results[1]
        if (weightTypeRes.ok) {
          this.weightTypeList = weightTypeRes.content
        }
        if (symbolRes.ok) {
          this.symbolList = symbolRes.content
        }
			})
		},
    submitFn() {
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

      let data = this.$extends(true, {}, this.editItem)
      let index = data.productLineChannels.findIndex(v => v.channelCode === this.channelCode)
      if (index >= 0) {
        data.productLineChannels[index].restrictions = restrictions
      }
      data.productLineChannelDtos = data.productLineChannels
      delete data.productLineChannels
      updateProductLineApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t("uexpressProduct.restriction_edit_success"))
          this.visible = false
          this.$emit('refresh')
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
		addFn() {
      this.restrictions.push({})
		},
		deleteFn(index) {
			this.restrictions.splice(index, 1)
		}
	}
};
</script>
<style scoped lang="scss">

</style>
