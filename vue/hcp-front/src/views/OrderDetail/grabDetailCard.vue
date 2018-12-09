<template>
    <div>
        <!-- <Loading v-show="loading" class="loading-fixed"></Loading> -->
        <div class="order-info" v-if="isGrabRuntime">
          <span>{{`订单号:${orderId}`}}</span>
          <span class="price" v-show="moneyShowType(subType, orderCode)">
            {{`${moneyShowType(subType, orderCode)}:￥${payFee / 100}`}}
          </span>
        </div>
        <div class="grap-detail-card">
            <div class="list-item">
                <span class="item-label">行程</span>
                <span class="item-detail">{{`${grapOrderInfo.from_station_name} -  ${grapOrderInfo.to_station_name}`}}</span>
            </div>
            <div class="list-item">
                <span class="item-label">出发日期</span>
                <span class="item-detail">{{`${grapOrderInfo.start_date.map(item=>format(item,'MM月DD日')).join(' | ')}`}}</span>
            </div>
            <div class="list-item">
                <span class="item-label">指定车次</span>
                <span class="item-detail">{{train_infos.join(' | ')}}</span>
            </div>
            <div class="list-item" v-if="subType === 2">
                <span class="item-label">指定座席</span>
                <span class="item-detail">{{grapOrderInfo.seat_type_names.split(',').join(' | ')}}</span>
            </div>
            <div class="list-item" v-if="subType === 2">
                <span class="item-label">抢票截止</span>
                <span class="item-detail">{{grapEndTime}}</span>
            </div>
            <div class="list-item">
                <span class="item-label">乘车人</span>
                <span class="item-detail">{{passengers_infos.join(' | ')}}</span>
            </div>
        </div>
        <!-- v-if="buttonShow(orderCode)" -->
        <!-- <div v-if="buttonShow(orderCode)" class="grap-tips">我们将全力为您购票，如购票失败将短信通知，全部票款将于1-7个工作日内退回原支付账户</div> -->
        <!-- <div class="fixed-bottom-container fixed-bottom-container-white" v-if="buttonShow(orderCode)">
          <Button :active="true" @click="cancelGrabOrder" class="btn-cancel-grap">取消抢票</Button>
        </div> -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import format from "date-fns/format";
import { Button, Loading } from "cube-ui";
import api from "@/service/api.js";
import {
  Adult_Ticket_Code,
  Child_Ticket_Code
} from "@/components/Passenger/passengerMap";
import { moneyShowType } from "utils/orderClassStyle.js"
import { formatTimeStr } from 'utils/commonlibs.js'

export default {
  name: "grabdetailCard",
  components: {
    Button,
    Loading
  },
  props: {
    orderCode: {
      type: Number,
      default: 0
    },
    orderId: {
      type: Number,
      default: 0
    },
    payFee: {
      type: Number,
      default: 0
    },
    isGrabRuntime: {
      type: Boolean,
      default: false
    },
    subType: {
      type: Number,
      default: 0
    },
    grapOrderInfo: {
      type: Object,
      default: function() {
        return {
          // pay_mode: 1, // 支付方式 1:预支付；2：免密支付
          // grab_order_start_time: "2017-08-09 14:00:00", //抢票任务开始时间   yyyyMMddHHmmss
          // grab_order_end_time: "2017-08-09 14:00:00", //抢票任务结束时间   yyyyMMddHHmmss
          // hthy_grab_order_end_time: "2017-08-09 14:00:00",
          // passenger_phone: "15012341234", //联系人电话
          // from_station_code: "BJP",
          // from_station_name: "北京",
          // to_station_code: "SHH",
          // to_station_name: "上海",
          // start_date: ["2018-08-01", "2018-08-02"], //出发日期   格式：”yyyyMMdd”
          // train_infos: [
          //   {
          //     train_no: "58000D323405",
          //     train_code: "K110",
          //     train_type: "K"
          //   }
          // ],
          // seat_type_names: ["二等座", "一等座", "硬座"],
          // is_accept_standing: false, //是否接受无座
          // passengers: [
          //   {
          //     passenger: "431121199005028734", //乘客身份证
          //     ticket_type: 1, //票类型
          //     ticket_type_name: "成人票",
          //     passenger_name: "张三"
          //   }
          // ]
        };
      }
    }
  },
  data() {
    return {
      train_infos: [],
      passengers_infos: [],
      loading: false,
      format: format,
      btnClickStatus: true,
      moneyShowType
    };
  },
  computed: {
    ...mapGetters({}),
    grapEndTime() {
      let str = formatTimeStr(this.grapOrderInfo.grab_order_end_time)
      // eg: hthy_grab_order_end_time: "2018-12-09 23:00"，这种格式无需再对北京时间进行处理
      return format(str, "MM月DD日 HH:mm");
    }
  },
  mounted() {
    this.genTrainInfos();
    this.genPassengers();
  },
  methods: {
    ...mapActions({}),
    formatDate(item) {
      let a = item.split("");
      a.splice(4, 0, "-");
      a.splice(7, 0, "-");
      return a.join("");
    },
    buttonShow(orderCode) {
      return [5026, 5019].includes(orderCode);
    },
    genTrainInfos() {
      this.train_infos = [];
      this.grapOrderInfo.train_infos.forEach(element => {
        this.train_infos.push(element.train_code);
      });
    },
    genPassengers() {
      this.passengers_infos = [];
      this.grapOrderInfo.passengers.forEach(element => {
        // 增加儿童票标识
        this.passengers_infos.push(
          `${element.passenger_name}${
            element.ticket_type === Child_Ticket_Code ? "·儿童票" : ""
          }`
        );
      });
    },
  }
};
</script>

<style lang="less" scpoed>
.order-info {
  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  color: #999999;
  background: #fff;
  padding: 0 1.33rem;
  .price {
    margin-left: auto;
  }
}
.grap-detail-card {
  box-sizing: border-box;
  background: #fff;
  padding: 0 1.33rem 12px 1.33rem;
  box-sizing: border-box;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  .list-item {
    display: flex;
    min-height: 40px;
    line-height: 1.5;
    padding-top: 12px;
    box-sizing: border-box;
    // margin: 0 0.83rem;
    text-align: left;
    font-size: 0;
    & > span {
      display: inline-block;
      font-size: 14px;
    }
    .item-label {
      width: 22%;
      color: #999;
      overflow: hidden;
    }
    .item-detail {
      width: 78%;
      color: #333;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
    }
  }
}
.grap-tips {
  padding: 1rem;
  text-align: left;
  line-height: 1.8rem;
  font-size: 12px;
  color: #999;
}
// .btn-cancel-grap {
//   height: 50px;
//   line-height: 0;
// }
</style>
