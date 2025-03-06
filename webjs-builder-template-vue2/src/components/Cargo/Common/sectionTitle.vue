<!--提交成功页面 -->
<template>
  <div class="section-title-wrap">
    <div class="title-text">{{title}}</div>
    <div class="switch-wrap" v-show="showSwitch">
      <el-switch v-model="switchVal" @change="switchChange"></el-switch>
      <span>{{valueText}}</span>
    </div>
    <slot name="importBtn"></slot>
  </div>
</template>

<script>
export default {
  name: 'SectionTitle',
  props: {
    title: {type: String, default: ''},
    showSwitch: {type: Boolean, default: false},
    value: {type: Boolean, default: true}
  },
  computed: {
    switchVal: {
      get: function() {
        return this.value
      },
      set: function(val) {
        return val
      }
    },
    valueText: function() {
      return this.switchVal ? '开' : '关'
    }
  },
  methods: {
    switchChange(val) {
      this.$emit('input', val)
    }
  },
  data() {
    return {}
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.section-title-wrap{
  width: 100%;
  height: 34px;
  line-height: 34px;
  background: #eee;
  margin-top: 30px;
  position: relative;
  &:before{
    position: absolute;
    content: '';
    width: 3px;
    height: 100%;
    background: rgb(67, 91, 137);
  }
  .title-text{
    display: inline-block;
    font-size: 14px;
    padding-left: 10px;
    vertical-align: middle;
  }
  .switch-wrap{
    display: inline-block;
    position: absolute;
    right: 10px;
    top: 0px;
    vertical-align: middle;
    z-index: 1000;
    span{
      font-size: 14px;
      color: #1F4267;
    }
  }
}
</style>
