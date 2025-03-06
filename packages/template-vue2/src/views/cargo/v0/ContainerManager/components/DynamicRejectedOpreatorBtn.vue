<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="modifyDetail" v-permission="['ctn:status:log:add']">{{$t('common.modifyBtn')}}</el-button>
  </div>
</template>
<script>
export default {
  name: 'DynamicRejectedOpreatorBtn',
  data() {
    return {}
  },
  components: {},
  computed: {},
  methods: {
    async modifyDetail() {
      this.$router.push({name: 'DynamicRejectModify', params: {id: this.params.data.id}})
    }
  },
  created() {}
}
</script>
<style>
</style>
