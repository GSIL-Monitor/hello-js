<template>
  <div class="account">
    <div class="un-login" v-if="!isLogin12306" @click="goLogin">
      <div class="left" v-if="!isInPicker">
        <p class="font-14">登陆12306账号</p>
        <p class="font-12 tips">同步乘车人信息，购票更快速</p>
      </div>
      <div class="left" v-if="isInPicker" :class="{ 'is-in-picker': isInPicker }">
        <img :src="IconTrainAccount" class="icon-train-account">
        <div class="">
          <p class="font-14">12306账号未登录</p>
          <p class="font-12 tips">同步乘车人信息，购票更快速</p>
        </div>
      </div>
      <i class="right cubeic-arrow"></i>
    </div>
    <div class="has-login" v-if="isLogin12306">
      <div class="left">
        <span class="label font-14" v-if="!isInPicker">12306账号</span>
        <img :src="IconTrainAccount" class="icon-train-account" v-if="isInPicker">
        <span class="name font-14">{{account12306}}</span>
      </div>
      <i class="right cubeic-arrow"></i>
    </div>
  </div>
</template>
<script>
import IconTrainAccount from '@/assets/images/12306@3x.png'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {

  },
  data() {
    return {
      hasLogin: false,
      IconTrainAccount
    }
  },
  props: {
    isInPicker: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      isLogin12306: 'isLogin12306',
      account12306: 'account12306'
    })
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions([
      'update12306'
    ]),
    goLogin() {
      let { query } = this.$route
      this.$router.push({
        path: '/login12306',
        query
      })
    }
  }
}
</script>
<style scoped lang="less">
.account {
  height: 4.17rem;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  .un-login, .has-login {
    margin-left: 1.33rem;
    margin-right: 1.33rem;
    width: 100%;
    display: flex;
    align-items: center;
    .left {
      float: left;
      display: inline-block;
      text-align: left;
      color: #333333;
      line-height: 1.67rem;
      &.is-in-picker {
        display: flex;
        align-items: center;
        & > div {
          margin-left: 0.92rem;
        }
      }
      .icon-train-account {
        width: 1.25rem;
        height: 1.25rem;
      }
      .tips {
        color: #999999;
        line-height: 1.42rem;
      }
      .label {
        color: #999999;
        margin-right: 1rem;
      }
    }
    .right {
      flex-grow: 1;
      float: right;
      text-align: right;
    }
  }
}
</style>
