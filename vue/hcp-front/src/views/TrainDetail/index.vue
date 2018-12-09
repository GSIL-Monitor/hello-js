<!-- 订单详情页 -->
<template>
  <div class="train-detail">
    <DirectionCard
      :trainInfo="trainInfo"
      :omegaInfo="{omegaKey:'train_ticket_detail_through_ck',omegaName:'车次详情页经停信息'}"
    >
    </DirectionCard>
    <div class="scroll-wrapper" :style="{ 'height': swHeight + 'px' }">
      <Scroll
        :options="options"
        @pulling-down="onPullingDown"
        ref="scroll"
      >
        <HeaderCalendar
          callModule='traindetail'
          :shadow="false"
          class="date-select"
          :holiday="holiday"
          :defaultSeletedDays="trainDate"
          @on-query-train="getTrainDetailAgain"
        >
        </HeaderCalendar>
        <Seat
          :seatInfo="seatInfo"
          :isChangeTicket="isChangeTicket"
          @on-buy="isLogin"
          @on-grab="isLogin"
          @on-change="isLogin"
          :loading="seatLoading"
        >
        </Seat>
      </Scroll>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { Scroll, Loading } from "cube-ui";
import DirectionCard from "@/components/DirectionCard/index.vue";
import HeaderCalendar from "@/components/HeaderCalendar/headercalendar.vue";
import Seat from "./seat.vue";
import api from "service/api.js";
import { localDb } from "@/utils/commonlibs";
import {
  computedScrollWrapperHeight,
  pullDownRefresh
} from "utils/pullRefresh";

const CUSTOM_EVENT_NAME = "on-query-train";
const CUSTOM_OMEGA_EVENT_NAME = "omega_click";

