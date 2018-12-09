<template>
  <div class="buy-ticket">
    <div class="top-tips-message" v-if="notServiceTime">
      {{searchServiceText}}
    </div>
    <DirectionCard class="train-info" :trainInfo="trainInfo" :omegaInfo="{omegaKey:'train_ticket_fillorder_through_ck',omegaName:'订单填写页面经停信息点击'}"></DirectionCard>
    <!-- <Account class="account-info"></Account> -->
    <Passenger class="passenger-info" :omegaInfo="omegaInfo"></Passenger>
    <Contact
      :class="['contact-info', { 'extra-margin-bottom': !canChooseSeat && !coupon }]"
      :omegaInfo="{omegaKey:'train_ticket_fillorder_contact_ck',omegaName:'订单填写页面联系方式输入框点击'}"
    >
    </Contact>
    <Coupon :class="['coupon-info', {'extra-margin-bottom': !canChooseSeat }]" v-if="coupon" :coupon="coupon"></Coupon>
    <ChooseSeat
      :class="['seat-info', { 'extra-margin-bottom': canChooseSeat }]"
      v-if="canChooseSeat"
      :chooseSeat="chooseSeat">
    </ChooseSeat>
    <Pay
      class="price-info"
      pageType="buyTicket"
      :omegaInfo="priceOmegaInfo"
    >
    </Pay>
    <LockSeat class="lockseat-dialog-info" :trainInfo="trainInfo"></LockSeat>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import DirectionCard from "@/components/DirectionCard/index.vue";
import Account from "@/components/Account/account.vue";
import Contact from "@/components/Contact/contact.vue";
import Coupon from "@/components/Coupon/coupon.vue";
import ChooseSeat from "./chooseSeat.vue";
import Passenger from "@/components/Passenger/passenger.vue";
import Pay from "./pay.vue";
// import Price from '@/components/Pay/price.vue'
import LockSeat from "./lockSeat.vue";
import { checkOpenId } from "utils/getOpenID";

export default {
  components: {
    DirectionCard,
    ChooseSeat,
    Account,
    Contact,
    Passenger,
    Pay,
    LockSeat,
    Coupon
  },
  data() {
    return {
      trainInfo: {},
      // canChooseSeat: false,
      chooseSeat: "",
      checkOpenId: checkOpenId,
      omegaInfo: {
        omegaKey: "train_ticket_fillorder_adult_ck",
        omegaName: "订单填写页面添加乘客点击",
        omegaChildKey: "train_ticket_fillorder_child_ck",
        omegaChildName: "订单填写页面添加儿童点击",
        omegaDeleteKey: "train_ticket_fillorder_delete_ck",
        omegaDleteName: "订单填写页面的删除乘客点击"
      },
      priceOmegaInfo: {
        allowKey: "train_ticket_fillorder_allow_ck",
        allowName: "订单填写页面预订协议点击",
        childKey: "train_ticket_fillorder_childnotice_ck",
        childName: "订单填写页面儿童购票须知点击",
        clickKey: "train_ticket_fillorder_allowpay_ck",
        clickName: "订单填写页面同意协议并付款点击"
      }
    };
  },
  props: {},
  computed: {
    ...mapGetters({
      openid: "openid",
      webView: "webView",
      isWeChat: "isWeChat",
      isAliPay: "isAliPay",
      trainSeatGroup: "trainSeatGroup",
      notServiceTime: "notServiceTime",
      searchServiceText: "searchServiceText",
      coupon: "coupon"
    }),
    canChooseSeat: function(val, oldVal) {
      let status = false
      let { query } = this.$route
      let chooseSeat = query.chosen_seat.code;
      const HOLD_SEAT_TYPE_RUANWO = '4' // 软卧
      const HOLD_SEAT_TYPE_YINGWO = '3' // 硬卧
      const NO_SEAT = 'wz'
      const HOLD_SEAT_TYPE_DONGWO = 'F' // 动卧
      const HOLY_SEAT_TYPE_GAOJIRUANWO = 'T' // 高级软卧
      const hideChooseSeat = [HOLD_SEAT_TYPE_RUANWO, HOLD_SEAT_TYPE_YINGWO, NO_SEAT, HOLD_SEAT_TYPE_DONGWO, HOLY_SEAT_TYPE_GAOJIRUANWO]
      // 软卧、硬卧、无座 动卧 高级软卧都不需要展示座位显示
      status = !hideChooseSeat.includes(chooseSeat) && !!this.trainSeatGroup[query.train_type] && !!this.trainSeatGroup[query.train_type][chooseSeat]; // 是否展示选座模块
      return status
    }
  },
  created() {},
  mounted() {
    let { isWeChat, isAliPay } = this
    // 没有获取到openid时，通过跳转去获取openid兜底
    if (!this.checkOpenId(isWeChat, isAliPay)) {
      return
    }
    this.changeHeader();
    this.getTrainDetail();
    this.Omega("train_ticket_fillorder_sw", "订单填写页面展现");
  },
  beforeDestroy() {
  },
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions(["changeHeader", "updateOpenId"]),
    getTrainDetail() {
      let { query } = this.$route;
      this.chooseSeat = query.chosen_seat.code;
      // this.canChooseSeat = this.chooseSeat !== 'wz' && this.trainSeatGroup[query.train_type]; // 是否展示选座模块
      this.trainInfo = {
        startStation: query.from_station_name,
        startTime: query.start_time,
        startDate: query.train_date,
        startCode: query.from_station_code,
        runTime: query.run_time,
        trainCode: query.train_code,
        trainNo: query.train_no,
        endStation: query.to_station_name,
        endTime: query.arrive_time,
        endCode: query.to_station_code,
        endDate: query.train_arrive_date,
        chosenSeat: query.chosen_seat
      };
    },
    showConfirmDialog() {
      this.$createDialog({
        type: "confirm",
        icon: "cubeic-alert",
        title: "订单尚未提交，确认放弃吗？",
        content: "",
        confirmBtn: {
          text: "取消",
          active: true,
          disabled: false,
          href: "javascript:;"
        },
        cancelBtn: {
          text: "确定",
          active: false,
          disabled: false,
          href: "javascript:;"
        },
        onConfirm: () => {
        },
        onCancel: () => {
          this.$router.back();
        }
      }).show();
    }
  }
};
</script>
<style scoped lang="less">
.buy-ticket {
  padding-bottom: 7.66rem;
  .top-tips-message {
    background: rgba(252, 145, 83, 0.1);
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #fc9153;
    letter-spacing: 0;
    min-height: 30px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .train-info,
  .account-info,
  .passenger-info,
  .contact-info,
  .coupon-info,
  .seat-info {
    margin-top: 0.83rem;
  }
  .extra-margin-bottom {
    margin-bottom: 20px;
  }
  .price-info {
    margin-top: 0.83rem;
    position: fixed;
    bottom: 0;
  }
}
</style>
