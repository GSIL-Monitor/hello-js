<template>
  <div class="price">
    <div class="protocol font-12">
      <Checkbox v-model="agreeProtocol" class="buy-protocol">同意</Checkbox><span class="hight-light" @click="jumpToTicketProto">《火车票预定协议》</span>
      <div class="align-right"><span>查看</span><span class="hight-light" @click="showBuyTicketProto">《购票须知》</span></div>
      <!-- <span v-if="showChildProtocol" class="and-span">和</span><span class="hight-light" @click="jumpToChildProto" v-if="showChildProtocol">《购买儿童票须知》</span> -->
    </div>
     <!-- <Button :outline="false" :primary="true" :inline="true" class="btn-pay" @click="showToken">getToken</Button> -->
     <!-- <Button :outline="false" :primary="true" :inline="true" class="btn-pay" @click="showOpenID">openid</Button> -->
    <div class="order" >
       <div class="price-info">
          <div class="text">
            <span class="font-14">{{isNoPass ? '最高扣款': '预付金额'}}</span>
            <span class="order-price hight-light font-18">¥{{formatPrice(totalPrice - coupon)}}</span>
            <span class="passenger-num font-12">共{{passengersNum}}人</span>
          </div>
          <div class="coupon" v-if="coupon">券已抵扣<span>{{formatPrice(coupon)}}</span>元</div>
       </div>
       <Button :outline="false" :inline="true" :disabled="disabled" class="btn-pay" @click="onClick">
         {{isNoPass ? '开始抢票': '立即预订'}}
       </Button>
    </div>
    <!-- <div class="no-pass-order order font-17" v-if="isNoPass" @click="onClick">
      开始抢票（出票后自动扣款）
    </div> -->
  </div>
</template>
<script>
import { Button, Checkbox } from "cube-ui";
import { mapGetters, mapActions } from "vuex";
import api from "service/api";
import { goPay } from "@/service/pay.js";
import { getSignStatus } from "../../views/Reservation/signStatus";

let oldPrice;

export default {
  components: {
    Checkbox,
    Button
  },
  data() {
    return {
      agreeProtocol: true,
      query: {},
      chosenSeat: {},
      clickChildProtocol: false,
      coupon: 0,
      payfirst: false
    };
  },
  props: {
    pageType: {
      type: String,
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ["buyTicket", "grabTicket"].indexOf(value) !== -1;
      }
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    passengersNum: {
      type: Number,
      default: 0
    },
    passengerPhone: {
      type: String,
      default: ""
    },
    showChildProtocol: {
      type: Boolean,
      default: false
    },
    omegaInfo: {
      type: Object,
      default: null
    },
    isNoPass: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      vuexCoupon: "coupon"
    }),
    disabled: function(val) {
      let { passengersNum, agreeProtocol, passengerPhone } = this;
      return (
        !agreeProtocol ||
        passengersNum == 0 ||
        !new RegExp(/^\d{11}$/).test(passengerPhone)
      );
    }
  },
  created() {
    if (this.pageType === "grabTicket") {
      getSignStatus().then(isSign => {
        this.payfirst = isSign;
      });
    }
  },
  mounted() {},
  async updated() {
    if (oldPrice === this.totalPrice) {
      this.coupon = this.vuexCoupon;
      return;
    }
    oldPrice = this.totalPrice;
    const params = {
      pay_amount: this.totalPrice,
      pay_mod: this.payfirst ? 2 : 0
    };
    const res = await api.getCoupon(params);
    if (res.errno === 0) {
      const coupon = res.data.deduction_amount;
      this.coupon = coupon;
      this.updateCoupon({ coupon });
    }
  },
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions(["updateCoupon"]),
    formatPrice(val) {
      if (val < 0) return 0;
      return Number(val / 100) || 0;
    },
    onClick() {
      this.$emit("on-pre-pay");
      this.omegaInfo &&
        this.Omega(this.omegaInfo.clickKey, this.omegaInfo.clickName);
    },
    jumpToChildProto() {
      this.omegaInfo &&
        this.Omega(this.omegaInfo.childKey, this.omegaInfo.childName);
      this.clickChildProtocol = true;
    },
    jumpToTicketProto() {
      this.omegaInfo &&
        this.Omega(this.omegaInfo.allowKey, this.omegaInfo.allowName);
      // 跳转之后往url里增加标示位，当用协议页back到填写页时用作判断
      let { query } = this.$route;
      // let newQuery = Object.assign({}, query, { previous_proto: 1 });
      // this.$router.replace({ query: newQuery });
      // console.log('location.hash',location.hash)
      sessionStorage.setItem('previous_proto','1');
      this.$router.push("/protocol/ticketBookingNotice");
    },
    showBuyTicketProto() {
      this.omegaInfo &&
        this.Omega(
          "train_ticket_fillorder_notice_ck",
          "订单填写页面购票须知点击"
        );
      let { query } = this.$route;
      // 跳转之后往url里增加标示位，当用协议页back到填写页时用作判断
      // let newQuery = Object.assign({}, query, { previous_proto: 1 });
      // this.$router.replace({ query: newQuery });
      // console.log('location.hash',location.hash)
      sessionStorage.setItem('previous_proto','1');
      this.$router.push("/protocol/buyNotice");
    }
  }
};
</script>
<style scoped lang="less">
.price {
  width: 100%;
  background: #ffffff;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.16);
  .protocol {
    min-height: 2.5rem;
    background-color: #fafafa;
    display: flex;
    align-items: center;
    padding-left: 1.33rem;
    padding-right: 1.33rem;
    font-size: 10px;
    .align-right {
      color: #666666;
      text-align: right;
      margin-left: auto;
    }
    // flex-wrap: wrap;
    // div, span{
    //   display: inline-block;
    //   font-size: 12px;
    //   transform: scale(0.84);
    // }
    // span{
    //   display: inline-block;
    //   margin-left: -11px;
    // }
    .and-span {
      margin-left: -6px;
    }
    .buy-protocol {
      // flex-grow: 1
    }
    .cube-checkbox {
      padding: 0;
    }
  }
  .order {
    height: 70px;
    display: flex;
    align-items: center;
    padding-left: 1.33rem;
    padding-right: 1.33rem;
    .price-info {
      flex-grow: 1;
      // text-align: left;
      .coupon {
        padding-top: 3px;
        text-align: center;
        color: #999;
        span {
          color: #fc9153;
        }
      }
    }
    .passenger-num {
      color: #999999;
    }
    .btn-pay {
      height: 50px;
      font-size: 16px;
      width: 14.5rem;
    }
  }
  .no-pass-order {
    background-color: #fc9153;
    text-align: center;
    color: #fff;
    justify-content: center;
  }
}
/*5/5s/SE*/
@media only screen and (min-device-width: 320px) and (max-device-width: 320px) and (-webkit-min-device-pixel-ratio: 2) {
  .btn-pay {
    // height: 26px;
    padding: 7px 12px;
  }
}
</style>
<style lang="less">
.price {
  .dialog .dialog-footer {
    position: static !important;
  }
  .cube-checkbox-wrap {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
