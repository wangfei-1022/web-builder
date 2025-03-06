<template>
  <div class="top-menu-box">
    <div class="logo-box">
      <img src="@/assets/logo-yht.png">
    </div>
    <div class="main-menu-bar">
      <top-menu-list />
    </div>
    <div class="operation-menu-bar">
      <RightMenu />
    </div>
  </div>
</template>

<script>
import RightMenu from './RightMenu'
import TopMenuList from './TopMenuList'
export default {
  name: 'TopMenu',
  components: {
    TopMenuList,
    RightMenu
  },
  data() {
    return {}
  },
  computed: {}
}
</script>

<style lang="scss">
  .top-menu-box{
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .logo-box{
      height: 100%;
      overflow: hidden;
      line-height: 60px;
      padding-left: 20px;
      img {
        display: inline-block;
        vertical-align: middle;
        height: 86%;
        width: auto;
      }
    }
    .main-menu-bar{
      align-self: flex-end;
      padding-bottom: 10px;
    }
  }
</style>
