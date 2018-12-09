<template>
  <div>
    <div :class="`train-list-filter ${showIphoneXHack()?'page-button-iphonex':''}`">
      <div class="most-early" :class="{ 'active': activeFilter == 'mostEarly' }" @click="changeFilter('mostEarly', $event,'travelTime')">
          <i class="icon-clock icon"></i>
          <span class="filter-text" @click="showTravelTimePicker">{{travelTimeFilterText}}</span>
      </div>
      <div class="all-train-type" :class="{ 'active': activeFilter == 'allTrainType' }" @click="changeFilter('allTrainType', $event,'trainType')">
          <i class="icon-train icon"></i>
          <span class="filter-text" @click="showTrainTypePicker">{{trainTypeFilterText}}</span>
      </div>
      <div class="mix-filter" :class="{ 'active': activeFilter == 'mixFilter' }" @click="changeFilter('mixFilter', $event,'mixFilter')">
          <i class="icon-filter icon"></i>
          <span class="filter-text" @click="changeFilterPickerShow">综合筛选</span>
      </div>
      <div class="ticket-first" :class="{'active': this.filterCondition.hasTicket}" @click="changeFilter('ticketFirst', $event,'ticketFirst')">
          <i class="icon-ticket icon"></i>
          <span class="filter-text" @click="ticketFirst">有票优先</span>
      </div>
    </div>
    <FilterTrainPicker style="width:100%" @on-cancel-filter-picker = "cancel" @on-confirm-filter-picker = "confirm"></FilterTrainPicker>
    <div :class="`for-iphonex ${showIphoneXHack()?'for-iphonex-show':''}`"></div>
  </div>
</template>
<script>
import FilterTrainPicker from "@/components/FilterTrainPicker/filtertrainpicker.vue";
import { mapGetters, mapActions } from "vuex";
const PICKER_ALIGN = "left";

