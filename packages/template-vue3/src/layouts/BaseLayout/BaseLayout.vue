<template>
  <ALayout class="layout">
    <Header />
    <ALayout class="body">
      <Sider />
      <MultiTabbed />
    </ALayout>
  </ALayout>
</template>

<script lang="ts">
import { usePassport } from '@/stores/user';
import { defineComponent } from 'vue';

export default defineComponent({
  beforeRouteEnter: async to => {
    const passport = usePassport();
    if (!passport.value) {
      const redirect = encodeURIComponent(to.fullPath);
      return {
        name: 'Login',
        query: { redirect },
      };
    }
  },
});
</script>

<script lang="ts" setup>
import Header from './components/Header.vue';
import MultiTabbed from './components/MultiTabbed.vue';
import Sider from './components/Sider.vue';
</script>

<style lang="less" scoped>
.layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: @color-bg-4;
}

.body {
  overflow: hidden;
}
</style>