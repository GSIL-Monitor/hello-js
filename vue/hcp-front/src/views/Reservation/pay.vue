<template>
  <div class="grab-pay">
    <Price class="price-info"
      :omegaInfo="priceOmegaInfo"
      pageType="grabTicket"
      :showChildProtocol="showChildProtocol"
      :passengersNum="passengersNum"
      :totalPrice="totalPrice"
      :passengerPhone="passengerPhone"
      :isNoPass="grabCreatOrderParms.pay_mode == 2"
      @on-pre-pay="beginGrapTicket">
    </Price>

    <Dialog
      :show="grabDialog.type == 'payFailed'"
      :showClose="true"
      iconType="warn"
      class="no-ticket"
      cancelText="我知道了"
      @on-cancel="onClose()"
      @on-confirm="onConfirm"
      @on-close="onClose"
    >
      <div slot="body">
        <p class="font-14 tips">{{grabDialog.message}}</p>
      </div>
    </Dialog>
  </div>


</template>
<script>
import Price from "@/components/Pay/price.vue";
import Dialog from "@/components/Dialog/index.vue";
import { mapGetters, mapActions } from "vuex";
import {
  Child_Ticket_Code,
  formatTicketType
} from "@/components/Passenger/passengerMap.js";
import { goPay } from "@/service/pay.js";
import api from "@/service/api.js";

