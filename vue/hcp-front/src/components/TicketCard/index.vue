<template>
  <div class="ticket-card" :class="ticketTopCss(ticketCode)">
    <DirectionCard
      :mask="mask"
      :trainInfo="trainInfo"
    ></DirectionCard>
    <section class="passenger-info">
      <div class="base-info">
        <!-- <p class="passenger-name font-14">{{`${ticketInfo.passenger_name}${Number(ticketInfo.ticket_type) === Child_Ticket_Code ? ' 儿童票': ''}`}}</p> -->
        <p class="passenger-name font-14">{{ticketInfo.passenger_name}}<span class="child" v-if="Number(ticketInfo.ticket_type) === Child_Ticket_Code">儿童票</span></p>
        <p class="account-type font-12">{{`${ticketInfo.certificate_type}${ticketInfo.certificate_no}`}}</p>
        <!-- <span class="account-num">{{ticketInfo.certificate_no}}</span> -->
      </div>
      <div class="seat-info font-14">
        <div class="seat-pos">{{ticketInfo.coach_no.split(',').join('')}}</div>
        <div class="seat-price">{{`${ticketInfo.seat_type_name}·￥${ticketInfo.price / 100}`}}</div>
      </div>
    </section>
    <section class="ticket-status">
      <div class="status">
        <span class="status-text" :class="ticketTextCss(ticketInfo.ticket_code)">{{ticketInfo.ticket_msg}}</span>
        <p class="status-note" v-if="ticketInfo.ticket_msg_detail" v-html="formatOrderMsgDetail(ticketInfo.ticket_msg_detail)"></p>
      </div>
      <div class="btn-controls">
        <Button :outline="true" :primary="true" :inline="true" @click="onChange" v-if="ticketInfo.change_ticket_button">改签</Button>
        <Button :outline="true" :primary="true" :inline="true" @click="onReturn" v-if="ticketInfo.refund_ticket_button">退票</Button>
      </div>
    </section>
    <div>
    </div>
  </div>
</template>
<script>
import format from 'date-fns/format'
import { Button } from 'cube-ui'
import DirectionCard from '../DirectionCard/index.vue'
import { ticketTextCss, ticketTopCss } from '@/utils/orderClassStyle.js'
import { Child_Ticket_Code } from '@/components/Passenger/passengerMap';
import { getBJDate } from '@/utils/commonlibs'
import { formatBJ } from '@/utils/commonlibs';
export default {
  components: {
    DirectionCard,
    Button
  },
  data() {
    return {
      Child_Ticket_Code,
      ticketTextCss,
      ticketTopCss
    }
  },
  props: {
    ticketInfo: {
      type: Object,
      default: function() {
        return {};
      }
    },
    ticketCode: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    mask: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    trainInfo: function() {
      let { ticketInfo } = this
      const info = {
        startStation: this.ticketInfo.from_station_name,
        startCode: this.ticketInfo.from_station_code,
        startTime: formatBJ(parseInt(this.ticketInfo.departure_timestamp, 10) * 1000, 'HH:mm'),
        startDate: formatBJ(parseInt(this.ticketInfo.departure_timestamp, 10) * 1000, 'YYYY-MM-DD'),
        trainCode: this.ticketInfo.train_code,
        trainNo: this.ticketInfo.train_no,
        runTime: this.ticketInfo.running_time,
        endStation: this.ticketInfo.to_station_name,
        endCode: this.ticketInfo.to_station_code,
        endTime: formatBJ(parseInt(this.ticketInfo.arrive_timestamp, 10) * 1000, 'HH:mm'),
        endDate: formatBJ(parseInt(this.ticketInfo.arrive_timestamp, 10) * 1000, 'YYYY-MM-DD')
      };
      return info
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    // 高亮车票描述金额
    formatOrderMsgDetail(order_msg_detail) {
      return order_msg_detail.replace('{', `<span class="orange">`).replace('}', `</span>`)
    },
    onChange() {
      this.$emit('on-change-ticket', this.ticketInfo)
      this.Omega('train_ticket_ordetail_change_ck','购票进入订单详情页面改签按钮点击',{way:this.$route.query.sub_type==2?'抢票':'购票'});
    },
    onReturn() {
      this.$emit('on-return-ticket', this.ticketInfo)
      this.Omega('train_ticket_ordetail_refund_ck','购票进入订单详情页面退票按钮点击',{way:this.$route.query.sub_type==2?'抢票':'购票'});
    },
  }
}
</script>
<style lang="less">
@import '~assets/styles/var.less';

@green: #46c284;
@grey: #666666;
@orange: #fc9153;
@red: #ff525d;

.ticket-card {
  min-height: 18rem;
  width: 29.58rem;
  margin: 0 auto;
  background: #ffffff;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  // position: relative;
  margin-bottom: 0.83rem;
  &.grey {
    border-color: #c7c7cd;
  }
  .passenger-info {
    margin-left: 1.33rem;
    margin-right: 1.33rem;
    padding-top: 0.83rem;
    margin-bottom: 15px;
    // overflow: hidden;
    position: relative;
    display: flex;
    .passenger-name {
      color: #666666;
      margin-bottom: 0.5rem;
      .child {
        margin-left: 4px;
        opacity: 0.4;
        font-family: PingFangSC-Regular;
        font-size: 9px;
        color: #4a4c5b;
        letter-spacing: 0;
        text-align: center;
        background: rgba(74, 76, 91, 0.1);
        border: 1px solid rgba(74, 76, 91, 0.2);
        border-radius: 2px;
      }
    }
    .account-type,
    .account-num {
      color: #999999;
    }
    .base-info {
      width: 13.08rem;
      text-align: left;
    }
    .seat-info {
      color: #666666;
      margin-left: auto;
      text-align: right;
      .seat-price {
        padding-top: 4px;
      }
    }
  }
  .ticket-status {
    margin-left: 1.33rem;
    margin-right: 1.33rem;
    padding-bottom: 19px;
    display: flex;
    .status {
      display: inline-block;
      text-align: left;
      // float: left;
      margin-right: 3px;
      .status-text {
        font-size: 14px;
        line-height: 2.08rem;
        &.green {
          color: @green;
        }
        &.red {
          color: @red;
        }
        &.orange {
          color: @orange;
        }
        &.grey {
          color: @grey;
        }
      }
      .status-note {
        line-height: 16px;
        color: #999999;
        .orange {
          color: @orange;
        }
      }
    }
    .btn-controls {
      // float: right;
      // display: inline-block;
      width: 11rem;
      margin-left: auto;
      margin-top: auto;
      text-align: right;
    }
  }
  .cube-btn {
    width: 4.67rem !important;
    margin-left: 4px;
  }
}
</style>
