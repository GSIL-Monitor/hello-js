<template>
    <div class="calendar" :class="{ 'show': this.calendarShow }">

        <table class="page-calendar-weekday">
          <thead>
            <tr class="calendar-weekday font-12">
              <th v-for="day in weekdayText" :key="day">{{day}}</th>
            </tr>
          </thead>
        </table>
        <div class="page-current-month-text sticky-header">
          {{currentMonth}}
        </div>
        <div class="page-calendar-scroll scroll-wrapper" :style="{ 'height': swHeight + 'px' }">
          <div class="calendar-scroll">
            <div class="calendar-months">
              <div class="calendar-month" v-for="(month, monthIndex) in renderMonths" :key="month.month">
                <div :class="['calendar-month-header', {'invisible': !monthIndex }]">{{month.monthText}}</div>
                <table class="calendar-month-body">
                  <tbody class="calendar-weeks">
                    <tr v-for="(week, weekIndex) in month.weeks" class="calendar-week" :key="month.month + weekIndex">
                      <td v-for="day in week" :class="wrapperClasses(day)" @click="onSelect(day, $event)">
                        <p class="calendar-day-ext calendar-day-ext-top"
                          :class="[noteDay.originDate ? 'day-ext-color-333' : '']"
                          v-if="day.extendText"
                        >
                          {{day.extendText}}
                        </p>

                        <p class="calendar-day-num"
                          v-if="!day.dayType || (day.dayType && !day.dayType.includes('today'))">{{day.dayNumber}}</p>
                        <p class="calendar-day-num" v-if="day.dayType && day.dayType.includes('today')">今天</p>
                        <p class="calendar-day-ext calendar-day-ext-bottom" v-if="day.noteText">
                          {{day.noteText}}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="celendar-header-bottom font-14 fixed-bottom-container fixed-bottom-container-shadow">
          <div class="btn-cancel" @click="cancel">取消</div>
          <div class="btn-confirm" @click="confirm">完成</div>
        </div>

    </div>

</template>

<script>
import format from "date-fns/format";
import { formatBJ } from '@/utils/commonlibs';
import addDays from "date-fns/add_days";
import addMonths from "date-fns/add_months";
import distanceInWordsStrict from "date-fns/distance_in_words_strict";
import differenceInCalendarMonths from "date-fns/difference_in_calendar_months";
import getDaysInMonth from "date-fns/get_days_in_month";
import startOfMonth from "date-fns/start_of_month";
import endOfMonth from "date-fns/end_of_month";
import getDay from "date-fns/get_day";
import startOfWeek from "date-fns/start_of_week";
import isBefore from "date-fns/is_before";
import isAfter from "date-fns/is_after";
import throttle from 'lodash/throttle';
const holiday_2017 = { "2018-07-07": "小暑" };

