<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="showModifyDialog">{{$t('packageWarehouse.modifyWarehouse')}}</el-button>
    <el-button type="text" size="mini" v-show="enabled" @click="disabledWarehouse">{{$t('packageWarehouse.disabledBtn')}}</el-button>
    <el-button type="text" size="mini" v-show="!enabled" @click="enabledWarehouse">{{$t('packageWarehouse.enabledBtn')}}</el-button>
  </div>

</template>
<script>
import { enableWarehouseApi, disableWarehouseApi } from '@/api/packageWarehouse'
export default {
  name: 'WarehouseOpreationBtn',
  data() {
    return {}
  },
  computed: {
    enabled: function() {
      return this.params.data.statusCode
    }
  },
  methods: {
    showModifyDialog() {
      this.params.modifyWarehouse(this.params.data)
    },
    async disabledWarehouse() {
      const res = await disableWarehouseApi(this.params.data.id)
      if (res.ok) {
        this.params.refresh()
      }
    },
    async enabledWarehouse() {
      const res = await enableWarehouseApi(this.params.data.id)
      if (res.ok) {
        this.params.refresh()
      }
    }
  },
  mounted() {},
  created() {}
}
</script>
<style>
</style>
