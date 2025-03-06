<template>
  <div>
    <svg
      id="icon-daohang-tongjifenxi"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      class="report-svg"
      viewBox="0 0 1086 1024"
      @click="login"
    >
      <path
        d="M996.227879 44.311273v772.809697c0 17.687273-13.187879 32.147394-29.385697 32.147394h-176.376243c-16.228848 0-29.416727-14.429091-29.416727-32.147394V44.311273c0-17.687273 13.187879-32.116364 29.416727-32.116364h176.376243c16.197818 0 29.385697 14.36703 29.385697 32.116364z m-558.545455 772.747636V301.893818c0-17.749333 13.156848-32.178424 29.385697-32.178424h176.345212c16.228848 0 29.478788 14.429091 29.478788 32.178424v515.165091c0 17.780364-13.249939 32.209455-29.478788 32.209455h-176.345212c-16.228848 0-29.385697-14.429091-29.385697-32.209455z m-293.981091 32.209455h176.407273c16.166788 0 29.385697-14.429091 29.385697-32.209455v-257.551515c0-17.780364-13.218909-32.209455-29.385697-32.209455H143.701333c-16.197818 0-29.385697 14.429091-29.385697 32.209455v257.551515c0 17.780364 13.187879 32.209455 29.385697 32.209455zM0 938.077091V1024h1086.060606v-85.953939H0z"
        p-id="2511"
      />
    </svg>
    <a id="bi-link" :href="href" target="_blank" style="display: none">BI 报表</a>
  </div>
</template>
<script>
import {mapState} from 'vuex'

export default {
  name: 'BiReport',
  data() {
    return {
      href: `${process.env.VUE_APP_BI_URL}/webroot/decision/`
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  created() {},
  mounted() {},
  methods: {
    login() {
      this.$webTracker.send({
        logType: 'business',
        logCode: 'login',
        logName: 'BI',
        elementType: 'button',
        event: 'click',
        userName: this.user.name
      })

      window.jsonCallBack = data => {
        if (!data.errorCode) {
          document.getElementById('bi-link').click()
        } else {
          if (data.errorCode === '21300007') {
            this.$message.error('权限不足！')
          } else {
            this.$message.error(data.errorMsg || '权限不足！')
          }
        }
      }
      const element = document.createElement('script')
      element.type = 'text/javascript'
      let url = `${process.env.VUE_APP_BI_URL}/webroot/decision/login/cross/domain?callback=jsonCallBack`
      let data = {
        'fine_username': this.user.name,
        'fine_password': 'OD5H001',
        'validity': -1
      }
      Object.keys(data).forEach(function(v) {
        url += '&' + v + '=' + data[v]
      })
      element.src = url
      document.getElementsByTagName('head')[0].appendChild(element)
    }
  }
}
</script>
<style scoped>
  .report-svg {
    display: inline-block;
    cursor: pointer;
    fill: #35628a;
    width: 20px;
    height: 20px;
    vertical-align: 10px;
  }
</style>