export default {
  components: {
    Price,
    Dialog
  },
  data() {
    return {
      orderId: null,
      dialogMessage: "fff",
      priceOmegaInfo: {
        allowKey: "train_ticket_addgrab_allow_ck",
        allowName: "添加抢票页面预订协议点击",
        clickKey: "train_ticket_addgrab_allowpay_ck",
        clickName: "添加抢票页面同意协议并付款点击"
      },
      isClicked: false
    };
  },
  props: {},
  computed: {
    ...mapGetters({
      isWeChat: "isWeChat",
      isAliPay: "isAliPay",
      grabCreatOrderParms: "grabCreatOrderParms",
      train_date_reservation: "train_date_reservation",
      passengers: "passengers",
      passengerPhone: "passengerPhone",
      grabDialog: "grabDialog",
      coupon: "coupon"
    }),
    passengersNum: function() {
      return this.passengers.length || 0;
    },
    totalPrice: function() {
      return this.passengers.length
        ? this.grabCreatOrderParms.max_price * this.passengers.length
        : 0;
    },
    showChildProtocol: function() {
      let children = this.passengers.filter(item => {
        return Number(item.person_type) == Child_Ticket_Code;
      });
      return children.length !== 0;
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions(["changeGrabDialog", "changeRequestParms"]),
    toast(msg, type = "warn", time = 1500) {
      this.$createToast({
        txt: msg,
        type: type,
        time: time
      }).show();
    },
    validatePostRequest() {
      if (!this.train_date_reservation.length) {
        this.toast("请选择出发时间");
        return false;
      }
      if (!this.grabCreatOrderParms.train_infos.length) {
        this.toast("请选择车次");
        return false;
      }
      if (!this.grabCreatOrderParms.seat_type_names.length) {
        this.toast("请选择座席");
        return false;
      }
      if (!this.grabCreatOrderParms.grab_order_end_time) {
        this.toast("请选择抢票截止时间");
        return false;
      }
      if (!this.passengers.length) {
        this.toast("请选择乘车人");
        return false;
      }
      // 判断是否只有儿童
      if (
        this.passengers.length &&
        this.passengers.every(item => item.person_type == Child_Ticket_Code)
      ) {
        this.toast("儿童不能单独乘车，请选择同行成人");
        return false;
      }
      if (!this.passengerPhone) {
        this.toast("请输入联系电话");
        return false;
      }
      if (this.passengerPhone) {
        if (this.passengerPhone.trim()) {
          let phoneStr = /^\d{11}$/ // 11位数字
          if (phoneStr.test(this.passengerPhone.trim())) {

          } else {
            this.$createToast({
              type: 'warn',
              time: 1000,
              txt: '输入的手机号不合法，请核对后重试'
            }).show()
            return false;
          }
        }
      }
      return true;
    },
    isAcceptStanding() {
      let { seat_type_names } = this.grabCreatOrderParms
      this.changeRequestParms({ is_accept_standing: seat_type_names.includes('无座') });
    },
    async beginGrapTicket() {
      if (this.isClicked) {
        return false;
      }

      this.isClicked = true;

      this.Omega(
        'train_ticket_addgrab_confirm_ck", "添加抢票开始抢票按钮（自动付款）点击'
      );
      if (!this.validatePostRequest()) {
        this.loading = false;
        this.isClicked = false;
        return;
      }
      this.loading = true;
      let convertPassengers = this.passengers.map(element => {
        return {
          passenger: element.id_no,
          ticket_type: element.person_type,
          ticket_type_name: formatTicketType(element.person_type),
          passenger_name: element.name
        };
      });
      this.changeRequestParms({
        passengers: convertPassengers,
        start_date: this.train_date_reservation.map(element =>
          element.replace(/-/g, "")
        ),
        passenger_phone: this.passengerPhone,
      });
      this.isAcceptStanding()
      const payFee = this.totalPrice - this.coupon
      this.grabCreatOrderParms.pay_fee = payFee > 0 ? payFee : 0 // 实付
      this.grabCreatOrderParms.pay_amount = this.totalPrice  // 应付
      console.log(this.grabCreatOrderParms);
      const res = await api.grabTicketPost(this.grabCreatOrderParms);
      if (res.errno === 0) {
        let { data } = res;
        this.toast("创建抢票订单成功", "correct", 1000);
        let orderId = res.data.order_id;
        this.orderId = orderId;
        if (this.grabCreatOrderParms.pay_mode == 1) {
          // 预支付订单拉起支付
          this.getPayId({ orderId: orderId, price: this.totalPrice });
        } else {
          this.isClicked = false;
          // 否则跳转到订单详情页
          this.$router.push({
            path: "orderDetail",
            query: { order_id: orderId }
          });
        }
      } else {
        this.isClicked = false;
        this.toast(res.errmsg || "创建抢票订单失败", "warn", 1000);
      }
      this.loading = false;
    },
    async getPayId(orderInfo) {
      let params = {
        order_id: orderInfo.orderId,
        order_type: 2, // 1 车票  2 订单
        pay_fee: orderInfo.price
      };
      const res = await api.fetchPayId(params);
      if (res.errno == 0) {
        let outTradeID = res.data.out_trade_id;
        this.doPay(outTradeID, orderInfo.orderId);
      } else {
        // 获取支付id失败，弹提示，后跳转详情页
        this.isClicked = false;
        this.changeGrabDialog({
          type: "payFailed",
          message: res.errmsg || "网络异常，请稍后再试"
        });
      }
    },
    doPay(outTradeID, orderId) {
      let { openid } = this.$route.query;
      if (!openid) {
        this.changeGrabDialog({
          type: "payFailed",
          message: "支付失败，openid为空。请确保在微信／支付宝内打开本页面"
        });
        return;
      }
      // let _this = this
      // 单次监听
      // window.DPay.once("close", function(panel) {
      //   // 用户手动关闭支付弹窗时
      //   _this.$router.push({ path: "orderDetail", query: { order_id: _this.orderId } });
      // });
      // goPay(outTradeID, openid)
      //   .then(result => {
      //     // 支付成功后跳转到订单详情页
      //     this.$router.push({
      //       path: "orderDetail",
      //       query: { order_id: orderId }
      //     });
      //   })
      //   .catch(error => {
      //     // this.changeGrabDialog({ type: 'payFailed', message: error.errmsg || '支付失败' })
      //     // this.$router.push({ path: 'orderDetail', query: { order_id: orderId } })
      //   })
      this.$router.push({ path: "orderDetail", query: { order_id: this.orderId, pay_immediately: 1 } });
    },
    onClose() {
      // 支付失败时才会弹窗，点击后跳转到订单详情页
      this.changeGrabDialog({ type: '', message: '' })
      this.$router.push({ path: "orderDetail", query: { order_id: this.orderId } });
    },
    onConfirm() {}
  }
};
</script>
<style scoped lang="less">
.grab-pay {
  .tips {
    line-height: 1.75rem;
    padding-left: 1.33rem;
    padding-right: 1.33rem;
    color: #999999;
  }
}
</style>
