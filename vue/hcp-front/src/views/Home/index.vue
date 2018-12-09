<template>
  <div class="homepage" :class="{ 'visibility': this.visibility }">
    <div class="show-tip" v-if="notServiceTime">
      <p v-html="statusText"></p>
    </div>
    <Banner :geoLocation="geoLocation"></Banner>
    <div class="card" :style="travel_log_object.length>0?'height:258px':'height:234px'">
      <div class="card-title">
        <transition
          @leave="leave"
          @before-enter="beforeEnter"
          @enter="enter">
          <span class="destination" id="start" v-show="showOD" @click="showCityList(0)">{{start_station}}</span>
        </transition>

        <div>
          <img :class="{'exchange-icon': true, 'rotate-class': iconRotate}" @click="exchangeStation" :src="exchangeIcon"/>
        </div>

        <transition
          @leave="leave"
          @before-enter="beforeEnter"
          @enter="enter">
          <span class="destination" id="end" v-show="showOD" @click="showCityList(1)">{{end_station}}</span>
        </transition>
      </div>
      <div class="cut-off-line">
        <span></span>
        <span></span>
      </div>
      <div class="trip-date">
        <div class="date" @click="showCalendar">
          <span>{{go_off}}</span>
          <Calendar
            :holiday="holiday"
            :multiple="false"
            title="出发日期"
            :calendarShow="calendarShow"
            :defaultSeletedDays="[train_date]"
            @on-select="onDateChange"
            @on-cancel="hideCalendar"
            :formatRule="{ type: 'String', rule: 'YYYY-MM-DD' }"
          >
          </Calendar>
          <span>{{day_name}}</span>
        </div>
        <div class="arrow"><i class="cubeic-arrow"></i></div>
      </div>
      <div class="ticket-type font-14"  @click="selectHsrType">
          <span style="position:absolute;left:0;">只看高铁动车</span>
          <Checkbox style="right:0;padding-right:0;" :option="tripTpes[0]" :value="trip_type_hsr"></Checkbox>
          <Checkbox :option="tripTpes[1]" @input="selectStudentType" :value="trip_type_student" v-show="false"></Checkbox>
      </div>
      <div class="search-button font-14">
        <Button :active="true" @click="searchTicket">查询车票</Button>
        <!-- <Button :active="true" :disabled="btnDisabled" @click="logintest">查询车票</Button> -->
      </div>
      <div class="outer-container">
        <div class="search-log inner-container" ref="wrapper" v-show="travel_log_object.length>0">
          <div class="content" v-touchMove>
            <span class="log-item" v-for="(item,index) in travel_log_object" :key="`${item.start_station_code}${index}`" @click="setDestinationHook({obj:travel_log_object[index],index:index})">{{`${item.start_station} - ${item.end_station}`}}</span>
          </div>
          <span class="clear-log" @click="emptyTravelLogHook">清除历史记录</span>
        </div>
      </div>
    </div>
    <div :class="`page-button ${showIphoneXHack()?'page-button-iphonex':''}` " v-show="pageButtonShow">
      <div @click="goOrderList(2)">
        <span><img :src="hotIcon"></span>
        <span>抢票</span>
      </div>
      <div @click="goOrderList(1)">
        <span><img :src="shapeIcon"></span>
        <span>我的行程</span>
      </div>
      <tip
      ref="tip2"
      :direction="tipDirection"
      :style="tipStyle"
      @close="closeTips"
      @click="bubbleClick">
      <div>{{tipsContent}}</div>
    </tip>
      <div @click="goOrderList(0)">
        <span><img :src="tripsIcon"></span>
        <span>全部订单</span>
      </div>
    </div>
    <div :class="`for-iphonex ${showIphoneXHack()?'for-iphonex-show':''}`"></div>
  </div>
