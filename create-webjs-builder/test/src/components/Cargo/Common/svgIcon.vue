<template>
  <svg class="icon" aria-hidden="true" :fill="iconColor">
    <use v-bind:xlink:href="`#${iconId}`"></use>
  </svg>
</template>
<script>
  // import '../../../../public/static/svgIconjs/iconfont'
  // import './svgjs/iconfont'
  export default {
    name: 'SvgIcon',
    props: {
      iconId: {type: String, require: true},
      iconColor: {type: String, default: '#515151'}
    }
  }
</script>
<style type="text/css">
  .icon {
   width: 1em; height: 1em;
   vertical-align: -0.15em;
   fill: currentColor;
   overflow: hidden;
   color: #515151;
  }
</style>
