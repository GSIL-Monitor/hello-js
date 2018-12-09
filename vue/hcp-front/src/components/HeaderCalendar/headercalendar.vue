<template>
  <div>
    <div class="header-calendar border-top-1px" :class="{ 'shadow': shadow }">
        <div class="pre-day" :class="{ 'disabled': preDisabled }"><span @click="changeDay('pre', preDisabled)">前一天</span></div>
        <div @click="showCalendar">
          <span class="calendar-icon"><img :src="calendarPng"/></span>
          <span>{{renderDate}}</span>
          <span>{{weekDay}}</span>
          <i class="cubeic-select"></i>
        </div>
        <div class="next-day" :class="{ 'disabled': nextDisabled }"><span @click="changeDay('next', nextDisabled)">后一天</span></div>
    </div>
  </div>
</template>
<script>
import { returnDate, returnDay } from "@/utils/commonlibs";
import isBefore from "date-fns/is_before";
import isAfter from "date-fns/is_after";
import addDays from "date-fns/add_days";
import format from "date-fns/format";
import calendarPng from "assets/images/calendar@3x.png";

// NOTE 由于本组件在某些页面可能用于下拉刷新区域，会有transform属性。
// trasnform存在时会导致calendar组件的position:fixed定位表现降级为相对父元素定位
// 所以此处使用createAPI的方式调用calendar,直接作为body的子元素规避以上问题
import { createAPI } from "cube-ui";
import Calendar from "@/components/Calendar/index.vue";
import Vue from "vue";
createAPI(Vue, Calendar, ["on-select", "on-cancel"], true);

const oneDay = 1000 * 60 * 60 * 24;
// let tomorrow = new Date().getTime() + oneDay;
let today = new Date().getTime();
const CUSTOM_EVENT_NAME = "on-query-train";
const CUSTOM_OMEGA_EVENT_NAME = "omega_click";

export default {
  name: "header-calendar",
  props: {
    shadow: {
      type: Boolean,
      default: true
    },
    defaultSeletedDays: {
      type: Array,
      default: function(val) {
        return [format(new Date().BJDate(), "YYYY-MM-DD")];
      }
    },
    callModule: {
      type: String,
      default: "trainlist" // trainlist,traindetail
    },
    holiday: {
      type: Object,
      default: function() {
        return {};
      }
    },
    noteDay: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      calendarPng,
      returnDay,
      returnDate,
      partHistoryDay: "" // YYYY-MM-DD or ts
    };
  },
  computed: {
    // 今天之前不可点
    preDisabled: function() {
      let currentDate = format(this.partHistoryDay, "YYYY-MM-DD"); // 当前显示的日期
      let today = format(new Date(), "YYYY-MM-DD");
      if (isAfter(currentDate, today)) {
        return false;
      }
      return true;
    },
    // 60天后不可选
    nextDisabled: function() {
      let currentDate = format(this.partHistoryDay, "YYYY-MM-DD");
      let today = new Date();
      // TODO 多少天后不可选这个值从config接口取
      let disabledCount = 59;
      let disabledDate = format(
        addDays(new Date(), disabledCount),
        "YYYY-MM-DD"
      );
      if (isBefore(currentDate, disabledDate)) {
        return false;
      }
      return true;
    },
    renderDate: function() {
      if (this.partHistoryDay) {
        return returnDate(this.partHistoryDay);
      }
      return "";
    },
    weekDay: function() {
      if (this.partHistoryDay) {
        return returnDay(this.partHistoryDay);
      }
      return "";
    }
  },
  mounted() {
    this.partHistoryDay = this.defaultSeletedDays[0];
  },
  watch: {
    defaultSeletedDays(newVal, oldVal) {
      this.partHistoryDay = newVal[0];
    }
  },
  methods: {
    changeDay(type, disabled) {
      if (disabled) {
        return;
      }
      let day = new Date(this.partHistoryDay).getTime();
      if (type === "pre") {
        day -= oneDay;
      } else {
        day += oneDay;
      }
      day = format(day, "YYYY-MM-DD")
      this.partHistoryDay = day;
      this.$emit(CUSTOM_EVENT_NAME, day);
      // 埋点统计
      this.eventHub.$emit(CUSTOM_OMEGA_EVENT_NAME, {
        date: day,
        type: type,
        callModule: this.callModule
      });
    },
    onDateChange(val) {
      this.partHistoryDay = val;
      this.$emit(CUSTOM_EVENT_NAME, val);
      // 埋点统计
      this.eventHub.$emit(CUSTOM_OMEGA_EVENT_NAME, {
        date: format(val, "YYYY-MM-DD"),
        type: "date"
      });
    },
    showCalendar() {
      let defaultSeletedDays = [];
      if (this.partHistoryDay) {
        defaultSeletedDays.push(format(this.partHistoryDay, "YYYY-MM-DD"));
      } else {
        defaultSeletedDays = this.defaultSeletedDays;
      }
      const instance = this.$createCalendar({
        multiple: false,
        title: "出发日期",
        confirmText: "确定",
        defaultSeletedDays,
        holiday: this.holiday,
        formatRule: { type: "String", rule: "YYYY-MM-DD" },
        calendarShow: true
      });
      instance.$on("on-select", e => {
        this.onDateChange(e);
        instance.remove(); // 这种调用方式, 由于使用了remove移除了实例，所以无需再将calendarShow设为false
      });
      instance.$on("on-cancel", e => {
        instance.remove();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.header-calendar {
  height: 44px;
  line-height: 44px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  &.shadow {
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
  }
  font-size: 0;
  & > div {
    display: inline-block;
    text-align: center;
    font-size: 14px;
    color: #333;
    &.disabled {
      color: #ccc!important;
    }
    &.pre-day {
      color: #666666;
      text-align: left;
      position: absolute;
      left: 1.33rem;
    }
    &.next-day {
      color: #666666;
      text-align: right;
      position: absolute;
      right: 1.33rem;
    }
    &.disabled {
      color: #cccccc;
    }
    .calendar-icon {
      vertical-align: middle;
      img {
        width: 15px;
        position: relative;
        top: 1px;
      }
    }
    &:active {
      opacity: 0.6;
    }
  }
  .arrow {
    transform: rotate(90deg);
    display: inline-block;
    color: #999;
    margin-left: 0.8rem;
    font-size: 1.1rem;
  }
}
</style>
