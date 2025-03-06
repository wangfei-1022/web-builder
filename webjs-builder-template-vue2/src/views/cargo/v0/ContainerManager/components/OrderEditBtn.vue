<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" v-permission="['ctn:order:view']" @click="viewOwner">{{$t('common.viewBtn')}}</el-button>
    <el-button type="text" size="mini" v-permission="['ctn:order:view']" @click="editOwner">{{$t('common.editBtn')}}</el-button>
  </div>

</template>
<script>
export default {
  name: 'OrderEditBtn',
  data() {
    return {
      showDialog: false
    }
  },
  beforeMount() {
  },
  methods: {
    viewOwner() {
      this.$router.push({name: 'OrderDetail', params: {operate: 'view', id: this.params.data.id}})
    },
    editOwner() {
      this.$router.push({name: 'OrderDetail', params: {operate: 'edit', id: this.params.data.id}})
    }
  }
}
</script>
<style>
</style>
