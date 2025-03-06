<template>
  <section class="menu-list-wrap">
    <ul class="menu-item-list">
      <li :class="['top-menu-item root-menu', {'active-root': currActiveIndex === index}]" v-for="(item, index) in mainList" :key="item.code" @mouseenter="shwoExtend(index)" @mouseleave="hideExtend">
        <span>{{item.title}}</span>
        <i class="iconfont icon-chevron-down-outline"></i>
      </li>
    </ul>
    <div :class="['extened-panel', {'active': shwoExtendMenu === true}]" @mouseenter="shwoExtend(currActiveIndex)" @mouseleave="hideExtend">
      <SubMenuPanel :parent="mainList" :active="currActiveIndex" ref="subMenuPanel" @hideExtendImmediately="hideExtendImmediately" />
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { generateTitle } from '@/utils/i18n'
import SubMenuPanel from './SubMenuPanel'
import Bus from '@/utils/eventBus.js'
export default {
  name: 'TopMenuList',
  components: {
    SubMenuPanel
  },
  data() {
    return {
      shwoExtendMenu: false,
      hideTimer: null,
      currActiveIndex: null,
      mainList: null
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes'
    ])
  },
  watch: {
    'permission_routes': function(newVal, oldVal) {
      this.mainList = newVal.filter(item => item.topMenu)
    },
    shwoExtendMenu: function(newVal, oldVal) {
      // 显示蒙层
      Bus.$emit('switchExtendMenu', this.shwoExtendMenu)
    },
    '$route': function(newVal, oldVal) {
      this.currActiveIndex = null
      this.shwoExtendMenu = false
    }
  },
  methods: {
    shwoExtend(index = null) {
      clearTimeout(this.hideTimer)
      if (!this.shwoExtendMenu) {
        this.shwoExtendMenu = true
      }
      if (index !== null) {
        this.switchMainMenu(Number(index))
      }
    },
    hideExtend() {
      if (this.shwoExtendMenu) {
        this.hideTimer = setTimeout(() => {
          this.shwoExtendMenu = false
          this.currActiveIndex = null
        }, 200)
      }
    },
    switchMainMenu(index) {
      this.currActiveIndex = index
      this.$refs.subMenuPanel.activeSubmemu = 0
    },
    hideExtendImmediately() {
      this.shwoExtendMenu = false
    }
  },
  mounted() {
    this.mainList = this.permission_routes.filter(item => item.topMenu)
  }
}
</script>

<style lang="scss" scoped>
.menu-list-wrap{
  height: 32px;
  width: 640px;
  overflow: hidden;
}
.menu-item-list{
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  color: #3F4341;
}
.root-menu{
  padding: 0 10px;
  .iconfont{
    display: inline-block;
    transition: all .3s;
  }
  &.active-root{
    // color: #1466BB;
    color: #36a3f7;
    .iconfont {
      transform: rotate(180deg);
    }
  }
}
.extened-panel{
  position: absolute;
  top: 64px;
  left: 0;
  z-index: 2200;
  width: 100%;
  height: 0;
  background: #fff;
  box-shadow: 0 2px 5px #ccc;
  &.active{
    height: 420px;
  }
}
</style>
