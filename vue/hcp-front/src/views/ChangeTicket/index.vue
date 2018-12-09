<template>
  <div class="change-ticket-container">
    <div class="content">
      <div class="border-bottom-1px">
        <span>出发城市</span>
        <span class="fixed-from-station">{{trainInfo.from_station}}</span>
      </div>
      <div class="to-station border-bottom-1px" @click="showCityList">
        <span>到达城市</span>
        <span>{{trainInfo.to_station}}</span>
        <img src="../../assets/images/right@3x.png" alt="" class="select_icon">
      </div>
      <div class="start-date border-bottom-1px" @click="calendarShow = true">
        <span>出发日期</span>
        <span>{{returnDate(trainInfo.train_date)}}</span>
        <span>{{returnDay(trainInfo.train_date)}}</span>
        <img src="../../assets/images/right@3x.png" alt="" class="select_icon">
      </div>
      <div class="gt-switch">
        <span>只看高铁动车</span>
        <cube-switch v-model="tripTpes"></cube-switch>
      </div>
    </div>
    <div class="fixed-bottom-container fixed-bottom-container-shadow">
      <div class="change-btn" @click="changeHandle">申请改签</div>
    </div>
    <Calendar
      :multiple="false"
      title="出发日期"
      :calendarShow="calendarShow"
      :defaultSeletedDays="[trainInfo.train_date]"
      :holiday="holidayAndChangeday"
      @on-select="onDateChange"
      @on-cancel="hideCalendar"
      :formatRule="{ type: 'String', rule: 'YYYY-MM-DD' }"
    >
    </Calendar>
  </div>
</template>
<script>
import { returnDate, returnDay } from "@/utils/commonlibs.js";
import { mapGetters, mapActions } from "vuex";
import { Switch, createAPI } from "cube-ui";
import format from "date-fns/format";
import { formatBJ } from "@/utils/commonlibs";

import CityList from "@/components/CityList/index.vue";
import Vue from "vue";

