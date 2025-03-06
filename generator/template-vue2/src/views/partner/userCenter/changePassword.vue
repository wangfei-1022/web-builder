<template>
  <div v-loading="loading" class="right-main-wrapper">
    <el-form ref="form" :model="form" label-width="80px" size="mini" style="width: 300px">
      <el-form-item :label="$t('member.originalPwd')">
        <el-input :placeholder="$t('member.originalPwd')" v-model="form.oldPassword" show-password></el-input>
      </el-form-item>
      <el-form-item :label="$t('member.newPassword')">
        <el-input :placeholder="$t('member.newPassword')" v-model="form.newPassword" show-password></el-input>
      </el-form-item>
      <el-form-item :label="$t('member.confirmPwd')">
        <el-input :placeholder="$t('member.confirmPwd')" v-model="form.newPasswordAgain" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toChangePassword">{{$t('common.navbar.changePassword')}}</el-button>
        <el-button @click="backtoIndex">{{$t('common.cancelBtn')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePassword } from '@/api/user'
export default {
  name: 'UserChangePassword',
  data() {
    return {
      loading: false,
      form: {
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: ''
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    backtoIndex() {
      this.$router.push('/')
    },
    toChangePassword() {
      if (this.form.oldPassword !== '' && this.form.newPassword !== '') {
        if (this.form.newPassword === this.form.newPasswordAgain) {
          changePassword({ oldPassword: this.form.oldPassword, newPassword: this.form.newPassword }).then(res => {
            if (res.ok) {
              this.$message.success(this.$t('member.passwordChanged'))
              this.isShowingChangePasswordDialog = false
              this.$store.dispatch('user/logout').then(() => {
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              })
            }
          })
        } else {
          return this.$message.error(this.$t('member.passwordInvalid'))
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
