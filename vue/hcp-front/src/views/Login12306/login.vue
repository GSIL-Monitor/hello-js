<template>
  <div class="login-container">
    <h1>登录12306账号</h1>
    <div class="content">
      <p v-show="nameFocus || name">12306账号/邮箱/手机号</p>
      <cube-input
         v-model="name"
         placeholder="12306账号/邮箱/手机号"
         type="text"
         :clearable="true"
         class="account-input"
         @focus="nameFocus = true"
         @blur="nameFocus = false"
      ></cube-input>
      <p v-show="passFocus || pass">12306密码</p>
      <cube-input
         v-model="pass"
         placeholder="12306密码"
         type="password"
         :clearable="true"
         :eye="true"
         @focus="passFocus = true"
         @blur="passFocus = false"
      ></cube-input>
      <a href="/#/resetPass/phone">忘记账号名/密码 ></a>
      <cube-button :disabled="!name || !pass" @click="fetchLogin">登录12306</cube-button>
      <cube-button :light="true" @click="noAccount">无账号直接购票</cube-button>
    </div>
    <div class="footer">
      <cube-checkbox v-model="checked">同意<a href="#">《账号授权协议》</a>及同步12306账号常用联系人</cube-checkbox>
    </div>
  </div>
</template>

<script>
import { Input, Button, Checkbox } from 'cube-ui'
import api from 'service/api'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    CubeInput: Input,
    CubeButton: Button,
    CubeCheckbox: Checkbox,
  },
  data() {
    return {
      name: '',
      pass: '',
      nameFocus: false,
      passFocus: false,
      checked: true,
    }
  },
  methods: {
    ...mapActions([
      'update12306'
    ]),
    // 登录
    async fetchLogin() {
      const params = {
        account_name: this.name,
        account_pass: this.pass,
      }
      const res = await api.login12306(params);
      if (res.errno == 0) {
        let { account } = res
        this.update12306({ account12306: account.name, isLogin12306: true })
        this.$router.back()
      } else {
        // TODO 登陆失败的提示
      }
    },
    noAccount() {
      const { query } = this.$route
      // TODO 梳理登陆的上游页以及兜底调转页
      this.$router.push({
        path: '/buyTicket',
        query
      })
    }
  }
}
</script>

<style lang="less">
 .login-container{
   padding: 1.33rem;
   text-align: left;
   background: #ffffff;
   position: absolute;
   top: 4.14rem;
   left: 0;
   right: 0;
   bottom: 0;
   h1{
    font-family: 'PingFangSC-Medium';
    font-size: 22px;
    color: #333333;
    margin-top: 2.08rem;
    margin-bottom: 4rem;
    }
   .content{
     p{
       color: #C7C7C7;
       margin-bottom: 0.30rem;
     }
     .account-input{
       margin-bottom: 3rem;
     }
     .cube-input{
       border-bottom: 1px solid rgba(0,0,0,0.10);
       .cube-input-field{
        font-size: 20px;
        padding-left: 0 !important;
      }
     }
     .cube-input::after{
        border: none;
     }
     a{
       color: #666666;
       display: inline-block;
       margin-top: 1rem;
       margin-bottom: 3rem;
     }
     .cube-btn{
       font-size: 14px;
     }
     .cube-btn-light{
       margin-top: .83rem;
       border: 1px solid #5A6473;
       border-radius: 2px;
     }
   }
   .footer{
     position: fixed;
     left: 1.33rem;
     bottom: 0;
     font-size: 12px;
     color: #666666;
     .cube-checkbox{
       padding: 0;
     }
     a{
      color: #FC9153;
      line-height: 17px;
     }
   }
 }
</style>