export default {
  components: {
    Scroll,
    DirectionCard,
    HeaderCalendar,
    Seat
  },
  data() {
    return {
      trainInfo: {},
      seatInfo: [],
      trainDate: [],
      pullDownRefresh: pullDownRefresh,
      swHeight: 0,
      seatLoading: false,
      isChangeTicket: false,
      res: {}
    };
  },
  props: {},
  computed: {
    ...mapGetters({
      passengerPhone: "passengerPhone",
      holiday: "holiday"
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
    this.changeHeader();
    this.getQuery();
    this.swHeight = computedScrollWrapperHeight();
    this.Omega("train_ticket_detail_sw", "车次详情页展现");

    let self = this;
    self.eventHub.$on(CUSTOM_OMEGA_EVENT_NAME, function(attr) {
      let { type, callModule } = attr;
      if (callModule === "traindetail") {
        switch (type) {
          case "pre":
            self.Omega(
              "train_ticket_detail_before_ck",
              "车次详情页前一天点击",
              { cellphone: this.passengerPhone }
            );
            break;
          case "next":
            self.Omega("train_ticket_detail_next_ck", "车次详情页后一天点击", {
              cellphone: this.passengerPhone
            });
            break;
          case "date":
            self.Omega(
              "train_ticket_detail_date_ck",
              "车次详情页日期控件点击",
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
  watch: {},
  methods: {
    ...mapActions(["changeHeader"]),
    getQuery() {
      let { query } = this.$route;
      if (query) {
        this.getDirCardInfo(query);
        this.getPriceDetail(query);
      }
      // 判断是否为改签
      if (this.$route.query.old_ticket_info) {
        this.isChangeTicket = true;
      }
    },
    getDirCardInfo(query) {
      this.seatInfo = query.seat_info;
      this.trainDate = [query.train_date];
      this.trainInfo = {
        startStation: query.from_station_name,
        startTime: query.start_time,
        startDate: query.train_date, // train_date 是该站出发日期，train_start_date是始发站发车日期
        // startDate: query.train_start_date,
        startCode: query.from_station_code,
        runTime: query.run_time,
        trainCode: query.train_code,
        trainNo: query.train_no,
        endStation: query.to_station_name,
        endTime: query.arrive_time,
        endCode: query.to_station_code,
        endDate: query.train_arrive_date
      };
    },
    async isLogin(seat, type) {
      this.jumpto(seat, type);
    },
    jumpto(seat, type) {
      if (type == "buyTicket") {
        this.buyTicket(seat);
      } else if (type == "grabTicket") {
        this.grabTicket(seat);
      } else if (type == "changeTicket") {
        this.changeTicket(seat);
      }
    },
    buyTicket(seat) {
      let { query } = this.$route;
      let newQuery = Object.assign({}, query, { chosen_seat: seat });
      this.$router.push({ path: "/buyTicket", query: newQuery });
    },
    grabTicket(seat) {
      let { query } = this.$route;
      let newQuery = {
        train_date: query.train_date,
        from_station_code: query.from_station_code,
        from_station_name: query.from_station_name,
        to_station_code: query.to_station_code,
        to_station_name: query.to_station_name,
        train_code: query.train_code,
        train_number: query.train_no,
        train_type: query.train_type,
        chosen_seat: seat,
        seatInfo: this.seatInfo
      };
      this.$router.push({ path: "/grabTicket", query: newQuery });
    },
    changeTicket(seat) {
      let { query } = this.$route;
      let newQuery = Object.assign({}, query, { chosen_seat: seat });
      this.$router.push({ path: "/buyChangeTicket", query: newQuery });
    },
    onPullingDown() {
      // 如果有新数据
      this.getTrainDetailAgain(this.trainDate[0]);
    },
    async getTrainDetailAgain(date) {
      this.seatLoading = true;
      // console.log('loading start');
      let { query } = this.$route;
      let trainDateCache = query.train_start_date;
      const params = {
        from_station_code: query.from_station_code,
        to_station_code: query.to_station_code,
        train_date: date,
        train_code: query.train_code,
        train_no: query.train_no
      };
      const res = await api.fetchTrainList(params);
      if (res.errno == 0) {
        let { data } = res;
        let trainDetail = data[0];
        this.updateRouterQuery(trainDetail);
        this.getPriceDetail(params);
        this.getDirCardInfo(trainDetail);
        this.$refs.scroll.forceUpdate();
      } else {
        this.seatInfo = [];
        // TODO 刷新出错时, 日期是否需要回滚
        this.$refs.scroll.forceUpdate();
      }
      this.seatLoading = false;
    },
    updateRouterQuery(trainDetail) {
      let { query } = this.$route;
      // 一般来说更新出发、到达日期、座位信息即可。但可能铁路网调整时，会有其他信息也变更，所以都更新到url中
      let updatePart = {
        train_date: trainDetail.train_date,
        train_start_date: trainDetail.train_start_date,
        train_arrive_date: trainDetail.train_arrive_date,
        seat_info: trainDetail.seat_info,
        from_station_name: query.from_station_name,
        start_time: query.start_time,
        from_station_code: query.from_station_code,
        run_time: query.run_time,
        train_code: query.train_code,
        train_no: query.train_no,
        to_station_name: query.to_station_name,
        arrive_time: query.arrive_time,
        to_station_code: query.to_station_code
      };
      let newQuery = Object.assign({}, query, updatePart);
      this.$router.replace({ query: newQuery });
    },
    async getPriceDetail(query) {
      const params = {
        train_no: query.train_no,
        train_date: query.train_date,
        to_station_code: query.to_station_code,
        from_station_code: query.from_station_code,
        train_code: query.train_code
      };
      const res = await api.fetchPriceDetail(params);
      if (res.errno == 0) {
        this.mergeSeatInfo(res.data);
      } else {
      }
    },
    mergeSeatInfo(priceDetail) {
      let seatInfo = this.$route.query.seat_info;
      let priceInfo = {};
      priceDetail.forEach(item => {
        priceInfo[item.code] = item.price;
      });
      seatInfo = seatInfo.map(item => {
        if (priceInfo[item.code]) {
          let newItem = { ...item, price: priceInfo[item.code] };
          return newItem;
        }
        return item;
      });
      this.seatInfo = seatInfo;
      let newQuery = Object.assign({}, this.$route.query, {
        seat_info: seatInfo
      });
      this.$router.replace({ query: newQuery });
    }
  }
};
</script>
<style scoped lang="less">
.train-detail {
  padding-top: 0.83rem;
  .date-select {
    margin-top: 0.83rem;
  }
  .scroll-wrapper {
    height: 5rem;
  }
}
</style>
