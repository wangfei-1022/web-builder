<template>
  <div class="submenu-wrap">
    <div class="submenu-box" v-for="(item, index) in parent" :key="`parent-${item.code}`" v-show="index == active">
      <div class="menu-level2">
        <div :class="['menu-level2-box', {'active-submenu': activeSubmemu === subIndex}]" v-for="(submenu, subIndex) in item.children" :key="submenu.code" @mouseenter="activeSubmemu = subIndex">
          {{submenu.title}}
          <div class="menu-level3" v-show="activeSubmemu === subIndex">
            <ThirdMenu :thirdMenu="submenu.children" v-on="$listeners" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ThirdMenu from './ThirdMenu'
export default {
  name: 'SubmenuPanel',
  props: {
    parent: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: 0
    }
  },
  components: {
    ThirdMenu
  },
  data() {
    return {
      activeSubmemu: 0
    }
  },
  computed: { },
  methods: { },
  mounted() { }
}
</script>

<style lang="scss" scoped>
@mixin flexColumnBox {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-end;
}
@mixin flexRowBox {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.submenu-wrap{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  @include flexRowBox;
}
.submenu-box{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.menu-level2{
  width: 20%;
  height: 100%;
  @include flexColumnBox;
  padding-top: 20px;
  background: #F1F1F1;
}
.menu-level2-box{
  padding: 12px 0;
  font-size: 18px;
  padding-right: 20px;
  text-align: right;
  width: 100%;
  cursor: pointer;
  &.active-submenu{
    color: #36a3f7;
    text-decoration: underline;
    background: #fff;
  }
}
.menu-level3{
  position: absolute;
  top: 0;
  left: 20%;
  width: 79%;
  height: 100%;
  overflow: hidden;
  overflow-x: auto;
}
</style>
