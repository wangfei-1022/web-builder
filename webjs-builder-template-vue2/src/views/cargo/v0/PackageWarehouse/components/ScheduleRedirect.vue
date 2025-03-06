<template>
  <router-link :to="{name: 'ScheduleDetail', params: {id: params.data.id}}" class="redirect-uri">{{params.value}}</router-link>
</template>
<script>
export default {
  name: 'RevokeOutboundBtn',
  data() {
    return {}
  },
  components: {},
  computed: {},
  methods: {},
  created() {}
}
</script>
<style>
  .redirect-uri{
    color: #007CFC;
  }
</style>
