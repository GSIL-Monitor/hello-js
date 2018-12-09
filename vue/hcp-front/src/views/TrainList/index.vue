<template>
  <div class="train-list">
    <HeaderCalendar callModule="trainlist" :holiday="holiday" @on-query-train="onTrainDateChange" :defaultSeletedDays="defaultSeletedDays"></HeaderCalendar>
    <!-- <Loading v-show="loading" class="loading-fixed" v-if="!pullLoading"></Loading> -->
    <div class="list-wrapper scroll-wrapper" :style="{ 'height': swHeight + 'px' }">
      <Scroll
        :options="options"
        @pulling-down="onPullingDown"
        ref="scroll"
        :data="trainList"
      >
        <TrainCard
          :trainInfo="trainInfo"
          v-for="trainInfo in trainList"
          :key="trainInfo.train_no + trainInfo.train_code"
          @onClick="onTrainClick">
        </TrainCard>
        <CommonError :show="noResultShow" :tips="tips" :subTips="subTips" @on-click="search" v-if="noResultShow"></CommonError>
      </Scroll>
    </div>
    <TrainFilter @on-filter-change="onFilterChange"></TrainFilter>
  </div>
</template>
<script>
import { Loading, Scroll } from "cube-ui";
import { mapGetters, mapActions } from "vuex";
import qs from "qs";
import HeaderCalendar from "@/components/HeaderCalendar/headercalendar.vue";
import CommonError from "@/components/Common/commonError.vue";
import TrainCard from "./trainCard.vue";
import TrainFilter from "./filter.vue";
import format from "date-fns/format";
import api from "@/service/api.js";
import {
  computedScrollWrapperHeight,
  pullDownRefresh
} from "utils/pullRefresh";

const CUSTOM_EVENT_NAME = "on-query-train";
const CUSTOM_OMEGA_EVENT_NAME = "omega_click";

