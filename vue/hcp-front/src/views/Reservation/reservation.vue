<template>
    <div class="reservation-card">
      <div class="top-tips-message" v-if="notServiceTime">
        {{searchServiceText}}
      </div>
      <Loading v-show="loading" class="loading-fixed"></Loading>
      <div class="conditionCard train-info" v-show="conditionShow">
        <div class="card-title">
            <transition
              @leave="leave"
              @before-enter="beforeEnter"
              @enter="enter">
              <span class="destination" id="start" v-show="showOD" @click="showCityList(0)">{{grabCreatOrderParms.from_station_name}}</span>
            </transition>
            <div><img :class="{'exchange-icon': true, 'rotate-class': iconRotate}" @click="exchangeDestinationHook" :src="exchangeIcon" /></div>
            <transition
              @leave="leave"
              @before-enter="beforeEnter"
              @enter="enter">
              <span class="destination" id="end" v-show="showOD" @click="showCityList(1)">{{grabCreatOrderParms.to_station_name}}</span>
            </transition>
        </div>
        <div class="cut-off-line">
            <span class="border-bottom-1px"></span>
            <span class="border-bottom-1px"></span>
        </div>
        <div class="info-item train-date border-bottom-1px" @click="showCalendar(true)">
            <div class="label">出发日期</div>
            <div :class="`selected ${!train_date_reservation.length?'default':'active'}`">
                <span class="place-holder" v-if="!train_date_reservation.length">推荐多选</span>
                <span class="selected-span" v-for="(item,index) in train_date_reservation" :key="`${item}${index}`">
                  {{returnDate(item)}}
                </span>
                <!-- <span class="selected-span">{{train_date_reservation.map(item => returnDate(item)).join(' | ')}}</span> -->
            </div>
            <div class="arrow">
                <span class="txtbutton">推荐多选</span>
                <span class="txtarrow"><i class="cubeic-arrow"></i></span>
            </div>
        </div>
         <div class="info-item train-date border-bottom-1px" @click="selectetrainList">
            <div class="label">指定车次</div>
            <div :class="`selected ${!train_code.length?'default':'active'}`">
                <span class="place-holder" v-if="!train_code.length">推荐多选</span>
                <span class="selected-span" v-for="(item,index) in train_code" :key="`${item}${index}`">{{item}}</span>
            </div>
            <div class="arrow">
                <span class="txtbutton">推荐多选</span>
                <span class="txtarrow"><i class="cubeic-arrow"></i></span>
            </div>
        </div>
         <div class="info-item train-date border-bottom-1px" @click="changeSeatTypePickerStatus">
            <div class="label">指定座席</div>
            <div :class="`selected ${!grabCreatOrderParms.seat_type_names.length?'default':'active'}`">
                <span class="place-holder" v-if="!grabCreatOrderParms.seat_type_names.length">推荐多选</span>
                <span class="selected-span" v-for="(item,index) in grabCreatOrderParms.seat_type_names" :key="`${item}${index}`">{{item}}</span>
            </div>
            <div class="arrow">
                <span class="txtbutton">推荐多选</span>
                <span class="txtarrow"><i class="cubeic-arrow"></i></span>
            </div>
        </div>
        <div class="info-item deadline border-bottom-1px" @click="showDatePicker">
            <div class="label">抢票截止时间</div>
            <div :class="`grab-end-date selected ${deadline_date=='推荐选择出发前一天'?'default':'active'}`">
                {{returnDate(deadline_date)}} {{deadline_date=='推荐选择出发前一天'? '' : grap_end_time}}
            </div>
            <div class="arrow">
                <span class="txtarrow"><i class="cubeic-arrow"></i></span>
            </div>
        </div>
      </div>
        <TrainList :trainListShow="trainListShow"></TrainList>
        <SeatTypePicker></SeatTypePicker>
        <div v-show="conditionShow" class="person-info">
          <!-- <div class="account">
            <Account></Account>
          </div> -->
          <div class="addpassenger">
            <Passenagers :omegaInfo="omegaInfo"></Passenagers>
          </div>
          <div class="addcontact">
            <Contact :omegaInfo="{omegaKey:'train_ticket_addgrab_contact_ck',omegaName:'添加抢票页面联系方式点击'}"></Contact>
          </div>
          <div class="coupon-wrapper" v-if="coupon">
            <Coupon :coupon="coupon"></Coupon>
          </div>
          <div class="payfirst" v-if="!isAliPay">
            <NoPass></NoPass>
            <p class="tips-msg">取消抢票或抢票失败将不会产生任何费用，抢票成功后将自动扣款</p>
          </div>
        </div>
        <Pay class="price-info"
          v-if="!trainListShow"
        >
        </Pay>
    </div>
