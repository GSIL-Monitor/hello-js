<template>
  <div class="order-carder-container" @click="onClick">
    <div class="order-card">
      <div class="order-header border-bottom-1px">
        <div class="grap" v-if="orderInfo.sub_type === 2">
          <p>抢</p>
        </div>
        <p class="font-14">{{`订单号:${orderInfo.order_id}`}}</p>
        <p class="ticket-price" v-show="moneyShowType(orderInfo.sub_type, orderInfo.order_code)">
          {{`${moneyShowType(orderInfo.sub_type, orderInfo.order_code)}:￥${orderInfo.pay_fee / 100}`}}
        </p>
      </div>
      <div class="order-body">
        <p class="stations">
          <span class="font-weight-500">{{orderInfo.from_station_name}}</span>
          <img src="../../assets/images/OtoD_tiny@3x.png" alt="">
          <span class="font-weight-500">{{orderInfo.to_station_name}}</span>
          <span>&nbsp;{{orderInfo.train_code}}</span>
        </p>
        <p class="start-time">
          <span v-if="orderInfo.sub_type === 2 && orderInfo.start_date">{{orderInfo.start_date.join(' | ')}}</span>
          <span v-else>{{`${formatBJ(parseInt(orderInfo.departure_timestamp, 10) * 1000, 'MM.DD HH:mm')}出发`}}</span>
        </p>
        <div class="ticker-info">
          <p
           v-for="(item, index) in orderInfo.tickets"
           :key="index">
            <span class="name-text">{{`${item.passenger_name}${Number(item.ticket_type) === Child_Ticket_Code ? '·儿童票': ''}`}}</span>
            <!-- <span class="name-text">{{item.passenger_name}}<span class="child" v-if="Number(item.ticket_type) === Child_Ticket_Code">儿童票</span></span> -->
            <span v-if="item.seat_type_name">{{`${item.seat_type_name}${item.coach_no ? '·' + item.coach_no.split(',').join(''): ''}`}}</span>
            <span :class="ticketTextCss(item.ticket_code)">{{item.ticket_msg}}</span>
          </p>
        </div>
      </div>
      <!-- 订单列表倒计时，支付，改签确认等按钮状态显示 pay_surplus_time大于0-->
      <div class="order-footer border-top-1px" v-if="orderInfo.pay_surplus_time > 0 || countTimeZero(orderInfo.order_code)">
        <p class="paid-time">{{orderInfo.pay_order_type == 1 ? '改签' : '支付'}}倒计时 {{formatCountDown(showTime)}}</p>
        <!-- 平改低改显示确认改签 -->
        <p class="paid-btn" v-if="orderInfo.pay_order_type == 1 && orderInfo.need_pay_fee == 0">确认改签</p>
        <p class="paid-btn" @click="omegaPayClick" v-else>去支付￥{{orderInfo.need_pay_fee / 100}}</p>
      </div>
    </div>
  </div>
</template>

<script>
// import format from "date-fns/format";
import { ticketTextCss, formatCountDown, moneyShowType, countTimeZero } from "@/utils/orderClassStyle.js";
import { Adult_Ticket_Code, Child_Ticket_Code } from '@/components/Passenger/passengerMap';
import { formatBJ } from '@/utils/commonlibs';

export default {
  name: "OrderList",
  data() {
    return {
      formatBJ,
      Child_Ticket_Code,
      ticketTextCss,
      formatCountDown,
      moneyShowType,
      countTimeZero,
      showTime: 0,
      timer: null,
    };
  },
  props: {
    orderInfo: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  created() {},
  mounted() {
    // 判断是否存在倒计时字段，存在开启倒计时
    this.judgCountTime();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  destroyed() {},
  watch: {
    orderInfo: {
      // 从详情页回到列表页时
      handler: function(val, oldVal) {
        if (val && val.pay_surplus_time !== -1) {
          this.judgCountTime()
          // console.log(val);
          // console.log(val.pay_surplus_time);
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    omegaPayClick() {
      this.Omega('train_ticket_allorder_pay_ck', '订单列表页面去支付按钮点击');
    },
    onClick() {
      this.$emit("onClick", this.orderInfo);
    },
    judgCountTime() {
      if (this.orderInfo.pay_surplus_time !== -1) {
        console.log(this.orderInfo.pay_surplus_time);
      }
      if (this.orderInfo.pay_surplus_time > 0) {
        this.showTime = this.orderInfo.pay_surplus_time;
        if (!this.timer) {
          this.timer = setInterval(() => {
            if (this.showTime > 0) {
              this.showTime--;
            } else {
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.order-card {
  text-align: left;
  margin: 0 0 0.83rem;
  background: #fff;
  &:active {
    background-color: rgba(0, 0, 0, 0.04);
  }
  .order-header,
  .order-body,
  .order-footer {
    padding: 0 1.33rem;
  }
  .order-header {
    height: 3.33rem;
    line-height: 1.33rem;
    font-size: 14px;
    color: #666666;
    display: flex;
    align-items: center;
    .ticket-price {
      margin-left: auto;
    }
    .grap {
      height: 14px;
      line-height: 14px;
      width: 14px;
      color: #fff;
      background: #fc9153;
      // border: 1px solid #fc9153;
      border-radius: 2px;
      margin-right: 0.46rem;
      text-align: center;
      p {
        transform: scale(0.91);
      }
    }
  }
  .order-body {
    padding-top: 1.38rem;
    padding-bottom: 1rem;
    .stations {
      font-family: 'PingFangSC-Medium';
      font-size: 18px;
      color: #333;
      line-height: 25px;
      img {
        width: 1.27rem;
        height: 0.33rem;
        vertical-align: middle;
        position: relative;
        top: -1px;
      }
    }
    .start-time {
      font-size: 14px;
      margin-top: 7px;
      margin-bottom: 0.83rem;
      line-height: 20px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ticker-info {
      color: #999;
      line-height: 17px;
      .name-text {
        color: #666;
      }
      p {
        display: flex;
        margin-bottom: 0.33rem;
        & span:last-child {
          margin-left: auto;
        }
        & span:first-child {
          margin-right: 0.5rem;
        }
        .green {
          color: #46c284;
        }
        .orange {
          color: #ff7e33;
        }
        .red {
          color: #ff525d;
        }
        .grey {
          color: #999999;
        }
      }
    }
  }
  .order-footer {
    display: flex;
    height: 4.21rem;
    align-items: center;
    .paid-time {
      font-size: 14px;
      color: #ff525d;
    }
    .paid-btn {
      height: 2.5rem;
      line-height: 2.5rem;
      padding: 0 0.75rem;
      text-align: center;
      color: #ff7e33;
      margin-left: auto;
      background: #ffffff;
      border: 1px solid #fc9153;
      border-radius: 2px;
    }
  }
}
</style>
