<template>
  <div class="logout" @click="logout">
    退出登陆
  </div>
</template>
<script>
export default {
  components: {

  },
  data() {
    return {

    }
  },
  props: {},
  computed: {},
  created() {},
  mounted() {

  },
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    logout() {
      localStorage.removeItem('token')
      sessionStorage.setItem('loginStatus', false)
      console.log('has remove')
      try {
        window.login.logout(() => {
          alert('logout success')
        }, error => {
          alert('logout failed')
        })
      } catch (e) {

      }
    }
  }
}
</script>
<style scoped lang="less">
  .logout {
    width: 100px;
    height: 50px;
    background-color: #FFF;
    border: 1px solid #FAFAFA;
    margin: 0 auto;
    margin-top: 100px;
    font-size: 18px;
    line-height: 50px;
  }
</style>