export default {
  components: {
    HeaderCalendar,
    TrainCard,
    // Loading,
    Scroll,
    TrainFilter,
    CommonError
  },
  data() {
    return {
      loading: null,
      defaultSeletedDays: [format(new Date().BJDate(), "YYYY-MM-DD")],
      tips: "无可用班次",
      subTips: "重新选择出发时间试一试",
      noResultShow: false,
      swHeight: 0,
      pullDownRefresh: pullDownRefresh,
      pullLoading: false, // 是否处于下拉刷新中，为true时，全屏中心的loading不会展示，否则会有两个loading
      firstload: true
    };
  },
  props: {},
  computed: {
    ...mapGetters({
      passengerPhone: "passengerPhone",
      trainList: "trainList",
      toStationCode: "toStationCode",
      fromStationCode: "fromStationCode",
      trainDate: "trainDate",
      fromStationList: "fromStationList",
      toStationList: "toStationList",
      seatType: "seatType",
      StartStation: "StartStation",
      EndStation: "EndStation",
      SeatType: "SeatType",
      holiday: "holiday",
      hasHSR: "hasHSR",
      trainListFirstLoad:"trainListFirstLoad"
    }),
    options() {
      return {
        observeDOM: true,
        click: true,
        probeType: 1,
        scrollbar: false,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: false
      };
    }
  },
  created() {},
  mounted() {
    // this.firstload = false;
    this.loading = this.$createToast({ txt: "加载中", time: 0 });
    this.updateStationinfo();
    this.getQuery();
    this.search();
    let fixedFilterHeight = 48; // 底部filter高度
    this.swHeight = computedScrollWrapperHeight() - fixedFilterHeight;

    // 埋点统计
    this.Omega("train_ticket_searlist_sw", "查询结果列表页面展现", {
      cellphone: this.passengerPhone
    });
    let self = this;
    self.eventHub.$on(CUSTOM_OMEGA_EVENT_NAME, function(attr) {
      let { type, callModule } = attr;
      if (callModule === "trainlist") {
        switch (type) {
          case "pre":
            self.Omega(
              "train_ticket_searlist_before_ck",
              "查询结果列表页面前一天点击",
              { cellphone: this.passengerPhone }
            );
            break;
          case "next":
            self.Omega(
              "train_ticket_searlist_next_ck",
              "查询结果列表页面后一天点击",
              { cellphone: this.passengerPhone }
            );
            break;
          case "date":
            self.Omega(
              "train_ticket_searlist_date_ck",
              "查询结果列表页日期控件点击",
              { cellphone: this.passengerPhone }
            );
            break;
          default:
            break;
        }
      }
    });
  },
  beforeDestroy() {},
  destroyed() {},
  watch: {
    trainList(val, old) {
      // 当点击筛选条件，当刷选的车次为空时，展示相应提示
      this.noResultShow = !val.length;
      this.subTips = "请更换筛选条件重试";
      // this.$refs.scroll.refresh()
      this.$refs.scroll.forceUpdate(true);
    }
  },
  methods: {
    ...mapActions([
      "changeHeader",
      "fetchTrainList",
      "filterTrainList",
      "changeTrainDate",
      "filterByTrainDate",
      "setStartStation",
      "setEndStation",
      "setSeatType",
      "changeStationinfo",
      "multiFilterTrainList",
      "filterByCouponNum",
      "changeFilterCondition",
      "updateFirstLoadStatus"
    ]),
    onPullingDown() {
      this.search("pulldown");
      this.pullLoading = true;
      // this.multiFilterTrainList();
    },
    updateStationinfo() {
      let { query } = this.$route;
      this.changeStationinfo({
        fromStationCode: query.from_station_code,
        fromStation: query.from_station,
        toStationCode: query.to_station_code,
        toStation: query.to_station
      });
      this.changeHeader();
    },
    replaceRouter(newTrainDate, query = this.$route) {
      let newQuery = Object.assign({}, query, { train_date: newTrainDate });
      this.$router.replace({ query: newQuery });
      this.changeTrainDate(newTrainDate);
    },
    getQuery(val) {
      let { query } = this.$route;
      let newTrainDate =
        val || (query.train_date || format(new Date().BJDate(), "YYYY-MM-DD"));
      this.defaultSeletedDays = [newTrainDate];
      this.replaceRouter(newTrainDate, query);
    },
    async search(type) {
      if (!this.pullLoading) {
        this.loading.show();
        // this.loading = true;
      }
      this.noResultShow = false;
      const params = {
        train_date: this.trainDate,
        from_station_code: this.fromStationCode,
        to_station_code: this.toStationCode,
        train_type: this.$route.query.train_type
      };
      const res = await api.fetchTrainList(params);
      if (res.errno === 0) {
        let { data } = res;
        this.fetchTrainList({ trainList: data });
        // 获取数据时如果有筛选条件，根据筛选条件进行刷选
        if (this.$route.query.train_type == 1) {
          this.changeFilterCondition({ trainType: 4 });
        }
        this.multiFilterTrainList();
        !this.StartStation.length && this.setStartStation(this.fromStationList);
        !this.EndStation.length && this.setEndStation(this.toStationList);
        !this.SeatType.length && this.setSeatType(this.seatType);
        // this.filterByTrainDate(0);
        // 处理加载后的状态变更
        if (this.$route.query.train_type == 1 && this.trainListFirstLoad) {
          // 如果选择了高铁的筛选条件，但是又没有高铁，弹个toast
          if (!this.hasHSR) {
            let toast_txt = `${this.$route.query.from_station}到${
              this.$route.query.to_station
            }（或当前时间）没有高铁动车`;
            let hsrToast = this.$createToast(
              {
                txt: toast_txt,
                type: "warn",
                time: 3000
              },
              false
            );
            hsrToast.show();
          }
        }
        this.updateFirstLoadStatus(false)
      } else {
        this.noResultShow = true;
        this.fetchTrainList({ trainList: [] });
        this.tips = res.errmsg || "获取信息失败";
        // this.$createToast({
        //   txt: res.errmsg || "获取信息失败",
        //   type: "warn",
        //   time: 1000
        // }).show();
      }
      this.$refs.scroll.forceUpdate();
      this.pullLoading = false;
      // this.loading = false;
      this.loading.hide();
    },
    onFilterChange() {},
    onTrainDateChange(val) {
      this.getQuery(val);
      this.search();
    },
    sortTrainList(trainList) {
      // 将停运车次排在最后
      return trainList.sort(function(a, b) {
        return b.run_status - a.run_status
      })
    },
    onTrainClick(trainInfo) {
      if (!trainInfo.run_status) {
        // 停运车次不可点
        return
      }
      const {
        train_no,
        train_code,
        from_station_code,
        from_station_name,
        to_station_name,
        to_station_code,
        train_date, // 列车在当前站点出发的日期
        // train_start_date, // 列车从始发站发车的日期
        train_arrive_date,
        start_time,
        run_time,
        arrive_time,
        seat_info,
        min_price,
        train_type,
        start_time_timestamp,
        arrive_time_timestamp
      } = trainInfo;
      const { old_ticket_info, is_change_to_station } = this.$route.query;
      this.$router.push({
        path: "/trainDetail",
        query: {
          train_no,
          train_code,
          from_station_code,
          from_station_name,
          to_station_name,
          to_station_code,
          train_date,
          // train_start_date,
          train_arrive_date,
          start_time,
          run_time,
          arrive_time,
          seat_info,
          min_price,
          train_type,
          start_time_timestamp,
          arrive_time_timestamp,
          old_ticket_info, // 是否为改签
          is_change_to_station: is_change_to_station || false // 是否变更到站
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.cube-scroll-list-wrapper {
  div:last-of-type {
    margin-bottom: 0.83rem;
  }
}
</style>