createAPI(Vue, CityList, ["on-select", "on-cancel"], true);
export default {
  components: {
    CubeSwitch: Switch
  },
  data() {
    return {
      returnDate,
      returnDay,
      tripTpes: false, // 只看高铁
      calendarShow: false,
      noteDate: {},
      trainInfo: {
        from_station: "",
        from_station_code: "",
        to_station: "",
        to_station_code: "",
        train_date: ""
      },
      toStationDisable: false,
      isChangeToStation: false, // 用户是否更改过“到达城市”
      holidayAndChangeday: {} // 节假日+改签原日期
    };
  },
  props: {},
  computed: {
    ...mapGetters({
      holiday: "holiday"
    })
  },
  created() {},
  mounted() {
    this.changeHeader();
    this.trainInfo = this.getTrainInfo();

    this.Omega("train_ticket_change_sw", "车票改签选择城市日期页面展示");
  },
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions(["updateHoliday", "changeHeader"]),
    showCityList() {
      // 除了在调用 createAPI 的时候传入了 events，这里对应的就是
      // on{event name} 会被当做事件回调处理
      const instance = this.$createCityList({
        cityListShow: true
      });
      let _this = this
      instance.$on("on-select", val => {
        this.trainInfo.to_station = val.name;
        this.trainInfo.to_station_code = val.code;
        // NOTE: isChangeToStation：该值只取决于用户是否选择了不一样的到达城市，而与改签时实际选择的车次实际到达站是否有变更无关。
        if (val.name !== this.$route.query.old_to_station) {
          _this.isChangeToStation = true
        }
        this.updateUrlQuery("city", val);
        this.Omega(
          "train_ticket_change_arrival_sw",
          "车票改签选择城市日期页面到达城市点击",
          { city: val.name }
        );
        instance.remove(); // 这种调用方式, 由于使用了remove移除了实例，所以无需再将calendarShow设为false
      });
      instance.$on("on-cancel", e => {
        instance.remove();
      });
    },
    getTrainInfo() {
      const { query } = this.$route;
      let {
        from_station,
        from_station_code,
        to_station,
        to_station_code,
        old_to_station,
        old_to_station_code,
        departure_timestamp
      } = query;
      let departureDate = formatBJ(
        parseInt(departure_timestamp, 10) * 1000,
        "YYYY-MM-DD"
      );
      this.noteDate = {
        originDate: departureDate
      };
      // eslint-disable-next-line
      // 原日期与节假日都在上方显示，所以这里做一个合并，简单处理实现
      let originDate = { [departureDate]: '原日期' }
      let holidayAndChangeday = Object.assign({}, this.holiday, originDate)
      this.holidayAndChangeday = holidayAndChangeday
      // this.updateHoliday({ holiday })
      return {
        from_station,
        from_station_code,
        to_station: to_station || old_to_station,
        to_station_code: to_station_code || old_to_station_code,
        train_date: departureDate
      };
    },
    //
    getOldTicketInfo() {
      let {
        order_id,
        ticket_id,
        seat_type_code,
        seat_type_name,
        old_to_station,
        old_to_station_code,
        passenger_name,
        certificate_no,
        ticket_type
      } = this.$route.query;
      return {
        order_id,
        ticket_id,
        seat_type_code,
        seat_type_name,
        old_to_station,
        old_to_station_code,
        passenger_name,
        certificate_no,
        ticket_type
      };
    },
    // 申请改签
    changeHandle() {
      let { trainInfo } = this;
      let ticketInfo = this.getOldTicketInfo();
      let query = Object.assign({}, trainInfo, { old_ticket_info: ticketInfo, is_change_to_station: this.isChangeToStation });
      // 是否只看高铁
      if (this.tripTpes) {
        query.train_type = 1;
      }
      this.$router.push({
        path: "/trainlist",
        query: query
      });
    },
    onDateChange(val) {
      this.trainInfo.train_date = val;
      this.calendarShow = false;
      this.updateUrlQuery("date", val);
      this.Omega(
        "train_ticket_change_date_ck",
        "车票改签选择城市日期页面出发日期点击",
        { date: val }
      );
    },
    updateUrlQuery(type, val) {
      let { query } = this.$route;
      let updatePart = {};
      switch (type) {
        case "date":
          updatePart = {
            train_date: val
          };
          break;
        case "city":
          updatePart = {
            to_station: val.name,
            to_station_code: val.code
          };
          break;
        default:
      }
      let newQuery = Object.assign({}, query, updatePart);
      this.$router.replace({ query: newQuery });
    },
    hideCalendar() {
      this.calendarShow = false;
    }
  }
};
</script>
<style scoped lang="less">
.change-ticket-container {
  .content {
    text-align: left;
    font-size: 14px;
    margin-top: 0.83rem;
    background: #ffffff;
    // padding-left: 1.33rem;
    & > div {
      height: 4.17rem;
      line-height: 4.17rem;
      padding-left: 1.33rem;
      color: #333333;
      overflow: hidden;
      & span:nth-child(1) {
        color: #999999;
        margin-right: 2rem;
      }
    }
    .fixed-from-station {
      color: #adadad;
    }
    .to-station:active, .start-date:active {
      background-color: rgba(0,0,0,0.04);
    }
    .gt-switch {
      display: flex;
      .cube-switch {
        margin-left: auto;
        margin-right: 1.46rem;
      }
    }
    .select_icon {
      width: 1rem;
      height: 1rem;
      float: right;
      margin-top: 1.33rem;
      margin-right: 1.33rem;
    }
  }
  .change-btn {
    font-size: 16px;
    font-family: PingFangSC-Medium;
    height: 50px;
    line-height: 50px;
    color: #ffffff;
    background: #4A4C5B;
    border-radius: 2px;
  }
}
</style>
