<template>
  <div class="right-menu">
    <template v-if="device!=='mobile'">
      <el-tooltip :content="$t('common.navbar.BIReport')" placement="bottom">
        <BiReport class="screenfull right-menu-item" />
      </el-tooltip>
      <el-tooltip :content="$t('common.navbar.messageCenter')" placement="bottom">
        <message class="screenfull right-menu-item" />
      </el-tooltip>
      <el-tooltip :content="$t('common.navbar.accountInfo')" placement="bottom">
        <user-center class="screenfull right-menu-item" />
      </el-tooltip>
      <el-tooltip :content="$t('common.navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item" />
      </el-tooltip>
      <el-tooltip :content="$t('common.navbar.hideFixed')" placement="bottom">
        <div class="right-menu-item icon-menu-box">
          <i class="iconfont icon-shouqi2" @click="hideFixed"></i>
        </div>
      </el-tooltip>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Message from '@/components/Message'
import Screenfull from '@/components/Screenfull'
import UserCenter from '@/components/UserCenter'
import BiReport from '@/components/BiReport'
import Bus from '@/utils/eventBus.js'
export default {
  name: 'RightMenu',
  components: {
    Message,
    Screenfull,
    UserCenter,
    BiReport
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    hideFixed() {
      Bus.$emit('hideTopMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
.right-menu {
  padding-right: 40px;
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
    height: 22px;
    font-size: 18px;
    color: #5a5e66;
    // vertical-align: text-bottom;
    vertical-align: middle;

    &.hover-effect {
      cursor: pointer;
      transition: background .3s;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }
  }
  .icon-menu-box{
    cursor: pointer;
    padding: 0;
    .icon-tudingqingchu {
      font-size: 28px;
      color: #D30707;
      display: inline-block;
      line-height: 24px;
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
</style>