export default {
  name: "Calendar",
  components: {},
  data() {
    return {
      sundayFirst: true, // 周日为第一天
      weekdayText: ["日", "一", "二", "三", "四", "五", "六"],
      renderMonths: [],
      selectedDays: [],
      swHeight: 0,
      currentMonth: '',
      stickyTop: 0,
      eleNodeList: []
    };
  },
  props: {
    calendarShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "日期"
    },
    confirmText: {
      type: String,
      default: ""
    },
    defaultSeletedDays: {
      type: Array,
      default: function(val) {
        return [format(new Date().BJDate(), "YYYY-MM-DD")];
      }
    },
    showToday: {
      type: Boolean,
      default: true
    },
    // preS
    startTime: {
      type: String, // YYYY-MM-DD
      default: format(new Date().BJDate(), "YYYY-MM-DD"),
      validator: function(val) {
        return new Date(val).toString() !== "Invalid Date";
      }
    },
    endTime: {
      type: String,
      default: format(addDays(new Date().BJDate(), 59), "YYYY-MM-DD"), // 默认60天后
      validator: function(val) {
        return new Date(val).toString() !== "Invalid Date";
      }
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 最多可选个数
    multipleMax: {
      type: [Number, String],
      default: 4
    },
    // 需要显示右上角徽章的日期, 作为扩展功能，本期不做 TODO
    badge: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 需要显示假日文本的日期
    holiday: {
      type: Object,
      default: function() {
        return holiday_2017;
      }
    },
    // 扩展类文本日期，如“可抢”
    noteDay: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 不可用日期, 作为扩展功能，本期不做 TODO
    disabledTime: {
      type: Object,
      default: function() {
        return {};
      }
    },
    formatRule: {
      type: Object,
      default: function() {
        return { rule: "YYYY-MM-DD", type: "Array" };
      }
      // validator: function(val) {
      //
      // }
    }
  },
  computed: {},
  created() {
    this.initCalendar();
  },
  mounted() {
    this.selectedDays = this.defaultSeletedDays;
    if (this.defaultSeletedDays.length > this.multipleMax) {
      throw new Error(
        `defaultSeletedDays length can't more than ${this.multipleMax}`
      );
    }
    this.initSticky()
    this.scrollToHightLight()
  },
  beforeDestroy() {
    // this.removeScrollEvent()
  },
  destroyed() {},
  watch: {
    defaultSeletedDays(val, oldVal) {
      this.selectedDays = val;
    },
    holiday(val, oldVal) {
      console.log('holiday update');
      console.log(val, oldVal);
      this.initCalendar()
    },
    calendarShow(val, oldVal) {
      if (val) {
        this.scrollToHightLight()
      }
    }
  },
  methods: {
    initCalendar() {
      const startMonth = new Date(this.startTime);
      const endMonth = new Date(this.endTime);
      let months = this.generateMonths(this.startTime, this.endTime);
      this.renderMonths = months.map(month => {
        return this.getMonthTable(month);
      });
      this.$nextTick(() => {
        this.scrollToHightLight()
        let fixedBottomHeight = 70; // 底部btn高度
        let fixedTopHeight = 33; // 顶部weekday高度
        this.swHeight = window.innerHeight - fixedBottomHeight - fixedTopHeight;
      });
    },
    generateMonths(startTime, endTime) {
      // const subtractMonth = Number(distanceInWordsStrict(startTime, endTime, { unit: 'M' }).split(' ')[0]) // 计算起始时间相差月数
      const subtractMonth = Number(
        differenceInCalendarMonths(endTime, startTime)
      ); // 计算起始时间相差月数
      const startMonth = format(startTime, "YYYY-MM");
      let months = [startMonth];
      let pivotMonth = startMonth;
      for (let i = 0; i < subtractMonth; i++) {
        pivotMonth = addMonths(pivotMonth, 1);
        months.push(format(pivotMonth, "YYYY-MM"));
      }
      return months;
    },
    /**
     * [getMonthTable description] 获取该月日历
     * @param  {string} month [description] 'YYYY-MM'
     * @return {array}       [description]
     */
    getMonthTable(month) {
      let weeks = this.getWeeks(month);
      return { monthText: `${format(month, "YYYY年M月")}`, month: month, weeks };
    },
    getWeeks(date) {
      const weekDayNotInMonth = {
        dayNumber: "",
        dateNumberFull: "",
        fullDate: ""
      }; // 用以第一周or最后一周epmtyDays
      const daysInMonth = getDaysInMonth(date); // 获取该月的总天数
      const year = format(date, "YYYY");
      const month = format(date, "MM");
      const lastday = endOfMonth(date); // 获取该月最后一天
      const lastWeekFirstDay = startOfWeek(lastday); // 获取该月最后一周的第一天
      // const lastWeekLastDay = lastday
      let firstDayInWeek = parseInt(
        format(date, this.sundayFirst ? "d" : "E"),
        10
      ); // 该月第一天属于周几
      // const firstDay = startOfMonth(date) // 获取当月第一天
      // const firstDayInWeek = getDay(firstDay) // 第一天属于周几
      if (this.sundayFirst) {
        firstDayInWeek++;
      }

      let weeks = [];
      let week = [];
      // add empty days to get first day in correct position
      for (let s = 1; s < firstDayInWeek; s++) {
        week.push(weekDayNotInMonth);
      }
      for (let d = 0; d < daysInMonth; d++) {
        let dayNumber = d + 1;
        let dayNumberFull =
          dayNumber < 10 ? "0" + dayNumber : dayNumber.toString();
        let fullDate = year + "-" + month + "-" + dayNumberFull;
        const attribute = this.generateDateAttribute(fullDate);
        week.push({
          dayNumber,
          dayNumberFull,
          fullDate,
          ...attribute
        });
        // let now = new Date(fullDate)
        // const isInLaskWeek = isBefore(now, lastWeekLastDay) && isAfter(now, lastWeekFirstDay) // 是否位于最后一周
        if (week.length === 7) {
          weeks.push(week);
          week = [];
        } else if (fullDate == format(lastday, "YYYY-MM-DD")) {
          // 最后一周单独处理
          weeks.push(week);
          week = [];
        }
      }
      return weeks;
    },
    // 单独计算day各自的属性
    generateDateAttribute(date) {
      const attribute = {
        extendText: '',
        dayType: [],
        noteText: ''
      }
      let isSunday = getDay(date) == 0
      let isSaturday = getDay(date) == 6
      let isWeekDay = isSunday || isSaturday // 是否周末
      attribute.isWeekDay = isWeekDay
      let isHoliday = Object.keys(this.holiday).indexOf(date) !== -1
      if (isHoliday) {
        attribute.extendText = this.holiday[date]
        attribute.dayType.push("holiday")
      }
      let isDisabled = Object.keys(this.disabledTime).indexOf(date) !== -1
      if (isDisabled) {
        attribute.isDisabled = isDisabled
      }

      if (isBefore(date, this.startTime) || isAfter(date, this.endTime)) {
        attribute.isDisabled = true
      }
      if (this.showToday && date == format(new Date().BJDate(), "YYYY-MM-DD")) {
        // attribute.extendText = "今天"
        attribute.dayType.push("today")
      }
      // 计算可抢日期
      let end = format(addDays(new Date().BJDate(), 60), "YYYY-MM-DD")
      if (
        isBefore(date, end) &&
        isAfter(date, format(addDays(new Date().BJDate(), 29)))
      ) {
        attribute.noteText = "可抢"
        // attribute.extendText = "可抢"
        attribute.dayType.push("grap")
      }
      let isNoteDay = Object.keys(this.noteDay).indexOf(date) !== -1
      if (isNoteDay) {
        attribute.noteText = this.noteDay[date]
      }
      return attribute;
    },
    wrapperClasses(date) {
      /* eslint-disable */
      return {
        empty: !date,
        "calendar-day": true,
        isWeekday: date.isWeekDay,
        holiday: date.dayType && date.dayType.includes("holiday"),
        today: date.dayType && date.dayType.includes("today"),
        isDisabled: date.isDisabled || !date.fullDate,
        selected: this.multiple
          ? this.selectedDays.indexOf(date.fullDate) !== -1
          : date.fullDate == this.selectedDays[0]
      };
      /* eslint-enable */
    },
    onSelect(val, e) {
      const { fullDate, isDisabled } = val;
      if (!fullDate || isDisabled) {
        return;
      }
      let selectedDays = this.selectedDays.slice();
      let index = this.selectedDays.indexOf(fullDate);
      if (!this.multiple) {
        // 单选
        selectedDays = [fullDate];
      } else {
        // 多选
        if (this.selectedDays.indexOf(fullDate) !== -1) {
          selectedDays.splice(index, 1);
        } else {
          if (this.selectedDays.length < this.multipleMax) {
            selectedDays.push(fullDate);
            selectedDays = selectedDays.sort(this.sortDate);
          }
          if (this.selectedDays.length == this.multipleMax) {
            let txt = "日期最多可选择4天";
            this.$createToast({ txt, type: "warn", time: 1000 }).show();
            return;
            // 选满四个时，再点选会清空原有
            // selectedDays = [fullDate]
          }
        }
      }
      this.selectedDays = selectedDays;
      e.stopPropagation();
      // if (!this.multiple) {
      //   // 单选时无确定按钮，手动触发一次confirm
      //   this.confirm(e)
      // }
    },
    sortDate(a, b) {
      return new Date(a) - new Date(b);
    },
    confirm(e) {
      if (!this.selectedDays.length) {
        this.$createToast({
          txt: "请至少选择一个日期",
          type: "warn",
          time: 1000
        }).show();
        return;
      }
      const result = this.formatResult(this.selectedDays);
      this.$emit("on-select", result);
      e.stopPropagation();
    },
    formatResult(dates) {
      let result = dates.map(day => {
        return format(day, this.formatRule.rule);
      });
      if (this.formatRule.type == "String") {
        result = result.join("、");
      }
      return result;
    },
    cancel(e) {
      this.$emit("on-cancel");
      e.stopPropagation();
    },
    initSticky() {
      this.currentMonth = this.renderMonths.length && this.renderMonths[0].monthText
      let nodeList = document.getElementsByClassName('calendar-month-header')
      let offsetTop = Array.from(nodeList).map(item => {
        return item.offsetTop
      })
      this.eleNodeList = nodeList
      if (nodeList.length && offsetTop[0]) {
        this.stickyTop = offsetTop[0]
      }
      this.onScroll()
    },
    onScroll() {
      let ele = document.getElementsByClassName('page-calendar-scroll')
      if (ele.length) {
        this.addScrollEvent(ele[0])
      } else {
        this.$nextTick(() => {
          // ele = document.querySelector('.scroll-wrapper')
          this.addScrollEvent(ele[0])
        })
      }
    },
    addScrollEvent(ele) {
      let _this = this
      ele.addEventListener('scroll', throttle(function() {
        _this.calculateOffset()
      }, 200), false)
    },
    removeScrollEvent() {
      let ele = document.getElementsByClassName('page-calendar-scroll')
      ele.removeEventListener("mousedown", false)
    },
    calculateOffset() {
      let text = this.renderMonths.length && this.renderMonths[0].monthText
      let eleViewTop = Array.from(this.eleNodeList).map(item => {
        return item.getBoundingClientRect().top
      })
      let { stickyTop } = this
      eleViewTop.forEach((item, index) => {
        if (item <= (stickyTop + 36)) {
          text = this.renderMonths[index].monthText
        }
      })
      if (text) {
        this.currentMonth = text
      }
      // console.log(eleViewTop);
    },
    // 自动滚动到高亮日期
    scrollToHightLight() {
      let stickyHeaderHeight = 36
      let weekHeight = 33
      this.$nextTick(() => {
        let selected = document.querySelectorAll('.calendar .selected')[0]
        let offsetTop = selected && selected.offsetTop
        // set wrapper scrollTop
        if (offsetTop) {
          document.querySelector('.calendar .scroll-wrapper').scrollTop = offsetTop - stickyHeaderHeight - weekHeight
        }
      })
    }
  }
};
</script>
<style scoped lang="less">
@import "~assets/styles/var.less";
@bgc: rgba(0, 0, 0, 0.04);
@bgc-header: #F7F7F7;
@text: #333333;
@orange: #fc9153;
@text-extension: #fe613c;
@border-color: #d9dbdf;
// @disabled-bgc: rgba(0,0,0,0.04);
@disabled-bgc: rgba(0, 0, 0, 0.04);

