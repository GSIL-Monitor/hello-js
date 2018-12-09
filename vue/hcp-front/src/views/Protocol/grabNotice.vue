<template>
  <div class="tips-container tips-container-iphonex">
    <div class="tip-container">
      <div class="tip-title">
        一、分开下单最有效
      </div>
      <div class="tip-content">
        抢票订单中，单个订单只有一位乘车人时，抢票成功率最高。多位乘车人时，建议分开下单抢票。
      </div>
    </div>
    <div class="tip-container">
      <div class="tip-title">
        二、重复下单不可靠
      </div>
      <div class="tip-content">
        相同车次相同出发时间建议多个预约单并不会提高成功率，建议不要重复下单。
      </div>
    </div>
    <div class="tip-container">
      <div class="tip-title">
        三、利用规律捡漏票
      </div>
      <div class="tip-content">
        <p>最有可能漏票的几个时间点：</p>
        <ul>
          <li><span class="radius-span"><span>1</span></span>开售后每天整点、半点（分批放票时间点）</li>
          <li><span class="radius-span"><span>2</span></span>开售后45分钟（未及时支付的漏票）</li>
          <li><span class="radius-span"><span>3</span></span>开售前15天 - 退票高峰期</li>
          <li><span class="radius-span"><span>4</span></span>开车前24~48小时 - 剩余车票放票时间点</li>
        </ul>
        <!-- <p></p>
        <p><span class="radius-span"><span>2</span></span></p>
        <p><span class="radius-span"><span>3</span></span></p>
        <p><span class="radius-span"><span>4</span></span></p> -->
      </div>
    </div>
    <div class="tip-container">
      <div class="tip-title">
        四、提前预约抢票快
      </div>
      <div class="tip-content">
        开售前下单，系统持续监测放票时间，临近开售时间系统提前登录排队，一旦开售，即刻发起占座。
      </div>
    </div>
    <div class="tip-container">
      <div class="tip-title">
        五、兜底必选多座席
      </div>
      <div class="tip-content">
        春运等高峰时期，各类票源均紧俏，建议多选座席、车次和日期，作为兜底出行方案。
      </div>
    </div>
    <div class="tip-container">
      <div class="tip-title">
        六、避免多平台抢票
      </div>
      <div class="tip-content">
        同一个12306账号在多处同时下单会互相干扰，影响抢票成功率。若已在多平台下单且同一车票支付多次时，系统会自动退还多余票款。
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  created() {
    const { no_header } = this.$route.query;
    this.changeHeader({
      headerStatus: no_header
    });
  },
  mounted() {
    document.getElementsByTagName("title")[0].innerHTML = "抢票攻略";
    const { no_header } = this.$route.query;
    if (!no_header) {
      this.Omega("train_ticket_grablist_raiders_sw", "抢票攻略点击后页面展现");
    }
  },
  beforeDestroy() {
    document.getElementsByTagName("title")[0].innerHTML = "滴滴火车票";
  },
  methods: {
    ...mapActions(["changeHeader"])
  }
};
</script>

<style lang="less" scoped>
.tips-container {
  background: #ffffff;
  height: 100%;
  padding: 2.08em 2.08em 0 2.08em;
  .tip-container {
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    text-align: left;
    margin-bottom: 24px;
    .tip-title {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #333333;
      line-height: 22px;
      margin-bottom: 14px;
    }
    .tip-content {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      line-height: 22px;
      margin-bottom: 17px;
      .radius-span {
        display: inline-block;
        width: 1.17rem;
        height: 1.17rem;
        background: #fc9153;
        color: #ffffff;
        border-radius: 50%;
        margin-right: 0.5rem;
        & > span {
          display: block;
          line-height: 1.17rem;
          text-align: center;
        }
      }
      ul {
        line-height: 24px;
      }
    }
  }
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    .tips-container-iphonex{
      margin-bottom:34px;
    }
    .tips-container-iphonex::after {
      display: block;
      content: "";
      height: 34px;
      background: #fff;
    }
  }
}
</style>
