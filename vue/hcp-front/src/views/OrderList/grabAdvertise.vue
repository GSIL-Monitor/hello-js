<template>
<div class="grab-index">
  <div class="post-container">
    <img :src="IconTrain" class="train-icon">
    <p class="post-title">滴滴火车票</p>
    <p class="post-content">急速云抢票，只为您出行无忧</p>
  </div>
  <div class="grab-container">
    <div class="grab-methods">
      <div class="grab-method">
        <div class="icon-background"><img :src="IconTimer" class="method-icon"></div>
        <p class="method-title">急速抢</p>
        <p class="method-content">成功率最高</p>
      </div>
      <div class="grab-method">
        <div class="icon-background"><img :src="IconReminder" class="method-icon"></div>
        <p class="method-title">预约抢</p>
        <p class="method-content">开售秒抢</p>
      </div>
      <div class="grab-method">
        <div class="icon-background"><img :src="IconCard" class="method-icon"></div>
        <p class="method-title">信用抢</p>
        <p class="method-content">先抢票后支付</p>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import IconTrain from '@/assets/images/index_train@3x.png'
import IconTimer from '@/assets/images/timer@2x.png'
import IconReminder from '@/assets/images/reminder@2x.png'
import IconCard from '@/assets/images/card@2x.png'
export default {
  name: 'grabIndex',
  data() {
    return {
      IconTrain,
      IconCard,
      IconReminder,
      IconTimer,
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.grab-index{
  // overflow-y: scroll;
  .post-container{
    height: 60%;
    background: #FFFFFF;
    text-align: center;
    border-bottom: 10px solid #F3F4F5;
    .train-icon{
      // display: block;
      transform: translateX(-5%);
      width: 20.67rem;
      height: 17.92rem;
      margin-top: 30px;
      margin-bottom: 22px;
    }
    .post-title{
      font-family: PingFangSC-Medium;
      font-size: 24px;
      color: #333333;
      line-height: 33px;
      margin-bottom: 2px;
    }
    .post-content{
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #333333;
      line-height: 22px;
      margin-bottom: 34px;
    }
  }
  .grab-container{
    height: 40%;
    background-color: #FFFFFF;
    .grab-methods{
      display: flex;
      justify-content: space-around;
      padding: 20px 0 10px;
      .grab-method{
        display: flex;
        flex-direction: column;
        align-items: center;
        .icon-background{
          width: 5rem;
          height: 5rem;
          line-height: 5rem;
          border-radius: 50%;
          background-color: #FFF5EA;
          margin-bottom: 11px;
          img{
            width: 3rem;
            height: 3rem;
            vertical-align: middle;
          }
        }
        .method-title{
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #333333;
          text-align: center;
          line-height: 22px;
          margin-bottom: 2px;
        }
        .method-content{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #333333;
          text-align: center;
          line-height: 20px;
          margin-bottom: 8px;
        }
      }
    }
  }


}

</style>