.calendar-wrapper {
  position: relative;
}
.calendar {
  .border-bottom-1px {
    &::before,
    &::after {
      border-color: @border-color;
    }
  }
  background-color: @bgc;
  color: @text;
  text-align: center;
  display: none;
  z-index: @z-calendar;
  &.show {
    display: block;
    position: fixed !important;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: @z-calendar;
    // overflow: scroll;
    // -webkit-overflow-scrolling: touch;
  }
  .calendar-input {
    font-size: 12px;
  }
  .calendar-wrapper {
    // TODO delete
    // display: none;
    // &.show {
    //   display: block;
    //   position: absolute;
    //   top: 0;
    //   bottom: 0;
    //   left: 0;
    //   right: 0;
    //   background-color: #fff;
    // }
  }
  .calendar-header {
    height: 2.81rem;
    line-height: 2.81rem;
    background-color: #fff;
    position: relative;
    text-align: center;
    padding: 0.73rem 1.33rem;
    .cubeic-back {
      font-size: 18px;
      position: absolute;
      left: 1.33rem;
    }
    .title {
      font-size: 18px;
      color: @text;
      font-family: "PingFangSC-Medium";
    }
    .confirm-text {
      position: absolute;
      color: @orange;
      font-size: 14px;
      position: absolute;
      right: 1.33rem;
    }
  }
  .celendar-header-bottom {
    position: fixed;
    bottom: 0;
    z-index: @z-calendar-bottom;
    width: 100%;
    height: 70px;
    line-height: 70px;
    background-color: #fff;
    text-align: center;
    // box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.16);
    // padding: 0.73rem 1.33rem;
    display: flex;
    .btn-cancel,
    .btn-confirm {
      font-family: PingFangSC-Regular;
      width: 50%;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      box-sizing: border-box;
      border-radius: 2px;
    }
    .btn-confirm {
      color: #fff;
      background-color: @orange;
    }
    .btn-cancel {
      border: 1px solid rgba(151, 151, 151, 0.4);
      margin-right: 5px;
      color: #666666;
    }
  }
  .page-calendar-weekday {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: @z-calendar-bottom;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.08);
    .calendar-weekday {
      height: 33px;
      line-height: 33px;
      background-color: #ffffff;
    }
  }
  .page-current-month-text {
    position: fixed;
    top: 33px;
    width: 100%;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #333;
    text-align: left;
    padding-left: 1.67rem;
    background-color: #F7F7F7;
    z-index: @z-calendar-sticky;
  }
  .page-calendar-scroll {
    width: 100%;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    // height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    padding-top: 33px;
    .calendar-months {
      width: 100%;
      .calendar-month-header {
        height: 3rem;
        line-height: 3rem;
        font-size: 14px;
        color: #333;
        text-align: left;
        padding-left: 1.67rem;
        // background-color: @bgc-header;
      }
      .invisible {
        visibility: hidden;
      }
      .calendar-month-body {
        width: 100%;
        border-collapse: separate;
        border-spacing: 4px;
        .calendar-day {
          font-size: 16px;
          height: 66px;
          line-height: initial;
          width: 4.5rem;
          background-color: #ffffff;
          vertical-align: middle;
          border-radius: 8px;
          box-sizing: border-box;
        }
        .today {
          font-family: PingFangSC-Medium;
          color: #FC9153;
          background: #FEF1EA;
        }
        .calendar-week {
          &:last-of-type {
            border-bottom: none;
          }
          td {
            position: relative;
          }
        }
        .calendar-day-num {
          line-height: initial;
        }
        .calendar-day-ext {
          line-height: initial;
          font-size: 10px;
          color: @orange;
          position: absolute;
          transform: scale(0.83);
        }
        .calendar-day-ext-top {
          top: 4.5px;
          width: 100%;
        }
        .day-ext-color-333 {
          color: @text;
        }
        .calendar-day-ext-bottom {
          bottom: 4px;
          width: 100%;
        }
        .isWeekday {
          color: @orange;
        }
        .isDisabled {
          opacity: 0.5;
          .calendar-day-ext {
            color: #cccccc;
          }
        }
        .selected {
          background-color: @orange;
          color: #fff;
          .calendar-day-ext {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
