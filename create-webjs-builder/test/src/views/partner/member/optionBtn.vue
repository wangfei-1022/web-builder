<template>
  <div class="option-btn-wrap">
    <el-button
      v-if="params.data.auditingStatus !== 0"
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.viewFn(params.data)"
      v-permission="['mem:user:omc:view']"
    >
      {{$t('authorization.view')}}
    </el-button>
    <el-button
      v-if="params.data.auditingStatus !== 0"
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.changeNameFn(params.data)"
      v-permission="['mem:user:omc:update:name']"
    >
      {{$t('authorization.changeName')}}
    </el-button>
    <el-button
      v-if="params.data.auditingStatus === 2"
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.editFn(params.data)"
      v-permission="['mem:user:omc:edit']"
    >
      {{$t('authorization.edit')}}
    </el-button>
    <el-button
      v-if="params.data.auditingStatus === 2 && false"
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.addAccount(params.data)"
      v-permission="['mem:user:omc:open:account']"
    >
      {{$t('authorization.inception_business')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.authLoginFn(params.data)"
      v-permission="['mem:user:omc:login']"
    >
      {{$t('authorization.auth_login')}}
    </el-button>
  </div>
</template>
<script>
export default {
	name: 'OptionBtn',
	data() {
		return {}
	}
}
</script>
<style lang="scss" scoped>
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

