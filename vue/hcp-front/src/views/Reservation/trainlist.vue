<template>
    <div class="train-list" v-if="trainListShow">
        <Loading v-show="loading" class="loading-fixed" v-if="!pullLoading"></Loading>
        <div class="list-wrapper scroll-wrapper" :style="{ 'height': swHeight + 'px' }">
          <!-- <Scroll
            :options="options"
            @pulling-down="onPullingDown"
            ref="scroll"
          > -->
            <TrainCard
              :trainInfo="trainInfo"
              v-for="(trainInfo,index) in reservation_trainList"
              :index="index"
              :key="trainInfo.train_no + trainInfo.train_code"
              @onClick="onTrainClick(index)">
            </TrainCard>
            <div style="height:80px;background: #f3f4f5;"></div>
            <CommonError :show="noResultShow" :tips="tips" :subTips="subTips" @on-click="search"></CommonError>
          <!-- </Scroll> -->
        </div>
        <TrainFilter @on-filter-change="onFilterChange"></TrainFilter>
        <div class="fixed-bottom-container fixed-bottom-container-shadow">
        <Button @click="confirmSelectedTrain" class="btn-confirm" :primary="true" :disabled="train_number.length===0">完成</Button>
        </div>
    </div>
</template>

<script>
import { Loading, Scroll, Button } from "cube-ui";
import { mapGetters, mapActions } from "vuex";
import qs from "qs";
import TrainCard from "./trainCard.vue";
import TrainFilter from "./filter.vue";
import api from "@/service/api.js";
import CommonError from "@/components/Common/commonError.vue";
import {
  computedScrollWrapperHeight,
  pullDownRefresh
} from "utils/pullRefresh";
// const DEFAULT_VALUE = "推荐多选";

export default {
  components: {
    Scroll,
    TrainCard,
    Loading,
    TrainFilter,
    CommonError,
    Button
  },
  props: {
    trainListShow: {
      type: Boolean,
      default: false
    }
  },
  name: "trainlist-reservation",
  data() {
    return {
      loading: false,
      noResultShow: false,
      tips: "无可用班次",
      subTips: "重新选择筛选条件试一试",
      clickCurrentIndex: 0,
      swHeight: 0,
      pullDownRefresh: pullDownRefresh,
      pullLoading: false // 是否处于下拉刷新中，为true时，全屏中心的loading不会展示，否则会有两个loading
    };
  },
  computed: {
    ...mapGetters({
      reservation_trainList: "reservation_trainList",
      reservation_orginTrainlist: "reservation_orginTrainlist",
      train_date_reservation: "train_date_reservation",
      grabCreatOrderParms: "grabCreatOrderParms",
      train_number: "train_number",
      isDatechanged: "isDatechanged"
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
  watch: {
    trainListShow(newVal) {
      if (newVal) {
        if (this.isDatechanged) {
          this.clearNumAndSeat();
          this.fetchReservationTrainlist({ trainList: [] }); // clear
          this.search();
        }
        this.$nextTick().then(() => {
          this.computedHeight();
        });
      }
    },
    reservation_trainList(newVal) {
      if (newVal.length === 0 && !this.loading) {
        this.noResultShow = true;
      } else {
        this.noResultShow = false;
      }
    }
  },
  beforeDestroy() {},
  mounted() {},
  methods: {
    ...mapActions([
      "fetchReservationTrainlist",
      "changeTrainDateReservation",
      "changeTrainListShow",
      "changeTrainConditionShow",
      "changeHeader",
      "changeRequestParms",
      "changeIsDateChanged",
      "clearNumAndSeat",
      "changeTrainNumberReservation",
      "filterSeatFromTrainList",
      "fetchFilterTrainList"
    ]),
    // 计算下拉刷新容器高度
    computedHeight() {
      let fixedFilterHeight = 48; // 底部filter高度
      this.swHeight = computedScrollWrapperHeight() - fixedFilterHeight;
    },
    onPullingDown() {
      this.search();
      this.pullLoading = true;
      this.fetchFilterTrainList();
      // TODO
      // this.multiFilterTrainList();
    },
    confirmSelectedTrain() {
      let self = this;
      self.changeTrainNumberReservation();
      self.filterSeatFromTrainList();
      if (self.reservation_orginTrainlist.length) {
        let train_no_length = self.train_number.length;
        if (train_no_length > 10) {
          self
            .$createToast({
              txt: "最多支持选择10个车次",
              type: "warn",
              time: 1200
            })
            .show();
          return;
        } else if (!self.train_number.length) {
          self
            .$createToast({
              txt: "请至少选择一个车次",
              type: "warn",
              time: 1200
            })
            .show();
          return;
        }
        self.eventHub.$emit("change-picker-status");
      }
      self.changeTrainListShow(false);
      // self.changeTrainConditionShow(true);
      self.changeHeader({ pageTitle: "抢票信息填写", headerRightText: "" });
      self.changeIsDateChanged(false);
    },
    onFilterChange() {},
    onTrainDateChange() {},
    async search() {
      this.loading = true;
      this.noResultShow = false;
      const params = {
        // train_date: this.train_date_reservation[
        //   this.train_date_reservation.length - 1
        // ],
        train_date: this.train_date_reservation.join(","),
        from_station_code: this.grabCreatOrderParms.from_station_code,
        to_station_code: this.grabCreatOrderParms.to_station_code
      };
      const res = await api.fetchTrainList(params);
      if (res.errno === 0) {
        let { data } = res;
        this.cacheParam = qs.stringify(params);
        this.cacheData = data;
        this.fetchReservationTrainlist({ trainList: data });
      } else {
        this.noResultShow = true;
        this.fetchReservationTrainlist({ trainList: [] });
        this.tips = res.errmsg || "获取信息失败";
      }
      // this.$refs.scroll.forceUpdate();
      this.pullLoading = false;
      this.loading = false;
    },
    onTrainClick(index) {
      this.clickCurrentIndex = index;
    }
  }
};
</script>

<style lang="less" scoped>
.train-list {
  width: 100%;
  height: 100%;
  top: 4rem;
  background: #f3f4f5;
  position: fixed;
  z-index: 10;
  .list-wrapper {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .fixed-bottom-container {
    z-index: 2;
    .btn-confirm {
      // position: fixed;
      // bottom: 0;
      font-size: 16px;
      width: 100%;

    }
  }
}
</style>