</template>

<script>
import format from "date-fns/format";
// import addDays from "date-fns/add_days";
import subDays from "date-fns/sub_days";
import isBefore from "date-fns/is_before";
import eachDay from "date-fns/each_day";
import { Loading, Button, Checkbox, createAPI } from "cube-ui";
import { mapGetters, mapActions } from "vuex";
import exchangeIcon from "assets/images/od.png";
import * as commonlibs from "../../utils/commonlibs";
import TrainList from "./trainList.vue";
import SeatTypePicker from "./seatTypePicker.vue";
import Passenagers from "@/components/Passenger/passenger.vue";
// import Account from "@/components/Account/account.vue";
import Contact from "@/components/Contact/contact.vue";
import Coupon from "@/components/Coupon/coupon.vue";
import NoPass from "./noPassword.vue";
import Pay from "./pay.vue";

import {
  Child_Ticket_Text,
  formatTicketType,
  Child_Ticket_Code
} from "@/components/Passenger/passengerMap.js";
import { checkOpenId } from "utils/getOpenID";

const DEFAULT_VALUE = "推荐多选";
const DEADLINE_DEFAULT_VALUE = "推荐选择出发前一天";
import qs from "qs";
// 城市插件
import CityList from "@/components/CityList/index.vue";
import Calendar from "@/components/Calendar/index.vue";
import Vue from "vue";
import Velocity from 'velocity-animate'

createAPI(Vue, Calendar, ["on-select", "on-cancel"], true);
createAPI(Vue, CityList, ["on-select", "on-cancel"], true);

