<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button
      v-if="params.value"
      type="text"
      size="mini"
      @click="params.context.componentParent.prePicFile(params.value)"
    >
      {{$t('common.viewBtn')}}
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'ChangeOrderViewImg',
  data() {
    return {

    }
  },
  beforeMount() {
  },
  methods: {

  }
}
</script>
<style>
  .edi-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
