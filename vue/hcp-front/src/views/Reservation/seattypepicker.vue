<template>
    <div class="seattypepicker">
        <Popup class="cube-popup-content-over" :mask="true" position="bottom" :maskClosable="true" :visible="show" type="add-child-picker-popup" @mask-click="onCancel">
            <div class="seattypeslot">
                <div class="picker-header">
                    <span class="cancel" @click="cancel">取消</span>
                    <span class="title">选择座席</span>
                    <span class="confirm" @click="confirm">确定</span>
                </div>
                <div class="picker-content">
                  <div class="tips">
                    <ul>
                      <li>建议多选几个座席，成功率更高哦!</li>
                      <li>建议多个座席暂收最高票价，出票后退还差额</li>
                    </ul>
                  </div>
                  <div :class="`picker-content-item hsr-train ${isAliPay?'picker-content-item-iphonex':''}`" v-if="alternative_seat[0].length>0">
                    <div class="title">高铁 / 动车</div>
                    <div class="seattype-item" v-for="(item,index) in alternative_seat[0]" :key="item.name">
                      <span @click="changeSeatSelectedStatus([0,index])" :class="`seat-type-name ${item.active}`">{{`${item.name} ￥${item.price/100}`}}</span>
                    </div>
                  </div>
                  <div :class="`picker-content-item common-train ${isAliPay?'picker-content-item-iphonex':''}`" v-if="alternative_seat[1].length>0">
                    <div class="title">普通列车</div>
                   <div class="seattype-item" v-for="(item,index) in alternative_seat[1]" :key="item.name">
                      <span  @click="changeSeatSelectedStatus([1,index])" :class="`seat-type-name ${item.active}`">{{`${item.name} ￥${item.price/100}`}}</span>
                    </div>
                  </div>
                </div>
            </div>
        </Popup>
    </div>
</template>

<script>
import { Popup, Checkbox } from "cube-ui";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "seattypepicker",
  props: {},
  data() {
    return {
      show: false
    };
  },
  components: {
    Popup,
    Checkbox
  },
  computed: {
    ...mapGetters({
      alternative_seat: "alternative_seat",
      grabCreatOrderParms: "grabCreatOrderParms",
      isAliPay: "isAliPay"
    })
  },
  mounted() {
    let self = this;
    self.eventHub.$on("change-picker-status", function() {
      self.show = true;
    });
  },
  methods: {
    ...mapActions(["changeSeatSelectedStatus", "changeRequestParms"]),
    updatetraintype() {},
    confirm() {
      // do something
      let seat_type_names = [];
      let { alternative_seat } = this;
      let seat_arr = [[], []];
      this.alternative_seat.forEach((element, index) => {
        element.forEach(item => {
          if (item.active == "active") {
            seat_type_names.push(item.name);
            seat_arr[index].push(item.name);
          }
        });
      });
      if (seat_type_names.length === 0) {
        this.$createToast({
          txt: "请至少选择一种座席 ",
          time: 1500,
          type: "warn"
        }).show();
        return false;
      }

      if (alternative_seat[0].length > 0 && alternative_seat[1].length > 0) {
        if (seat_arr[0].length === 0) {
          this.$createToast({
            txt: "请至少选择一种高铁/动车座席 ",
            time: 1500,
            type: "warn"
          }).show();
          return false;
        }
        if (seat_arr[1].length === 0) {
          this.$createToast({
            txt: "请至少选择一种普通列车座席 ",
            time: 1500,
            type: "warn"
          }).show();
          return false;
        }
      }

      let prices = [];
      alternative_seat.forEach(element => {
        element &&
          element.forEach(item => {
            console.log(item);
            if (item.active === "active") {
              prices.push(item.price);
            }
          });
      });
      const max_price = Math.max.apply(null, prices);
      this.changeRequestParms({
        seat_type_names: seat_type_names,
        max_price: max_price,
        is_accept_standing: seat_type_names.includes("无座")
      });
      this.show = false;
    },
    cancel() {
      this.show = false;
    },
    onCancel() {
      this.show = false;
    }
  }
};
</script>

<style lang="less" scoped>
.seattypepicker {
  .seattypeslot {
    max-height: 35em;
    background: #fff;
    // height: 100%;
    .picker-header {
      height: 60px;
      line-height: 60px;
      font-size: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      & > span {
        display: inline-block;
        font-size: 1.1rem;
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
        font-size: 1.3rem;
        color: #333;
      }
      .cancel, .confirm {
        &:active {
          opacity: 0.6;
        }
      }
    }
    .picker-content {
      .tips {
        background: #fafafa;
        color: #999;
        font-size: 12px;
        padding-left: 1.5rem;
        padding-right: 1rem;
        margin-bottom: 1.5rem;
        box-sizing: border-box;
        padding-top: 6px;
        line-height: 18px;
        & > ul {
          padding-bottom: 6px;
          box-sizing: border-box;
          li {
            list-style: none;
            text-align: left;
            line-height: 1.5rem;
          }
        }
      }
      .picker-content-item {
        font-size: 0;
        width: 90%;
        margin: 0 auto;
        // margin-bottom: 2rem;
        margin-bottom: 1.33rem;
        text-align: left;
        // margin-bottom: 2rem;
        // &:last-child {
        //   margin-bottom: 4.5rem;
        // }
        .title {
          font-size: 1.2rem;
          color: #999;
          text-align: left;
          line-height: 2rem;
          margin-bottom: 1rem;
        }
        .seattype-item {
          display: inline-block;
          font-size: 1.1rem;
          text-align: left;
          & > span {
            display: inline-block;
            vertical-align: middle;
          }
          .seat-type-name {
            box-sizing: border-box;
            padding-left: 1rem;
            padding-right: 1rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            width: 13.5rem;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #4a4c5b;
            text-align: center;
            border: 1px solid rgba(74, 76, 91, 0.2);
            border-radius: 2px;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
            &:nth-child(even) {
              margin-left: 0.5rem;
            }
            &:active {
              background-color: rgba(0, 0, 0, 0.04);
            }
          }
          .active {
            background: rgba(252, 145, 83, 0.1);
            border: 1px solid #fc9153;
            color: #fc9153;
          }
        }
      }
    }
  }
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    .picker-content-item-iphonex:last-child {
      margin-bottom: 50px !important;
    }
  }
}
</style>
<style lang="less">
.seattypepicker {
  .cube-popup-content {
    background: #fff !important;
    // padding-bottom: 20px;
  }
}
</style>
