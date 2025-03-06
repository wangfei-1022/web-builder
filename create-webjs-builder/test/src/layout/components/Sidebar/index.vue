<template>
  <div :class="{'has-logo':showLogo}">
    <!--<logo v-if="showLogo" :collapse="isCollapse" />-->
    <!-- <svg-icon icon-class="cargoware-logo2" style="width:180px;height:50px;" /> -->
    <!-- <div class="logo-container"> -->
      <!-- <i class="el-icon-ship" style="font-size:24px;margin-right:10px" /> -->
      <!-- <img src="@/assets/logo-yht.png"> -->
      <!--<span class="title">大禹</span>-->
    <!-- </div> -->
    <!--    <span style="width: 180px;height: 50px;color: #bfcbd9;font-size: 14px;text-align: center;line-height: 50px;display: inline-block;background: #304156">Cargo</span>-->
    <!-- <el-scrollbar wrap-class="scrollbar-wrapper" style="height:calc(100% - 50px)"> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="$route.path" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical" :default-openeds="['favorite', 'lastest']">
        <sidebar-item v-for="route in dashboard" :key="route.name" :item="route" :base-path="route.path" />
        <leftmenu-item v-if="favoriteMenuList.children.length > 0" :key="favoriteMenuList.name" :item="favoriteMenuList" :base-path="favoriteMenuList.path" />
        <leftmenu-item v-if="lastestMenuList.children.length > 0" :key="lastestMenuList.name" :item="lastestMenuList" :base-path="lastestMenuList.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import LeftmenuItem from './LeftmenuItem'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.module.scss'
import Layout from '@/layout'
export default {
  components: { LeftmenuItem, SidebarItem, Logo },
  data() {
    return {
      favoriteMenuList: {
        name: 'favorite',
        path: '',
        meta: {
          title: '常用菜单',
          icon: 'icon-star1'
        },
        children: [],
        title: '常用菜单'
      },
      lastestMenuList: {
        name: 'lastest',
        path: '',
        meta: {
          title: '最近使用',
          icon: 'icon-shalou'
        },
        children: [],
        title: '最近使用'
      }
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar',
      'favourRoutes',
      'lastestRoutes'
    ]),
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    dashboard() {
      return this.permission_routes.filter(item => item.name === 'Index')
    }
  },
  watch: {
    favourRoutes (newVal, oldVal) {
      this.favoriteMenuList.children = newVal
    },
    lastestRoutes(newVal, oldVal) {
      this.lastestMenuList.children = newVal
    }
  },
  mounted() {
    this.$store.dispatch('permission/getFavoriteRoutes')
    this.$store.dispatch('permission/getLatestRoutes')
  },
  craete() {}
}
</script>
<style scoped>
.logo-container {
  width: 180px;
  height: 50px;
  background: #304156;
  color: #97A8BE;
  display: flex;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  border-bottom: 0.5px solid #3a5169;
}
.logo-container img{
  height: 24px;
}
.logo-container .title{
  font-size: 18px;
  display: inline-block;
  margin-left: 8px;
}
</style>
