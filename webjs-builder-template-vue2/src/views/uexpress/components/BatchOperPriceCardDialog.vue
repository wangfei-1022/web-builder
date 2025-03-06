<template>
    <el-dialog :title="title" :visible.sync="visible" width="450px" @close="closeFn">
      <div v-if="state === 1">
        {{$t('uexpressPriceCard.batchOperInfo', { count: allIds.length, oper: title })}}
      </div>
      <div v-if="state === 2">
        {{$t('uexpressPriceCard.batchOperRuningInfo', { inCount: (allIds.length - ids.length), unCount: ids.length })}}
      </div>
      <div v-if="state === 4">
        {{$t('uexpressPriceCard.batchOperEndingInfo', { successCount: successIds.length, failCount: failIds.length })}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFn" size="mini" v-if="state === 1">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="startFn" size="mini" v-if="state === 1">{{$t('common.confirm')}}</el-button>

        <el-button type="primary" size="mini" :loading="true" v-if="state === 2">{{$t('uexpressPriceCard.excuteRuning')}}</el-button>

        <el-button @click="closeFn" size="mini" v-if="state === 4">{{$t('common.close')}}</el-button>
      </span>
    </el-dialog>
</template>

<script>

export default {
	name: "BatchOperPriceCardDialog",
	data() {
		return {
			title: '',
			visible: false,
      state: 1, // 1.init 2.start 3.stop 4.end
      allIds: [],
      ids: [],
      remainIds: [],
      successIds: [],
      failIds: [],
      oper: '',
      api: null
		}
	},
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.refreshFn);
  },
	methods: {
    init() {
      this.state = 1
      this.allIds = []
      this.ids = []
      this.remainIds = []
      this.successIds = []
      this.failIds = []
      this.oper = ''
      this.api = null
    },
    refreshFn(e) {
      e.returnValue = '确定要刷新页面吗？';
    },
		show(config) {
      this.init()
      this.allIds = this.$extends(true, [], config.ids)
      this.ids = this.$extends(true, [], config.ids)
      this.title = this.$t(config.oper)
      this.oper = config.oper
      this.api = config.api
      this.visible = true
		},
    startFn() {
      this.state = 2
      window.addEventListener('beforeunload', this.refreshFn);
      this.submitFn()
    },
		async submitFn() {
      if (this.ids.length) {
        let id = this.ids.shift()
        let data = {
          offerVersionIds: [id]
        }
        const res = await this.api(data)
        this.submitFn()
        if (res.ok) {
          this.successIds.push(id)
        } else {
          this.failIds.push(id)
        }
      } else {
        this.state = 4
        window.removeEventListener('beforeunload', this.refreshFn);
      }
		},
    closeFn() {
      window.removeEventListener('beforeunload', this.refreshFn);
      this.visible = false
      this.$emit('ok')
    }
	}
}
</script>
<style lang="scss" scoped>

</style>
