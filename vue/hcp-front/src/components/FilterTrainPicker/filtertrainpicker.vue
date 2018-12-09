<template>
<Popup :mask="true" position="bottom" :maskClosable="true" :visible="showFilterPicker" type="add-child-picker-popup" @mask-click="cancel">
     <div class="filter-train-pickers-slot">
        <div class="picker-header">
            <span class="cancel" @click="cancel">取消</span>
            <span class="title">综合筛选</span>
            <span class="confirm" @click="confirm">确认</span>
        </div>
        <div class="picker-content">
            <div class="item-container" v-show="StartStation.length">
                <span class="title">选择出发站</span>
                <div class="item-list">
                    <span :class="`item ${item.active}`" @click="selectStation(index)" v-for="(item,index) in StartStation" :key="item.code">{{item.name}}</span>
                </div>
            </div>
            <div class="item-container" v-show="EndStation.length">
                <span class="title">选择到达站</span>
                <div class="item-list">
                    <span :class="`item ${item.active}`" @click="selectStation(index,2)" v-for="(item,index) in EndStation" :key="item.code">{{item.name}}</span>
                </div>
            </div>
            <div class="item-container" v-show="SeatType.length">
                <span class="title">选择座席类型</span>
                <div class="item-list">
                    <span :class="`item ${item.active}`" @click="selectSeatType(index)" v-for="(item,index) in SeatType" :key="item.code">{{item.name}}</span>
                </div>
            </div>
        </div>
    </div>
</Popup>
</template>


<script>
import { Style, Popup } from "cube-ui";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "filtertrainpiker",
  props: {},
  components: {
    Popup
  },
  computed: {
    ...mapGetters({
      showFilterPicker: "showFilterPicker",
      StartStation: "StartStation",
      EndStation: "EndStation",
      SeatType: "SeatType",
      selectedStartStation: "selectedStartStation",
      selectedEndStation: "selectedEndStation",
      selectedSeatType: "selectedSeatType"
    })
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions([
      "changeFilterPickerStatus",
      "setStartStation",
      "setEndStation",
      "setSeatType",
      "setSelectedStartStation",
      "setSelectedEndStation",
      "setSelectedSeatType"
    ]),
    selectStation(index, type = 1) {
      let self = this;
      let tempStation =
        type === 1
          ? Object.assign([], self.StartStation)
          : Object.assign([], self.EndStation);
      let element = tempStation[index];
      element.active ? (element.active = "") : (element.active = "active");

      type == 1
        ? self.setStartStation(tempStation)
        : self.setEndStation(tempStation);

      type === 1
        ? self.setSelectedStartStation(tempStation)
        : self.setSelectedEndStation(tempStation);

      this.Omega(
        ["train_ticket_searlist_start_ck", "train_ticket_searlist_arrival_ck"][type],
        ["查询结果列表综合筛选选择出发车站点击","查询结果列表综合筛选选择到达车站点击"][type]
      );
    },
    selectSeatType(index) {
      let self = this;
      let tempSeatType = Object.assign([], self.SeatType);
      let element = tempSeatType[index];
      element.active ? (element.active = "") : (element.active = "active");
      self.setSeatType(tempSeatType);
      self.setSelectedSeatType(tempSeatType);
      this.Omega('train_ticket_searlist_seat_ck','查询结果列表综合筛选选择座席类型点击',{seat:element.name});
    },
    cancel() {
      this.changeFilterPickerStatus(false);
      // this.StartStation.map(element => delete element.active);
      // this.EndStation.map(element => delete element.active);
      // this.SeatType.map(element => delete element.active);
      // this.setSelectedStartStation([]);
      // this.setSelectedEndStation([]);
      // this.setSelectedSeatType([]);
      this.$emit("on-cancel-filter-picker");
    },
    confirm() {
      let self = this;
      self.changeFilterPickerStatus(false);
      self.$emit("on-confirm-filter-picker", {
        selectedStartStation: self.selectedStartStation,
        selectedEndStation: self.selectedEndStation,
        selectedSeatType: self.selectedSeatType
      });
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@import '~assets/styles/var.less';

.filter-train-pickers-slot {
  z-index: @z-filter-pop-content;
  max-height: 35em;
  background: #fff;
  height: 100%;
  .picker-header {
    height: 5rem;
    line-height: 5rem;
    font-size: 0;
    font-family: "PingFangSC-Regular";
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    & > span {
      display: inline-block;
      font-size: 14px;
      width: 33%;
      box-sizing: border-box;
    }
    & > span:first-child {
      text-align: left;
      padding-left: 1.5rem;
      color: #666;
    }
    & > span:last-child {
      text-align: right;
      padding-right: 1.5rem;
      color: #fc9153;
    }
    & > span:nth-child(2) {
      font-size: 17px;
      color: #333333;
    }
  }
  .picker-content {
    // height: auto;
    // padding: 1.38rem 1.33rem;
    padding-top: 1.38rem;
    padding-left: 1.33rem;
    text-align: left;
    // margin-top: 1.38rem;
    .item-container {
      margin-bottom: 1rem;
      .title {
        font-size: 12px;
        color: #999;
      }
      .item-list {
        margin-top: 10px;
        font-size: 0;
        .item {
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          width: 9.17rem;
          height: 30px;
          line-height: 29px;
          font-size: 14px;
          color: #4a4c5b;
          text-align: center;
          border: 1px solid rgba(74, 76, 91, 0.4);
          border-radius: 2px;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .active {
          color: #fc9153;
          background: rgba(252, 145, 83, 0.1);
          border: 1px solid #fc9153;
        }
      }
    }
  }
}

.custom-picker-show {
  transform: translate(100%, 100%);
  transition: transform 0.5s;
}
.custom-picker-hide {
  transform: translate(100%, 200%);
  transition: transform 0.5s;
}

@media (device-height: 568px) and (device-width: 320px) and (-webkit-min-device-pixel-ratio: 2) {
  .cube-popup-content {
    .cube-picker-content {
      .item-container {
        .item-list {
          .item {
            width: 7.55rem;
          }
        }
      }
    }
  }
}
</style>
