<template>
  <Price class="price-info"
    pageType="buyTicket"
    :showChildProtocol="showChildProtocol"
    :passengersNum="passengersNum"
    :passengerPhone="passengerPhone"
    :totalPrice="totalPrice"
    @on-pre-pay="holdSeat">
  </Price>
</template>
<script>
import { Button, Checkbox } from "cube-ui";
import { mapGetters, mapActions } from "vuex";
import format from "date-fns/format";
import { formatBJ } from '@/utils/commonlibs';
import api from "service/api";
import { goPay } from "@/service/pay";
import {
  formatTicketType,
  Child_Ticket_Code,
  Lonely_Child_Text
} from "@/components/Passenger/passengerMap";
import Price from "@/components/Pay/price.vue";

export default {
  components: {
    Price
  },
  data() {
    return {
      query: {},
      chosenSeat: {},
      count: 1,
      intervalTime: 3000, // 默认轮询间隔，单位ms
      orderId: 0, // 创建订单的订单ID
      isClicked: false
    };
  },
  props: {},
  computed: {
    ...mapGetters({
      passengers: "passengers",
      contactList: "contactList",
      isAliPay: "isAliPay",
      isWeChat: "isWeChat",
      passengerPhone: "passengerPhone",
      seatStatus: "seatStatus",
      coupon: "coupon"
    }),
    totalPrice: function() {
      let { passengers, chosenSeat } = this;
      let passengersNum = passengers.length;
      let seatPrice = chosenSeat ? chosenSeat.price || 0 : 0;
      let total = Number(seatPrice * passengersNum) || 0;
      return total;
    },
    passengersNum: function() {
      let { passengers } = this;
      return passengers.length;
    },
    showChildProtocol: function() {
      let { passengers } = this;
      // 判断是否存在儿童票
      let children = passengers.filter(item => {
        return item.person_type == Child_Ticket_Code;
      });
      return children.length !== 0;
    }
  },
  created() {},
  mounted() {
    this.getQuery();
    this.eventHub.$on("lock-success-call-pay", () => {
      let info = { orderId: this.orderId, price: this.totalPrice }
      this.getPayId(info)
    });
  },
  beforeDestroy() {
    // 注意需要$off掉，否则发生路由切换时不会自动off，后续可能被触发多次
    this.eventHub.$off(["lock-success-call-pay"])
    // dialog也需要清除
    this.changeDialog({ type: "" })
  },
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions(["changeDialog", "updateOrderId", "updateOrderDetail"]),
    formatPrice(val) {
      return Number(val / 100) || 0;
    },
    getQuery() {
      let { query } = this.$route;
      this.chosenSeat = query.chosen_seat;
      this.query = query;
    },
    getReqTime() {
      return format(new Date().BJDate(), "YYYYMMDDHHmmSS");
    },
    getPassengers() {
      let { passengers, chosenSeat } = this;
      let passengerInfos = [];
      if (passengers && passengers.length && chosenSeat) {
        passengerInfos = passengers.map(item => {
          return {
            seat_type_name: chosenSeat.name,
            seat_type_code: chosenSeat.code,
            passenger: item.id_no,
            ticket_type: item.person_type,
            ticket_type_name: formatTicketType(item.person_type),
            price: chosenSeat.price
          };
        });
      }
      return passengerInfos;
    },
    getHoldSeatParams() {
      let { query } = this;
      let params = {
        is_accept_standing: query.chosen_seat.code == "wz",
        req_time: this.getReqTime(),
        from_station_name: query.from_station_name,
        train_no: query.train_no,
        train_type: query.train_type,
        train_code: query.train_code,
        from_station_code: query.from_station_code,
        to_station_name: query.to_station_name,
        source: 1, // native app（0） or h5（1)
        to_station_code: query.to_station_code,
        train_date: query.train_date,
        pay_amount: this.totalPrice, // 应付
        pay_fee: this.totalPrice - this.coupon > 0 ? this.totalPrice - this.coupon : 0, // 实付 = 应付 - 优惠券
        choose_seats: this.seatStatus,
        is_choose_seats: false, // TODO,
        departure_time: formatBJ(Number(query.start_time_timestamp) * 1000, 'YYYY-MM-DD HH:mm:ss'),
        arrive_time: formatBJ(Number(query.arrive_time_timestamp) * 1000, 'YYYY-MM-DD HH:mm:ss'),
        running_time: query.run_time,
        passenger_phone: this.passengerPhone,
        passenger_infos: this.getPassengers()
      };
      return params;
    },
    validate() {
      let inValid = false;
      if (!this.passengerPhone) {
        this.$createToast({
          txt: "联系方式不能为空",
          type: "warn",
          time: 1000
        }).show();
        inValid = true;
      }
      if (this.passengerPhone) {
        if (this.passengerPhone.trim()) {
          let phoneStr = /^\d{11}$/ // 11位数字
          if (phoneStr.test(this.passengerPhone.trim())) {

          } else {
            inValid = true
            this.$createToast({
              type: 'warn',
              time: 1000,
              txt: '输入的手机号不合法，请核对后重试'
            }).show()
          }
        }
      }
      if (
        this.passengers &&
        this.passengers.every(item => item.person_type == Child_Ticket_Code)
      ) {
        this.$createToast({
          txt: Lonely_Child_Text,
          type: "warn",
          time: 1000
        }).show();
        inValid = true;
      }
      return inValid;
    },
    async holdSeat() {
      if (this.isClicked) {
        return
      }
      this.isClicked = true;

      if (this.validate()) {
        this.isClicked = false
        return
      }
      let params = this.getHoldSeatParams();
      const res = await api.holdSeat(params);
      if (res.errno == 0) {
        let orderId = res.data.order_id;
        this.orderId = orderId
        this.updateOrderId({ orderId });
        let price = this.totalPrice;
        if (res.data.sub_type == 3) {
          // 预约买票-先支付后占座
          this.getPayId({ orderId, price })
        } else {
          // 普通买票-先占座后支付
          this.pollOrderStatus(orderId, price);
          this.updateOrderId({ orderId });
          // 开始轮询订单详情
        }
      } else {
        this.changeDialog({ type: "lockFailed", message: res.errmsg });
        this.isClicked = false;
      }
    },
    // 轮询订单status
    async pollOrderStatus(orderId, price) {
      if (!orderId) {
        return;
      }
      const params = {
        oid: orderId,
        order_type: 2
      };
      const res = await api.fetchOrderStatus(params);
      if (res && res.errno == 0) {
        const { data } = res;
        const orderInfo = {
          orderCode: data.order_code,
          orderId: orderId,
          orderMsg: data.order_msg,
          thirdMsg: data.third_msg,
          price: price
        };
        this.intervalTime = data.interval_time * 1000;
        if (orderInfo.orderCode == 6001) {
          this.changeDialog({
            type: "locking",
            message: "正在为您占座，请耐心等待..."
          });
          // 开始轮询
          setTimeout(() => {
            this.pollOrderStatus(orderId, price);
          }, this.intervalTime);
          this.count += 1;
        } else {
          this.afterOrderCreate(orderInfo);
        }
      } else {
        // 订单创建成功，但占座轮询接口请求失败时，再次轮询
        setTimeout(() => {
          this.pollOrderStatus(orderId, price);
        }, this.intervalTime);
      }
    },
    /*
      orderCode：
      self::ORDER_HOLD_SEAT                        => array('code' => 6001, 'msg' => '占座中'),
      self::ORDER_HOLD_SEAT_FAILD                  => array('code' => 6002, 'msg' => '占座失败'),
      self::ORDER_HOLD_SEAT_TIMEOUT                => array('code' => 6003, 'msg' => '占座超时'),
      self::ORDER_PRE_PAY                          => array('code' => 5001, 'msg' => '待支付'),
      self::ORDER_CLOSE                            => array('code' => 5002, 'msg' => '已关闭'),
      self::ORDER_PAY_SUCC                         => array('code' => 5003, 'msg' => '出票中'),
      self::ORDER_PAY_TIMEOUT                      => array('code' => 5002, 'msg' => '已关闭'),
      self::ORDER_OUT_TICKET_FAILD                 => array('code' => 5004, 'msg' => '出票失败，退款中'),
      self::ORDER_OUT_TICKET_SUCC                  => array('code' => 5005, 'msg' => '出票成功'),
     */
    afterOrderCreate(orderInfo) {
      switch (orderInfo.orderCode) {
        case 6002:
          this.changeDialog({
            type: "lockFailed",
            message: orderInfo.thirdMsg || "占座失败,请稍后重试"
          });
          break;
        case 6003:
          this.changeDialog({
            type: "lockFailed",
            message: orderInfo.orderMsg || "占座超时,请稍后重试"
          });
          break;
        case 5001:
          this.changeDialog({ type: "" }); // 将占座弹窗隐藏
          this.orderId = orderInfo.orderId;
          // this.getPayId(orderInfo);
          // 拉起订单详情
          this.getOrderDetail(orderInfo)
          break;
        // 调起支付
        default:
          this.changeDialog({ type: "" });
      }
      this.isClicked = false; // 更改占座按钮点击状态
    },
    async getOrderDetail(orderInfo) {
      let params = {
        order_id: orderInfo.orderId
      }
      const res = await api.fetchOrderDetail(params)
      if (res.errno == 0) {
        this.updateOrderDetail({ orderDetail: res.data })
        this.changeDialog({ type: 'lockSuccess', message: '' })
      } else {
        this.changeDialog({ type: '', message: '' })
        // 获取详情失败时，直接拉起支付
        this.getPayId(orderInfo)
      }
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
        this.changeDialog({
          type: "payFailed",
          message: res.errmsg || "支付失败"
        });
        this.isClicked = false
      }
    },
    doPay(outTradeID, orderId) {
      let { openid } = this.$route.query;
      // if (!openid) {
      //   this.changeDialog({
      //     type: "payFailed",
      //     message: "支付失败，openid为空。请确保在微信／支付宝内打开本页面"
      //   });
      //   // 在弹窗关闭的回跳里回跳转到订单详情页
      //   this.isClicked = false
      //   return;
      // }

      // let _this = this
      // window.DPay.once("close", function(panel) {
      // 用户手动关闭支付弹窗时
      // _this.$router.push({ path: "orderDetail", query: { order_id: _this.orderId } });
      // });
      // goPay(outTradeID, openid)
      //   .then(result => {
      //     // 支付成功后跳转到订单详情页
      //     this.goOrderDetail()
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   });

      // 由于监听了onClose事件的话，在支付宝内换券会有问题，可能会导致页面回退，所以统一将收银放到订单详情去拉起
      this.goOrderDetail()
    },
    goOrderDetail() {
      // pay_immediately：0不拉起收银 1拉起收银台
      this.$router.push({ path: "orderDetail", query: { order_id: this.orderId, pay_immediately: 1 } });
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
    height: 2.5rem;
    background-color: #fafafa;
    display: flex;
    align-items: center;
    padding-left: 1.33rem;
    padding-right: 1.33rem;
    .buy-protocol {
      flex-grow: 1;
    }
    .child-protocol {
    }
    .cube-checkbox {
      padding: 0;
    }
  }
  .order {
    height: 4.33rem;
    display: flex;
    align-items: center;
    padding-left: 1.33rem;
    padding-right: 1.33rem;
    .text {
      flex-grow: 1;
      text-align: left;
    }
    .passenger-num {
      color: #999999;
    }
    .btn-pay {
      height: 2.5rem;
    }
    /*5/5s/SE*/
    @media only screen and (min-device-width: 320px) and (max-device-width: 320px) and (-webkit-min-device-pixel-ratio: 2) {
      .btn-pay {
        // height: 26px;
        padding: 7px 12px;
      }
    }
  }
}
</style>
