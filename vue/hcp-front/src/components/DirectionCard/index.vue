<template>
<div :class="{'direction-card': true, 'mask': mask}">
  <div class="left">
    <p class="start-station station font-18">{{trainInfo.startStation}}</p>
    <p class="start-time time font-24">{{trainInfo.startTime}}</p>
    <p class="start-date date font-14">
      {{trainInfo.startDate ? format(trainInfo.startDate, 'MM月DD日') : ''}}
      <span class="ext-text">{{trainInfo.startDate ? returnDay(trainInfo.startDate): ''}}</span>
    </p>
  </div>
  <div class="middle">
    <p class="train-code font-14">{{trainInfo.trainCode}}</p>
    <p class="schedule" @click="getSchedule">
      <span class="schedule-text">经停信息</span>
      <i class="icon-direction"></i>
    </p>
    <p class="run-time font-14">{{returnHourMin(trainInfo.runTime)}}</p>
  </div>
  <div class="right">
    <p class="end-station station font-18">{{trainInfo.endStation}}</p>
    <p class="end-time time font-24">{{trainInfo.endTime}}</p>
    <p class="end-date date font-14">
      {{trainInfo.endDate ? format(trainInfo.endDate, 'MM月DD日') : ''}}
      <span class="ext-text">{{trainInfo.endDate ? returnDay(trainInfo.endDate): ''}}</span>
    </p>
  </div>
  <div class="chosen-seat border-top-1px font-14" v-if="formatchosenSeat(trainInfo.chosenSeat).show">
    {{formatchosenSeat(trainInfo.chosenSeat).name}}
    <span class="seat-price">¥{{formatchosenSeat(trainInfo.chosenSeat).price}}</span>
  </div>
  <!-- <Schedule :show="scheduleShow" @on-hide="hideSchedule" :scheduleData="scheduleData" :loading="loading"></Schedule> -->
</div>
</template>
<script>
import { mapActions } from "vuex";
import qs from "qs";
import {
  returnDay,
  returnHourMin
} from "@/utils/commonlibs";
import Schedule from "@/components/Schedule/index.vue";
import api from "service/api.js";
import { Loading, createAPI } from "cube-ui";
import Vue from "vue";
import format from 'date-fns/format';

createAPI(Vue, Schedule, ["on-hide"], true);

export default {
  components: {
    Schedule,
    Loading
  },
  data() {
    return {
      format,
      returnDay,
      returnHourMin,
      scheduleShow: false
    };
  },
  props: {
    trainInfo: {
      type: Object,
      default: function() {
        return {
          startStation: "",
          startTime: "",
          startDate: "",
          trainNo: "",
          trainCodeL: "",
          runTime: "",
          endStation: "",
          endTime: "",
          endDate: "",
          chosenSeat: {}
        };
      }
    },
    omegaInfo: {
      type: Object,
      default: null
    },
    mask: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions([
      "updateScheduleLoading",
      "updateScheduleData",
      "updateScheduleNetErr"
    ]),
    async getSchedule() {
      this.updateScheduleNetErr({ netErr: false });
      this.updateScheduleLoading({ loading: true });
      if (!this.scheduleShow) {
        this.scheduleShow = true;
        const instance = this.$createSchedule({
          scheduleShow: true
        });
        instance.$on("fetch-again", e => {
          this.getSchedule();
        });
        instance.$on("on-hide", e => {
          instance.remove();
          this.scheduleShow = false;
        });
      }
      // this.loading = true;
      const params = {
        train_code: this.trainInfo.trainCode,
        train_no: this.trainInfo.trainNo,
        from_station_code: this.trainInfo.startCode,
        to_station_code: this.trainInfo.endCode,
        train_date: this.trainInfo.startDate
      };
      // this.scheduleShow = true;
      const res = await api.fetchSchedule(params);
      if (res.errno == 0) {
        this.updateScheduleData(res.data);
      } else {
        // TODO 错误信息是展示在时刻表弹窗内 or 单独弹窗
        let scheduleData = [];
        this.updateScheduleData(scheduleData);
        this.updateScheduleNetErr({ netErr: true });
      }
      // this.loading = false;
      this.updateScheduleLoading({ loading: false });
      this.omegaInfo &&
        this.Omega(this.omegaInfo.omegaKey, this.omegaInfo.omegaName);
    },
    showSchedule() {
      this.loading = true;
      this.scheduleShow = true;
    },
    hideSchedule() {
      this.scheduleShow = false;
    },
    formatchosenSeat(val) {
      if (val && val.name) {
        let { price, name } = val;
        price = Number(price / 100) || "";
        return { name, price, show: true };
      }
      return { show: false, name: "", price: "" };
    }
  }
};
</script>
<style scoped lang="less">
@padding-top: 1.67rem;
@padding-bottom: 1.67rem;
.direction-card {
  display: flex;
  background: #fff;
  min-height: 9.33rem;
  position: relative;
  text-align: center;
  flex-wrap: wrap;
  .left {
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    left: 0;
    margin: @padding-top 0 @padding-bottom 1.33rem;
    // padding-left: inherit;
    .start-station {
    }
    .start-time {
    }
    .start-date {
    }
  }
  .right {
    text-align: right;
    position: absolute;
    right: 0;
    margin: @padding-top 1.33rem @padding-bottom 0;
    .start-station {
    }
    .start-time {
    }
    .start-date {
    }
  }
  .middle {
    margin: 0 auto;
    position: relative;
    margin-top: @padding-top;
    margin-bottom: @padding-bottom;
    color: #666666;
    text-align: center;
    .ext-text,
    .train-code {
      line-height: 1.67rem;
      letter-spacing: 0;
    }
    .train-code {
      margin-bottom: 1rem;
    }
    .schedule {
      border-radius: 10px;
      position: relative;
      font-size: 12px;
      width: 54px;
      height: 16px;
      line-height: 16px;
      background: rgba(252, 145, 83, 0.08);
      border: 1px solid rgba(252, 145, 83, 0.2);
      &:active {
        opacity: 0.6;
      }
      &::before {
        content: '';
        display: inline-block;
        border-top: 1px solid #fc9153;
        opacity: 0.2;
        position: absolute;
        width: 10px;
        top: 8px;
        // z-index: 1;
        left: -10px;
      }
      &::after {
        content: '';
        display: inline-block;
        border-top: 1px solid #fc9153;
        opacity: 0.2;
        position: absolute;
        width: 10px;
        top: 8px;
        right: -10px;
      }
      .icon-direction {
        position: absolute;
        top: 5px;
        right: -10px;
      }
      .schedule-text {
        font-size: 12px;
        transform: scale(0.8);
        display: inline-block;
        color: #fc9153;
        // transform: scaleX(0.83) scaleY(0.83);
      }
    }
    .run-time {
      margin-top: 1.1rem;
    }
  }
  .chosen-seat {
    text-align: left;
    padding-left: 1.33rem;
    height: 3.29rem;
    line-height: 3.29rem;
    flex-basis: 100%;
    color: #333333;
    .seat-price {
      margin-left: 0.67rem;
    }
  }
  .station {
    color: #333333;
    line-height: 25px;
  }
  .time {
    color: #333333;
    line-height: 33px;
    font-weight: 500;
  }
  .date {
    color: #666666;
    line-height: 20px;
  }
}
.mask {
  background: rgba(74, 76, 91, 0.04);
}
</style>