export default {
  name: "reservation",
  components: {
    Loading,
    TrainList,
    SeatTypePicker,
    Passenagers,
    // Account,
    Contact,
    NoPass,
    Button,
    Checkbox,
    Pay,
    Coupon
  },
  data() {
    return {
      exchangeIcon: exchangeIcon,
      calendarmultiple: true,
      calendarTitle: "出发日期",
      defaultSeletedDays: [format(new Date().BJDate(), "YYYY-MM-DD")],
      cityListShow: false,
      cityListType: 0, // 0：设置出发站 1:设置到达站
      dateCol: [],
      timeCol: [],
      selectedIndex: [0, 23],
      payfirst: false,
      acceptProtocol: true,
      loading: false,
      checkOpenId: checkOpenId,
      isExchanging: false,
      init: true,
      iconRotate: false,
      omegaInfo: {
        omegaKey: "train_ticket_addgrab_adult_ck",
        omegaName: "添加抢票页面添加乘客点击",
        omegaChildKey: "train_ticket_addgrab_child_ck",
        omegaChildName: "添加抢票页面添加儿童点击",
        omegaDeleteKey: "train_ticket_addgrab_delete_ck",
        omegaDleteName: "添加抢票页面删除乘客点击"
      },
      iconRotate: false,
      showOD: true
    };
  },
  watch: {},
  created() {
    // this.initReservation();
  },
  mounted() {
    console.log("location.hash", location.hash);
    let { isWeChat, isAliPay } = this;
    if (!this.checkOpenId(isWeChat, isAliPay)) {
      return;
    }
    this.changeHeader();
    this.changeTrainListShow(false); // 确保车次列表页不会展示
    this.Omega("train_ticket_addgrab_sw", "添加抢票页面展现");
    this.changeIsDateChanged(true);
    // 仅当上一页不是协议页时，才执行清空操作
    let { query } = this.$route;
    let previous_proto = sessionStorage.getItem("previous_proto");
    let previous_contact = sessionStorage.getItem("previous_contact");
    if (previous_proto !== "1" && previous_contact !== "1") {
      this.clearNumAndSeat();
    }
    this.initReservation();
  },
  beforeDestroy() {},
  computed: {
    ...mapGetters({
      isWeChat: "isWeChat",
      isAliPay: "isAliPay",
      train_date_reservation: "train_date_reservation",
      train_number: "train_number",
      train_code: "train_code",
      train_seat_type: "train_seat_type",
      deadline_date: "deadline_date",
      trainListShow: "trainListShow",
      conditionShow: "conditionShow",
      grap_end_time: "grap_end_time",
      grabCreatOrderParms: "grabCreatOrderParms",
      passengers: "passengers",
      passengerPhone: "passengerPhone",
      isDatechanged: "isDatechanged",
      alternative_seat: "alternative_seat",
      notServiceTime: "notServiceTime",
      searchServiceText: "searchServiceText",
      coupon: "coupon",
      holiday: "holiday"
    })
  },
  methods: {
    ...mapActions([
      "changeHeader",
      "exchangeGrabDestination",
      "changeStartStation",
      "changeEndStation",
      "changeTrainDateReservation",
      "changeDeadlineReservation",
      "changeTrainListShow",
      "changeTrainConditionShow",
      "changeRequestParms",
      "clearNumAndSeat",
      "changeGrabTrainInfo",
      "changeIsDateChanged",
      "updatePassengers",
      "updateSelectedTrainList",
      "updateReservationTrainList",
      "updateReservationOrginTrainlist",
      "filterSeatFromTrainList",
      "changeReservationSeat",
      "restoreSeatStatus",
      "updateReservationSeat"
    ]),
    exchangeDestinationHook() {
      this.showOD = false
      this.iconRotate = true
      // this.exchangeGrabDestination();
      this.Omega(
        "train_ticket_addgrab_exchange_ck",
        "添加抢票页面出发和到达站互换按钮点击"
      )

      this.$nextTick(() => {
        this.isExchanging = !this.isExchanging
      })

    },
    leave(el, done) {
      Velocity(el, {
        opacity: 0,
        translateX: el.id === 'start' ? '70%' : '-70%'
      }, {
        duration: 180,
        complete: async() => {
          // 消失动画结束后交换车站，showOD设置为true触发进入动画
          // eslint-disable-next-line
          el.id === 'start' && await this.exchangeGrabDestination()
          this.showOD = true
          done()
        }
      })
    },
    beforeEnter(el) {
      el.style.opacity = 0
    },
    enter(el, done) {
      Velocity(el, {
        opacity: 1,
        translateX: '0%'
      }, {
        duration: 180,
        complete: () => {
          this.iconRotate = false
          done()
        }
      })
    },
    initReservation() {
      let { query } = this.$route;
      let previous_proto = sessionStorage.getItem("previous_proto");
      let previous_contact = sessionStorage.getItem("previous_contact");
      if (previous_proto == "1" || previous_contact == "1") {
        this.initFromVuex();
        // 如果上次打开页面是协议页，则本次挂载时，不从url中取参进行重新初始化（直接从vuex中渲染）
        return;
      }
      // 若从免密签约页回来，则从localStorage里取值，将其同步到vuex，并将localStorage清除
      let has_jump_sign = localStorage.getItem("has_jump_sign");
      if (has_jump_sign == "1") {
        this.initFromStorage(query);
      } else {
        // 正常加载，从url里取值
        this.initFromUrl(query);
      }
    },
    initFromVuex() {
      this.initTimePicker();
      let { query } = this.$route;
      // delete query.passengerPickerShow;
      // let newQuery = Object.assign({}, query, { passengerPickerShow: -1 });
      // this.$router.replace({ query: query });
      sessionStorage.removeItem("previous_proto");
      sessionStorage.removeItem("previous_contact");
    },
    initFromStorage(query) {
      // 从localStorage里取值，将其同步到vuex，
      try {
        let grabCreatOrderParms = JSON.parse(
          localStorage.getItem("grabCreatOrderParms")
        );
        let train_date_reservation = JSON.parse(
          localStorage.getItem("train_date_reservation")
        );
        let train_code = JSON.parse(localStorage.getItem("train_code"));
        let train_number = JSON.parse(localStorage.getItem("train_number"));
        let passengers = JSON.parse(localStorage.getItem("passengers"));
        let deadline_date = JSON.parse(localStorage.getItem("deadline_date"));
        let grap_end_time = JSON.parse(localStorage.getItem("grap_end_time"));

        let alternative_seat = JSON.parse(
          localStorage.getItem("alternative_seat")
        );
        let selectedTrainList = JSON.parse(
          localStorage.getItem("selectedTrainList")
        );
        let reservation_orginTrainlist = JSON.parse(
          localStorage.getItem("reservation_orginTrainlist")
        );

        this.changeRequestParms(grabCreatOrderParms);
        this.updatePassengers({ passengers }); // 乘客信息
        this.changeGrabTrainInfo({ train_number, train_code }); // 车次信息
        this.changeTrainDateReservation(train_date_reservation); // 出发日期信息
        this.defaultSeletedDays = train_date_reservation; // 出发日期信息-日历
        this.changeDeadlineReservation([deadline_date, grap_end_time]); // 抢票截止时间
        // 初始化截止时间picker
        this.initTimePicker();
        // 初始化座席选择picker
        this.updateReservationOrginTrainlist(reservation_orginTrainlist);
        this.updateSelectedTrainList(selectedTrainList);
        // this.filterSeatFromTrainList();
        this.updateReservationSeat(alternative_seat);
        this.restoreSeatStatus();
        // 并将localStorage清除
        this.removeStorage();
      } catch (e) {
        console.log(e);
      }
    },
    initFromUrl(query) {
      // 初始化请求参数
      // 城市也需要从url中取，否则刷新就变成默认值北京-上海
      this.changeRequestParms({
        from_station_code: query.from_station_code,
        from_station_name: query.from_station_name,
        to_station_code: query.to_station_code,
        to_station_name: query.to_station_name,
        train_infos: [
          {
            train_no: query.train_number,
            train_code: query.train_code,
            train_type: query.train_type
          }
        ]
      });
      if (query.train_number && query.train_code) {
        this.changeGrabTrainInfo({
          train_number: [query.train_number],
          train_code: [query.train_code]
        });
        this.changeRequestParms({
          seat_type_names: [query.chosen_seat.name],
          max_price: query.chosen_seat.price,
          grab_order_end_time: format(`${query.train_date} ${this.grap_end_time}`, 'YYYYMMDDHHmmss')
        });
      }
      query.seatInfo &&
        this.changeReservationSeat({
          train_type: query.train_type,
          seatInfo: query.seatInfo,
          selected_seat: [query.chosen_seat.name]
        });
      if (query.train_date) {
        this.changeTrainDateReservation([query.train_date]);
        this.defaultSeletedDays = [query.train_date];
        // this.onDateChange([query.train_date]);
        this.changeTrainDateReservation([query.train_date]);
        let today = format(new Date().BJDate(), "YYYY-MM-DD");
        this.changeDeadlineReservation([
          this.dayBefore(today, query.train_date),
          this.grap_end_time
        ]);
      }
      this.initTimePicker();
    },
    initTimePicker() {
      this.initDateCol();
      this.initTimeCol();
    },
    initDateCol(dates = this.train_date_reservation) {
      let tempDate = dates[dates.length - 1];
      let today = format(new Date().BJDate(), "YYYY-MM-DD");
      let oneDayBeforeDeadLine = this.dayBefore(today, tempDate);
      this.genDataCol(today, oneDayBeforeDeadLine); // picker的可选日期为：当天 => 最晚出发日期的前一天
    },
    initTimeCol() {
      for (let i = 0; i < 24; i++) {
        let value = `${i.length == 1 ? "0" : ""}${i}:00`;
        this.timeCol.push({ text: value, value: value });
      }
    },
    removeStorage() {
      localStorage.removeItem("grabCreatOrderParms");
      localStorage.removeItem("train_date_reservation");
      localStorage.removeItem("train_code");
      localStorage.removeItem("train_number");
      localStorage.removeItem("passengers");
      localStorage.removeItem("deadline_date");
      localStorage.removeItem("grap_end_time");
      localStorage.removeItem("alternative_seat");
      localStorage.removeItem("selectedTrainList");
      localStorage.removeItem("reservation_orginTrainlist");
      localStorage.removeItem("has_jump_sign");
    },
    dayBefore(today, tempDate) {
      let oneDayBeforeDeadLine = format(subDays(tempDate, 1), "YYYY-MM-DD"); // 最晚出发日期的前一天
      if (isBefore(oneDayBeforeDeadLine, today)) {
        oneDayBeforeDeadLine = today;
      }
      return oneDayBeforeDeadLine;
    },
    changeSeatTypePickerStatus() {
      if (!this.train_code.length) {
        this.$createToast({
          txt: "请先选择车次",
          time: 1500,
          type: "warn"
        }).show();
        setTimeout(this.selectetrainList, 1500);
        return;
      }
      this.eventHub.$emit("change-picker-status");
      this.Omega("train_ticket_addgrab_seat_ck", "添加抢票页面座席选择点击");
    },
    genDataCol(startDate, endDate) {
      this.dateCol = [];
      let diff = eachDay(new Date(startDate), new Date(endDate));
      diff.forEach(element => {
        let text = format(element, "YYYY年MM月DD日");
        let value = format(element, "YYYY-MM-DD");
        this.dateCol.push({ text: text, value: value });
      });
      this.selectedIndex[0] = diff.length - 1;
    },
    selectetrainList() {
      if (!this.train_date_reservation.length) {
        this.$createToast({
          txt: "请先选择出发日期",
          time: 3000,
          type: "warn"
        }).show();
      } else {
        this.changeTrainListShow(true);
      }
      this.Omega(
        "train_ticket_addgrab_traintime_ck",
        "添加抢票页面车次推荐多选点击"
      );
    },
    returnDate(item) {
      return item == DEFAULT_VALUE || item == DEADLINE_DEFAULT_VALUE
        ? item
        : commonlibs.returnDate(item);
    },
    showCityList(type) {
      // 除了在调用 createAPI 的时候传入了 events，这里对应的就是
      // on{event name} 会被当做事件回调处理
      const instance = this.$createCityList({
        cityListShow: true
      });
      instance.$on("on-select", val => {
        // eslint-disable-next-line
        // type 0 起始点 1 目的地
        this.changeIsDateChanged(true); // 城市切换等同于时间变了，需要重新发请求
        type == 0
          ? this.changeRequestParms({
              from_station_name: val.name,
              from_station_code: val.code
            })
          : this.changeRequestParms({
              to_station_name: val.name,
              to_station_code: val.code
            });
        this.clearNumAndSeat(); // 清除车次与座席
        this.Omega(
          ["train_ticket_addgrab_start_ck", "train_ticket_addgrab_arrival_ck"][
            type
          ],
          ["添加抢票页面出发站点击", "添加抢票页面到达站点击"][type]
        );
        instance.remove(); // 这种调用方式, 由于使用了remove移除了实例，所以无需再将calendarShow设为false
      });
      instance.$on("on-cancel", e => {
        instance.remove();
      });
    },
    showCalendar() {
      let { defaultSeletedDays } = this;
      const instance = this.$createCalendar({
        multiple: true,
        title: this.calendarTitle,
        confirmText: "确定",
        defaultSeletedDays,
        holiday: this.holiday,
        formatRule: { type: "Array", rule: "YYYY-MM-DD" },
        calendarShow: true
      });
      instance.$on("on-select", e => {
        this.onDateChange(e);
        instance.remove(); // 这种调用方式, 由于使用了remove移除了实例，所以无需再将calendarShow设为false
      });
      instance.$on("on-cancel", e => {
        instance.remove();
      });
      this.Omega(
        "train_ticket_addgrab_date_ck",
        "添加抢票页面日期推荐多选点击"
      );
    },
    onDateChange(val) {
      let itemLen = val.length;
      this.changeTrainDateReservation(val);
      let today = format(new Date().BJDate(), "YYYY-MM-DD");
      this.changeDeadlineReservation([
        this.dayBefore(today, val[itemLen - 1]),
        this.grap_end_time
      ]);
      this.initDateCol();
      this.clearNumAndSeat(); // 清除车次与座席
      this.defaultSeletedDays = val;
      this.changeIsDateChanged(true);
    },
    showDatePicker() {
      if (!this.train_code.length) {
        this.toast("请先选择车次");
        return;
      }
      if (!this.grabCreatOrderParms.seat_type_names.length) {
        this.toast("请先选择座席");
        this.changeSeatTypePickerStatus();
        return;
      }

      let self = this;
      self.mutiPicker = self.$createPicker({
        title: "选择抢票截止时间",
        data: [self.dateCol, self.timeCol],
        selectedIndex: this.selectedIndex,
        onSelect: (selectedVal, selectedIndex, selectedText) => {
          this.selectedIndex = selectedIndex;
          this.changeDeadlineReservation(selectedVal);
        },
        onCancel: () => {}
      });
      self.mutiPicker.show();
      this.Omega(
        "train_ticket_addgrab_deadline_ck",
        "添加抢票页面抢票截止日点击"
      );
    },
    toast(msg, type = "warn", time = 1500) {
      this.$createToast({
        txt: msg,
        type: type,
        time: time
      }).show();
    },
    showConfirmDialog() {
      this.$createDialog({
        type: "confirm",
        icon: "cubeic-alert",
        title: "订单尚未提交，确认放弃吗？",
        content: "",
        confirmBtn: {
          text: "取消",
          active: true,
          disabled: false,
          href: "javascript:;"
        },
        cancelBtn: {
          text: "确定",
          active: false,
          disabled: false,
          href: "javascript:;"
        },
        onConfirm: () => {},
        onCancel: () => {
          this.$router.back();
        }
      }).show();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~assets/styles/var.less";
.reservation-card {
  background: #f3f4f5;
  height: 100%;
  .top-tips-message {
    background: rgba(252, 145, 83, 0.1);
    font-size: 12px;
    color: #fc9153;
    letter-spacing: 0;
    line-height: 18px;
    min-height: 30px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    padding-left: 1.33rem;
    padding-right: 1.33rem;
  }
  .conditionCard {
    background: #fff;
    & > div {
      padding-left: 1.33rem;
      padding-right: 1.33rem;
    }

  }
  .card-title {
    line-height: 24px;
    height: 24px;
    padding-top: 1.5rem;
    font-size: 0;
    & > span {
      display: inline-block;
      vertical-align: middle;
    }
    & > div {
      display: inline-block;
      vertical-align: middle;
      height: 24px;
    }
    .destination {
      text-align: center;
      min-width: 2rem;
      width: 46%;
      font-size: 24px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .destination:first-child {
      text-align: left;
    }
    .destination:last-child {
      text-align: right;
    }
    .exchange-icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      &:active {
        opacity: 0.6;
      }
    }
  }
  .cut-off-line {
    position: relative;
    // width: 90%;
    margin: 0 auto;
    margin-top: 10px;
    & > span {
      display: inline-block;
      width: 47%;
      // height: 1px;
      background-color: rgba(0, 0, 0, 0.1);
    }
    & > span:first-child {
      position: absolute;
      left: 0;
    }
    & > span:last-child {
      position: absolute;
      right: 0;
    }
  }
  .info-item {
    min-height: 60px;
    line-height: 60px;
    margin: 0 auto;
    text-align: left;
    font-size: 0;
    padding-top: 5px;
    padding-bottom: 5px;
    overflow: hidden;
    &:active {
      background-color: rgba(0, 0, 0, 0.04);
    }
    .place-holder {
      color: #ccc;
    }
    & > div {
      // height: 60px;
      line-height: 18px;
      vertical-align: middle;
      display: inline-block;
      font-size: 14px;
      box-sizing: border-box;
    }
    .label {
      color: #999;
    }
    .selected {
      padding-left: 10px;
      padding-right: 10px;
      // display: flex;
      // flex-wrap: wrap;
      // white-space: pre-wrap;
      // word-break: keep-all;
      span {
        // margin-right: 0.5rem;
      }
      .selected-span {
        &::after {
          content: " | ";
          color: #999;
        }
        &:last-child::after {
          content: "";
        }
      }
    }
    .grab-end-date {
      line-height: 60px;
    }
    .default {
      color: #ccc;
    }
    .active {
      color: #333;
      max-width: 60%;
    }
    .arrow {
      float: right;
      position: absolute;
      right: 1.33rem;
      top: 50%;
      transform: translateY(-50%);
      .txtbutton {
        color: #fc9153;
        font-size: 12px;
      }
      .txtarrow {
        color: #999;
        font-size: 12px;
      }
    }
  }
  .deadline {
    border-bottom: none;
    .selected {
      width: 70%;
    }
  }
  .person-info {
    overflow: hidden;
    & > div:last-child {
      padding-bottom: 120px;
    }
  }
  .addpassenger,
  .account,
  .addcontact,
  .tips-msg,
  .coupon-wrapper,
  .payfirst {
    margin-top: 10px;
  }
  .addpassenger {
    .passenger {
      margin-top: -2px;
    }
  }
  .paytips {
    color: #fc9153;
    font-size: 14px;
    line-height: 1.8rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 1.5rem;
    text-align: left;
    // padding-bottom: 1rem;
  }
  .acceptProtocol {
    height: 40px;
    line-height: 40px;
    margin-top: 12px;
    background: #fff;
    text-align: left;
    padding-left: 1.33rem;
    font-size: 13px;
    .accept-protocol-checkbox {
      display: inline-block;
      padding-left: 0;
      padding-right: 0.5rem;
    }
    label {
      color: #fc9153;
    }
  }
  .acceptProtocol::after {
    display: block;
    height: 47px;
    content: "";
  }
  .grap-button {
    position: fixed;
    bottom: 0px;
    height: 50px;
    line-height: 0;
    font-size: 17px;
  }
  .tips-msg {
    color: #fc9153;
    padding-left: 1.33rem;
    line-height: 16px;
    padding-right: 0.85rem;
    text-align: left;
  }
  .price-info {
    margin-top: 0.83rem;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: @z-prive-info;
  }
  .tip-info {
    color: #fc9153;
    text-align: left;
    margin: 0 1.33rem;
  }
}
/*5/5s/SE*/
@media only screen and (min-device-width: 320px) and (max-device-width: 320px) and (-webkit-min-device-pixel-ratio: 2) {
  .reservation-card {
    .card-title .destination {
      width: 45%;
    }
    .info-item {
      .selected {
        max-width: 50%;
      }
    }
  }
}
</style>