export default {
  components: {
    FilterTrainPicker
  },
  data() {
    return {
      activeFilter: "",
      travelTimeFilterText: "最早出发",
      travelTimeActive: 0,
      travelTypeActive: 0,
      trainTypeFilterText: "全部车型",
      travelTimePicker: null,
      trainTypePicker: null,
      timeFilterPickerData: [
        {
          content: "最早出发",
          type: 0,
          align: PICKER_ALIGN
        },
        {
          content: "最晚出发",
          type: 1,
          align: PICKER_ALIGN
        },
        {
          content: "耗时最短",
          type: 2,
          align: PICKER_ALIGN
        }
      ],
      trainTypeFilterPickerData: [
        {
          content: "全部车型",
          type: 0,
          align: PICKER_ALIGN
        },
        {
          content: "特快直达(T/Z)",
          type: 1,
          align: PICKER_ALIGN
        },
        {
          content: "高铁动车(G/D/C)",
          type: 2,
          align: PICKER_ALIGN
        },
        {
          content: "其他车型",
          type: 3,
          align: PICKER_ALIGN
        }
      ]
    };
  },
  props: {},
  computed: {
    ...mapGetters({
      showFilterPicker: "showFilterPicker",
      trainList: "trainList",
      orginTrainlist: "orginTrainlist",
      trainDate: "trainDate",
      fromStationList: "fromStationList",
      toStationList: "toStationList",
      seatType: "seatType",
      StartStation: "StartStation",
      EndStation: "EndStation",
      SeatType: "SeatType",
      filterCondition: "filterCondition",
      isAliPay: "isAliPay"
    })
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {
    fromStationList: {
      handler(oldVal, newVal) {
        !this.StartStation.length && this.setStartStation(this.fromStationList);
      }
    },
    toStationList: {
      handler(oldVal, newVal) {
        !this.EndStation.length && this.setEndStation(this.toStationList);
      }
    },
    seatType: {
      handler(oldVal, newVal) {
        !this.SeatType.length && this.setSeatType(this.seatType);
      }
    }
  },
  methods: {
    ...mapActions([
      "changeFilterPickerStatus",
      "filterByTrainDate",
      "filterBySeatType",
      "filterByCouponNum",
      "multiFilterTrainList",
      "setStartStation",
      "setEndStation",
      "setSeatType",
      "changeFilterCondition"
    ]),
    cancel() {},
    confirm(val) {
      console.log({ multiFilter: val });
      this.changeFilterCondition({ multiFilter: val });
      this.multiFilterTrainList();
    },
    changeFilterPickerShow() {
      if (this.orginTrainlist.length === 0) {
        this.$createToast({
          txt: "暂无可筛选的车次信息",
          time: 1500,
          type: "warn"
        }).show();
      } else {
        this.changeFilterPickerStatus(true);
      }
    },
    changeFilter(val, e, type) {
      this.activeFilter = val;
      e.stopPropagation();
    },
    ticketFirst() {
      this.changeFilterCondition({
        hasTicket: this.filterCondition.hasTicket ? false : true
      });
      this.multiFilterTrainList();
      this.Omega(
        "train_ticket_searlist_ticket_ck",
        "查询结果列表综合筛选选择有票优先点击"
      );
    },
    showTravelTimePicker() {
      let eventid_arr = [
        "train_ticket_searlist_early_ck",
        "train_ticket_searlist_late_ck",
        "train_ticket_searlist_time_ck"
      ];
      let eventname_arr = [
        "查询结果列表最早出发点击",
        "查询结果列表最晚出发点击",
        "查询结果列表耗时最短点击"
      ];
      this.$createActionSheet({
        data: this.timeFilterPickerData,
        active: this.travelTimeActive,
        onSelect: (item, index) => {
          this.changeFilterCondition({ trainDateType: item.type });
          this.travelTimeFilterText = item.content;
          this.travelTimeActive = index;
          this.multiFilterTrainList();
          this.Omega(eventid_arr[item.type], eventname_arr[item.type]);
        },
        onCancel: () => {}
      }).show();
    },
    showTrainTypePicker() {
      let eventid_arr = [
        "train_ticket_searlist_modle_ck",
        "train_ticket_searlist_direct_ck",
        "train_ticket_searlist_hirail_ck",
        "train_ticket_searlist_other_ck"
      ];
      let eventname_arr = [
        "查询结果列表全部车型点击",
        "查询结果列表特快直达点击",
        "查询结果列表高铁动车点击",
        "查询结果列表全其他车型点击"
      ];
      this.$createActionSheet({
        data: this.trainTypeFilterPickerData,
        active: this.travelTypeActive,
        onSelect: (item, index) => {
          this.changeFilterCondition({ trainType: item.type });
          this.trainTypeFilterText = item.content.split("(")[0];
          this.travelTypeActive = index;
          this.multiFilterTrainList();
          this.Omega(eventid_arr[item.type], eventname_arr[item.type]);
        },
        onCancel: () => {}
      }).show();
    },
    showIphoneXHack() {
      let flag = false;
      if (this.isAliPay) {
        flag = true;
      }
      return flag;
    }
  }
};
</script>
<style scoped lang="less">
@import '~assets/styles/var.less';

.icon {
  display: block;
  margin: 0 auto;
}
.icon-clock {
  background-image: url('~assets/images/clock_default@3x.png');
  background-size: 1.33rem 1.33rem;
  width: 1.33rem;
  height: 1.33rem;
}
.icon-train {
  background-image: url('~assets/images/train@3x.png');
  width: 1.13rem;
  // height: 1.29rem;
  height: 1.33rem;
  background-size: 1.33rem 1.33rem;
}
.icon-filter {
  background-image: url('~assets/images/filter@3x.png');
  background-size: 1.33rem 1.33rem;
  width: 1.33rem;
  height: 1.33rem;
}
.icon-ticket {
  background-image: url('~assets/images/filter@3x.png');
  background-size: 1.37rem 1.29rem;
  width: 1.33rem;
  // height: 1.17rem;
  height: 1.33rem;
}
.train-list-filter {
  z-index: @z-filter;
  position: fixed;
  width: 100%;
  height: 48px;
  bottom: 0;
  background-color: #fff;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.16);
  display: flex;
  & > div {
    text-align: center;
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .filter-text {
      margin-top: 2px;
      margin-top: 2.5px;
      font-size: 12px;
    }
  }
  i.icon {
    width: 16px;
    height: 16px;
    background-size: contain;
  }
  .active {
    color: #ff7e33;
    .icon-clock {
      background-image: url('~assets/images/clock_activated@3x.png');
    }
    .icon-train {
      background-image: url('~assets/images/train_activated@3x.png');
    }
    .icon-filter {
      background-image: url('~assets/images/filter_activated@3x.png');
    }
    .icon-ticket {
      background-image: url('~assets/images/ticket_activated@3x.png');
    }
  }
  .for-iphonex {
    display: none;
  }
}
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .page-button-iphonex {
    bottom: 34px !important;
  }
  .for-iphonex-show {
    display: block !important;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 35px;
    z-index: 2;
  }
}
</style>

<style>
.cube-action-sheet-space {
  display: none !important;
}
.cube-action-sheet-cancel {
  display: none !important;
}
.cube-action-sheet-item_active {
  background: url('../../assets/images/check@3x.png') no-repeat center right;
  background-position-x: 95%;
  background-size: 1.33rem 1.33rem;
}
.cube-action-sheet-item {
  font-family: 'PingFangSC-Regular';
  font-size: 15px !important;
  color: #333333;
}
</style>
