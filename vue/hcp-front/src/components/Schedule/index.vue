<template>
  <Popup :mask="true" position="bottom" :maskClosable="false" :visible="scheduleShow" type="schedule-popup" @mask-click="$emit('on-hide')">
    <div class="schedule">
      <div class="header">
        <span class="font-18">经停信息</span>
        <img class="close-icon" @click="$emit('on-hide')" :src="closeIcon" />
      </div>
      <!-- <div class="schedule-table"> -->
        <div class="schedule-header font-12">
          <div class="station-name">车站</div>
          <div class="arrive-time">到达</div>
          <div class="leave-time">发车</div>
          <div class="stay-time">停留</div>
        </div>
        <div class="schedule-body font-12">
          <!-- <Loading v-show="scheduleLoading" class="loading-dialog"></Loading> -->
          <div class="pre-station"
            v-for="(station, index) in scheduleData"
            :key="station.station_name + index"
            :class="{ 'choose-station' : station.station_flag === 1 || station.station_flag === 2}">
            <div class="station-name">{{station.station_name}}</div>
            <div class="arrive-time">{{formatTime(station.arrive_time)}}</div>
            <div class="leave-time">{{formatTime(station.start_time)}}</div>
            <div class="stay-time">{{formatTime(station.stopover_time)}}</div>
          </div>
          <div v-if="scheduleNetErr" class="net-err-info">
            <img :src="netError" @click="fetchAgain"></img>
            <p class="tips">网络异常</p>
            <p class="sub-tips">点击图片，重新加载</p>
          </div>
        </div>
      <!-- </div> -->
      <!-- <div class="btn border-top-1px font-16" @click="onClick">
        我知道了
      </div> -->
    </div>
  </Popup>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import CommonError from "@/components/Common/commonError.vue";
import { Popup, Loading } from 'cube-ui'
import netError from '@/assets/images/neterror.png'
import closeIcon from '@/assets/images/close@3x.png'


export default {
  name: 'Schedule',
  components: {
    Popup,
    Loading,
    CommonError
  },
  data() {
    return {
      tips: "网络连接异常",
      subTips: "点击图片，重新加载",
      showNetError: false,
      netError,
      closeIcon
    }
  },
  props: {
    scheduleShow: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    ...mapGetters({
      // scheduleLoading: "scheduleLoading",
      scheduleData: "scheduleData",
      scheduleNetErr: "scheduleNetErr"
    }),
    show: {
      get() {
        return this.scheduleShow
      },
      set(val) {
        this.$emit('on-hide')
      }
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    onClick() {
      this.$emit('on-hide')
    },
    fetchAgain() {
      this.$emit('fetch-again')
    },
    formatTime(str) {
      let time = str
      if (str == '----') {
        time = '-'
      }
      return time
    }
  }
}
</script>
<style scoped lang="less">
@import "~assets/styles/var.less";
.schedule {
  width: 100%;
  // min-height: 25rem;
  // max-height: 46.25rem;
  height: @drawer-height-max;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  .header {
    height: 4rem;
    line-height: 4rem;
    text-align: center;
    position: relative;
    flex: 0 0 4rem;
    .close-icon {
      height: 1.333rem;
      width: 1.333rem;
      position: absolute;
      right: 1.25rem;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .schedule-header, .pre-station {
    font-size: 12px;
    line-height: 2.5rem;
    height: 2.5rem;
    padding: 0 2.083rem;
    // text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .station-name, .arrive-time, .leave-time, .stay-time {
      display: inline-block;
    }
    .station-name {
      width: 40%;
    }
    .arrive-time, .leave-time {
      width: 20%;
    }
    .stay-time {
      width: 20%;
      text-align: right;
    }
  }
  .schedule-header {
    background: #F3F4F6;
    color: #999999;
    // padding: 0 2.083em;
    // flex: 0 0 2.5rem;
  }
  .schedule-body {
    font-size: 14px;
    color: #333333;
    flex: 1 1;
    padding: 3px 0;
    overflow-y: scroll;
    .choose-station{
      color: #FC9153;
    }
  }

  .net-err-info{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img{
      width: 10rem;
      height: 10rem;
    }
    .tips {
      font-size: 14px;
      color: #666;
      letter-spacing: 0;
      text-align: center;
    }
    .sub-tips {
      font-size: 12px;
      color: #999;
      text-align: center;
      margin-top: 1rem;
    }
  }
}
</style>