</template>
<script>
import isBefore from "date-fns/is_before";
import isAfter from "date-fns/is_after";
import request from "@/utils/request";
import { Button, Checkbox, CheckboxGroup, createAPI, Tip } from "cube-ui";
import { mapGetters, mapActions } from "vuex";
import exchangeIcon from "assets/images/od.png";
import hotIcon from "assets/images/hot@3x.png";
import shapeIcon from "assets/images/CombinedShape@3x.png";
import tripsIcon from "assets/images/trips@2x.png";
import api from "service/api";
import {
  goTo,
  initPMClient,
  getLoginStatus,
  getDataFromCommon,
  forceLogin,
  getLocation
} from "./iframeMessageGate.js";
import CityList from "@/components/CityList/index.vue";
import Banner from "./banner.vue";
import Vue from "vue";
import { PostMessageClient } from "@didi/message-poster";
import Velocity from 'velocity-animate'
// import BScroll from "better-scroll";

createAPI(Vue, CityList, ["on-select", "on-cancel"], true);
// import Cookies from "js-cookie";
export default {
  name: "home-page",
  components: {
    Button,
    Checkbox,
    CheckboxGroup,
    Tip,
    Banner
  },
  data() {
    return {
      visibility: true,
      tripTpes: [
        {
          label: "",
          value: false,
          disabled: false
        },
        {
          label: "学生票",
          value: false,
          disabled: false
        }
      ],
      exchangeIcon: exchangeIcon,
      iconRotate: false,
      showOD: true,
      hotIcon: hotIcon,
      shapeIcon: shapeIcon,
      tripsIcon: tripsIcon,
      calendarShow: false,
      pageButtonShow: true,
      cityListShow: false,
      cityListType: 0, // 0：设置出发站 1:设置到达站
      // btnDisabled: true,
      showLogin: false,
      openid: "",
      goTo: goTo, // 将goTo放在data里，自动绑定一下this，因为方法内部需要用到this.$router；不注册的话手动call this也行
      startpoint: "",
      endpoint: "",
      tipDirection: "bottom",
      tipStyle: `top:-50px;color:#FFF;
                font-size:12px;
                width:auto;
                height:40px;
                line-height:40px;
                box-sizing:border-box;`,
      tipsContent: "",
      ticket_ids: [],
      retryCount: 0,
      // geoLocation: { lng: 116.28465, lat: 40.04391, city_id: 1 } // 用户当前定位
      geoLocation: { lng: "", lat: "", city_id: "" } // 用户当前定位
    };
  },
  props: {},
  computed: {
    ...mapGetters({
      holiday: "holiday",
      passengerPhone: "passengerPhone",
      isWeChat: "isWeChat",
      isAliPay: "isAliPay",
      start_station: "start_station",
      start_station_code: "start_station_code",
      end_station: "end_station",
      end_station_code: "end_station_code",
      train_date: "train_date",
      go_off: "go_off",
      day_name: "day_name",
      trip_type_hsr: "trip_type_hsr",
      trip_type_student: "trip_type_student",
      travel_log: "travel_log",
      travel_log_object: "travel_log_object",
      searchButtonActive: "searchButtonActive",
      searchServiceText: "searchServiceText",
      localCity: "localCity",
      notServiceTime: "notServiceTime",
      trainListFirstLoad: "trainListFirstLoad"
    }),
    statusText: function() {
      // 将文案中包含{}内容高亮显示
      let str = "";
      if (this.searchServiceText) {
        str = this.searchServiceText
          .replace("{", `<span class="hight-light">`)
          .replace("}", `</span>`);
      }
      return str;
    }
  },
  created() {},
  mounted() {
    this.showLogin = this.$route.query.showLogin;
    this.selectStudentType(false);
    this.updateFirstLoadStatus(true); //初始化trainlist页  firstload的状态,这个状态决定是否弹出没有高铁的toast
    this.changeHeader();
    this.initStationInfo();
    if (this.start_station && this.end_station) {
      // this.btnDisabled = false;
    }
    let mpClient = initPMClient("train", this.getUserDataFromCommon); // 监听从公共首页传入的初始数据
    console.log("process.env.NODE_ENV:" + process.env.NODE_ENV);
    // 线下环境不从公共首页查询登陆状态，因为公共返回的始终会是线上的token
    if (
      process.env.NODE_ENV !== "development" &&
      process.env.NODE_ENV !== "testing"
    ) {
      this.checkLogin(); // 从公共首页获取登陆状态，判断是否需要取bubble数据
    }
    this.locate(); // 从公共首页获取定位信息
    this.Omega("train_ticket_sw", "滴滴首页火车票首页展现", {
      cellphone: this.passengerPhone
    });
  },
  beforeDestroy() {},
  destroyed() {},
  watch: {
    start_station(val) {
      if (val && this.end_station) {
        // this.btnDisabled = false;
      }
    },
    end_station(val) {
      if (val && this.start_station) {
        this.btnDisabled = false;
      }
    }
  },
  methods: {
    ...mapActions([
      "changeHeader",
      "changeStartStation",
      "changeEndStation",
      "recordTravelLog",
      "emptyTravelLog",
      "initStationInfo",
      "exchangeDestination",
      "setDestination",
      "changeFilterCondition",
      "setStartStation",
      "setEndStation",
      "setSeatType",
      "updateLocalCity",
      "updateFirstLoadStatus"
    ]),
    // 从公共父窗口获取登陆状态，若已登陆，获取24小时内的行程提示
    checkLogin() {
      getLoginStatus()
        .then(res => {
          if (res.status == "success") {
            console.log(res);
            // todo
            this.showTips();
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
          // not login, do nothing
        });
    },
    locate() {
      getLocation()
        .then(geoData => {
          let { city, recommend } = geoData;
          console.log(geoData);
          localStorage.setItem("localCity", city.slice(0, city.length - 1));
          this.updateLocalCity({ localCity: city.slice(0, city.length - 1) });
          let geoLocation = {
            lat: recommend.lat,
            lng: recommend.lng,
            city_id: geoData.cityid
          };
          this.geoLocation = geoLocation;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getUserDataFromCommon(res) {
      try {
        let { data } = res;
        if (data.openid) {
          this.openid = data.openid;
          console.log("openid from common:" + data.openid);
        }
        if (data.fromStation) {
          this.fromStation = data.fromStation;
          // 当定位成功，将定位城市保存到localStorage中
          if (data.fromStation.city) {
            let localCity = data.fromStation.city;
            localStorage.setItem(
              "localCity",
              localCity.slice(0, localCity.length - 1)
            );
            this.updateLocalCity({
              localCity: localCity.slice(0, localCity.length - 1)
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
      // 获取openid，并且在后续的页面url中携带
      // 因为微信中页面跳转后webview会把localstorage和cookie都清掉，后续的页面读取的值都是空
      // 所以存localStorage和cookie并不保险
    },
    emptyTravelLogHook() {
      this.emptyTravelLog();
      this.Omega("train_ticket_delete_ck", "首页清除历史查询记录点击", {
        cellphone: this.passengerPhone
      });
    },
    setDestinationHook(attr) {
      this.setDestination(attr);
      this.Omega("train_ticket_history_ck", "首页历史查询记录点击", {
        cellphone: this.passengerPhone
      });
    },
    exchangeStation() {
      this.showOD = false
      this.iconRotate = true
      this.Omega("train_ticket_exchange_ck", "首页来往目的地切换按钮点击", {
        cellphone: this.passengerPhone
      });
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
          el.id === 'start' && await this.exchangeDestination()
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
    bubbleClick() {
      this.Omega("train_ticket_bubble_ck", "首页我的行程气泡点击", {
        cellphone: this.passengerPhone
      });
      this.goOrderList(1);
    },
    goOrderList(order_status) {
      switch (order_status) {
        case 0:
          this.Omega("train_ticket_allorder_ck", "首页全部订单点击", {
            cellphone: this.passengerPhone
          });
          break;
        case 1:
          this.ticket_ids.length && this.closeTips();
          this.Omega("train_ticket_wait_ck", "首页待出行点击", {
            cellphone: this.passengerPhone
          });
          break;
        case 2:
          this.Omega("train_ticket_grap_ck", "首页预约抢票点击", {
            cellphone: this.passengerPhone
          });
          break;
        default:
        // do nothing
      }
      this.goTo({
        path: "/orderList",
        query: {
          order_status: order_status,
          train_date: this.train_date,
          from_station_code: this.start_station_code,
          from_station_name: this.start_station,
          to_station_code: this.end_station_code,
          to_station_name: this.end_station,
          openid: this.openid,
          local_city: this.localCity || localStorage.getItem("localCity")
        }
      });
    },
    selectHsrType() {
      let self = this;
      self.$store.dispatch("selectHsrType", {
        trip_type_hsr: self.trip_type_hsr ? false : true
      });
      this.Omega("train_ticket_highrail_ck", "首页高铁勾选点击", {
        cellphone: this.passengerPhone
      });
    },
    selectStudentType(val) {
      this.$store.dispatch("selectStudentType", {
        trip_type_student: val
      });
      this.Omega("train_ticket_stu_ck", "首页学生票勾选点击", {
        cellphone: this.passengerPhone
      });
    },
    showCalendar() {
      this.calendarShow = true;
      this.pageButtonShow = false;
    },
    onDateChange(val) {
      this.calendarShow = false;
      this.pageButtonShow = true;
      this.$store.dispatch("changeGoOff", {
        go_off: val
      });
      this.Omega("train_ticket_date_ck", "首页出发日期点击", { date: val });
    },
    hideCalendar() {
      this.calendarShow = false;
      this.pageButtonShow = true;
    },
    searchTicket() {
      // 清除筛选条件
      this.changeFilterCondition({
        trainType: 0,
        trainDateType: 0,
        hasTicket: false,
        multiFilter: {
          selectedStartStation: [],
          selectedEndStation: [],
          selectedSeatType: []
        }
      });
      this.setStartStation([]);
      this.setEndStation([]);
      this.setSeatType([]);

      this.recordTravelLog({
        start_station: this.start_station,
        end_station: this.end_station,
        start_station_code: this.start_station_code,
        end_station_code: this.end_station_code
      });

      let routerQuery = {
        train_date: this.train_date,
        from_station_code: this.start_station_code,
        from_station: this.start_station,
        to_station_code: this.end_station_code,
        to_station: this.end_station,
        openid: this.openid
      };
      if (this.trip_type_student) {
        routerQuery.passenger_type = 1;
      }
      if (this.trip_type_hsr) {
        routerQuery.train_type = 1;
      }

      this.Omega("train_ticket_search_ck", "首页查询车票点击", {
        cellphone: this.passengerPhone
      });

      this.goTo({
        path: "/trainList",
        query: routerQuery
      });
    },
    showCityList(type) {
      // 除了在调用 createAPI 的时候传入了 events，这里对应的就是
      // on{event name} 会被当做事件回调处理
      const instance = this.$createCityList({
        cityListShow: true
      });
      this.pageButtonShow = false;
      this.visibility = false
      instance.$on("on-select", val => {
        // eslint-disable-next-line
        type == 0 ? this.changeStartStation(val) : this.changeEndStation(val);

        // omega 埋点
        type == 0
          ? this.Omega("train_ticket_start_ck", "首页出发地点击", {
              city: val.name
            })
          : this.Omega("train_ticket_arrival_ck", "首页到达地点击", {
              city: val.name
            });
        this.pageButtonShow = true
        this.visibility = true
        instance.remove(); // 这种调用方式, 由于使用了remove移除了实例，所以无需再将calendarShow设为false
      });
      instance.$on("on-cancel", e => {
        this.pageButtonShow = true
        this.visibility = true
        instance.remove();
      });
    },
    async showTips() {
      this.retryCount = 0;
      this.ticket_ids = [];
      let params = {
        ts_webapp_request: new Date().valueOf() // 避免浏览器回退时，该get请求被微信缓存
      };
      const res = await api.listBubble(params);
      if (res.errno === 0 && res.data.length > 0) {
        this.tipsContent = res.data[0].info;
        res.data.forEach(element => {
          this.ticket_ids.push(element.ticket_id);
        });
        this.$refs.tip2.show();
      }
    },
    async closeTips() {
      let params = {
        ticket_ids: this.ticket_ids
      };
      const res = await api.closeBubble(params);
      if (res.errno != 0 && this.retryCount === 0) {
        // 如果失败则重试一次，第二次失败就不重试了
        this.closeTips();
        this.retryCount++;
      }
    },
    showIphoneXHack() {
      let flag = false;
      if ((this.isWeChat && window.history.length === 1) || this.isAliPay) {
        flag = true;
      }
      return flag;
    }
  }
};
</script>
<style scoped lang="less">
.homepage {
  font-family: "PingFangSC-Regular";
  margin-top: 16px;
  visibility: hidden;
  &.visibility {
    visibility: visible;
  }
  .show-tip {
    height: 50px;
    // line-height: 50px;
    font-size: 12px;
    color: #666666;
    text-align: left;
    // margin: 0 15px 10px;
    width: 92%;
    margin: 0 auto;
    margin-bottom: 10px;
    background: #ffffff url("../../assets/images/buynotice@3x.png") no-repeat
      8px 8px;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.08);
    border-radius: 2px;
    background-size: 34px 34px;
    overflow: hidden;
    p {
      margin-left: 50px;
      height: 100%;
      // display: flex;
      display: -webkit-box;
      -webkit-box-align: center;
      align-items: center;
      padding-right: 10px;
      .orange-color {
        color: #fc9153;
        line-height: 18px;
      }
    }
  }
  .card {
    font-size: 18px;
    color: #333;
    width: 92%;
    height: 248px;
    margin: 0 auto;
    background: #fff;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.08);
    border-radius: 2px;
    color: #333333;
    .card-title {
      font-family: PingFangSC-Medium;
      line-height: 24px;
      height: 24px;
      padding-top: 18px;
      font-size: 0;
      position: relative;
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
        width: 41%;
        font-size: 24px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
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
      width: 90%;
      margin: 0 auto;
      margin-top: 12px;
      & > span {
        display: inline-block;
        width: 47%;
        height: 1px;
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
    .trip-date,
    .ticket-type {
      width: 90%;
      height: 58px;
      line-height: 58px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      margin: 0 auto;
    }
    .ticket-type {
      border-bottom: none;
      position: relative;
      color: #666666;
      & > div {
        display: inline-block;
        position: absolute;
        height: 58px;
      }
      & > div:first-child {
        right: 0;
        padding-right: 0;
      }
    }
    .trip-date {
      text-align: left;
      font-size: 0;
      & > div {
        display: inline-block;
      }
      .date {
        font-size: 20px;
        width: 95%;
      }
      .arrow {
        color: #d8d8d8;
        font-size: 14px;
        width: 5%;
        text-align: right;
      }
      &:active {
        background-color: rgba(0, 0, 0, 0.04);
      }
    }
    .search-button {
      margin: 0 auto;
      width: 92%;
      height: 50px;
      line-height: 50px;
      button {
        height: 50px;
        line-height: 0;
      }
    }

    .outer-container,
    .content {
      width: 92%;
      height: 37px;
      min-height: 37px;
      left: 1.2rem;
    }
    .outer-container {
      position: relative;
      overflow: hidden;
    }
    .inner-container {
      position: absolute;
      left: 0;
      -webkit-overflow-scrolling: touch;
      // overflow-x: hidden;
      // overflow-y: scroll;
      overflow:hidden;
      z-index: 2;
      height: 100%;
      width: 100%;
      .content {
        position: absolute;
        left: 0;
        top: 12px;
        overflow: hidden;
      }
    }
    .search-log {
      font-size: 12px;
      width: 100%;
      margin: 0 auto;
      padding-top: 12px;
      text-align: left;
      // min-height: 80px;
      & > div {
        display: inline-block;
        width: 73%;
        overflow-y: hidden;
        overflow-x: scroll;
        white-space: nowrap;
      }
      .log-item {
        margin-right: 0.5rem;
        font-size: 12px;
        color: #999;
        display: inline-block;
      }
      .clear-log {
        vertical-align: top;
        float: right;
        &:active {
          opacity: 0.6;
        }
      }
    }
  }
  .page-button {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 48px;
    background: #fff;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.16);
    font-size: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    & > div {
      display: inline-block;
      width: 33.33%;
      text-align: center;
      font-size: 12px;
      color: #666;
      text-align: center;
      & > span {
        display: inline-block;
        width: 100%;
        img {
          width: 16px;
        }
      }
    }
  }
  .for-iphonex {
    display: none;
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
      height: 34px;
    }
  }
}
</style>
<style lang="less">
.homepage {
  .cube-tip-content {
    width: 100%;
  }
}



</style>
