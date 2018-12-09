<template>
  <div ref="slider" @touchstart="handleSliderTouchstart" @touchmove="handleSliderTouchmove" @touchend="handleSliderTouchend" class="time-range-slider">
    <div class="slider-time-show" slot="slider-time">
      <span>
        {{value[0]}} - {{value[1]}}
      </span>
    </div>
    <div class="slider-silder-container" role="time-range-slider">
      <div class="slider-silder">
        <div class="slider-slider-mask">
          <div class="slider-slider-mask-item" :class="{selected: index === 1}"  :style="{flex: duration}" v-for="(duration, index) in selectedDurations" :key="index"></div>
        </div>
      </div>
      <div class="slider-tick">
        <div class="slider-tick-item" :style="{flex: tick.duration}" v-for="(tick, index) in ticks" :key="index">
          <span class="slider-tick-item-label">{{tick.label}}</span>
        </div>
      </div>
    </div>
    <div class="slider-tips" slot="slider-tip">
      <span v-if="tipsShow">建议扩大发车时间段，提高预约成功率</span>
    </div>
  </div>
</template>

<script>
function addZeroForNumber(number, digit = 2) {
  if (number == null) throw Error("number不能为空");
  const addNumber = digit - String(number).length;
  if (addNumber <= 0) return String(number);
  return "0".repeat(addNumber) + String(number);
}
function generateTimeOptions(start = "00:00", end = "24:00", step = "00:15") {
  const [startHour, startMinute] = start.split(":").map(value => Number(value));
  const [endHour, endMinute] = end.split(":").map(value => Number(value));
  const [stepHour, stepMinute] = step.split(":").map(value => Number(value));
  let options = [start],
    currentHour = startHour,
    currentMinute = startMinute;
  while (currentHour < endHour || currentMinute < endMinute) {
    currentHour += stepHour;
    currentMinute += stepMinute;
    // 处理进位
    currentHour += Math.floor(currentMinute / 60);
    currentMinute = currentMinute % 60;
    options.push(
      `${addZeroForNumber(currentHour)}:${addZeroForNumber(currentMinute)}`
    );
    // options.push(`${addZeroForNumber(currentHour)}:00`);
  }
  return options;
}
function checkTime(time) {
  if (/^\d{2}:\d{2}$/.test(time)) return true;
  return false;
}
function caclTimeDuration(before = "00:00", after = "01:30") {
  return calcTimeMiunte(after) - calcTimeMiunte(before);
}
function calcTimeMiunte(time = "00:00") {
  if (!checkTime(time)) return 0;
  const [hour, minute] = time.split(":").map(value => Number(value));
  return hour * 60 + minute;
}
function timeAppendOffset(time = "00:00", offsetMinutes = 60) {
  if (!checkTime(time)) return;
  const [hour, minute] = time.split(":").map(value => Number(value));
  const newHour = hour + Math.floor(offsetMinutes / 60);
  const newMinute = minute + (offsetMinutes % 60);
  const totalMinutes = newHour * 60 + newMinute;
  return `${addZeroForNumber(Math.floor(totalMinutes / 60))}:${addZeroForNumber(
    totalMinutes % 60
  )}`;
  // return `${addZeroForNumber(Math.floor(totalMinutes / 60))}:00`;
}
// 返回数组，用于刻度渲染
function defaultTickRule(options) {
  const filterOpts = options.filter((opt, index) => index % 2 === 0);
  return filterOpts.map((opt, index) => {
    const nextOpt = filterOpts[index + 1];
    let duration;
    if (nextOpt) {
      duration = caclTimeDuration(opt, nextOpt);
    } else {
      duration = 0;
    }
    if (opt === "00:00" || opt === "12:00" || opt === "24:00") {
      return { time: opt, label: opt, duration };
    } else {
      return { time: opt, duration };
    }
  });
}
function fixStep(time = "12:23", step = "00:60") {
  const [hour, minute] = time.split(":").map(value => Number(value));
  const [, stepMinute] = step.split(":").map(value => Number(value));
  const realMinutes = Math.round(minute / stepMinute) * stepMinute;
  const totalMinutes = hour * 60 + realMinutes;
  // return `${addZeroForNumber(Math.floor(totalMinutes / 60))}:${addZeroForNumber(
  //   totalMinutes % 60
  // )}`;
  return `${addZeroForNumber(Math.floor(totalMinutes / 60))}:00`;
}
export default {
  name: "TimeRangeSlider",
  props: {
    range: {
      type: Array,
      default() {
        return ["00:00", "24:00"];
      }
    },
    value: {
      type: Array,
      default() {
        return ["8:00", "15:00"];
      }
    },
    // 最小调整大小
    step: {
      type: String,
      default: "00:60"
    },
    minRange: {
      type: Number,
      default: 60
    },
    // 刻度尺显示规则
    tickRule: {
      type: Function,
      default: defaultTickRule
    }
  },
  data() {
    return {
      currentValue: this.value.slice(),
      tipsShow: false
    };
  },
  computed: {
    timeOptions() {
      return generateTimeOptions(this.range[0], this.range[1], this.step);
    },
    ticks() {
      return this.tickRule(this.timeOptions);
    },
    // 从0到选中开始，选中开始到选中结束，开始到结束
    selectedDurations() {
      const [start, end] = this.range;
      const [selectedStart, selectedEnd] = this.currentValue;
      return [
        caclTimeDuration(start, selectedStart),
        caclTimeDuration(selectedStart, selectedEnd),
        caclTimeDuration(selectedEnd, end)
      ];
    },
    pixelPerMinute() {
      const [start, end] = this.range;
      return this.$refs.slider.clientWidth / caclTimeDuration(start, end);
    },
    minutePerPixel() {
      const [start, end] = this.range;
      return caclTimeDuration(start, end) / this.$refs.slider.clientWidth;
    }
  },
  watch: {
    currentValue(val) {
      let [selectedStart, selectedEnd] = val;
      let start = parseInt(selectedStart.split(":")[0]);
      let end = parseInt(selectedEnd.split(":")[0]);
      if (end - start <= 2) {
        this.tipsShow = true;
      } else {
        this.tipsShow = false;
      }
      this.$emit("input", val);
      this.eventHub.$emit("on-timerange-change", val);
    }
  },
  methods: {
    isGreaterCenter(x) {
      const [selectedStart, selectedEnd] = this.currentValue;
      const center =
        ((calcTimeMiunte(selectedStart) + calcTimeMiunte(selectedEnd)) / 2) *
        this.pixelPerMinute;
      return x - center > 0;
    },
    handleSliderTouchstart(e) {
      // touch 事件取不到 offsetX,计算大于中心点时稍有一点偏移
      const touch = e.changedTouches[0] || {};
      this.startX = touch.clientX;
      this.changeIndex = this.isGreaterCenter(touch.clientX) ? 1 : 0;
      this.startValue = this.currentValue[this.changeIndex];
    },
    handleSliderTouchmove(e) {
      const { clientX } = e.changedTouches[0] || {};
      const offsetMinutes = Math.round(
        (clientX - this.startX) * this.minutePerPixel
      );
      let changedValue = timeAppendOffset(this.startValue, offsetMinutes);
      if (caclTimeDuration(changedValue, this.range[0]) >= 0) {
        changedValue = this.range[0];
      }
      if (caclTimeDuration(changedValue, this.range[1]) <= 0) {
        changedValue = this.range[1];
      }
      // 处理两个滑块相互超过的情况
      if (
        this.changeIndex === 0 &&
        caclTimeDuration(changedValue, this.currentValue[1]) <= this.minRange
      ) {
        // 当前滑动的是第一块，并且第二块与第一块差值小于60分钟时，改为滑动第二块
        this.changeIndex = 1;
        changedValue = this.currentValue[1];
      }
      if (
        this.changeIndex === 1 &&
        caclTimeDuration(this.currentValue[0], changedValue) <= this.minRange
      ) {
        // 当前滑动的是第二块
        this.changeIndex = 0;
        changedValue = this.currentValue[0];
      }
      this.$set(this.currentValue, this.changeIndex, changedValue);
    },
    // 修复正确的 value,选中开始时间大于 range[0],小于选中结束时间
    // fixRightValue() {},
    handleSliderTouchend(e) {
      this.startX = null;
      this.changeIndex = null;
      this.startValue = null;
      const [start, end] = this.currentValue;
      this.$set(this.currentValue, 0, fixStep(start, this.step));
      this.$set(this.currentValue, 1, fixStep(end, this.step));
    }
  }
};
</script>

