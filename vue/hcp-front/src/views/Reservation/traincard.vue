<template>
  <div class="train-card" @click="updateReservationTrainListHook(trainInfo)">
    <div :class="[{ 'train-disabled': !trainInfo.run_status }, 'train-info']">
      <section class="start-info">
        <p class="start-time time font-24">{{trainInfo.start_time}}</p>
        <p class="start-station station font-14">{{trainInfo.from_station_name}}</p>
      </section>
      <section class="run-info">
        <p class="run-time">
          {{formatRunTime(trainInfo.run_time)}}
          <i class="icon-direction-png"></i>
        </p>
        <p class="train-code">
          {{trainInfo.train_code}}
          <i class="icon-id-card" v-show="trainInfo.access_byidcard" @click="onIdCardClick($event)"></i>
          <cube-tip ref="tip" direction="top" style="left:10.8rem;top:7rem;" offsetRight="20">可凭二代身份证直接进出站</cube-tip>
        </p>
      </section>
      <section class="end-info">
        <p class="end-time time font-24">{{trainInfo.arrive_time}}</p>
        <span v-if="trainInfo.arrive_days" class="arrive_day">{{`+${trainInfo.arrive_days}天`}}</span>
        <p class="end-station station font-14">{{trainInfo.to_station_name}}</p>
      </section>
      <section class="price-info">
        <!-- <p class="price"> -->
          <Checkbox style="font-size:160%;padding-right:0" :option="{value:trainInfo.train_no,disable:false}" :value="trainInfo.reservation_selected" position="right"></Checkbox>
        <!-- </p> -->
      </section>
    </div>
    <!-- <div class="seat-info border-top-1px" v-if="trainInfo.run_status">
      <p v-for="seat in trainInfo.seat_info" :key="seat.name"
        v-if="!(trainInfo.seat_info.length > 4) || seat.code !== 'wz'"
       :class="{ 'sell-out': formatTicketNumText(seat.num) == noTicketText }">
        <span class="seat-name">{{seat.name}}:</span>
        <span :class="[formatTicketNumText(seat.num) !== noTicketText ?'seat-green':'seat-num']">{{formatTicketNumText(seat.num)}}</span>
        <span class="seat-note">(抢)</span>
      </p>
    </div> -->
    <div class="extract-info border-top-1px" v-if="!trainInfo.run_status">
      列车暂时停运
    </div>
  </div>
</template>
<script>
import { Checkbox, Tip } from "cube-ui";
import { mapGetters, mapActions } from "vuex";
import { formatTicketNumText, noTicketText } from "utils/commonlibs";

export default {
  name: "traincard-reservation",
  components: {
    Checkbox,
    CubeTip: Tip
  },
  data() {
    return {
      formatTicketNumText,
      noTicketText,
      hideTimer: null
    };
  },
  props: {
    trainInfo: {
      type: Object,
      default: function() {
        return {};
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters({
      ticketNumThreshold: "ticketNumThreshold",
      train_number: "train_number"
    })
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions(["updateReservationTrainList"]),
    updateReservationTrainListHook(trainInfo) {
      if (!trainInfo.run_status) {
        return
      }
      this.updateReservationTrainList(trainInfo);
      console.log("this.train_number", this.train_number.length);
      if (this.train_number.length > 10) {
        this.$createToast({
          txt: "最多支持选择10个车次",
          type: "warn",
          time: 1500
        }).show();
        this.updateReservationTrainList(trainInfo);
        return;
      }
    },
    formatRunTime(time) {
      let arr = time.split(":");
      return `${Number(arr[0])}小时${arr[1]}分`;
    },
    computedPrice(minPrice) {
      // eslint-disable-next-line
      let min = minPrice / 100; // 价格以分为单位
      return min;
    },
    onIdCardClick(e) {
      this.$refs.tip.show();
      // 定时消失
      if (this.hideTimer) {
        clearTimeout(this.hideTimer)
        this.hideTimer = null
      }
      this.hideTimer = setTimeout(() => {
        this.$refs.tip.hide();
      }, 3000);
      e.stopPropagation();
    }
  }
};
</script>
<style scoped lang="less">
.train-card {
  color: #666666;
  min-height: 7.5rem;
  background-color: #ffffff;
  margin-top: 10px;
  padding-left: 1.33rem;
  padding-right: 1.33rem;
  position: relative;
  .train-disabled {
    opacity: 0.4;
  }
  .train-info {
    display: flex;
    .start-info {
      text-align: left;
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
      width: 6.53rem;
      .start-time {
        color: #FC9153;
      }
    }
    .run-info {
      margin-top: 2.1rem;
      width: 6.17rem;
      text-align: center;
      .run-time {
        margin-bottom: 0.17rem;
        position: relative;
        line-height: 2.42rem;
      }
      .train-code {
        // padding-top: 0.08rem;
        // border-top: 1px solid #adadad;
        // line-height: 1.42rem;
        .icon-id-card {
          display: inline-block;
          background-image: url("~assets/images/id_card.png");
          background-size: 1.67rem 1rem;
          width: 1.67rem;
          height: 1rem;
          position: relative;
          top: 0.1rem;
        }
      }
    }
    .end-info {
      text-align: right;
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
      width: 6.33rem;
      position: relative;
      .arrive_day {
        font-size: 10px;
        color: #333333;
        position: absolute;
        right: -22px;
        top: 5px;
      }
    }
    .price-info {
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
      color: #fc9153;
      flex-grow: 1;
      text-align: right;
      display: flex;
      justify-content: flex-end;
      .price-unit {
        line-height: 2.08rem;
      }
      .price-num {
        line-height: 2.75rem;
      }
      .price-begin {
        line-height: 1.42rem;
      }
    }
  }
  .seat-info {
    display: flex;
    // flex-wrap: wrap;
    // font-size: 12px;
    & > p {
      flex-grow: 1;
      text-align: left;
      margin-top: 0.79rem;
      margin-bottom: 0.83rem;
      line-height: 1.42rem;
      font-size: 0;
      span{
        font-size: 11px;
      }
      .seat-green {
        color: #46c284;
      }
      .seat-note {
        display: none;
      }
      &.sell-out {
        color: #adadad;
        .seat-note {
          color: #fe613c;
          display: inline-block;
        }
      }
    }
  }
  .time {
    color: #333333;
    font-weight: 500;
    line-height: 2.75rem;
  }
  .station {
    color: #333333;
    margin-top: 0.17rem;
    line-height: 1.67rem;
  }
  .train-code {
    font-family: 'PingFangSC-Medium';
  }
  .extract-info {
    height: 42px;
    line-height: 42px;
    color: #fe613c;
    text-align: left;
  }
}
.train-card:last-child {
  margin-bottom: 60px;
}
@media (device-height: 568px) and (device-width: 320px) and (-webkit-min-device-pixel-ratio: 2) {
  .train-card {
    .train-info {
      .start-info, .end-info {
        width: 5.83rem;
      }
    }
  }
}
</style>
