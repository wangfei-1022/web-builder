<template>
  <div>
    <el-popover
      placement="bottom-end"
      title=""
      width="200"
      trigger="click">
      <div class="notification-container">
        <!-- <div class="notification-title">
          <span class="left">{{$t('common.navbar.accountInfo')}}</span>
        </div> -->
        <div class="avator-wrap">
          <img src="@/assets/userAvator2.png" alt="">
          <div class="name-show">{{this.userInfo.chineseName}}</div>
        </div>
        <ul>
          <li>
            <el-button type="text" icon="iconfont icon-security" @click="redirectChangePassword">{{$t('common.navbar.changePassword')}}</el-button>
          </li>
          <li>
            <el-button type="text" icon="iconfont icon-paperclip" @click="redirectSubscribeList">{{$t('common.navbar.subscribeConfig')}}</el-button>
          </li>
          <li>
            <el-button type="text" icon="iconfont icon-paperplane" @click="redirectReceiver">{{$t('common.navbar.messageSender')}}</el-button>
          </li>
          <li>
            <el-button type="text" icon="iconfont icon-power" @click="logout">{{$t('common.navbar.logOut')}}</el-button>
          </li>
        </ul>
      </div>
      <div slot="reference" class="notification-btn">
        <div style="position: relative;" class="test">
          <i class="iconfont icon-quanxian top-account"></i>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'UserCenter',
    props: {},
    components: {},
    data() {
      return {
        userName: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    created() {},
    methods: {
      // 登出
      async logout() {
        await this.$store.dispatch('tagsView/delAllViews')
        await this.$store.dispatch('user/logout')
        // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        this.$router.push('/login')
      },
      // 修改密码
      redirectChangePassword() {
        this.$router.push({name: 'UserChangePassword'})
      },
      redirectSubscribeList() {
        this.$router.push({name: 'SubscribeList'})
      },
      redirectReceiver() {
        this.$router.push({name: 'ReceiverList'})
      },
      toChangePassword() {
        if (this.oldPassword !== '' && this.newPassword !== '') {
          if (this.newPassword === this.newPasswordAgain) {
            changePassword({ oldPassword: this.oldPassword, newPassword: this.newPassword }).then(res => {
              if (res.ok) {
                this.$message.success('修改成功，请重新登陆')
                this.isShowingChangePasswordDialog = false
                this.$store.dispatch('user/logout').then(() => {
                  this.$router.push(`/login?redirect=${this.$route.fullPath}`)
                })
              }
            })
          } else {
            return this.$message.error('两次输入的密码不一致')
          }
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .notification-btn {
    border: none;
    padding: 10px 0;
  }
  .test {
    height: 20px;
    line-height: 20px;
    margin-top: -8px;
    cursor: pointer;
  }
  .top-account {
    cursor: pointer;
    width: 20px;
    height: 20px;
    color: #35628a;
    font-size: 20px;
  }
  .notification-title {
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    text-indent: 10px;
  }
  .avator-wrap{
    width: 100%;
    height: 36px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    img {
      margin-left: 20px;
      width: 34px;
      height: 34px;
    }
    .name-show{
      margin-left: 20px;
      font-size: 16px;
    }
  }
  ul{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  ::v-deep .el-button{
    color: #97a8be;
    .iconfont{
      margin-right: 5px;
    }
  }
</style>