<style lang="less">
@orange: #fc9153;
@orange-light: #ffe9dd;
@gray: #f3f4f5;
@ft-gray: #999999;
@tick-color: #cccccc;
.time-range-slider {
  font-family: PingFangSC-Regular;
  text-align: center;
  width: 90%;
  margin: 0 auto;
  .slider-time-show {
    font-size: 24px;
    color: #fc9153;
    line-height: 36px;
    & > span {
      font-weight: bolder;
    }
  }
  .slider-silder-container {
    margin-top: 16px;
    margin-bottom: 30px;
    .slider-silder {
      height: 12px;
      background-color: @gray;
      position: relative;
      .slider-slider-mask {
        display: flex;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        &-item {
          height: 12px;
          box-sizing: border-box;
        }
        &-item.selected {
          background-color: @orange-light;
          border-left: 3px solid @orange;
          border-right: 3px solid @orange;
          position: relative;
        }
        &-item.selected::after,
        &-item.selected::before {
          position: absolute;
          content: "";
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: @orange;
          z-index: 2;
        }
        &-item.selected::before {
          left: -7.5px;
          top: -100%;
        }
        &-item.selected::after {
          right: -7.5px;
          top: 100%;
        }
      }
    }
    .slider-tick {
      display: flex;
      flex-direction: row;
      height: 6px;
      margin-top: 6px;
      .slider-tick-item {
        border-left: 1px solid @tick-color;
        position: relative;
        &-label {
          position: absolute;
          display: inline-block;
          margin-top: 6px;
          left: -50%;
          top: 6px;
          text-align: left;
        }
      }
      .slider-tick-item:first-child {
        .slider-tick-item-label {
          left: 0;
        }
      }
      .slider-tick-item:last-child {
        .slider-tick-item-label {
          left: initial;
          right: 0;
        }
      }
    }
    .slider-tick-item-label {
      color: #999;
      font-size: 14px;
    }
  }
  .slider-tips {
    font-size: 12px;
    color: #fe4f27;
    text-align: center;
    line-height: 18px;
    height: 18px;
  }
}
</style>