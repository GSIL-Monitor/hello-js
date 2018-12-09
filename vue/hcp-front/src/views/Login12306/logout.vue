<template>
  <div class="account-manage">
    <div class="account">
      {{account12306}}
    </div>
    <div class="delete font-16" @click="logout">
      删除账号
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import api from 'service/api'

export default {
  components: {

  },
  data() {
    return {

    }
  },
  props: {},
  computed: {
    ...mapGetters({
      account12306: "account12306",
    })
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    async logout() {
      const params = {
        account_name: this.account12306
      }
      const res = await api.logout12306(params)
      if (res.errno == 0) {
        this.$router.back()
      }
    }
  }
}
</script>
<style scoped lang="less">
.account-manage {
  .account {
    background-color: #FFF;
    height: 4.33rem;
    line-height: 4.33rem;
    margin-top: 0.83rem;
    text-align: left;
    padding-left: 1.33rem;
  }
  .delete {
    font-family: PingFangSC-Medium;
    background-color: #FE4F27;
    height: 4.17rem;
    line-height: 4.17rem;
    color: #FFFFFF;
  }
}
</style>
