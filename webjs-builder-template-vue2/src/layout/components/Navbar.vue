<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" v-show="device!=='mobile'" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" :class="mobileBreadcrumb" />
    <notification />
    <!-- <div class="right-menu">
      <template v-if="device!=='mobile'">
        <div class="organization-wrap" style="display:inline-block;vertical-align: top;line-height:20px;padding-right:14px;color:#97a8be">
          {{ userInfo.userName }} | {{ userInfo.departmentName }} | {{ userInfo.officeName }} | {{ userInfo.tenantId }}
        </div>

        <message class="screenfull right-menu-item" />

        <notification />

        <el-tooltip content="BI报表" effect="dark" placement="bottom">
          <bi-report class="screenfull right-menu-item" />
        </el-tooltip>

        <el-tooltip content="全屏" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item" />
        </el-tooltip>

        <el-tooltip content="帮助中心" effect="dark" placement="bottom">
          <help-center class="screenfull right-menu-item" />
        </el-tooltip>

        <el-tooltip content="预警提醒" effect="dark" placement="bottom">
          <warning-alert class="screenfull right-menu-item" />
        </el-tooltip>

        <el-tooltip content="公告消息" effect="dark" placement="bottom">
          <board-message class="screenfull right-menu-item" />
        </el-tooltip>

        <el-tooltip content="在线客服" effect="dark" placement="bottom">
          <custom-service class="screenfull right-menu-item" />
        </el-tooltip>

        <user-info class="screenfull right-menu-item" @change-password-from-user-info-because-of-shit="$emit('change-password-from-navbar-because-of-shit')" />

        <el-button type="text" style="position:relative;top:-15px;" @click="logout">[注销]</el-button>
        <el-tooltip content="注销" effect="dark" placement="bottom">
          <logout class="screenfull right-menu-item" />
        </el-tooltip>

      </template>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Notification from '@/components/Notification'
// import { getUserInfo } from '@/utils/auth'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import BiReport from '@/components/BiReport'
// import HelpCenter from '@/components/HelpCenter'
// import WarningAlert from '@/components/WarningAlert'
// import BoardMessage from '@/components/BoardMessage'
// import CustomService from '@/components/CustomService'
// import UserInfo from '@/components/UserInfo'
// import Logout from '@/components/Logout'
// import SizeSelect from '@/components/SizeSelect'
// import LangSelect from '@/components/LangSelect'
// import ThemePicker from '@/components/ThemePicker'
// import Message from '@/components/Message'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Notification
    // ErrorLog,
    // Screenfull,
    // BiReport,
    // HelpCenter,
    // WarningAlert,
    // BoardMessage,
    // CustomService,
    // UserInfo,
    // Logout,
    // SizeSelect,
    // LangSelect,
    // ThemePicker,
    // Message
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ]),
    // userInfo() {
    //   return getUserInfo()
    // },
    mobileBreadcrumb() {
      return {
        'mobile-breadcrumb': this.device === 'mobile'
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
    &.mobile-breadcrumb{
      margin-left: 16px;
    }
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    position: absolute;
    top: 10px;
    right: 5px;

    &:focus {
      outline: none;
    }

    .screenfull {
      height: 20px;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      /*height: 100%;*/
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
