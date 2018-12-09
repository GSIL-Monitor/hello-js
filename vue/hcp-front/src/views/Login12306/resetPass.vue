<template>
  <div class="reset-pass-container">
    <div class="header">
      <i class="cubeic-back"></i>
      <h1>找回密码</h1>
      <p>{{`通过${name}找回密码`}}</p>
    </div>
    <div class="content">
      <p v-show="passFocus || name">手机号码</p>
      <cube-input
         v-model="pass"
         placeholder="邮箱账号"
         type="text"
         :clearable="true"
         class="account-input"
         @focus="nameFocus = true"
         @blur="nameFocus = false"
      ></cube-input>
      <p v-show="passFocus || pass">证件类型</p>
      <cube-input
         v-model="pass"
         placeholder="12306密码"
         type="password"
         :clearable="true"
         :eye="true"
         @focus="passFocus = true"
         @blur="passFocus = false"
      ></cube-input>
      <p v-show="passFocus || pass">证件号码</p>
      <cube-input
         v-model="pass"
         placeholder="12306密码"
         type="password"
         :clearable="true"
         :eye="true"
         @focus="passFocus = true"
         @blur="passFocus = false"
      ></cube-input>
      <p v-show="passFocus || pass">验证码</p>
      <cube-input
         v-model="pass"
         placeholder="12306密码"
         type="password"
         :clearable="true"
         :eye="true"
         @focus="passFocus = true"
         @blur="passFocus = false"
      ></cube-input>
      <p v-show="passFocus || pass">手机验证码</p>
      <cube-input
         v-model="pass"
         placeholder="12306密码"
         type="password"
         :clearable="true"
         :eye="true"
         @focus="passFocus = true"
         @blur="passFocus = false"
      ></cube-input>
      <a href="/#/resetPass/email" v-if="name === '已校验的手机号'">手机号未通过核验？试试通过邮箱找回 ></a>
      <cube-button :disabled="true">找回密码</cube-button>
    </div>
  </div>
</template>

<script>
import { Style, Input, Button, Checkbox } from 'cube-ui'
export default {
  components: {
    CubeInput: Input,
    CubeButton: Button,
    CubeCheckbox: Checkbox,
  },
  data() {
    return {
      name: '已校验的手机号',
      pass: '',
      passFocus: false,
    }
  },
  mounted() {
    let flag = this.$route.path.split('/').slice(-1)[0];
    if (flag === 'phone') {
      this.name = '已校验的手机号';
    } else if (flag === 'email') {
      this.name = '邮箱账号';
    }
  },
  methods: {}
}
</script>

<style lang="less">
 .reset-pass-container{
   padding: 0 1.33rem 1.33rem;
   text-align: left;
   .header{
     margin-bottom: 4rem;
     h1{
      font-family: 'PingFangSC-Medium';
      font-size: 22px;
      color: #333333;
      margin-top: 2.08rem;
      margin-bottom: .83rem;
     }
     p{
       font-size: 14px;
       color: #999999;
     }
   }
   .content{
     button{
       margin-top: 3.08rem;
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
   }
 }
</style>
