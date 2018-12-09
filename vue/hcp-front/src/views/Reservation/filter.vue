<template>
<div>
  <div class="train-list-filter">
    <div class="most-early" :class="{ 'active': activeFilter == 'mostEarly' }">
        <i class="icon-clock icon"></i>
        <span class="filter-text" @click="showTravelTimePicker">{{travelTimeFilterText}}</span>
    </div>
    <div class="all-train-type" :class="{ 'active': activeFilter == 'allTrainType' }">
        <i class="icon-train icon"></i>
        <span class="filter-text" @click="showTrainTypePicker">{{filterConditionReservation.trainType.length===3?trainTypeFilterText:selectOtherTrainTypeText}}</span>
    </div>
  </div>
  <TimeRange></TimeRange>
  <TrainType></TrainType>
  </div>
</template>

<script>
import TimeRange from "./timerange.vue";
import TrainType from "./traintype.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "filter-reservation",
  components: {
    TimeRange,
    TrainType
  },
  data() {
    return {
      activeFilter: "",
      travelTimeFilterText: "发车时段",
      trainTypeFilterText: "全部车型",
      selectOtherTrainTypeText: "车型选择"
    };
  },
  computed: {
    ...mapGetters({
      filterConditionReservation: "filterConditionReservation"
    })
  },
  methods: {
    showTravelTimePicker() {
      this.activeFilter = 'mostEarly';
      this.eventHub.$emit("change-timepicker-status",true);
      this.eventHub.$emit("change-traintypepicker-status",false);
    },
    showTrainTypePicker() {
      this.activeFilter = 'allTrainType';
      this.eventHub.$emit("change-traintypepicker-status",true);
      this.eventHub.$emit("change-timepicker-status",false);
    }
  }
};
</script>

<style lang="less" scoped>
.icon {
  display: block;
  margin: 0 auto;
}
.icon-clock {
  background-image: url("~assets/images/clock_default@3x.png");
  background-size: 1.33rem 1.33rem;
  width: 1.33rem;
  height: 1.33rem;
}
.icon-train {
  background-image: url("~assets/images/train@3x.png");
  width: 1.13rem;
  // height: 1.29rem;
  height: 1.33rem;
  background-size: 1.33rem 1.33rem;
}
.icon-filter {
  background-image: url("~assets/images/filter@3x.png");
  background-size: 1.33rem 1.33rem;
  width: 1.33rem;
  height: 1.33rem;
}
.icon-ticket {
  background-image: url("~assets/images/ticket@3x.png");
  background-size: 1.37rem 1.29rem;
  width: 1.33rem;
  // height: 1.17rem;
  height: 1.33rem;
}
.train-list-filter {
  position: fixed;
  width: 100%;
  height: 50px;
  top: 0;
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.08);
  display: flex;
  z-index: 1000;
  .most-early{
    &>i{
      display: inline-block;
    }
    &>span{
      display: inline-block;
    }
  }
  & > div {
    text-align: center;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .filter-text {
      margin-top: 0.17rem;
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
      background-image: url("~assets/images/clock_activated@3x.png");
    }
    .icon-train {
      background-image: url("~assets/images/train_activated@3x.png");
    }
    .icon-filter {
      background-image: url("~assets/images/filter_activated@3x.png");
    }
    .icon-ticket {
      background-image: url("~assets/images/ticket_activated@3x.png");
    }
  }
}
</style>
